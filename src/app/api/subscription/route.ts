import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '../../../../lib/stripe-subscriptions'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Obter dados da assinatura do usuário
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID é obrigatório' }, { status: 400 })
    }

    // Buscar dados da assinatura
    const { data: subscription, error: subError } = await supabase
      .rpc('get_user_subscription', { user_uuid: userId })

    if (subError) {
      console.error('Erro ao buscar assinatura:', subError)
      return NextResponse.json({ error: 'Erro ao buscar assinatura' }, { status: 500 })
    }

    // Buscar histórico de pagamentos
    const { data: payments, error: paymentsError } = await supabase
      .rpc('get_user_payment_history', { user_uuid: userId })

    if (paymentsError) {
      console.error('Erro ao buscar pagamentos:', paymentsError)
    }

    return NextResponse.json({
      subscription: subscription[0] || null,
      payments: payments || [],
      hasActiveSubscription: subscription.length > 0
    })

  } catch (error) {
    console.error('Erro na API de assinatura:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

// POST - Cancelar assinatura
export async function POST(request: NextRequest) {
  try {
    const { action, subscriptionId, cancelAtPeriodEnd = true } = await request.json()
    
    if (!action || !subscriptionId) {
      return NextResponse.json({ error: 'Ação e ID da assinatura são obrigatórios' }, { status: 400 })
    }

    if (action === 'cancel') {
      // Cancelar assinatura no Stripe
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: cancelAtPeriodEnd
      })

      // Atualizar no banco de dados
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          cancel_at_period_end: cancelAtPeriodEnd,
          canceled_at: cancelAtPeriodEnd ? null : new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscriptionId)

      if (updateError) {
        console.error('Erro ao atualizar assinatura no banco:', updateError)
      }

      return NextResponse.json({
        success: true,
        message: cancelAtPeriodEnd 
          ? 'Assinatura será cancelada no final do período atual'
          : 'Assinatura cancelada imediatamente',
        subscription: {
          id: subscription.id,
          status: subscription.status,
          cancel_at_period_end: subscription.cancel_at_period_end,
          current_period_end: subscription.current_period_end
        }
      })

    } else if (action === 'reactivate') {
      // Reativar assinatura cancelada
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false
      })

      // Atualizar no banco de dados
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          cancel_at_period_end: false,
          canceled_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscriptionId)

      if (updateError) {
        console.error('Erro ao atualizar assinatura no banco:', updateError)
      }

      return NextResponse.json({
        success: true,
        message: 'Assinatura reativada com sucesso',
        subscription: {
          id: subscription.id,
          status: subscription.status,
          cancel_at_period_end: subscription.cancel_at_period_end
        }
      })

    } else if (action === 'change_plan') {
      const { newPlanType } = await request.json()
      
      if (!newPlanType) {
        return NextResponse.json({ error: 'Tipo do novo plano é obrigatório' }, { status: 400 })
      }

      // Buscar o price ID do novo plano
      const priceIds = {
        monthly: 'price_1SI7BEEVE42ibKnXR2Y5XAuW',
        yearly: 'price_1SI7CSEVE42ibKnXA0pA9OYX'
      }

      const newPriceId = priceIds[newPlanType as keyof typeof priceIds]
      if (!newPriceId) {
        return NextResponse.json({ error: 'Tipo de plano inválido' }, { status: 400 })
      }

      // Alterar plano no Stripe
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: (await stripe.subscriptions.retrieve(subscriptionId)).items.data[0].id,
          price: newPriceId,
        }],
        proration_behavior: 'create_prorations'
      })

      // Atualizar no banco de dados
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          plan_type: newPlanType,
          stripe_price_id: newPriceId,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscriptionId)

      if (updateError) {
        console.error('Erro ao atualizar plano no banco:', updateError)
      }

      return NextResponse.json({
        success: true,
        message: 'Plano alterado com sucesso',
        subscription: {
          id: subscription.id,
          status: subscription.status,
          plan_type: newPlanType
        }
      })

    } else {
      return NextResponse.json({ error: 'Ação não reconhecida' }, { status: 400 })
    }

  } catch (error) {
    console.error('Erro na API de assinatura:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
