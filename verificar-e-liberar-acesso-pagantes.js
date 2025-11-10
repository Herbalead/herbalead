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

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

// Dados das pessoas que pagaram
const usuarios = [
  {
    nome: 'Cleiton De Sá',
    email: 'slimrosolem@gmail.com',
    senhaProvisoria: 'HerbaLead2025!'
  },
  {
    nome: 'Donarosa59',
    email: 'donarosa59@hotmail.com',
    senhaProvisoria: 'HerbaLead2025!'
  }
]

async function verificarEliberarAcesso() {
  console.log('🔍 Verificando e liberando acesso para usuários que pagaram...\n')
  
  for (const usuario of usuarios) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`👤 Processando: ${usuario.nome}`)
    console.log(`📧 Email: ${usuario.email}`)
    console.log(`${'='.repeat(60)}\n`)
    
    try {
      // 1. Verificar se existe na tabela professionals
      const { data: professional, error: profError } = await supabase
        .from('professionals')
        .select('*')
        .eq('email', usuario.email)
        .maybeSingle()
      
      if (profError) {
        console.error('❌ Erro ao buscar professional:', profError)
        continue
      }
      
      if (!professional) {
        console.log('⚠️  Professional não encontrado na tabela professionals')
        console.log('   Criando professional...')
        
        // Criar professional
        const { data: newProfessional, error: createProfError } = await supabase
          .from('professionals')
          .insert({
            email: usuario.email,
            name: usuario.nome,
            subscription_status: 'active',
            is_active: true,
            max_leads: 100
          })
          .select()
          .single()
        
        if (createProfError) {
          console.error('❌ Erro ao criar professional:', createProfError)
          continue
        }
        
        console.log('✅ Professional criado com ID:', newProfessional.id)
        
        // Continuar com o novo professional
        const professionalId = newProfessional.id
        
        // 2. Verificar/criar conta no auth.users
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
        
        if (authError) {
          console.error('❌ Erro ao listar usuários auth:', authError)
          continue
        }
        
        const existingAuthUser = authUsers.users.find(u => u.email === usuario.email)
        
        let authUserId = professionalId
        
        if (existingAuthUser) {
          console.log('✅ Usuário já existe no auth.users')
          authUserId = existingAuthUser.id
          
          // Atualizar senha
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            authUserId,
            { password: usuario.senhaProvisoria }
          )
          
          if (updateError) {
            console.error('❌ Erro ao atualizar senha:', updateError)
            continue
          }
          
          console.log('✅ Senha atualizada com sucesso')
        } else {
          console.log('⚠️  Usuário não existe no auth.users')
          console.log('   Criando usuário no auth...')
          
          // Criar usuário no auth
          const { data: newAuthUser, error: createAuthError } = await supabase.auth.admin.createUser({
            email: usuario.email,
            password: usuario.senhaProvisoria,
            email_confirm: true,
            user_metadata: {
              name: usuario.nome
            }
          })
          
          if (createAuthError) {
            console.error('❌ Erro ao criar usuário auth:', createAuthError)
            continue
          }
          
          console.log('✅ Usuário criado no auth com ID:', newAuthUser.user.id)
          authUserId = newAuthUser.user.id
          
          // Se o ID do auth for diferente do professional, atualizar professional
          if (authUserId !== professionalId) {
            console.log('⚠️  IDs diferentes, atualizando professional...')
            const { error: updateProfError } = await supabase
              .from('professionals')
              .update({ id: authUserId })
              .eq('id', professionalId)
            
            if (updateProfError) {
              console.error('❌ Erro ao atualizar professional ID:', updateProfError)
              // Tentar deletar o professional antigo e criar um novo
              await supabase.from('professionals').delete().eq('id', professionalId)
              
              const { error: createProfError2 } = await supabase
                .from('professionals')
                .insert({
                  id: authUserId,
                  email: usuario.email,
                  name: usuario.nome,
                  subscription_status: 'active',
                  is_active: true,
                  max_leads: 100
                })
              
              if (createProfError2) {
                console.error('❌ Erro ao recriar professional:', createProfError2)
                continue
              }
            }
          }
        }
        
        // 3. Verificar/criar subscription
        const { data: subscription, error: subError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', authUserId)
          .maybeSingle()
        
        if (subError) {
          console.error('❌ Erro ao buscar subscription:', subError)
        } else if (!subscription) {
          console.log('⚠️  Subscription não encontrada')
          console.log('   Criando subscription...')
          
          const { error: createSubError } = await supabase
            .from('subscriptions')
            .insert({
              user_id: authUserId,
              status: 'active',
              payment_source: 'mercadopago',
              stripe_customer_id: 'mp_' + authUserId.substring(0, 8),
              stripe_subscription_id: 'mp_sub_' + authUserId.substring(0, 8),
              stripe_price_id: 'mp_price_annual',
              plan_type: 'yearly',
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              cancel_at_period_end: false
            })
          
          if (createSubError) {
            console.error('❌ Erro ao criar subscription:', createSubError)
          } else {
            console.log('✅ Subscription criada')
          }
        } else {
          console.log('✅ Subscription já existe')
          // Garantir que está ativa
          if (subscription.status !== 'active') {
            await supabase
              .from('subscriptions')
              .update({ status: 'active' })
              .eq('user_id', authUserId)
            console.log('✅ Subscription atualizada para active')
          }
        }
        
        // 4. Resumo final
        console.log('\n✅ ACESSO LIBERADO COM SUCESSO!')
        console.log('─'.repeat(60))
        console.log(`📧 Email: ${usuario.email}`)
        console.log(`🔑 Senha provisória: ${usuario.senhaProvisoria}`)
        console.log(`🌐 URL de login: https://herbalead.com/login`)
        console.log(`👤 ID: ${authUserId}`)
        console.log('─'.repeat(60))
        
      } else {
        // Professional já existe
        console.log('✅ Professional encontrado')
        console.log('   ID:', professional.id)
        console.log('   Status:', professional.subscription_status)
        console.log('   Ativo:', professional.is_active)
        
        const professionalId = professional.id
        
        // 2. Verificar/criar conta no auth.users
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
        
        if (authError) {
          console.error('❌ Erro ao listar usuários auth:', authError)
          continue
        }
        
        const existingAuthUser = authUsers.users.find(u => u.email === usuario.email)
        
        let authUserId = professionalId
        
        if (existingAuthUser) {
          console.log('✅ Usuário já existe no auth.users')
          authUserId = existingAuthUser.id
          
          // Atualizar senha
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            authUserId,
            { password: usuario.senhaProvisoria }
          )
          
          if (updateError) {
            console.error('❌ Erro ao atualizar senha:', updateError)
            continue
          }
          
          console.log('✅ Senha atualizada com sucesso')
        } else {
          console.log('⚠️  Usuário não existe no auth.users')
          console.log('   Criando usuário no auth...')
          
          // Criar usuário no auth
          const { data: newAuthUser, error: createAuthError } = await supabase.auth.admin.createUser({
            email: usuario.email,
            password: usuario.senhaProvisoria,
            email_confirm: true,
            user_metadata: {
              name: usuario.nome
            }
          })
          
          if (createAuthError) {
            console.error('❌ Erro ao criar usuário auth:', createAuthError)
            continue
          }
          
          console.log('✅ Usuário criado no auth com ID:', newAuthUser.user.id)
          authUserId = newAuthUser.user.id
          
          // Se o ID do auth for diferente do professional, atualizar professional
          if (authUserId !== professionalId) {
            console.log('⚠️  IDs diferentes, atualizando professional...')
            
            // Migrar subscriptions e links primeiro
            const { data: oldSubs } = await supabase
              .from('subscriptions')
              .select('*')
              .eq('user_id', professionalId)
            
            if (oldSubs && oldSubs.length > 0) {
              for (const sub of oldSubs) {
                await supabase
                  .from('subscriptions')
                  .update({ user_id: authUserId })
                  .eq('id', sub.id)
              }
            }
            
            const { data: oldLinks } = await supabase
              .from('links')
              .select('*')
              .eq('user_id', professionalId)
            
            if (oldLinks && oldLinks.length > 0) {
              for (const link of oldLinks) {
                await supabase
                  .from('links')
                  .update({ user_id: authUserId })
                  .eq('id', link.id)
              }
            }
            
            // Atualizar professional
            const { error: updateProfError } = await supabase
              .from('professionals')
              .update({ id: authUserId })
              .eq('id', professionalId)
            
            if (updateProfError) {
              console.error('❌ Erro ao atualizar professional ID:', updateProfError)
              // Tentar deletar o professional antigo e criar um novo
              await supabase.from('professionals').delete().eq('id', professionalId)
              
              const { error: createProfError2 } = await supabase
                .from('professionals')
                .insert({
                  id: authUserId,
                  email: usuario.email,
                  name: usuario.nome,
                  subscription_status: professional.subscription_status || 'active',
                  is_active: professional.is_active !== false,
                  max_leads: professional.max_leads || 100,
                  phone: professional.phone,
                  specialty: professional.specialty,
                  company: professional.company
                })
              
              if (createProfError2) {
                console.error('❌ Erro ao recriar professional:', createProfError2)
                continue
              }
            }
          }
        }
        
        // 3. Verificar/criar subscription
        const { data: subscription, error: subError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', authUserId)
          .maybeSingle()
        
        if (subError) {
          console.error('❌ Erro ao buscar subscription:', subError)
        } else if (!subscription) {
          console.log('⚠️  Subscription não encontrada')
          console.log('   Criando subscription...')
          
          const { error: createSubError } = await supabase
            .from('subscriptions')
            .insert({
              user_id: authUserId,
              status: 'active',
              payment_source: 'mercadopago',
              stripe_customer_id: 'mp_' + authUserId.substring(0, 8),
              stripe_subscription_id: 'mp_sub_' + authUserId.substring(0, 8),
              stripe_price_id: 'mp_price_annual',
              plan_type: 'yearly',
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              cancel_at_period_end: false
            })
          
          if (createSubError) {
            console.error('❌ Erro ao criar subscription:', createSubError)
          } else {
            console.log('✅ Subscription criada')
          }
        } else {
          console.log('✅ Subscription já existe')
          // Garantir que está ativa
          if (subscription.status !== 'active') {
            await supabase
              .from('subscriptions')
              .update({ status: 'active' })
              .eq('user_id', authUserId)
            console.log('✅ Subscription atualizada para active')
          }
        }
        
        // 4. Atualizar professional para ativo
        if (!professional.is_active || professional.subscription_status !== 'active') {
          await supabase
            .from('professionals')
            .update({
              is_active: true,
              subscription_status: 'active'
            })
            .eq('id', authUserId)
          console.log('✅ Professional atualizado para ativo')
        }
        
        // 5. Resumo final
        console.log('\n✅ ACESSO LIBERADO COM SUCESSO!')
        console.log('─'.repeat(60))
        console.log(`📧 Email: ${usuario.email}`)
        console.log(`🔑 Senha provisória: ${usuario.senhaProvisoria}`)
        console.log(`🌐 URL de login: https://herbalead.com/login`)
        console.log(`👤 ID: ${authUserId}`)
        console.log('─'.repeat(60))
      }
      
    } catch (error) {
      console.error(`❌ Erro ao processar ${usuario.nome}:`, error)
    }
  }
  
  console.log('\n\n🎉 PROCESSAMENTO CONCLUÍDO!')
  console.log('\n📱 MENSAGEM PARA ENVIAR AOS USUÁRIOS:')
  console.log('─'.repeat(60))
  console.log('Olá!\n')
  console.log('Sua conta foi criada com sucesso! 🎉\n')
  console.log('📧 Email: [EMAIL DO USUÁRIO]')
  console.log('🔑 Senha provisória: HerbaLead2025!\n')
  console.log('Acesse: https://herbalead.com/login\n')
  console.log('⚠️ IMPORTANTE: Troque a senha após entrar no sistema.\n')
  console.log('─'.repeat(60))
}

verificarEliberarAcesso()

