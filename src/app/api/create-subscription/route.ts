import { NextRequest, NextResponse } from 'next/server'
import { stripe, stripePlans } from '../../../../lib/stripe-subscriptions'

export async function POST(request: NextRequest) {
  try {
    const { planType, email } = await request.json()
    
    // Get plan configuration
    const plan = stripePlans[planType as keyof typeof stripePlans]
    if (!plan) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })
    }

    // Create subscription checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment`,
      customer_email: email,
    })
    
    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url
    })
  } catch (error) {
    console.error('Error creating Stripe subscription:', error)
    return NextResponse.json({ 
      error: 'Erro ao criar assinatura',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
