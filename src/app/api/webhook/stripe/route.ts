import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '../../../../../lib/stripe-subscriptions'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')
    
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    let event
    
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log('Stripe webhook received:', event.type)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        console.log('Checkout session completed:', session.id)
        
        if (session.mode === 'subscription') {
          // Handle subscription creation
          console.log('Subscription created:', session.subscription)
          // TODO: Activate user subscription in database
        }
        break

      case 'customer.subscription.created':
        const subscription = event.data.object
        console.log('Subscription created:', subscription.id)
        // TODO: Activate user access
        break

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object
        console.log('Subscription updated:', updatedSubscription.id)
        // TODO: Update user access based on status
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object
        console.log('Subscription canceled:', deletedSubscription.id)
        // TODO: Deactivate user access
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object
        console.log('Payment succeeded:', invoice.id)
        // TODO: Extend user access
        break

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object
        console.log('Payment failed:', failedInvoice.id)
        // TODO: Handle failed payment
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
