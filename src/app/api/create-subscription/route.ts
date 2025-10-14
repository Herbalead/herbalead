import { NextRequest, NextResponse } from 'next/server'
import { createSubscriptionCheckout, stripeConfig } from '../../../../lib/stripe-subscriptions'

export async function POST(request: NextRequest) {
  try {
    const { planType, email } = await request.json()
    
    // Get plan configuration
    const plan = stripeConfig.plans[planType as keyof typeof stripeConfig.plans]
    if (!plan) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })
    }

    // Create subscription checkout session
    const session = await createSubscriptionCheckout(plan.priceId, email)
    
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
