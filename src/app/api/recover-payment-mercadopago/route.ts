import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    }

    console.log('🔍 Recuperando pagamento para:', email)

    // Buscar profissional com este email
    const { data: professional } = await supabase
      .from('professionals')
      .select('id, email, subscription_status, is_active, created_at')
      .eq('email', email)
      .single()

    if (!professional) {
      return NextResponse.json({ 
        error: 'Nenhum pagamento encontrado para este email',
        found: false 
      }, { status: 404 })
    }

    // Buscar assinatura relacionada
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('id, status, plan_type, customer_email, created_at')
      .eq('customer_email', email)
      .single()

    // Verificar se já tem conta de autenticação
    const { data: authUser } = await supabase.auth.admin.getUserById(professional.id)

    return NextResponse.json({
      found: true,
      email: email,
      professional_id: professional.id,
      subscription_status: professional.subscription_status,
      is_active: professional.is_active,
      subscription_id: subscription?.id,
      plan_type: subscription?.plan_type,
      subscription_status: subscription?.status,
      has_auth_account: !!authUser.user,
      created_at: professional.created_at,
      can_complete_registration: !authUser.user || !professional.name,
      gateway: 'mercadopago'
    })

  } catch (error) {
    console.error('Erro ao recuperar pagamento:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
