import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '../../../../../lib/stripe-subscriptions'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

    console.log('Stripe webhook received:', event.type)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        console.log('Checkout session completed:', session.id)
        
        if (session.mode === 'subscription' && session.subscription) {
          // Buscar dados da assinatura no Stripe
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          
          // Buscar usuário pelo email
          const { data: user, error: userError } = await supabase
            .from('professionals')
            .select('id')
            .eq('email', session.customer_email)
            .single()

          if (userError || !user) {
            console.error('Usuário não encontrado:', userError)
            break
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
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
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
        
        // Buscar usuário pelo customer ID
        const { data: user, error: userError } = await supabase
          .from('professionals')
          .select('id')
          .eq('stripe_customer_id', subscription.customer)
          .single()

        if (userError || !user) {
          console.error('Usuário não encontrado pelo customer ID:', userError)
          break
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
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
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
            current_period_start: new Date(updatedSubscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: updatedSubscription.cancel_at_period_end,
            canceled_at: updatedSubscription.canceled_at ? new Date(updatedSubscription.canceled_at * 1000).toISOString() : null,
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
        console.log('Payment succeeded:', invoice.id)
        
        // Salvar pagamento no banco
        if (invoice.subscription) {
          const { data: subscription, error: subError } = await supabase
            .from('subscriptions')
            .select('id')
            .eq('stripe_subscription_id', invoice.subscription)
            .single()

          if (!subError && subscription) {
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
              console.error('Erro ao salvar pagamento:', paymentError)
            } else {
              console.log('✅ Pagamento salvo:', invoice.id)
            }
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
