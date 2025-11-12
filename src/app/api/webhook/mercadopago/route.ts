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
            // CRIAR SUBSCRIPTION SEM USER_ID (será vinculada depois no cadastro)
            console.log('📧 Pagamento confirmado para novo usuário:', customer_email)
            console.log('📝 Criando subscription pendente de vinculação...')
            
            // Calcular current_period_end baseado no tipo de plano
            const periodStart = new Date()
            const periodEnd = new Date()
            if (plan === 'yearly') {
              periodEnd.setFullYear(periodEnd.getFullYear() + 1) // +1 ano
            } else {
              periodEnd.setMonth(periodEnd.getMonth() + 1) // +1 mês
            }
            
            const { data: pendingSubscription, error: pendingError } = await supabase
              .from('subscriptions')
              .insert({
                user_id: null, // Será vinculado depois
                stripe_customer_id: `mp_${paymentData.id}`,
                stripe_subscription_id: `mp_sub_${paymentData.id}`,
                stripe_price_id: `mp_price_${plan}`,
                customer_email: customer_email,
                status: 'active',
                plan_type: plan,
                current_period_start: periodStart.toISOString(),
                current_period_end: periodEnd.toISOString(),
                cancel_at_period_end: false,
                payment_source: 'mercadopago'
              })
              .select()
              .single()
            
            if (pendingError) {
              console.error('❌ Erro ao criar subscription pendente:', pendingError)
            } else {
              console.log('✅ Subscription pendente criada:', pendingSubscription.id)
              
              // Criar registro de pagamento
              await supabase
                .from('payments')
                .insert({
                  subscription_id: pendingSubscription.id,
                  stripe_payment_intent_id: `mp_pi_${paymentData.id}`,
                  stripe_invoice_id: `mp_inv_${paymentData.id}`,
                  amount: paymentData.transaction_amount * 100,
                  currency: paymentData.currency_id?.toLowerCase() || 'brl',
                  status: 'succeeded',
                  description: `Pagamento ${plan_name || plan} - ${customer_email}`,
                  payment_source: 'mercadopago'
                })
            }
            
            // Finalizar processamento para este pagamento
            return NextResponse.json({ received: true })
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
          
          // Criar assinatura no Supabase APENAS se professional já existe
          if (professionalId && !professionalId.includes('mp_')) {
            // Calcular current_period_end baseado no tipo de plano
            const periodStart = new Date()
            const periodEnd = new Date()
            if (plan === 'yearly') {
              periodEnd.setFullYear(periodEnd.getFullYear() + 1) // +1 ano
            } else {
              periodEnd.setMonth(periodEnd.getMonth() + 1) // +1 mês
            }
            
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
                current_period_start: periodStart.toISOString(),
                current_period_end: periodEnd.toISOString(),
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
