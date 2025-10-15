// Script para verificar status do usuário após pagamento
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkUserStatus(userId: string) {
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
    const { data: payments, error: payError } = await supabase
      .from('payments')
      .select('*')
      .eq('subscription_id', subscriptions?.[0]?.id || '')
    
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
    
    // 4. Verificar se usuário existe na auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('❌ Erro ao buscar usuários auth:', authError)
    } else {
      const authUser = authUsers.users.find(u => u.email === professional.email)
      if (authUser) {
        console.log('✅ Usuário encontrado na auth.users:', {
          id: authUser.id,
          email: authUser.email,
          email_confirmed_at: authUser.email_confirmed_at,
          created_at: authUser.created_at
        })
      } else {
        console.log('❌ Usuário NÃO encontrado na auth.users')
        console.log('🔧 Solução: Criar usuário na auth.users')
      }
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

// Executar verificação
const userId = 'f83d995a-c9c5-4988-90ad-2396afc1a099'
checkUserStatus(userId)
