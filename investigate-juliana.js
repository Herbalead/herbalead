// Script para investigar e corrigir a Juliana Bortolazzo
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://your-project.supabase.co', // Substitua pela sua URL
  'your-service-role-key' // Substitua pela sua chave
)

async function investigateJuliana() {
  console.log('🔍 Investigando Juliana Bortolazzo...')
  
  try {
    // 1. Buscar Juliana na tabela professionals
    const { data: professionals, error: profError } = await supabase
      .from('professionals')
      .select('*')
      .ilike('email', '%julianazr94%')
    
    if (profError) {
      console.error('❌ Erro ao buscar profissionais:', profError)
      return
    }
    
    console.log('👤 Profissionais encontrados:', professionals?.length || 0)
    
    professionals?.forEach(prof => {
      console.log('📋 Dados do profissional:')
      console.log('  - ID:', prof.id)
      console.log('  - Nome:', prof.name)
      console.log('  - Email:', prof.email)
      console.log('  - Status:', prof.subscription_status)
      console.log('  - Plano:', prof.subscription_plan)
      console.log('  - Customer ID:', prof.stripe_customer_id)
      console.log('  - Criado em:', prof.created_at)
      console.log('  - Período de graça:', prof.grace_period_end)
    })
    
    // 2. Buscar assinaturas da Juliana
    if (professionals && professionals.length > 0) {
      const juliana = professionals[0]
      
      const { data: subscriptions, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', juliana.id)
      
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
          console.log('  - Período atual:', sub.current_period_start, 'até', sub.current_period_end)
        })
      }
      
      // 3. Buscar pagamentos da Juliana
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
            console.log('  - Descrição:', payment.description)
          })
        }
      }
      
      // 4. Verificar se existe na auth.users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
      
      if (authError) {
        console.error('❌ Erro ao buscar usuários auth:', authError)
      } else {
        const authUser = authUsers.users.find(u => u.email === juliana.email)
        if (authUser) {
          console.log('✅ Usuário encontrado na auth.users:', {
            id: authUser.id,
            email: authUser.email,
            email_confirmed_at: authUser.email_confirmed_at,
            created_at: authUser.created_at
          })
        } else {
          console.log('❌ Usuário NÃO encontrado na auth.users')
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

// Executar investigação
investigateJuliana()
