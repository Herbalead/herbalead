// Script para corrigir usuário existente que pagou mas não está autenticado
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://your-project.supabase.co', // Substitua pela sua URL
  'your-service-role-key' // Substitua pela sua chave
)

async function fixExistingUser(userId) {
  console.log('🔧 Corrigindo usuário existente:', userId)
  
  try {
    // 1. Buscar dados do profissional
    const { data: professional, error: profError } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (profError) {
      console.error('❌ Erro ao buscar profissional:', profError)
      return
    }
    
    console.log('✅ Profissional encontrado:', professional.email)
    
    // 2. Verificar se já existe na auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('❌ Erro ao buscar usuários auth:', authError)
      return
    }
    
    const existingAuthUser = authUsers.users.find(u => u.email === professional.email)
    
    if (existingAuthUser) {
      console.log('✅ Usuário já existe na auth.users:', existingAuthUser.id)
      console.log('🔧 Atualizando ID na tabela professionals...')
      
      // Atualizar o ID na tabela professionals para corresponder ao auth.users
      const { error: updateError } = await supabase
        .from('professionals')
        .update({ id: existingAuthUser.id })
        .eq('id', userId)
      
      if (updateError) {
        console.error('❌ Erro ao atualizar ID:', updateError)
      } else {
        console.log('✅ ID atualizado com sucesso!')
      }
      
    } else {
      console.log('❌ Usuário não existe na auth.users, criando...')
      
      // Criar usuário na auth.users
      const { data: authUser, error: createAuthError } = await supabase.auth.admin.createUser({
        email: professional.email,
        password: 'temp-password-' + Date.now(),
        email_confirm: true,
        user_metadata: {
          name: professional.name || 'Usuário'
        }
      })
      
      if (createAuthError) {
        console.error('❌ Erro ao criar usuário na auth:', createAuthError)
        return
      }
      
      console.log('✅ Usuário criado na auth.users:', authUser.user.id)
      
      // Atualizar ID na tabela professionals
      const { error: updateError } = await supabase
        .from('professionals')
        .update({ id: authUser.user.id })
        .eq('id', userId)
      
      if (updateError) {
        console.error('❌ Erro ao atualizar ID:', updateError)
      } else {
        console.log('✅ ID atualizado com sucesso!')
      }
    }
    
    console.log('🎉 Usuário corrigido! Agora pode fazer login normalmente.')
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

// Executar correção
const userId = 'f83d995a-c9c5-4988-90ad-2396afc1a099'
fixExistingUser(userId)
