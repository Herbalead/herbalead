import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone, countryCode } = await request.json()
    
    console.log('🔐 Criando conta de autenticação para:', email)
    
    // Verificar se usuário já existe na tabela professionals
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('professionals')
      .select('id, email')
      .eq('email', email)
      .single()

    if (existingUser && !checkError) {
      // Usuário já existe - verificar se tem conta de auth
      console.log('Usuário já existe, verificando conta de auth...')
      
      // Verificar se existe na tabela auth.users
      const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1000
      })
      
      const hasAuth = authUsers?.users?.find(user => user.email === email)
      
      if (authUsers && !hasAuth) {
        // Não tem conta de auth - criar uma
        console.log('Criando conta de autenticação...')
        const { data: newAuthUser, error: createAuthError } = await supabaseAdmin.auth.admin.createUser({
          email: email,
          password: password,
          email_confirm: true,
          user_metadata: {
            full_name: name,
            phone: `${countryCode}${phone}`,
          }
        })
        
        if (createAuthError) {
          console.error('Erro ao criar conta de auth:', createAuthError)
          return NextResponse.json({ error: 'Erro ao criar conta de autenticação' }, { status: 500 })
        }
        
        console.log('Conta de auth criada:', newAuthUser.user?.id)
      } else if (hasAuth) {
        // Tem conta de auth - apenas atualizar senha
        console.log('Atualizando senha...')
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          existingUser.id,
          {
            password: password,
            user_metadata: {
              full_name: name,
              phone: `${countryCode}${phone}`,
            }
          }
        )

        if (updateError) {
          console.error('Erro ao atualizar senha:', updateError)
          return NextResponse.json({ error: 'Erro ao atualizar senha' }, { status: 500 })
        }
      }

      // Atualizar perfil na tabela professionals
      const { error: profileError } = await supabaseAdmin
        .from('professionals')
        .update({
          name: name,
          phone: `${countryCode}${phone}`,
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('email', email)

      if (profileError) {
        console.error('Erro ao atualizar perfil:', profileError)
        return NextResponse.json({ error: 'Erro ao atualizar perfil' }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Perfil atualizado com sucesso!',
        userId: existingUser.id
      })

    } else {
      // Usuário não existe - criar novo
      console.log('Usuário não existe, criando novo...')
      
      // Criar conta de autenticação primeiro
      const { data: newAuthUser, error: createAuthError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: name,
          phone: `${countryCode}${phone}`,
        }
      })
      
      if (createAuthError) {
        console.error('Erro ao criar conta de auth:', createAuthError)
        return NextResponse.json({ error: 'Erro ao criar conta de autenticação' }, { status: 500 })
      }

      const userId = newAuthUser.user?.id
      if (!userId) {
        return NextResponse.json({ error: 'Erro ao obter ID do usuário' }, { status: 500 })
      }

      // Criar profissional
      const { error: profError } = await supabaseAdmin
        .from('professionals')
        .insert({
          id: userId,
          email: email,
          name: name,
          phone: `${countryCode}${phone}`,
          specialty: '',
          company: '',
          subscription_status: 'active',
          is_active: true,
          max_leads: 1000
        })

      if (profError) {
        console.error('Erro ao criar profissional:', profError)
        return NextResponse.json({ error: 'Erro ao criar profissional' }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Conta criada com sucesso!',
        userId: userId
      })
    }

  } catch (error) {
    console.error('Erro geral:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
