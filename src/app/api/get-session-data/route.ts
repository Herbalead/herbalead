import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    const gateway = searchParams.get('gateway')
    const email = searchParams.get('email')

    // Se é Mercado Pago, buscar dados do profissional
    if (gateway === 'mercadopago' && email) {
      console.log('🔍 Buscando dados do Mercado Pago para:', email)
      
      // Buscar profissional criado pelo webhook
      const { data: professional } = await supabase
        .from('professionals')
        .select('id, email, subscription_status, is_active')
        .eq('email', email)
        .single()

      if (professional) {
        // Buscar assinatura relacionada
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('id, status, plan_type, customer_email')
          .eq('customer_email', email)
          .single()

        return NextResponse.json({
          id: professional.id,
          customer_email: professional.email,
          subscription_status: professional.subscription_status,
          is_active: professional.is_active,
          subscription_id: subscription?.id,
          plan_type: subscription?.plan_type,
          status: subscription?.status,
          gateway: 'mercadopago'
        })
      } else {
        return NextResponse.json({ 
          error: 'Profissional não encontrado',
          found: false 
        }, { status: 404 })
      }
    }

    // Se é Stripe (comportamento original)
    if (sessionId && !gateway) {
      const { stripe } = await import('../../../../lib/stripe-subscriptions')
      
      const session = await stripe.checkout.sessions.retrieve(sessionId)

      return NextResponse.json({
        id: session.id,
        customer_email: session.customer_email,
        subscription_id: session.subscription,
        payment_status: session.payment_status,
        status: session.status,
        gateway: 'stripe'
      })
    }

    return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })

  } catch (error) {
    console.error('Error retrieving session data:', error)
    return NextResponse.json({ error: 'Failed to retrieve session data' }, { status: 500 })
  }
}