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

async function verificarGladis() {
  console.log('🔍 Verificando dados da Gladis...\n')
  
  try {
    // Buscar professionals com nome Gladis
    const { data: professionals } = await supabase
      .from('professionals')
      .select('*')
      .or('email.ilike.%gladis%,name.ilike.%gladis%')
    
    console.log(`📋 Professionals encontrados: ${professionals?.length || 0}`)
    professionals?.forEach(p => {
      console.log('   - ID:', p.id)
      console.log('     Email:', p.email)
      console.log('     Nome:', p.name)
      console.log('')
    })
    
    // Buscar subscriptions
    if (professionals && professionals.length > 0) {
      for (const prof of professionals) {
        const { data: subs } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', prof.id)
        
        console.log(`📦 Subscriptions para ${prof.name}:`, subs?.length || 0)
      }
    }
    
    // Buscar auth users com email gladis
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('❌ Erro ao buscar auth users:', authError)
    } else {
      const gladisAuth = users.filter(u => 
        u.email?.toLowerCase().includes('gladis') || 
        u.email?.includes('gladis')
      )
      
      console.log(`\n🔐 Auth users encontrados: ${gladisAuth.length}`)
      gladisAuth.forEach(u => {
        console.log('   - ID:', u.id)
        console.log('     Email:', u.email)
        console.log('     Email confirmado:', u.email_confirmed_at ? 'SIM ✅' : 'NÃO ❌')
        console.log('     Último login:', u.last_sign_in_at || 'Nunca')
        console.log('')
      })
    }
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

verificarGladis()

