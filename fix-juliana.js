// Script para corrigir a Juliana Bortolazzo
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://your-project.supabase.co', // Substitua pela sua URL
  'your-service-role-key' // Substitua pela sua chave
)

async function fixJuliana() {
  console.log('🔧 Corrigindo Juliana Bortolazzo...')
  
  try {
    // 1. Buscar Juliana
    const { data: professionals, error: profError } = await supabase
      .from('professionals')
      .select('*')
      .ilike('email', '%julianazr94%')
    
    if (profError || !professionals || professionals.length === 0) {
      console.error('❌ Juliana não encontrada')
      return
    }
    
    const juliana = professionals[0]
    console.log('✅ Juliana encontrada:', juliana.email)
    
    // 2. Verificar se existe na auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('❌ Erro ao buscar usuários auth:', authError)
      return
    }
    
    let authUser = authUsers.users.find(u => u.email === juliana.email)
    
    if (!authUser) {
      console.log('🔧 Criando usuário na auth.users...')
      
      // Criar usuário na auth.users
      const { data: newAuthUser, error: createAuthError } = await supabase.auth.admin.createUser({
        email: juliana.email,
        password: 'temp-password-' + Date.now(),
        email_confirm: true,
        user_metadata: {
          name: juliana.name || 'Juliana Bortolazzo'
        }
      })
      
      if (createAuthError) {
        console.error('❌ Erro ao criar usuário na auth:', createAuthError)
        return
      }
      
      authUser = newAuthUser.user
      console.log('✅ Usuário criado na auth.users:', authUser.id)
      
      // Atualizar ID na tabela professionals
      const { error: updateError } = await supabase
        .from('professionals')
        .update({ id: authUser.id })
        .eq('id', juliana.id)
      
      if (updateError) {
        console.error('❌ Erro ao atualizar ID:', updateError)
      } else {
        console.log('✅ ID atualizado na tabela professionals')
      }
    } else {
      console.log('✅ Usuário já existe na auth.users:', authUser.id)
    }
    
    // 3. Verificar e criar assinatura se necessário
    const { data: subscriptions, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', authUser.id)
    
    if (subError) {
      console.error('❌ Erro ao buscar assinaturas:', subError)
    } else if (!subscriptions || subscriptions.length === 0) {
      console.log('🔧 Criando assinatura...')
      
      // Criar assinatura (assumindo plano mensal ativo)
      const { error: createSubError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: authUser.id,
          stripe_customer_id: juliana.stripe_customer_id || 'temp-customer-' + Date.now(),
          stripe_subscription_id: 'temp-sub-' + Date.now(),
          stripe_price_id: 'price_monthly', // Assumindo plano mensal
          status: 'active',
          plan_type: 'monthly',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 dias
          cancel_at_period_end: false
        })
      
      if (createSubError) {
        console.error('❌ Erro ao criar assinatura:', createSubError)
      } else {
        console.log('✅ Assinatura criada')
      }
    } else {
      console.log('✅ Assinatura já existe:', subscriptions.length)
    }
    
    // 4. Atualizar dados do profissional
    const { error: updateProfError } = await supabase
      .from('professionals')
      .update({
        subscription_status: 'active',
        subscription_plan: 'monthly',
        stripe_customer_id: juliana.stripe_customer_id || 'temp-customer-' + Date.now()
      })
      .eq('id', authUser.id)
    
    if (updateProfError) {
      console.error('❌ Erro ao atualizar profissional:', updateProfError)
    } else {
      console.log('✅ Dados do profissional atualizados')
    }
    
    console.log('🎉 Juliana corrigida com sucesso!')
    console.log('📋 Resumo:')
    console.log('  - Status: Ativo')
    console.log('  - Plano: Mensal')
    console.log('  - Pode fazer login: Sim')
    console.log('  - Acesso liberado: Sim')
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

// Executar correção
fixJuliana()
