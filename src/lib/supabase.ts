import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Funções de autenticação
export async function signUp(email: string, password: string, userType: string, profileData: Record<string, unknown>) {
  try {
    console.log('🔐 Iniciando cadastro...', { email, userType })
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userType,
          ...profileData
        }
      }
    })

    if (authError) {
      console.error('❌ Erro no auth:', authError)
      throw authError
    }

    console.log('✅ Usuário criado no auth:', authData.user?.id)
    
    // Criar perfil profissional após cadastro
    if (authData.user && userType === 'professional') {
      console.log('🔧 Criando perfil profissional...', { 
        userId: authData.user.id, 
        email, 
        profileData 
      })
      
      try {
        const { error: profileError } = await supabase
          .from('professionals')
          .insert({
            id: authData.user.id,
            email: email,
            name: profileData.name as string,
            phone: profileData.phone as string,
            specialty: profileData.specialty as string,
            company: profileData.company as string,
            isActive: true,
            maxLeads: 100
          })

        if (profileError) {
          console.error('❌ Erro ao criar perfil profissional:', profileError)
          console.error('❌ Detalhes do erro:', {
            code: profileError.code,
            message: profileError.message,
            details: profileError.details,
            hint: profileError.hint
          })
          // Não falhar o cadastro se o perfil não for criado
        } else {
          console.log('✅ Perfil profissional criado com sucesso')
        }
      } catch (profileError) {
        console.error('❌ Erro ao criar perfil profissional:', profileError)
        // Não falhar o cadastro se o perfil não for criado
      }
    } else {
      console.log('⚠️ Não criando perfil profissional:', { 
        hasUser: !!authData.user, 
        userType 
      })
    }
    
    return authData
  } catch (error) {
    console.error('❌ Erro completo no signUp:', error)
    throw error
  }
}

export async function signIn(email: string, password: string) {
  try {
    console.log('🔑 Iniciando login...', { email })
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('❌ Erro no login:', error)
      throw error
    }

    console.log('✅ Login realizado:', data.user?.id)
    return data
  } catch (error) {
    console.error('❌ Erro completo no signIn:', error)
    throw error
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Função para criar perfil profissional para usuários existentes
export async function createProfessionalProfile(userId: string, email: string, profileData: Record<string, unknown>) {
  try {
    console.log('👤 Criando perfil profissional para usuário existente...', { userId, email })
    
    const { error } = await supabase
      .from('professionals')
      .insert({
        id: userId,
        email: email,
        name: profileData.name as string || 'Usuário',
        phone: profileData.phone as string,
        specialty: profileData.specialty as string,
        company: profileData.company as string,
        isActive: true,
        maxLeads: 100
      })

    if (error) {
      console.error('❌ Erro ao criar perfil profissional:', error)
      throw error
    }

    console.log('✅ Perfil profissional criado com sucesso')
    return true
  } catch (error) {
    console.error('❌ Erro completo ao criar perfil profissional:', error)
    throw error
  }
}

// Tipos para o banco de dados
export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  age?: number
  gender?: string
  weight?: number
  height?: number
  activity?: string
  calculatorType: string
  results?: Record<string, unknown>
  recommendations?: Record<string, unknown>
  quizType?: string
  quizResults?: Record<string, unknown>
  status: string
  priority: string
  source?: string
  ipAddress?: string
  userAgent?: string
  professionalId?: string
  createdAt: string
  updatedAt: string
}

export interface Professional {
  id: string
  name: string
  email: string
  phone?: string
  specialty?: string
  company?: string
  license?: string
  isActive: boolean
  maxLeads: number
  createdAt: string
  updatedAt: string
}

export interface LeadNote {
  id: string
  leadId: string
  content: string
  author: string
  createdAt: string
}
