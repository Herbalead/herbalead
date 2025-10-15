import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  
  // Detectar domínio do projeto (subdomínio)
  const subdomain = hostname.split('.')[0]
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'ylada.com'
  
  // Se não é um subdomínio válido ou é o domínio principal, continuar normalmente
  if (hostname.includes('localhost') || hostname.includes('vercel.app') || subdomain === 'www') {
    return NextResponse.next()
  }
  
  // Verificar se é um domínio de projeto válido
  const isValidProjectDomain = subdomain !== baseDomain.split('.')[0] && 
                               subdomain.length >= 3 && 
                               subdomain.length <= 30 &&
                               /^[a-z0-9-]+$/.test(subdomain)
  
  if (!isValidProjectDomain) {
    return NextResponse.next()
  }
  
  // Adicionar header para identificar o projeto
  const response = NextResponse.next()
  response.headers.set('x-project-domain', subdomain)
  
  // Redirecionar página inicial do projeto para página específica
  if (url.pathname === '/' && subdomain === 'herbalead') {
    return NextResponse.redirect(new URL('/herbalead', url))
  }

  // Verificar acesso para rotas protegidas
  if (url.pathname.startsWith('/user') || 
      url.pathname.startsWith('/quiz-builder') ||
      url.pathname.startsWith('/tools/')) {
    
    // Verificar se usuário está logado
    const token = request.cookies.get('sb-access-token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/login', url))
    }
    
    // Verificar status da assinatura
    try {
      const { data: { user } } = await supabase.auth.getUser(token)
      if (!user) {
        return NextResponse.redirect(new URL('/login', url))
      }
      
      // Buscar dados do usuário e assinatura
      const { data: professional } = await supabase
        .from('professionals')
        .select('subscription_status, subscription_plan')
        .eq('email', user.email)
        .single()
      
      // Se usuário não tem assinatura ativa, bloquear acesso
      if (!professional || !['active', 'trialing'].includes(professional.subscription_status)) {
        return NextResponse.redirect(new URL('/payment-overdue', url))
      }
      
    } catch (error) {
      console.error('Middleware auth error:', error)
      return NextResponse.redirect(new URL('/login', url))
    }
  }

  // Verificar acesso para links públicos (páginas de usuário)
  if (url.pathname.match(/^\/[^\/]+\/[^\/]+$/)) {
    const pathParts = url.pathname.split('/')
    const username = pathParts[1]
    
    try {
      // Buscar dados do usuário
      const { data: professional } = await supabase
        .from('professionals')
        .select('subscription_status, subscription_plan')
        .eq('username', username)
        .single()
      
      // Se usuário não tem assinatura ativa, mostrar página de bloqueio
      if (!professional || !professional.subscription_status || !['active', 'trialing'].includes(professional.subscription_status)) {
        return NextResponse.redirect(new URL(`/account-suspended?user=${username}`, url))
      }
      
    } catch (error) {
      console.error('Middleware link access error:', error)
      // Se não conseguir verificar, permitir acesso (fallback)
    }
  }

  // Adicionar contexto do projeto para páginas de auth e ferramentas
  if (url.pathname.startsWith('/tools/') || 
      url.pathname.startsWith('/login') || 
      url.pathname.startsWith('/register') ||
      url.pathname.startsWith('/user') ||
      url.pathname.startsWith('/quiz-builder')) {
    // Só adicionar parâmetro se não existir
    if (!url.searchParams.has('project')) {
      url.searchParams.set('project', subdomain)
      return NextResponse.redirect(url)
    }
  }
  
  // Redirecionar /user para o subdomínio correto se estiver no domínio principal
  if (hostname === baseDomain && url.pathname.startsWith('/user')) {
    const redirectUrl = new URL(`https://herbalead.${baseDomain}${url.pathname}${url.search}`)
    return NextResponse.redirect(redirectUrl)
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}