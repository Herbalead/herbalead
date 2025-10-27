/**
 * Script para criar auth.users para Marcela Roberto
 * Execute: node criar-auth-marcela.js
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function criarAuthMarcela() {
  console.log('🔐 Criando auth para Marcela...')
  
  // DADOS DA MARCELA (PREENCHER AQUI)
  const email = 'marcela_roberto@hotmail.com'
  const name = 'marcela_roberto'
  const senhaTemporaria = 'MarcelaTemporaria123!'
  
  try {
    // 1. Verificar se já existe auth
    const { data: existingAuth } = await supabase
      .from('auth.users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (existingAuth) {
      console.log('⚠️ Já existe auth para este email')
      return
    }

    // 2. Buscar professional_id
    const { data: professional } = await supabase
      .from('professionals')
      .select('id, email, name')
      .eq('email', email)
      .single()

    if (!professional) {
      console.log('❌ Profissional não encontrado')
      return
    }

    console.log('✅ Professional encontrado:', professional.id)

    // 3. Criar auth.users usando Admin API
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: senhaTemporaria,
      email_confirm: true,
      user_metadata: {
        full_name: name
      }
    })

    if (authError) {
      console.error('❌ Erro ao criar auth:', authError)
      return
    }

    console.log('✅ Auth criada com sucesso!')
    console.log('📧 Email:', authUser.user.email)
    console.log('🔑 ID:', authUser.user.id)
    
    console.log('\n📋 CREDENCIAIS PARA MARCELA:')
    console.log('Email:', email)
    console.log('Senha temporária:', senhaTemporaria)
    console.log('\n⚠️ IMPORTANTE: Enviar estas credenciais por WhatsApp')

  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

criarAuthMarcela()

