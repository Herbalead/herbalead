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

async function verificar() {
  console.log('🔍 Buscando profissionais com subscription_status = active mas sem subscription...\n')
  
  try {
    // Buscar profissionais com status active mas sem subscription
    const { data: professionals, error } = await supabase
      .from('professionals')
      .select(`
        id,
        name,
        email,
        subscription_status,
        created_at
      `)
      .eq('subscription_status', 'active')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Erro:', error)
      return
    }
    
    console.log(`📋 Total de profissionais ativos: ${professionals.length}\n`)
    
    for (const prof of professionals) {
      const { data: subs } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', prof.id)
      
      if (!subs || subs.length === 0) {
        console.log(`⚠️  SEM SUBSCRIPTION: ${prof.name} (${prof.email})`)
        console.log(`   ID: ${prof.id}`)
        console.log('')
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

verificar()

