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

async function criarSubscriptions() {
  console.log('🔧 Criando subscriptions faltantes...\n')
  
  const profissionaisIDs = [
    { id: '6b0417e6-cb43-488a-8655-5d6815671259', name: 'Marta' },
    { id: '3d44bcb6-138c-49f4-9a4a-6fc2ced33b9b', name: 'Deise' }
  ]
  
  for (const prof of profissionaisIDs) {
    console.log(`\n📋 Processando: ${prof.name} (${prof.id})`)
    
    // Verificar se já tem subscription
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', prof.id)
    
    if (existing && existing.length > 0) {
      console.log(`✓ Já tem subscription`)
      continue
    }
    
    // Criar subscription
    const now = new Date()
    const endDate = new Date(now)
    endDate.setMonth(endDate.getMonth() + 1)
    
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: prof.id,
        stripe_customer_id: `manual_${prof.id}`,
        stripe_subscription_id: `manual_sub_${prof.id}`,
        stripe_price_id: 'manual_monthly',
        customer_email: null,
        status: 'active',
        plan_type: 'monthly',
        current_period_start: now.toISOString(),
        current_period_end: endDate.toISOString(),
        cancel_at_period_end: false,
        payment_source: 'mercadopago'
      })
      .select()
    
    if (error) {
      console.error(`❌ Erro: ${error.message}`)
    } else {
      console.log(`✅ Subscription criada: ${data[0].id}`)
      console.log(`   Vencimento: ${endDate.toISOString()}`)
    }
  }
  
  console.log('\n✅ CONCLUÍDO!')
}

criarSubscriptions()

