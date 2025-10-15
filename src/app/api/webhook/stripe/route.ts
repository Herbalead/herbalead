import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '../../../../../lib/stripe-subscriptions'
import { createClient } from '@supabase/supabase-js'
import { sendPaymentConfirmationEmail } from '../../../../../lib/payment-validation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Função auxiliar para converter timestamp para ISOString com segurança
const safeTimestampToISOString = (timestamp: number | null | undefined): string | null => {
  if (typeof timestamp === 'number' && !isNaN(timestamp) && timestamp > 0) {
    return new Date(timestamp * 1000).toISOString()
  }
  return null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')
    
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    let event
    
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log('🔔 Stripe webhook received:', {
      type: event.type,
      id: event.id,
      created: safeTimestampToISOString(event.created),
      livemode: event.livemode
    })

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        console.log('Checkout session completed:', session.id)
        
        if (session.mode === 'subscription' && session.subscription) {
          // Buscar dados da assinatura no Stripe
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          
          // Buscar ou criar usuário pelo email
          let user
          const { data: existingUser, error: userError } = await supabase
            .from('professionals')
            .select('id')
            .eq('email', session.customer_email)
            .single()

          if (userError || !existingUser) {
            console.log('Usuário não encontrado, criando automaticamente...')
            
            // Criar usuário na auth.users primeiro
            const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
              email: session.customer_email,
              password: 'tetemp-password-' + Date.now(), // Senha temporária
              email_confirm: true,
              user_metadata: {
                name: session.customer_details?.name || 'Usuário'
              }
            })
            
            if (authError) {
              console.error('Erro ao criar usuário na auth:', authError)
              break
            }
            
            console.log('✅ Usuário criado na auth.users:', authUser.user.id)
            
            // Criar usuário na tabela professionals
            const { data: newUser, error: createError } = await supabase
              .from('professionals')
              .insert({
                id: authUser.user.id, // Usar o mesmo ID da auth.users
                email: session.customer_email,
                name: session.customer_details?.name || 'Usuário',
                phone: session.customer_details?.phone || '',
                subscription_status: 'active',
                stripe_customer_id: subscription.customer as string,
                created_at: new Date().toISOString()
              })
              .select('id')
              .single()

            if (createError) {
              console.error('Erro ao criar usuário na professionals:', createError)
              break
            }
            
            user = newUser
            console.log('✅ Usuário criado automaticamente:', user.id)
          } else {
            user = existingUser
            console.log('✅ Usuário encontrado:', user.id)
          }

          // Salvar assinatura no banco
          const { error: subError } = await supabase
            .from('subscriptions')
            .insert({
              user_id: user.id,
              stripe_customer_id: subscription.customer as string,
              stripe_subscription_id: subscription.id,
              stripe_price_id: subscription.items.data[0].price.id,
              status: subscription.status,
              plan_type: subscription.items.data[0].price.recurring?.interval === 'year' ? 'yearly' : 'monthly',
              current_period_start: safeTimestampToISOString(subscription.current_period_start),
              current_period_end: safeTimestampToISOString(subscription.current_period_end),
              cancel_at_period_end: subscription.cancel_at_period_end
            })

          if (subError) {
            console.error('Erro ao salvar assinatura:', subError)
          } else {
            console.log('✅ Assinatura salva com sucesso para usuário:', user.id)
          }
        }
        break

      case 'customer.subscription.created':
        const subscription = event.data.object
        console.log('Subscription created:', subscription.id)
        
        // Buscar usuário pelo customer ID ou email
        let user
        const { data: existingUser, error: userError } = await supabase
          .from('professionals')
          .select('id, email')
          .eq('stripe_customer_id', subscription.customer)
          .single()

        if (userError || !existingUser) {
          console.log('Usuário não encontrado pelo customer ID, buscando pelo email...')
          
          // Buscar pelo email do customer no Stripe
          const customer = await stripe.customers.retrieve(subscription.customer as string)
          const customerEmail = customer.email
          
          if (customerEmail) {
            const { data: userByEmail, error: emailError } = await supabase
              .from('professionals')
              .select('id')
              .eq('email', customerEmail)
              .single()

            if (emailError || !userByEmail) {
              console.log('Usuário não encontrado pelo email, criando automaticamente...')
              
              // Criar usuário na auth.users primeiro
              const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
                email: customerEmail,
                password: 'temp-password-' + Date.now(), // Senha temporária
                email_confirm: true,
                user_metadata: {
                  name: customer.name || 'Usuário'
                }
              })
              
              if (authError) {
                console.error('Erro ao criar usuário na auth:', authError)
                break
              }
              
              console.log('✅ Usuário criado na auth.users:', authUser.user.id)
              
              // Criar usuário na tabela professionals
              const { data: newUser, error: createError } = await supabase
                .from('professionals')
                .insert({
                  id: authUser.user.id, // Usar o mesmo ID da auth.users
                  email: customerEmail,
                  name: customer.name || 'Usuário',
                  phone: customer.phone || '',
                  stripe_customer_id: subscription.customer as string,
                  subscription_status: 'active',
                  created_at: new Date().toISOString()
                })
                .select('id')
                .single()

              if (createError) {
                console.error('Erro ao criar usuário na professionals:', createError)
                break
              }
              
              user = newUser
              console.log('✅ Usuário criado automaticamente:', user.id)
            } else {
              // Atualizar customer ID no usuário existente
              await supabase
                .from('professionals')
                .update({ stripe_customer_id: subscription.customer as string })
                .eq('id', userByEmail.id)
              
              user = userByEmail
              console.log('✅ Usuário encontrado e customer ID atualizado:', user.id)
            }
          } else {
            console.error('Email do customer não encontrado no Stripe')
            break
          }
        } else {
          user = existingUser
          console.log('✅ Usuário encontrado pelo customer ID:', user.id)
        }

        // Salvar assinatura no banco
        const { error: subError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            stripe_customer_id: subscription.customer as string,
            stripe_subscription_id: subscription.id,
            stripe_price_id: subscription.items.data[0].price.id,
            status: subscription.status,
            plan_type: subscription.items.data[0].price.recurring?.interval === 'year' ? 'yearly' : 'monthly',
            current_period_start: safeTimestampToISOString(subscription.current_period_start),
            current_period_end: safeTimestampToISOString(subscription.current_period_end),
            cancel_at_period_end: subscription.cancel_at_period_end
          })

        if (subError) {
          console.error('Erro ao salvar assinatura:', subError)
        } else {
          console.log('✅ Assinatura criada e salva para usuário:', user.id)
        }
        break

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object
        console.log('Subscription updated:', updatedSubscription.id)
        
        // Atualizar assinatura no banco
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            status: updatedSubscription.status,
            current_period_start: safeTimestampToISOString(updatedSubscription.current_period_start),
            current_period_end: safeTimestampToISOString(updatedSubscription.current_period_end),
            cancel_at_period_end: updatedSubscription.cancel_at_period_end,
            canceled_at: safeTimestampToISOString(updatedSubscription.canceled_at),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', updatedSubscription.id)

        if (updateError) {
          console.error('Erro ao atualizar assinatura:', updateError)
        } else {
          console.log('✅ Assinatura atualizada:', updatedSubscription.id)
        }
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object
        console.log('Subscription canceled:', deletedSubscription.id)
        
        // Marcar assinatura como cancelada
        const { error: cancelError } = await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', deletedSubscription.id)

        if (cancelError) {
          console.error('Erro ao cancelar assinatura:', cancelError)
        } else {
          console.log('✅ Assinatura cancelada:', deletedSubscription.id)
        }
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object
        console.log('💳 Payment succeeded:', {
          invoice_id: invoice.id,
          subscription_id: invoice.subscription,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          customer_email: invoice.customer_email
        })
        
        // Salvar pagamento no banco
        if (invoice.subscription) {
          const { data: subscription, error: subError } = await supabase
            .from('subscriptions')
            .select('id, user_id')
            .eq('stripe_subscription_id', invoice.subscription)
            .single()

          if (!subError && subscription) {
            // Verificar se pagamento já existe (evitar duplicatas)
            const { data: existingPayment } = await supabase
              .from('payments')
              .select('id')
              .eq('stripe_invoice_id', invoice.id)
              .single()

            if (existingPayment) {
              console.log('⚠️ Pagamento já existe, ignorando:', invoice.id)
              break
            }

            const { error: paymentError } = await supabase
              .from('payments')
              .insert({
                subscription_id: subscription.id,
                stripe_payment_intent_id: invoice.payment_intent as string,
                stripe_invoice_id: invoice.id,
                amount: invoice.amount_paid,
                currency: invoice.currency,
                status: 'succeeded',
                description: `Pagamento ${invoice.currency.toUpperCase()} ${(invoice.amount_paid / 100).toFixed(2)}`
              })

            if (paymentError) {
              console.error('❌ Erro ao salvar pagamento:', paymentError)
            } else {
              console.log('✅ Pagamento salvo com sucesso:', invoice.id)
              
              // Atualizar status do profissional para ativo
              const { error: updateError } = await supabase
                .from('professionals')
                .update({ 
                  subscription_status: 'active',
                  updated_at: new Date().toISOString()
                })
                .eq('id', subscription.user_id)

              if (updateError) {
                console.error('❌ Erro ao atualizar status do profissional:', updateError)
              } else {
                console.log('✅ Status do profissional atualizado para ativo:', subscription.user_id)
                
                // Enviar email de confirmação
                if (invoice.customer_email) {
                  const emailResult = await sendPaymentConfirmationEmail(
                    invoice.customer_email,
                    invoice.amount_paid,
                    invoice.currency
                  )
                  
                  if (emailResult.success) {
                    console.log('✅ Email de confirmação enviado para:', invoice.customer_email)
                  } else {
                    console.error('❌ Erro ao enviar email:', emailResult.error)
                  }
                }
              }
            }
          } else {
            console.error('❌ Assinatura não encontrada para invoice:', invoice.subscription)
          }
        }
        break

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object
        console.log('Payment failed:', failedInvoice.id)
        
        // Salvar pagamento falhado no banco
        if (failedInvoice.subscription) {
          const { data: subscription, error: subError } = await supabase
            .from('subscriptions')
            .select('id')
            .eq('stripe_subscription_id', failedInvoice.subscription)
            .single()

          if (!subError && subscription) {
            const { error: paymentError } = await supabase
              .from('payments')
              .insert({
                subscription_id: subscription.id,
                stripe_payment_intent_id: failedInvoice.payment_intent as string,
                stripe_invoice_id: failedInvoice.id,
                amount: failedInvoice.amount_due,
                currency: failedInvoice.currency,
                status: 'failed',
                description: `Pagamento falhado ${failedInvoice.currency.toUpperCase()} ${(failedInvoice.amount_due / 100).toFixed(2)}`
              })

            if (paymentError) {
              console.error('Erro ao salvar pagamento falhado:', paymentError)
            } else {
              console.log('✅ Pagamento falhado salvo:', failedInvoice.id)
            }
          }
        }
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
