import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Dados da Marcela
    const email = 'marcela_roberto@hotmail.com'
    const name = 'marcela_roberto'
    const professionalId = 'a30b5935-3bdc-4b30-a78b-346d10c287c4'
    const senhaTemporaria = 'MarcelaTemporaria123!'
    
    console.log('🔐 Criando auth para Marcela Roberto...')
    
    // Verificar se já existe
    const { data: existingAuth } = await supabase.auth.admin.getUserById(professionalId)
    
    if (existingAuth?.user) {
      console.log('⚠️ Já existe auth para este usuário')
      return NextResponse.json({
        success: false,
        message: 'Já existe autenticação para este usuário',
        credentials: {
          email: existingAuth.user.email,
          senha: 'Verificar no Supabase Dashboard'
        }
      })
    }
    
    // Criar auth.users
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
      return NextResponse.json({
        success: false,
        error: authError.message
      }, { status: 500 })
    }
    
    console.log('✅ Auth criada com sucesso!')
    
    return NextResponse.json({
      success: true,
      message: 'Conta de autenticação criada com sucesso!',
      credentials: {
        email: authUser.user.email,
        senha: senhaTemporaria,
        userId: authUser.user.id
      }
    })
    
  } catch (error) {
    console.error('❌ Erro:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro ao criar autenticação'
    }, { status: 500 })
  }
}

