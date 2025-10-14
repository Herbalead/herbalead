import Stripe from 'stripe'

// Configure Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

// Stripe subscription configuration
export const stripeConfig = {
  currency: 'brl',
  plans: {
    monthly: {
      id: 'monthly',
      name: 'Plano Mensal',
      price: 60,
      priceId: 'price_1SI7BEEVE42ibKnXR2Y5XAuW',
      description: 'Acesso completo por 30 dias'
    },
    yearly: {
      id: 'yearly', 
      name: 'Plano Anual',
      price: 570,
      priceId: 'price_1SI7CSEVE42ibKnXA0pA9OYX',
      description: 'Economize 20% pagando anualmente'
    }
  }
}

// Create subscription checkout session
export async function createSubscriptionCheckout(priceId: string, customerEmail?: string) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment`,
      customer_email: customerEmail,
      metadata: {
        plan: priceId === stripeConfig.plans.monthly.priceId ? 'monthly' : 'yearly'
      }
    })

    return session
  } catch (error) {
    console.error('Error creating subscription checkout:', error)
    throw error
  }
}

// Create customer portal session
export async function createCustomerPortalSession(customerId: string) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/user`,
    })

    return session
  } catch (error) {
    console.error('Error creating customer portal session:', error)
    throw error
  }
}

// Get subscription details
export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Error retrieving subscription:', error)
    throw error
  }
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw error
  }
}

export { stripe }
