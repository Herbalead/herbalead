'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ArrowRight, User } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function SuccessPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userExists, setUserExists] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const sessionId = searchParams.get('session_id')

  const checkSessionAndUser = async () => {
    try {
      // Verificar se o usuário já existe
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setUserExists(true)
        setUserEmail(user.email || '')
        setLoading(false)
        return
      }

      // Se não existe usuário, criar automaticamente
      // Usar email do session_id se disponível
      if (sessionId) {
        try {
          // Tentar obter dados da sessão do Stripe
          const response = await fetch(`/api/get-session-data?session_id=${sessionId}`)
          if (response.ok) {
            const sessionData = await response.json()
            if (sessionData.customer_email) {
              setUserEmail(sessionData.customer_email)
              // Criar usuário automaticamente
              await createUserFromSession(sessionData)
            }
          }
        } catch (error) {
          console.error('Erro ao obter dados da sessão:', error)
        }
      }

      setLoading(false)
    } catch (error) {
      console.error('Erro ao verificar usuário:', error)
      setLoading(false)
    }
  }

  const createUserFromSession = async (sessionData: { customer_email: string }) => {
    try {
      // Criar usuário no Supabase
      const { data, error } = await supabase.auth.signUp({
        email: sessionData.customer_email,
        password: 'temp_password_' + Math.random().toString(36).substring(7),
        options: {
          emailRedirectTo: `${window.location.origin}/success`
        }
      })

      if (error) {
        console.error('Erro ao criar usuário:', error)
      } else {
        console.log('Usuário criado:', data)
        setUserExists(true)
        setUserEmail(sessionData.customer_email)
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
    }
  }

  useEffect(() => {
    if (sessionId) {
      checkSessionAndUser()
    } else {
      setLoading(false)
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando pagamento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header de Sucesso */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🎉 Pagamento Confirmado! ✅
            </h1>
            <p className="text-gray-600">
              Sua assinatura foi ativada com sucesso. Bem-vindo ao Herbalead!
            </p>
          </div>

          {userExists ? (
            // Usuário já existe - ir direto para o dashboard
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-green-800 mb-2">
                  ✅ Conta Ativada
                </h2>
                <p className="text-green-700 mb-4">
                  Sua conta <strong>{userEmail}</strong> foi ativada com sucesso!
                </p>
                <p className="text-green-600 text-sm">
                  Você já pode acessar todas as funcionalidades do Herbalead.
                </p>
              </div>

              <Link
                href="/user"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <User className="w-5 h-5 mr-2" />
                Acessar Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          ) : (
            // Usuário novo - aguardar webhook processar
            <div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-2">
                  🎉 Bem-vindo ao Herbalead!
                </h2>
                <p className="text-blue-700 mb-4">
                  Seu pagamento foi processado com sucesso! Estamos criando sua conta...
                </p>
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-blue-600">Processando...</span>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  ✅ O que acontece agora?
                </h3>
                <ul className="text-green-700 space-y-2">
                  <li>• Sua assinatura foi ativada</li>
                  <li>• Sua conta está sendo criada</li>
                  <li>• Você receberá um email de confirmação</li>
                  <li>• Em alguns minutos, você poderá acessar o dashboard</li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Complete seu cadastro para acessar o Herbalead.
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  <User className="w-5 h-5 mr-2" />
                  Finalizar Cadastro
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Precisa de ajuda? Entre em contato conosco.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-600">Carregando...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  )
}