import Stripe from 'stripe'

// TEMPORARY: Force test keys for validation
const stripeSecretKey = process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY!

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20',
})

export const stripePlans = {
  monthly: {
    priceId: process.env.NODE_ENV === 'production' 
      ? 'price_1SI7BEEVE42ibKnXR2Y5XAuW'  // Production price ID
      : 'price_test_monthly',              // Test price ID (will be created)
    name: 'Plano Mensal Herbalead',
    unit_amount: 6000, // R$ 60.00
    interval: 'month',
    currency: 'brl',
  },
  yearly: {
    priceId: process.env.NODE_ENV === 'production'
      ? 'price_1SI7CSEVE42ibKnXA0pA9OYX'  // Production price ID
      : 'price_test_yearly',              // Test price ID (will be created)
    name: 'Plano Anual Herbalead',
    unit_amount: 57000, // R$ 570.00
    interval: 'year',
    currency: 'brl',
  },
}