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

async function verificarClaudia() {
  console.log('🔍 Verificando dados da Cláudia Vitto...\n')
  
  try {
    const { data: professional } = await supabase
      .from('professionals')
      .select('*')
      .eq('email', 'claudiavitto@hotmail.com')
      .single()
    
    console.log('📋 Dados do professional:')
    console.log('   Nome:', professional?.name)
    console.log('   Email:', professional?.email)
    console.log('   Telefone:', professional?.phone || '❌ NÃO CONFIGURADO')
    console.log('   Specialty:', professional?.specialty)
    console.log('   Company:', professional?.company)
    console.log('')
    
    if (!professional?.phone) {
      console.log('⚠️  TELEFONE NÃO CONFIGURADO!')
      console.log('   Preciso atualizar o telefone dela.')
      
      // Pedir para o usuário fornecer o telefone
      console.log('\n💡 AÇÃO NECESSÁRIA:')
      console.log('   1. Pegue o telefone da Cláudia (com DDD)')
      console.log('   2. Execute: node atualizar-telefone-claudia.js')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

verificarClaudia()

