import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Verificar autenticação admin
async function verifyAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }
  
  const token = authHeader.substring(7)
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  
  return token === adminPassword
}

// GET - Dashboard administrativo
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    if (!(await verifyAdminAuth(request))) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'dashboard') {
      // Estatísticas gerais
      const [
        { data: totalUsers },
        { data: totalLinks },
        { data: activeSubscriptions },
        { data: recentUsers }
      ] = await Promise.all([
        // Total de usuários
        supabase
          .from('professionals')
          .select('id', { count: 'exact' }),
        
        // Total de links criados
        supabase
          .from('professional_links')
          .select('id', { count: 'exact' }),
        
        // Assinaturas ativas
        supabase
          .from('subscriptions')
          .select('id', { count: 'exact' })
          .eq('status', 'active'),
        
        // Usuários recentes (últimos 7 dias)
        supabase
          .from('professionals')
          .select('id', { count: 'exact' })
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ])

      return NextResponse.json({
        totalUsers: totalUsers?.length || 0,
        totalLinks: totalLinks?.length || 0,
        activeSubscriptions: activeSubscriptions?.length || 0,
        recentUsers: recentUsers?.length || 0,
        conversionRate: totalUsers?.length ? ((activeSubscriptions?.length || 0) / totalUsers.length * 100).toFixed(1) : 0
      })

    } else if (action === 'users') {
      // Lista de usuários com seus links
      const { data: users, error } = await supabase
        .from('professionals')
        .select(`
          id,
          name,
          email,
          phone,
          subscription_status,
          subscription_plan,
          created_at,
          professional_links (
            id,
            link_name,
            tool_name,
            cta_text,
            created_at
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar usuários:', error)
        return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 })
      }

      return NextResponse.json({ users })

    } else if (action === 'links') {
      // Todos os links da plataforma
      const { data: links, error } = await supabase
        .from('professional_links')
        .select(`
          id,
          link_name,
          tool_name,
          cta_text,
          created_at,
          professionals (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar links:', error)
        return NextResponse.json({ error: 'Erro ao buscar links' }, { status: 500 })
      }

      return NextResponse.json({ links })

    } else if (action === 'stats') {
      // Estatísticas detalhadas
      const { data: toolStats, error } = await supabase
        .from('professional_links')
        .select('tool_name')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar estatísticas:', error)
        return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 })
      }

      // Contar ferramentas mais usadas
      const toolCounts = toolStats?.reduce((acc, link) => {
        acc[link.tool_name] = (acc[link.tool_name] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      const sortedTools = Object.entries(toolCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)

      return NextResponse.json({ 
        toolStats: sortedTools,
        totalLinks: toolStats?.length || 0
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

// POST - Ações administrativas
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    if (!(await verifyAdminAuth(request))) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { action, userId } = await request.json()

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
