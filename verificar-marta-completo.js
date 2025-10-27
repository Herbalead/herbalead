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

async function verificarMartaCompleto() {
  console.log('🔍 Buscando assinatura da Marta...\n')
  
  try {
    // Buscar professional
    const { data: professional } = await supabase
      .from('professionals')
      .select('*')
      .eq('email', 'marta421@outlook.com')
      .single()
    
    console.log('📋 Professional ID:', professional.id)
    console.log('📋 Professional Name:', professional.name)
    console.log('📋 Email:', professional.email)
    
    // Buscar subscriptions pelo user_id
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select(`
        *,
        professionals!subscriptions_user_id_fkey (
          id,
          name,
          email
        )
      `)
    
    console.log('\n📦 Todas as subscriptions encontradas:', subscriptions.length)
    
    // Filtrar subscriptions que possam ser da Marta
    const subscriptionsMarta = subscriptions.filter(sub => 
      sub.user_id === professional.id || 
      sub.professionals?.email?.toLowerCase().includes('marta')
    )
    
    console.log('\n🎯 Subscriptions da Marta:', subscriptionsMarta.length)
    subscriptionsMarta.forEach(sub => {
      console.log('\n📦 Subscription:', {
        id: sub.id,
        user_id: sub.user_id,
        status: sub.status,
        plan_type: sub.plan_type,
        payment_source: sub.payment_source,
        current_period_start: sub.current_period_start,
        current_period_end: sub.current_period_end,
        professional_name: sub.professionals?.name,
        professional_email: sub.professionals?.email
      })
    })
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

verificarMartaCompleto()

