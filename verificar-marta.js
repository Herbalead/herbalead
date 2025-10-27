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

async function verificarMarta() {
  console.log('🔍 Buscando Marta...\n')
  
  try {
    // Buscar professional
    const { data: professional } = await supabase
      .from('professionals')
      .select('*')
      .eq('email', 'marta421@outlook.com')
      .single()
    
    console.log('📋 Professional:', professional)
    
    // Buscar subscriptions
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', professional.id)
    
    console.log('\n📦 Subscriptions:', subscriptions)
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

verificarMarta()

