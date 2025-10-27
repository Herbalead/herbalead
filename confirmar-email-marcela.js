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

async function confirmarEmailMarcela() {
  console.log('🔐 Confirmando email da Marcela...\n')
  
  try {
    const authId = 'f7a15f22-9699-4b04-9f9d-0d48dd558989'
    
    // Atualizar usuário para confirmar email
    const { data, error } = await supabase.auth.admin.updateUserById(authId, {
      email_confirm: true
    })
    
    if (error) {
      console.error('❌ Erro:', error)
      return
    }
    
    console.log('✅ Email confirmado com sucesso!')
    console.log('\n📋 Dados atualizados:')
    console.log('   ID:', data.user.id)
    console.log('   Email:', data.user.email)
    console.log('   Email confirmado:', data.user.email_confirmed_at ? 'SIM ✅' : 'NÃO ❌')
    
    console.log('\n🎉 Agora ela pode fazer login!')
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

confirmarEmailMarcela()

