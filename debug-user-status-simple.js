// Script para verificar status do usuário após pagamento
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://your-project.supabase.co', // Substitua pela sua URL
  'your-service-role-key' // Substitua pela sua chave
)

async function checkUserStatus(userId) {
  console.log('🔍 Verificando status do usuário:', userId)
  
  try {
    // 1. Verificar se usuário existe na tabela professionals
    const { data: professional, error: profError } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (profError) {
      console.error('❌ Erro ao buscar profissional:', profError)
      return
    }
    
    console.log('✅ Profissional encontrado:', {
      id: professional.id,
      email: professional.email,
      name: professional.name,
      subscription_status: professional.subscription_status,
      stripe_customer_id: professional.stripe_customer_id,
      created_at: professional.created_at
    })
    
    // 2. Verificar assinaturas
    const { data: subscriptions, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
    
    if (subError) {
      console.error('❌ Erro ao buscar assinaturas:', subError)
    } else {
      console.log('📋 Assinaturas encontradas:', subscriptions?.length || 0)
      subscriptions?.forEach(sub => {
        console.log('  - ID:', sub.id)
        console.log('  - Status:', sub.status)
        console.log('  - Plano:', sub.plan_type)
        console.log('  - Customer ID:', sub.stripe_customer_id)
        console.log('  - Subscription ID:', sub.stripe_subscription_id)
      })
    }
    
    // 3. Verificar pagamentos
    if (subscriptions && subscriptions.length > 0) {
      const { data: payments, error: payError } = await supabase
        .from('payments')
        .select('*')
        .eq('subscription_id', subscriptions[0].id)
      
      if (payError) {
        console.error('❌ Erro ao buscar pagamentos:', payError)
      } else {
        console.log('💳 Pagamentos encontrados:', payments?.length || 0)
        payments?.forEach(payment => {
          console.log('  - ID:', payment.id)
          console.log('  - Valor:', payment.amount)
          console.log('  - Status:', payment.status)
          console.log('  - Data:', payment.created_at)
        })
      }
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

// Executar verificação
const userId = 'f83d995a-c9c5-4988-90ad-2396afc1a099'
checkUserStatus(userId)
