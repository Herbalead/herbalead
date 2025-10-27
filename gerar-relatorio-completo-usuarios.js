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

async function relatorioCompleto() {
  console.log('📊 Gerando relatório completo de usuários...\n')
  
  // Buscar todos os auth users
  const { data: { users } } = await supabase.auth.admin.listUsers()
  
  const relatorio = []
  
  for (const user of users) {
    // Buscar professional correspondente
    const { data: professional } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', user.id)
      .single()
    
    // Buscar subscription
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
    
    relatorio.push({
      email: user.email,
      name: professional?.name || user.user_metadata?.full_name || 'N/A',
      hasProfessional: !!professional,
      hasSubscription: subscriptions && subscriptions.length > 0,
      subscriptionStatus: professional?.subscription_status || 'N/A',
      lastLogin: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('pt-BR') : 'Nunca',
      emailConfirmed: !!user.email_confirmed_at
    })
  }
  
  console.log('📋 RELATÓRIO COMPLETO DE USUÁRIOS\n')
  console.log(`Total de usuários com auth: ${relatorio.length}\n`)
  
  relatorio.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name} (${user.email})`)
    console.log(`   Professional: ${user.hasProfessional ? '✅ SIM' : '❌ NÃO'}`)
    console.log(`   Subscription: ${user.hasSubscription ? '✅ SIM' : '❌ NÃO'}`)
    console.log(`   Status: ${user.subscriptionStatus}`)
    console.log(`   Email confirmado: ${user.emailConfirmed ? '✅ SIM' : '❌ NÃO'}`)
    console.log(`   Último login: ${user.lastLogin}`)
    console.log('')
  })
  
  // Salvar em arquivo
  const arquivo = 'RELATORIO_USUARIOS.txt'
  let conteudo = 'RELATÓRIO DE USUÁRIOS DO SISTEMA\n'
  conteudo += '═══════════════════════════════════════════\n\n'
  
  relatorio.forEach((user) => {
    conteudo += `Nome: ${user.name}\n`
    conteudo += `Email: ${user.email}\n`
    conteudo += `Professional: ${user.hasProfessional ? 'SIM' : 'NÃO'}\n`
    conteudo += `Subscription: ${user.hasSubscription ? 'SIM' : 'NÃO'}\n`
    conteudo += `Status: ${user.subscriptionStatus}\n`
    conteudo += `Último login: ${user.lastLogin}\n`
    conteudo += '─'.repeat(50) + '\n\n'
  })
  
  fs.writeFileSync(arquivo, conteudo)
  console.log(`✅ Relatório salvo em: ${arquivo}`)
}

relatorioCompleto()

