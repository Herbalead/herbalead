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
