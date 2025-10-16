import Stripe from 'stripe'

// TEMPORARY: Force test keys for validation
const stripeSecretKey = process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY!

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20',
})

export const stripePlans = {
  monthly: {
    priceId: 'price_test_monthly',  // Always use test price for now
    name: 'Plano Mensal Herbalead',
    unit_amount: 6000, // R$ 60.00
    interval: 'month',
    currency: 'brl',
  },
  yearly: {
    priceId: 'price_test_yearly',  // Always use test price for now
    name: 'Plano Anual Herbalead',
    unit_amount: 57000, // R$ 570.00
    interval: 'year',
    currency: 'brl',
  },
}