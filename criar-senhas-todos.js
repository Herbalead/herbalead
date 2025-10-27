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

async function criarSenhasTodos() {
  console.log('🔐 Criando senhas para todos os profissionais sem auth...\n')
  
  const profissionais = [
    { id: 'a30b5935-3bdc-4b30-a78b-346d10c287c4', email: 'marcela_roberto@hotmail.com', name: 'Marcela Roberto' },
    { id: '3154711c-26e2-4769-ac79-ac8be815a714', email: 'iaralallon56@gmail.com', name: 'Iara Lallon' },
    { id: '5f0b7493-32d4-43f8-a84d-3cbcad90c6dd', email: 'diasmizuno@hotmail.com', name: 'Cleuza Mizuno' },
    { id: '8d0ccf34-e8a7-4baa-b25a-39158918a11b', email: 'stephanieizidio@hotmail.com', name: 'Stephanie Izidio' },
    { id: 'de631769-2aae-43e6-ad96-83cf62784891', email: 'sperandio.rosanaelisa@gmail.com', name: 'Rosana Elisa Sperandio' },
    { id: 'f1bca700-ef6e-49de-9746-72510d35572c', email: 'gladisgordaliza@gmail.com', name: 'Gladis Gordaliza' },
    { id: 'befda47d-7338-422b-b441-9dae8dbf2b81', email: 'albuquerquegaldino1959@gmail.com', name: 'Galdino Albuquerque Junior' },
    { id: '9e8f76b8-9049-4cdf-a951-882928122e2b', email: 'joaoaraujo11@gmail.com', name: 'João Araújo' },
    { id: '43cdd900-c343-4ae2-9195-893053e735bd', email: 'ylada.lead@gmail.com', name: 'André Oliveira' }
  ]
  
  const mensagens = []
  
  for (const prof of profissionais) {
    console.log(`\n📋 Processando: ${prof.name}`)
    
    // Gerar senha baseada no email
    const senhaBase = prof.email.split('@')[0].substring(0, 8)
    const senha = `${senhaBase}2024!`
    
    console.log(`   Email: ${prof.email}`)
    console.log(`   Senha: ${senha}`)
    
    // Verificar se já existe auth
    try {
      const { data: authUser } = await supabase.auth.admin.getUserById(prof.id)
      
      if (authUser?.user) {
        console.log(`   ✅ Já tem auth - Resetando senha...`)
        
        const { data, error } = await supabase.auth.admin.updateUserById(prof.id, {
          password: senha
        })
        
        if (error) {
          console.error(`   ❌ Erro: ${error.message}`)
          continue
        }
        
        console.log(`   ✅ Senha resetada`)
      } else {
        console.log(`   🔐 Criando auth...`)
        
        const { data: authUserNew, error } = await supabase.auth.admin.createUser({
          id: prof.id,
          email: prof.email,
          password: senha,
          email_confirm: true,
          user_metadata: {
            full_name: prof.name
          }
        })
        
        if (error) {
          console.error(`   ❌ Erro: ${error.message}`)
          continue
        }
        
        console.log(`   ✅ Auth criada`)
      }
      
      // Criar mensagem
      mensagens.push({
        nome: prof.name,
        email: prof.email,
        senha: senha
      })
      
    } catch (error) {
      console.error(`   ❌ Erro: ${error.message}`)
    }
  }
  
  console.log('\n✅ CONCLUÍDO!\n')
  
  // Imprimir mensagens para WhatsApp
  console.log('═'.repeat(60))
  console.log('📱 MENSAGENS PARA ENVIAR NO WHATSAPP:')
  console.log('═'.repeat(60))
  
  mensagens.forEach((msg, index) => {
    console.log(`\n${index + 1}. ${msg.nome} (${msg.email}):`)
    console.log('─'.repeat(40))
    console.log(`Olá ${msg.nome.split(' ')[0]}!\n`)
    console.log(`Sua conta foi criada com sucesso! 🎉\n`)
    console.log(`📧 Email: ${msg.email}`)
    console.log(`🔑 Senha: ${msg.senha}\n`)
    console.log(`Acesse: https://herbalead.com/login\n`)
    console.log(`⚠️ IMPORTANTE: Troque a senha após entrar no sistema.\n`)
    console.log('─'.repeat(40))
    console.log('')
  })
}

criarSenhasTodos()

