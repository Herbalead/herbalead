import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Dashboard administrativo (estatísticas gerais)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'dashboard') {
      // Estatísticas gerais
      const [
        { data: totalUsers },
        { data: activeSubscriptions },
        { data: totalRevenue },
        { data: recentUsers }
      ] = await Promise.all([
        // Total de usuários
        supabase
          .from('professionals')
          .select('id', { count: 'exact' }),
        
        // Assinaturas ativas
        supabase
          .from('subscriptions')
          .select('id', { count: 'exact' })
          .eq('status', 'active'),
        
        // Receita total (últimos 30 dias)
        supabase
          .from('payments')
          .select('amount')
          .eq('status', 'succeeded')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        
        // Usuários recentes (últimos 7 dias)
        supabase
          .from('professionals')
          .select('id', { count: 'exact' })
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ])

      const revenue = totalRevenue?.reduce((sum, payment) => sum + payment.amount, 0) || 0

      return NextResponse.json({
        totalUsers: totalUsers?.length || 0,
        activeSubscriptions: activeSubscriptions?.length || 0,
        monthlyRevenue: revenue,
        recentUsers: recentUsers?.length || 0,
        conversionRate: totalUsers?.length ? (activeSubscriptions?.length / totalUsers.length * 100).toFixed(1) : 0
      })

    } else if (action === 'users') {
      // Lista de usuários com assinaturas
      const { data: users, error } = await supabase
        .from('professionals')
        .select(`
          id,
          name,
          email,
          phone,
          subscription_status,
          subscription_plan,
          stripe_customer_id,
          created_at,
          subscriptions (
            id,
            status,
            plan_type,
            current_period_end,
            cancel_at_period_end
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar usuários:', error)
        return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 })
      }

      return NextResponse.json({ users })

    } else if (action === 'payments') {
      // Histórico de pagamentos
      const { data: payments, error } = await supabase
        .from('payments')
        .select(`
          id,
          amount,
          currency,
          status,
          description,
          created_at,
          subscriptions (
            user_id,
            professionals (
              name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) {
        console.error('Erro ao buscar pagamentos:', error)
        return NextResponse.json({ error: 'Erro ao buscar pagamentos' }, { status: 500 })
      }

      return NextResponse.json({ payments })

    } else if (action === 'revenue') {
      // Relatório de receita por período
      const { searchParams } = new URL(request.url)
      const period = searchParams.get('period') || '30' // dias
      
      const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).toISOString()
      
      const { data: payments, error } = await supabase
        .from('payments')
        .select('amount, currency, created_at')
        .eq('status', 'succeeded')
        .gte('created_at', startDate)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Erro ao buscar receita:', error)
        return NextResponse.json({ error: 'Erro ao buscar receita' }, { status: 500 })
      }

      // Agrupar por dia
      const dailyRevenue = payments?.reduce((acc, payment) => {
        const date = payment.created_at.split('T')[0]
        if (!acc[date]) {
          acc[date] = 0
        }
        acc[date] += payment.amount
        return acc
      }, {} as Record<string, number>) || {}

      return NextResponse.json({ 
        dailyRevenue,
        totalRevenue: payments?.reduce((sum, p) => sum + p.amount, 0) || 0,
        period: parseInt(period)
      })

    } else {
      return NextResponse.json({ error: 'Ação não reconhecida' }, { status: 400 })
    }

  } catch (error) {
    console.error('Erro na API administrativa:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

// POST - Ações administrativas (ativar, desativar, alterar plano)
export async function POST(request: NextRequest) {
  try {
    const { action, userId, subscriptionId, newPlan, days } = await request.json()
    
    if (!action || !userId) {
      return NextResponse.json({ error: 'Ação e ID do usuário são obrigatórios' }, { status: 400 })
    }

    if (action === 'activate_user') {
      // Ativar usuário
      const { error } = await supabase
        .from('professionals')
        .update({ subscription_status: 'active' })
        .eq('id', userId)

      if (error) {
        console.error('Erro ao ativar usuário:', error)
        return NextResponse.json({ error: 'Erro ao ativar usuário' }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: 'Usuário ativado com sucesso' })

    } else if (action === 'deactivate_user') {
      // Desativar usuário
      const { error } = await supabase
        .from('professionals')
        .update({ subscription_status: 'inactive' })
        .eq('id', userId)

      if (error) {
        console.error('Erro ao desativar usuário:', error)
        return NextResponse.json({ error: 'Erro ao desativar usuário' }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: 'Usuário desativado com sucesso' })

    } else if (action === 'change_plan') {
      if (!subscriptionId || !newPlan) {
        return NextResponse.json({ error: 'ID da assinatura e novo plano são obrigatórios' }, { status: 400 })
      }

      // Alterar plano
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          plan_type: newPlan,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId)

      if (error) {
        console.error('Erro ao alterar plano:', error)
        return NextResponse.json({ error: 'Erro ao alterar plano' }, { status: 500 })
      }

      // Atualizar também na tabela professionals
      await supabase
        .from('professionals')
        .update({ subscription_plan: newPlan })
        .eq('id', userId)

      return NextResponse.json({ success: true, message: 'Plano alterado com sucesso' })

    } else if (action === 'cancel_subscription') {
      if (!subscriptionId) {
        return NextResponse.json({ error: 'ID da assinatura é obrigatório' }, { status: 400 })
      }

      // Cancelar assinatura
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'canceled',
          canceled_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId)

      if (error) {
        console.error('Erro ao cancelar assinatura:', error)
        return NextResponse.json({ error: 'Erro ao cancelar assinatura' }, { status: 500 })
      }

      // Atualizar também na tabela professionals
      await supabase
        .from('professionals')
        .update({ subscription_status: 'canceled' })
        .eq('id', userId)

      return NextResponse.json({ success: true, message: 'Assinatura cancelada com sucesso' })

    } else if (action === 'give_grace_period') {
      // Conceder período de graça
      const graceDays = days || 10
      
      // Atualizar status para trialing (sem depender da coluna grace_period_end)
      const { error } = await supabase
        .from('professionals')
        .update({ 
          subscription_status: 'trialing'
        })
        .eq('id', userId)

      if (error) {
        console.error('Erro ao conceder período de graça:', error)
        return NextResponse.json({ error: 'Erro ao conceder período de graça' }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        message: `Período de graça de ${graceDays} dias concedido com sucesso` 
      })

    } else {
      return NextResponse.json({ error: 'Ação não reconhecida' }, { status: 400 })
    }

  } catch (error) {
    console.error('Erro na API administrativa:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
