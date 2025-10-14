import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export const stripePlans = {
  monthly: {
    priceId: 'price_1SI7BEEVE42ibKnXR2Y5XAuW', // Monthly recurring price ID
    name: 'Plano Mensal Herbalead',
    unit_amount: 6000, // R$ 60.00
    interval: 'month',
    currency: 'brl',
  },
  yearly: {
    priceId: 'price_1SI7CSEVE42ibKnXA0pA9OYX', // Annual recurring price ID
    name: 'Plano Anual Herbalead',
    unit_amount: 57000, // R$ 570.00
    interval: 'year',
    currency: 'brl',
  },
}