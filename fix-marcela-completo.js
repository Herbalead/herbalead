/**
 * Script para criar auth.users para Marcela Roberto e resolver problema de login
 * Execute no terminal: node fix-marcela-completo.js
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wnkmqxlhvuatvwxwljkj.supabase.co' // AJUSTAR SEU URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // AJUSTAR SUA SERVICE KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixMarcela() {
  console.log('🔧 Verificando e corrigindo conta da Marcela...\n')
  
  const email = 'marcela_roberto@hotmail.com'
  const professionalId = 'a30b5935-3bdc-4b30-a78b-346d10c287c4'
  
  try {
    // 1. Verificar profissional
    const { data: prof, error: profError } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', professionalId)
      .single()
    
    if (profError || !prof) {
      console.log('❌ Profissional não encontrado')
      return
    }
    
    console.log('✅ Profissional encontrado:')
    console.log('   Nome:', prof.name)
    console.log('   Email:', prof.email)
    console.log('   Subscription:', prof.subscription_status)
    
    // 2. Verificar se já tem auth
    const { data: existingAuth, error: authCheckError } = await supabase.auth.admin.getUserById(professionalId)
    
    if (existingAuth?.user) {
      console.log('\n⚠️ Já existe auth para este usuário')
      console.log('   Auth ID:', existingAuth.user.id)
      console.log('   Auth Email:', existingAuth.user.email)
      console.log('\n🔑 Sendo assim, as credenciais são:')
      console.log('   Email:', existingAuth.user.email)
      console.log('   Senha: (a senha criada no Dashboard)')
      console.log('\n💡 Se não lembra a senha:')
      console.log('   1. Vá no Supabase Dashboard')
      console.log('   2. Authentication → Users')
      console.log('   3. Busque o email:', existingAuth.user.email)
      console.log('   4. Clique nos 3 pontos → Reset Password')
      console.log('   5. Uma nova senha será gerada')
    } else {
      console.log('\n❌ AINDA NÃO TEM AUTH CRIADA!')
      console.log('\n📝 INSTRUÇÕES PARA CRIAR NO DASHBOARD:')
      console.log('=' .repeat(60))
      console.log('1. Vá para: https://supabase.com/dashboard')
      console.log('2. Authentication → Users')
      console.log('3. Clique em "Add user"')
      console.log('4. Preencha:')
      console.log('   Email: marcela_roberto@hotmail.com')
      console.log('   Password: MarcelaTemporaria123!')
      console.log('   UUID: a30b5935-3bdc-4b30-a78b-346d10c287c4')
      console.log('   Auto Confirm User: ✅ SIM')
      console.log('5. Clique em "Create User"')
      console.log('=' .repeat(60))
    }
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

fixMarcela()

