import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Mercado Pago Webhook received:', body)
    
    // Verify webhook signature (implement later)
    // const signature = request.headers.get('x-signature')
    
    // Handle different notification types
    if (body.type === 'payment') {
      const paymentId = body.data.id
      
      // Fetch payment details from Mercado Pago
      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!paymentResponse.ok) {
        throw new Error('Failed to fetch payment details')
      }
      
      const paymentData = await paymentResponse.json()
      
      console.log('Payment details:', {
        id: paymentData.id,
        status: paymentData.status,
        external_reference: paymentData.external_reference,
        metadata: paymentData.metadata
      })
      
      // Process approved payments
      if (paymentData.status === 'approved') {
        // Extract plan information from metadata
        const { plan, plan_name, plan_price, customer_email } = paymentData.metadata || {}
        
        console.log('💳 Pagamento aprovado Mercado Pago:', {
          plan,
          plan_name,
          plan_price,
          customer_email,
          payment_id: paymentData.id,
          external_reference: paymentData.external_reference
        })
        
        // Criar/atualizar profissional no Supabase
        if (customer_email) {
          const { createClient } = await import('@supabase/supabase-js')
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
          )
          
          // Verificar se profissional já existe
          const { data: existingProfessional } = await supabase
            .from('professionals')
            .select('id')
            .eq('email', customer_email)
            .single()
          
          let professionalId = existingProfessional?.id
          
          if (!professionalId) {
            // Criar profissional E autenticação
            // Primeiro criar auth
            const randomPassword = Math.random().toString(36).slice(-12) + 'A1!'
            
            console.log('🔐 Criando conta de autenticação...')
            const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
              email: customer_email,
              password: randomPassword,
              email_confirm: true,
              user_metadata: {
                full_name: customer_email.split('@')[0]
              }
            })

            if (authError) {
              console.error('❌ Erro ao criar auth:', authError)
            } else {
              console.log('✅ Auth criada:', authUser.user.id)
              professionalId = authUser.user.id

              // Agora criar professional usando o mesmo ID da auth
              const { data: newProfessional, error: createError } = await supabase
                .from('professionals')
                .insert({
                  id: authUser.user.id, // Usar o mesmo ID da auth
                  email: customer_email,
                  name: customer_email.split('@')[0],
                  phone: '',
                  specialty: '',
                  company: '',
                  subscription_status: 'active',
                  is_active: true,
                  max_leads: 1000
                })
                .select()
                .single()
              
              if (createError) {
                console.error('❌ Erro ao criar profissional:', createError)
              } else {
                console.log('✅ Profissional criado:', newProfessional.id)
                
                // Log das credenciais (salvar de forma segura)
                console.log('📧 Credenciais para o cliente:')
                console.log('   Email:', customer_email)
                console.log('   Senha temporária:', randomPassword)
                console.log('⚠️ IMPORTANTE: Enviar estas credenciais por email para o cliente')
              }
            }
          } else {
            // Atualizar status do profissional existente
            const { error: updateError } = await supabase
              .from('professionals')
              .update({ 
                subscription_status: 'active',
                is_active: true
              })
              .eq('id', professionalId)
            
            if (updateError) {
              console.error('❌ Erro ao atualizar profissional:', updateError)
            } else {
              console.log('✅ Profissional atualizado:', professionalId)
            }
          }
          
          // Criar assinatura no Supabase
          if (professionalId) {
            const { data: newSubscription, error: subError } = await supabase
              .from('subscriptions')
              .insert({
                user_id: professionalId,
                stripe_customer_id: `mp_${paymentData.id}`, // Usar ID do Mercado Pago
                stripe_subscription_id: `mp_sub_${paymentData.id}`,
                stripe_price_id: `mp_price_${plan}`,
                customer_email: customer_email,
                status: 'active',
                plan_type: plan,
                current_period_start: new Date().toISOString(),
                current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
                cancel_at_period_end: false,
                payment_source: 'mercadopago'
              })
              .select()
              .single()
            
            if (subError) {
              console.error('❌ Erro ao criar assinatura:', subError)
            } else {
              console.log('✅ Assinatura criada com sucesso:', newSubscription.id)
              
              // Criar registro de pagamento
              if (newSubscription) {
                const { error: paymentError } = await supabase
                  .from('payments')
                  .insert({
                    subscription_id: newSubscription.id,
                    stripe_payment_intent_id: `mp_pi_${paymentData.id}`,
                    stripe_invoice_id: `mp_inv_${paymentData.id}`,
                    amount: paymentData.transaction_amount * 100, // Converter para centavos
                    currency: paymentData.currency_id?.toLowerCase() || 'brl',
                    status: 'succeeded',
                    description: `Pagamento ${plan_name || plan} - ${customer_email}`,
                    payment_source: 'mercadopago'
                  })
                
                if (paymentError) {
                  console.error('❌ Erro ao criar pagamento:', paymentError)
                } else {
                  console.log('✅ Pagamento registrado com sucesso')
                }
              }
            }
          }
        }
      }
      
      // Handle other payment statuses
      else if (paymentData.status === 'pending') {
        console.log('Payment pending:', paymentData.id)
        // Handle pending payments (PIX, Boleto)
      }
      
      else if (paymentData.status === 'rejected') {
        console.log('Payment rejected:', paymentData.id)
        // Handle rejected payments
      }
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
