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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrarMarcela() {
  console.log('🔍 Buscando dados da Marcela...\n')
  
  try {
    // 1. Buscar dados do professional antigo
    const { data: professionalAntigo, error: errProf } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', 'a30b5935-3bdc-4b30-a78b-346d10c287c4')
      .single()
    
    if (errProf || !professionalAntigo) {
      console.log('⚠️ Professional antigo não encontrado ou já migrado')
    } else {
      console.log('📋 Dados encontrados:', {
        nome: professionalAntigo.name,
        email: professionalAntigo.email,
        subscription: professionalAntigo.subscription_status
      })
    }
    
    // 2. Buscar subscriptions
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', 'a30b5935-3bdc-4b30-a78b-346d10c287c4')
    
    console.log(`📦 Subscriptions encontradas: ${subscriptions?.length || 0}`)
    
    // 3. VERIFICAR se já existe professional com auth.id correto
    const { data: professionalNovo, error: errNovo } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', 'f7a15f22-9699-4b04-9f9d-0d48dd558989')
      .single()
    
    if (errNovo && errNovo.code === 'PGRST116') {
      console.log('\n✅ Professional novo NÃO existe ainda. Vamos criar!')
      
      // 4. Criar professional novo
      const { data: novoProf, error: errCreate } = await supabase
        .from('professionals')
        .insert({
          id: 'f7a15f22-9699-4b04-9f9d-0d48dd558989',
          email: 'marcela_roberto@hotmail.com',
          name: professionalAntigo?.name || 'Marcela Roberto',
          phone: professionalAntigo?.phone,
          specialty: professionalAntigo?.specialty,
          company: professionalAntigo?.company,
          subscription_status: professionalAntigo?.subscription_status || 'active',
          is_active: true,
          max_leads: 100
        })
        .select()
      
      if (errCreate) {
        console.error('❌ Erro ao criar professional:', errCreate)
        return
      }
      
      console.log('✅ Professional criado com sucesso!')
      
      // 5. Migrar subscriptions (se houver)
      if (subscriptions && subscriptions.length > 0) {
        console.log(`\n📦 Migrando ${subscriptions.length} subscription(s)...`)
        
        for (const sub of subscriptions) {
          const { error: errSub } = await supabase
            .from('subscriptions')
            .update({ user_id: 'f7a15f22-9699-4b04-9f9d-0d48dd558989' })
            .eq('id', sub.id)
          
          if (errSub) {
            console.error(`❌ Erro ao migrar subscription ${sub.id}:`, errSub)
          } else {
            console.log(`✅ Subscription ${sub.id} migrada`)
          }
        }
      }
      
      // 6. Migrar links (se houver)
      const { data: links } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', 'a30b5935-3bdc-4b30-a78b-346d10c287c4')
      
      if (links && links.length > 0) {
        console.log(`\n🔗 Migrando ${links.length} link(s)...`)
        
        const { error: errLinks } = await supabase
          .from('links')
          .update({ user_id: 'f7a15f22-9699-4b04-9f9d-0d48dd558989' })
          .eq('user_id', 'a30b5935-3bdc-4b30-a78b-346d10c287c4')
        
        if (errLinks) {
          console.error('❌ Erro ao migrar links:', errLinks)
        } else {
          console.log(`✅ ${links.length} link(s) migrado(s)`)
        }
      }
      
    } else if (professionalNovo) {
      console.log('\n⚠️ Professional novo JÁ EXISTE!')
      console.log('📋 Dados:', {
        email: professionalNovo.email,
        nome: professionalNovo.name
      })
    }
    
    // 7. Verificar resultado final
    const { data: profissionalFinal } = await supabase
      .from('professionals')
      .select(`
        *,
        subscriptions (*),
        links (*)
      `)
      .eq('id', 'f7a15f22-9699-4b04-9f9d-0d48dd558989')
      .single()
    
    console.log('\n✅ MIGRAÇÃO CONCLUÍDA!')
    console.log('\n📊 RESULTADO FINAL:')
    console.log('   Email:', profissionalFinal?.email)
    console.log('   Nome:', profissionalFinal?.name)
    console.log('   Subscriptions:', profissionalFinal?.subscriptions?.length || 0)
    console.log('   Links:', profissionalFinal?.links?.length || 0)
    
    console.log('\n📱 Envie para Marcela:')
    console.log('   Email: marcela_roberto@hotmail.com')
    console.log('   Senha: MarcelaTemporaria123!')
    console.log('   URL: https://herbalead.com/login')
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

migrarMarcela()

