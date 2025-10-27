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

async function ajustarVencimentos() {
  console.log('🔧 Ajustando vencimentos para dia 21/10...\n')
  
  const emails = [
    'marta421@outlook.com',      // Marta
    'joaoaraujo11@gmail.com'     // João Araújo
  ]
  
  for (const email of emails) {
    console.log(`\n📋 Processando: ${email}`)
    
    // Buscar professional
    const { data: professional } = await supabase
      .from('professionals')
      .select('id, name, created_at')
      .eq('email', email)
      .single()
    
    console.log(`✅ Encontrado: ${professional.name}`)
    console.log(`   Criado em: ${professional.created_at}`)
    
    // Buscar subscriptions
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', professional.id)
    
    for (const sub of subscriptions) {
      // Data de início: 21/10/2025
      const startDate = new Date('2025-10-21T12:00:00Z')
      
      // Vencimento: 21/11/2025 (1 mês depois)
      const endDate = new Date('2025-11-21T12:00:00Z')
      
      console.log(`\n📦 Subscription ID: ${sub.id}`)
      console.log(`   Data Início: ${startDate.toISOString()}`)
      console.log(`   Data Vencimento: ${endDate.toISOString()}`)
      
      // Atualizar
      const { error } = await supabase
        .from('subscriptions')
        .update({
          current_period_start: startDate.toISOString(),
          current_period_end: endDate.toISOString()
        })
        .eq('id', sub.id)
      
      if (error) {
        console.error(`❌ Erro: ${error.message}`)
      } else {
        console.log(`✅ Vencimento atualizado com sucesso!`)
      }
    }
  }
  
  console.log('\n✅ CONCLUÍDO!')
}

ajustarVencimentos()

