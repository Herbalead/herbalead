import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    // Verificar se é admin
    const authHeader = request.headers.get('authorization')
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { email } = await request.json()

    console.log('🔐 Criando auth para profissional:', email)

    // Buscar profissional
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    
    const { data: professional, error: profError } = await supabaseAdmin
      .from('professionals')
      .select('*')
      .eq('email', email)
      .single()

    if (profError || !professional) {
      console.error('❌ Profissional não encontrado:', profError)
      return NextResponse.json({ 
        error: 'Profissional não encontrado',
        details: profError?.message 
      }, { status: 404 })
    }

    console.log('✅ Profissional encontrado:', professional.name)

    // Verificar se já tem auth
    const { data: existingAuth } = await supabaseAdmin.auth.admin.getUserById(professional.id)
    
    if (existingAuth) {
      console.log('⚠️ Usuário já tem autenticação')
      return NextResponse.json({ 
        success: false, 
        message: 'Usuário já tem conta de autenticação',
        userId: existingAuth.user.id
      })
    }

    // Criar senha aleatória
    const randomPassword = Math.random().toString(36).slice(-12) + 'A1!'
    
    console.log('🔐 Criando conta de autenticação...')
    
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: professional.email,
      password: randomPassword,
      email_confirm: true,
      user_metadata: {
        full_name: professional.name,
        phone: professional.phone || ''
      }
    })

    if (authError) {
      console.error('❌ Erro ao criar auth:', authError)
      return NextResponse.json({ 
        error: 'Erro ao criar conta de autenticação',
        details: authError.message 
      }, { status: 500 })
    }

    console.log('✅ Conta de autenticação criada com sucesso!')
    
    return NextResponse.json({ 
      success: true,
      message: 'Conta de autenticação criada com sucesso',
      userId: authUser.user.id,
      email: authUser.user.email,
      credentials: {
        email: professional.email,
        password: randomPassword,
        note: 'Email estas credenciais para o usuário por um canal seguro'
      }
    })

  } catch (error) {
    console.error('❌ Erro geral:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

