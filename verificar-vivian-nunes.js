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

async function verificarVivian() {
  console.log('🔍 Verificando Vívian Nunes...\n')
  
  try {
    // Buscar profissional
    const { data: professional } = await supabase
      .from('professionals')
      .select('*')
      .ilike('email', '%vnnunes%')
      .single()
    
    console.log('📋 Professional:', professional)
    console.log('\n')
    
    if (!professional) {
      console.log('⚠️  Profissional não encontrado')
      
      // Buscar em todos
      const { data: allProf } = await supabase
        .from('professionals')
        .select('*')
        .ilike('name', '%vivian%')
      
      console.log('🔍 Buscando por nome Vivian:', allProf)
      return
    }
    
    // Verificar subscriptions
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', professional.id)
    
    console.log('📦 Subscriptions:', subscriptions)
    console.log('\n')
    
    // Verificar auth
    const { data: { users } } = await supabase.auth.admin.listUsers()
    const vivianAuth = users.find(u => u.id === professional.id)
    
    console.log('🔐 Auth User:', vivianAuth ? 'SIM ✅' : 'NÃO ❌')
    
    if (vivianAuth) {
      console.log('   Email:', vivianAuth.email)
      console.log('   Email confirmado:', vivianAuth.email_confirmed_at ? 'SIM' : 'NÃO')
      console.log('   Último login:', vivianAuth.last_sign_in_at || 'Nunca')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

verificarVivian()

