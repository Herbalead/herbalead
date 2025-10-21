const { createClient } = require('@supabase/supabase-js')

// Configuração do Supabase
const supabaseUrl = 'https://rjwuedzmapeozijjrcik.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqd3VlZHptYXBlb3ppampyY2lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MzI3MjMsImV4cCI6MjA3NTUwODcyM30.M5CFogx19_WnT_rU86fe1FUKn6yo4Dy-rKdZjRkUSd4'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSupabaseConnection() {
  console.log('🔍 Testando conexão com Supabase...')
  
  try {
    // Teste 1: Verificar se consegue conectar
    console.log('1. Testando conexão básica...')
    const { data, error } = await supabase.from('professionals').select('count').limit(1)
    
    if (error) {
      console.error('❌ Erro na conexão:', error)
      return false
    }
    
    console.log('✅ Conexão com Supabase funcionando!')
    
    // Teste 2: Verificar estrutura da tabela professionals
    console.log('2. Verificando estrutura da tabela professionals...')
    const { data: professionals, error: profError } = await supabase
      .from('professionals')
      .select('*')
      .limit(5)
    
    if (profError) {
      console.error('❌ Erro ao buscar profissionais:', profError)
    } else {
      console.log('✅ Tabela professionals acessível')
      console.log('📊 Profissionais encontrados:', professionals?.length || 0)
    }
    
    // Teste 3: Verificar tabela leads
    console.log('3. Verificando tabela leads...')
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .limit(5)
    
    if (leadsError) {
      console.error('❌ Erro ao buscar leads:', leadsError)
    } else {
      console.log('✅ Tabela leads acessível')
      console.log('📊 Leads encontrados:', leads?.length || 0)
    }
    
    // Teste 4: Verificar autenticação
    console.log('4. Testando sistema de autenticação...')
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('❌ Erro na autenticação:', authError)
    } else {
      console.log('✅ Sistema de autenticação funcionando')
      console.log('👤 Sessão atual:', authData.session ? 'Ativa' : 'Nenhuma')
    }
    
    console.log('🎉 Todos os testes passaram! Supabase está funcionando corretamente.')
    return true
    
  } catch (error) {
    console.error('❌ Erro geral no teste:', error)
    return false
  }
}

// Executar teste
testSupabaseConnection()
  .then(success => {
    if (success) {
      console.log('\n✅ RESUMO: Supabase está funcionando perfeitamente!')
      process.exit(0)
    } else {
      console.log('\n❌ RESUMO: Problemas encontrados no Supabase')
      process.exit(1)
    }
  })
  .catch(error => {
    console.error('\n💥 ERRO CRÍTICO:', error)
    process.exit(1)
  })
