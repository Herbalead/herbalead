import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    console.log('🔍 Buscando email em professionals:', email)

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Buscar profissional
    const { data: professional } = await supabase
      .from('professionals')
      .select('id, email, name, subscription_status')
      .eq('email', email)
      .single()

    if (professional) {
      console.log('✅ Profissional encontrado:', professional.email)
      
      // Verificar se tem subscription
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', professional.id)
        .single()

      return NextResponse.json({ 
        found: true,
        email: professional.email,
        name: professional.name,
        hasSubscription: !!subscription,
        subscriptionStatus: professional.subscription_status
      })
    }

    // Se não encontrou em professionals, retornar false
    console.log('❌ Profissional não encontrado')
    return NextResponse.json({ 
      found: false 
    })

  } catch (error) {
    console.error('Erro ao buscar profissional:', error)
    return NextResponse.json({ 
      found: false,
      error: 'Erro ao buscar email'
    })
  }
}
