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

async function atualizarVencimentos() {
  console.log('🔍 Buscando usuários...\n')
  
  const emails = [
    'marcela_roberto@hotmail.com', // Marcela Roberto
    'marta421@outlook.com',         // Marta
    'joaoaraujo11@gmail.com'        // João Araújo
  ]
  
  try {
    for (const email of emails) {
      console.log(`\n📋 Processando: ${email}`)
      
      // Buscar professional
      const { data: professional } = await supabase
        .from('professionals')
        .select('id, name, email')
        .eq('email', email)
        .single()
      
      if (!professional) {
        console.log(`⚠️  Profissional não encontrado: ${email}`)
        continue
      }
      
      console.log(`✅ Encontrado: ${professional.name} (${professional.id})`)
      
      // Buscar subscription
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', professional.id)
      
      if (!subscriptions || subscriptions.length === 0) {
        console.log(`⚠️  Sem assinatura: ${email}`)
        continue
      }
      
      for (const sub of subscriptions) {
        console.log(`📦 Subscription ID: ${sub.id}`)
        console.log(`   Status: ${sub.status}`)
        console.log(`   Plan: ${sub.plan_type}`)
        console.log(`   Payment Source: ${sub.payment_source}`)
        console.log(`   Current Period Start: ${sub.current_period_start}`)
        console.log(`   Current Period End: ${sub.current_period_end}`)
        
        // Se não tem vencimento, calcular baseado no tipo de plano
        if (!sub.current_period_end) {
          const now = new Date()
          const startDate = new Date(sub.current_period_start || now)
          
          // Calcular vencimento baseado no plano
          let endDate = new Date(startDate)
          if (sub.plan_type === 'monthly') {
            endDate.setMonth(endDate.getMonth() + 1) // +1 mês
          } else if (sub.plan_type === 'yearly') {
            endDate.setFullYear(endDate.getFullYear() + 1) // +1 ano
          }
          
          console.log(`   📅 Calculando vencimento...`)
          console.log(`   De: ${startDate.toISOString()}`)
          console.log(`   Para: ${endDate.toISOString()}`)
          
          // Atualizar subscription
          const { error } = await supabase
            .from('subscriptions')
            .update({
              current_period_start: startDate.toISOString(),
              current_period_end: endDate.toISOString()
            })
            .eq('id', sub.id)
          
          if (error) {
            console.error(`❌ Erro ao atualizar: ${error.message}`)
          } else {
            console.log(`✅ Vencimento atualizado com sucesso!`)
          }
        } else {
          console.log(`✓ Já tem vencimento configurado`)
        }
      }
    }
    
    console.log('\n✅ CONCLUÍDO!')
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

atualizarVencimentos()

