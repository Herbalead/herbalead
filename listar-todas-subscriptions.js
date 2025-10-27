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

async function listarTodas() {
  console.log('🔍 Listando todas as subscriptions...\n')
  
  try {
    // Buscar subscriptions com dados do professional
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select(`
        id,
        user_id,
        status,
        plan_type,
        payment_source,
        current_period_start,
        current_period_end,
        created_at,
        professionals!subscriptions_user_id_fkey (
          id,
          name,
          email
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Erro:', error)
      return
    }
    
    console.log(`\n📦 Total de subscriptions: ${subscriptions.length}\n`)
    
    subscriptions.forEach((sub, index) => {
      console.log(`${index + 1}. ${sub.professionals?.name || 'SEM NOME'} (${sub.professionals?.email || 'SEM EMAIL'})`)
      console.log(`   ID Subscription: ${sub.id}`)
      console.log(`   User ID: ${sub.user_id}`)
      console.log(`   Status: ${sub.status}`)
      console.log(`   Plan: ${sub.plan_type}`)
      console.log(`   Payment: ${sub.payment_source || 'N/A'}`)
      console.log(`   Vencimento: ${sub.current_period_end || 'NÃO DEFINIDO'}`)
      console.log('')
    })
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

listarTodas()

