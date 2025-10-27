const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Carregar variáveis de ambiente
const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8')
const env = {}
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length) {
    env[key.trim()] = valueParts.join('=').trim()
  }
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function resetSenhaGladis() {
  console.log('🔐 Resetando senha da Gladis...\n')
  
  try {
    const authId = '3fcaae16-b5e7-4a17-85b9-50e0004f4ab9'
    const novaSenha = 'GladisTemporaria123!'
    
    // Atualizar senha
    const { data, error } = await supabase.auth.admin.updateUserById(authId, {
      password: novaSenha
    })
    
    if (error) {
      console.error('❌ Erro:', error)
      return
    }
    
    console.log('✅ Senha resetada com sucesso!')
    console.log('\n📋 DADOS DE LOGIN:')
    console.log('   Email: gladisgordaliza@gmail.com')
    console.log('   Senha:', novaSenha)
    console.log('   URL: https://herbalead.com/login')
    
    console.log('\n📱 MENSAGEM PARA GLADIS:')
    console.log('─'.repeat(50))
    console.log(`Olá Gladis!\n\nSenha temporária gerada:\n\n📧 Email: gladisgordaliza@gmail.com\n🔑 Senha: ${novaSenha}\n\nAcesse: https://herbalead.com/login\n\n⚠️ IMPORTANTE: Troque a senha após entrar no sistema.\n`)
    console.log('─'.repeat(50))
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

resetSenhaGladis()

