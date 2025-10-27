const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8')
const env = {}
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length) {
    env[key.trim()] = valueParts.join('=').trim()
  }
})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function resetarVivian() {
  console.log('🔐 Resetando senha da Vívian...\n')
  
  try {
    const professionalId = 'bd7b8234-f891-4f8f-9ad9-07d402af64c4'
    const email = 'vnnuneshbl297@gmail.com'
    const novaSenha = 'VivianNunes297!'
    
    // Resetar senha
    const { data, error } = await supabase.auth.admin.updateUserById(professionalId, {
      password: novaSenha
    })
    
    if (error) {
      console.error('❌ Erro:', error)
      return
    }
    
    console.log('✅ Senha resetada com sucesso!\n')
    console.log('📧 DADOS DE LOGIN:')
    console.log('   Email:', email)
    console.log('   Senha:', novaSenha)
    console.log('   URL: https://herbalead.com/login')
    
    console.log('\n📱 MENSAGEM PARA VÍVIAN:')
    console.log('─'.repeat(60))
    console.log(`Olá Vívian!\n`)
    console.log(`Sua conta foi criada com sucesso! 🎉\n`)
    console.log(`📧 Email: ${email}`)
    console.log(`🔑 Senha: ${novaSenha}\n`)
    console.log(`Acesse: https://herbalead.com/login\n`)
    console.log(`⚠️ IMPORTANTE: Troque a senha após entrar no sistema.\n`)
    console.log('─'.repeat(60))
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

resetarVivian()

