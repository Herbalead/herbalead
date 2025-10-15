// Script para monitorar webhooks e status de pagamento
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function monitorWebhookHealth() {
  console.log('🔍 Monitorando saúde dos webhooks...')
  
  try {
    // 1. Verificar pagamentos recentes sem status atualizado
    const { data: recentPayments, error: payError } = await supabase
      .from('payments')
      .select(`
        id,
        status,
        created_at,
        subscriptions!inner(
          id,
          user_id,
          professionals!inner(
            id,
            email,
            subscription_status
          )
        )
      `)
      .eq('status', 'succeeded')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    
    if (payError) {
      console.error('❌ Erro ao buscar pagamentos:', payError)
      return
    }
    
    console.log(`📊 Pagamentos recentes encontrados: ${recentPayments?.length || 0}`)
    
    // 2. Verificar inconsistências
    const inconsistencies = []
    
    recentPayments?.forEach(payment => {
      const professional = payment.subscriptions?.professionals
      
      if (professional && professional.subscription_status !== 'active') {
        inconsistencies.push({
          payment_id: payment.id,
          user_email: professional.email,
          payment_status: payment.status,
          user_status: professional.subscription_status,
          created_at: payment.created_at
        })
      }
    })
    
    if (inconsistencies.length > 0) {
      console.log('⚠️ Inconsistências encontradas:')
      inconsistencies.forEach(inc => {
        console.log(`  - ${inc.user_email}: Pagamento ${inc.payment_status} mas usuário ${inc.user_status}`)
      })
      
      // Corrigir inconsistências automaticamente
      console.log('🔧 Corrigindo inconsistências...')
      
      for (const inc of inconsistencies) {
        const { error: updateError } = await supabase
          .from('professionals')
          .update({ 
            subscription_status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('email', inc.user_email)
        
        if (updateError) {
          console.error(`❌ Erro ao corrigir ${inc.user_email}:`, updateError)
        } else {
          console.log(`✅ Corrigido: ${inc.user_email}`)
        }
      }
    } else {
      console.log('✅ Nenhuma inconsistência encontrada')
    }
    
    // 3. Verificar webhooks duplicados
    const { data: duplicatePayments, error: dupError } = await supabase
      .from('payments')
      .select('stripe_invoice_id, count(*)')
      .eq('status', 'succeeded')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .group('stripe_invoice_id')
      .having('count(*) > 1')
    
    if (dupError) {
      console.error('❌ Erro ao verificar duplicatas:', dupError)
    } else if (duplicatePayments && duplicatePayments.length > 0) {
      console.log('⚠️ Pagamentos duplicados encontrados:')
      duplicatePayments.forEach(dup => {
        console.log(`  - Invoice ${dup.stripe_invoice_id}: ${dup.count} pagamentos`)
      })
    } else {
      console.log('✅ Nenhum pagamento duplicado encontrado')
    }
    
  } catch (error) {
    console.error('❌ Erro geral no monitoramento:', error)
  }
}

// Executar monitoramento
monitorWebhookHealth()
