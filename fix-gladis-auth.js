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

async function fixGladis() {
  console.log('🔧 Corrigindo vínculo auth-professional da Gladis...\n')
  
  try {
    const professionalIdAntigo = 'f1bca700-ef6e-49de-9746-72510d35572c'
    const authIdCorreto = '3fcaae16-b5e7-4a17-85b9-50e0004f4ab9'
    
    // 1. Buscar dados do professional atual
    const { data: professionalAntigo } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', professionalIdAntigo)
      .single()
    
    console.log('📋 Professional atual:', {
      id: professionalAntigo?.id,
      email: professionalAntigo?.email,
      name: professionalAntigo?.name
    })
    
    // 2. Verificar se já existe professional com auth.id
    const { data: professionalNovo } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', authIdCorreto)
      .single()
    
    if (professionalNovo) {
      console.log('⚠️ Já existe professional com ID correto!')
    } else {
      // 3. Criar professional novo com ID correto
      console.log('📝 Criando professional novo...')
      
      const { data: novoProfessional, error } = await supabase
        .from('professionals')
        .insert({
          id: authIdCorreto,
          email: 'gladisgordaliza@gmail.com',
          name: professionalAntigo?.name || 'gladisgordaliza',
          phone: professionalAntigo?.phone,
          specialty: professionalAntigo?.specialty,
          company: professionalAntigo?.company,
          subscription_status: professionalAntigo?.subscription_status || 'active',
          is_active: true,
          max_leads: 100
        })
        .select()
      
      if (error) {
        console.error('❌ Erro ao criar professional:', error)
        return
      }
      
      console.log('✅ Professional criado!')
    }
    
    // 4. Migrar subscriptions
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', professionalIdAntigo)
    
    if (subscriptions && subscriptions.length > 0) {
      console.log(`📦 Migrando ${subscriptions.length} subscription(s)...`)
      
      const { error } = await supabase
        .from('subscriptions')
        .update({ user_id: authIdCorreto })
        .eq('user_id', professionalIdAntigo)
      
      if (error) {
        console.error('❌ Erro ao migrar subscriptions:', error)
      } else {
        console.log('✅ Subscriptions migradas')
      }
    }
    
    // 5. Verificar resultado final
    const { data: profissionalFinal } = await supabase
      .from('professionals')
      .select(`
        *,
        subscriptions (*)
      `)
      .eq('id', authIdCorreto)
      .single()
    
    console.log('\n✅ CORREÇÃO CONCLUÍDA!')
    console.log('\n📊 RESULTADO FINAL:')
    console.log('   ID:', profissionalFinal?.id)
    console.log('   Email:', profissionalFinal?.email)
    console.log('   Nome:', profissionalFinal?.name)
    console.log('   Subscriptions:', profissionalFinal?.subscriptions?.length || 0)
    
    console.log('\n📱 DADOS DE LOGIN CORRETOS:')
    console.log('   Email: gladisgordaliza@gmail.com')
    console.log('   Senha: (ela precisa usar a senha REAL que ela criou)')
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

fixGladis()

