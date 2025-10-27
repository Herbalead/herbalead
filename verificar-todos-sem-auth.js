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

async function verificarTodos() {
  console.log('🔍 Verificando todos os profissionais sem auth...\n')
  
  try {
    // Buscar todos os profissionais ativos com subscription
    const { data: professionals } = await supabase
      .from('professionals')
      .select('id, name, email, subscription_status, created_at')
      .eq('subscription_status', 'active')
      .order('created_at', { ascending: false })
    
    console.log(`📋 Total de profissionais ativos: ${professionals?.length || 0}\n`)
    
    // Buscar todos os auth users
    const { data: { users } } = await supabase.auth.admin.listUsers()
    
    console.log(`🔐 Total de auth users: ${users.length}\n`)
    
    // Comparar
    const profissionaisSemAuth = []
    
    for (const prof of professionals) {
      const hasAuth = users.find(u => u.id === prof.id)
      
      if (!hasAuth) {
        profissionaisSemAuth.push({
          id: prof.id,
          name: prof.name,
          email: prof.email,
          created: prof.created_at
        })
      }
    }
    
    console.log(`⚠️  Profissionais SEM AUTH: ${profissionaisSemAuth.length}\n`)
    
    profissionaisSemAuth.forEach((prof, index) => {
      console.log(`${index + 1}. ${prof.name}`)
      console.log(`   Email: ${prof.email}`)
      console.log(`   ID: ${prof.id}`)
      console.log(`   Criado: ${new Date(prof.created).toLocaleString('pt-BR')}`)
      console.log('')
    })
    
    if (profissionaisSemAuth.length > 0) {
      console.log('\n💡 Ação necessária:')
      console.log('   Criar auth para estes profissionais ou enviar senhas temporárias')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

verificarTodos()

