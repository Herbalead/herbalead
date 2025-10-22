'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, User, KeyRound, Eye, EyeOff, Phone } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

// Cliente para operações normais
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function CompleteRegistrationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+55')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showRecoveryForm, setShowRecoveryForm] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [recoveryLoading, setRecoveryLoading] = useState(false)
  const [recoveryError, setRecoveryError] = useState('')

  // Lista de países com códigos
  const countries = [
    { code: '+55', name: 'Brasil', flag: '🇧🇷' },
    { code: '+1', name: 'Estados Unidos', flag: '🇺🇸' },
    { code: '+1', name: 'Canadá', flag: '🇨🇦' },
    { code: '+54', name: 'Argentina', flag: '🇦🇷' },
    { code: '+56', name: 'Chile', flag: '🇨🇱' },
    { code: '+57', name: 'Colômbia', flag: '🇨🇴' },
    { code: '+51', name: 'Peru', flag: '🇵🇪' },
    { code: '+598', name: 'Uruguai', flag: '🇺🇾' },
    { code: '+591', name: 'Bolívia', flag: '🇧🇴' },
    { code: '+595', name: 'Paraguai', flag: '🇵🇾' },
    { code: '+351', name: 'Portugal', flag: '🇵🇹' },
    { code: '+34', name: 'Espanha', flag: '🇪🇸' },
  ]

  useEffect(() => {
    // Verificar se há session_id válido (após pagamento Stripe)
    const sessionId = searchParams.get('session_id')
    const gateway = searchParams.get('gateway')
    
    if (sessionId) {
      // Se há session_id, tentar obter email da sessão Stripe
      fetchSessionEmail(sessionId)
    } else {
      // Se não há session_id, tentar obter email da URL ou localStorage
      const emailFromUrl = searchParams.get('email')
      const emailFromStorage = localStorage.getItem('user_email')
      
      if (emailFromUrl) {
        setEmail(emailFromUrl)
        console.log('📧 Email obtido da URL:', emailFromUrl)
        if (gateway === 'mercadopago') {
          console.log('🇧🇷 Mercado Pago - Email confirmado')
        }
      } else if (emailFromStorage) {
        setEmail(emailFromStorage)
        console.log('📧 Email obtido do localStorage:', emailFromStorage)
      } else {
        // Se não há email, mostrar interface de recuperação
        console.log('⚠️ Nenhum email encontrado, mostrando formulário de recuperação')
        setShowRecoveryForm(true)
      }
    }
  }, [searchParams, router])

  const fetchSessionEmail = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/get-session-data?session_id=${sessionId}`)
      if (response.ok) {
        const sessionData = await response.json()
        if (sessionData.customer_email) {
          setEmail(sessionData.customer_email)
        }
      }
    } catch (error) {
      console.error('Erro ao obter email da sessão:', error)
    }
  }

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault()
    setRecoveryError('')
    setRecoveryLoading(true)

    try {
      // Tentar primeiro Mercado Pago, depois Stripe
      let response = await fetch('/api/recover-payment-mercadopago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: recoveryEmail }),
      })

      // Se não encontrou no Mercado Pago, tentar Stripe
      if (!response.ok) {
        response = await fetch('/api/recover-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: recoveryEmail }),
        })
      }

      const data = await response.json()

      if (data.found) {
        setEmail(recoveryEmail)
        setShowRecoveryForm(false)
        setRecoveryError('')
      } else {
        setRecoveryError('Email não encontrado. Verifique se digitou corretamente.')
      }
    } catch (error) {
      console.error('Erro na recuperação:', error)
      setRecoveryError('Erro ao verificar email. Tente novamente.')
    } finally {
      setRecoveryLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // Validações
    if (!name.trim()) {
      setError('Nome é obrigatório.')
      setLoading(false)
      return
    }

    if (!phone.trim()) {
      setError('Telefone é obrigatório.')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      setLoading(false)
      return
    }

    try {
      // Chamar API para criar/atualizar conta
      const response = await fetch('/api/create-auth-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          phone,
          countryCode
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao processar cadastro')
        return
      }

      setSuccess(data.message + ' Redirecionando...')
      localStorage.setItem('user_email', email)
      localStorage.setItem('user_name', name)
      
      setTimeout(() => {
        router.push('/user')
      }, 2000)

    } catch (error) {
      console.error('Erro geral:', error)
      setError('Erro interno. Entre em contato.')
    } finally {
      setLoading(false)
    }
  }

  if (showRecoveryForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Recuperar Acesso
            </h1>
            <p className="text-gray-600">
              Digite o email usado no pagamento para continuar
            </p>
          </div>

          <form onSubmit={handleRecovery} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email usado no pagamento
              </label>
              <input
                type="email"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                className="w-full px-3 py-2 text-gray-900 bg-white border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base font-medium"
                placeholder="seu@email.com"
                required
              />
            </div>

            {recoveryError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {recoveryError}
              </div>
            )}

            <button
              type="submit"
              disabled={recoveryLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {recoveryLoading ? 'Verificando...' : 'Continuar'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Complete seu Cadastro
          </h1>
          <p className="text-gray-600">
            Defina sua senha para acessar o Herbalead
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome Completo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-gray-900 bg-white border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base font-medium"
                placeholder="Seu nome completo"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 bg-white border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base font-medium"
              placeholder="seu@email.com"
              required
            />
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone *
            </label>
            <div className="flex">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="px-3 py-2 text-gray-900 bg-white border-2 border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base font-medium"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.code}
                  </option>
                ))}
              </select>
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-gray-900 bg-white border-2 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base font-medium"
                  placeholder="11999999999"
                  required
                />
              </div>
            </div>
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 text-gray-900 bg-white border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base font-medium"
                placeholder="Digite sua senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirmar Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Senha *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 text-gray-900 bg-white border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base font-medium"
                placeholder="Confirme sua senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processando...
              </>
            ) : (
              <>
                Confirmar
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center">
            <Link href="/auth/login" className="text-green-600 hover:text-green-700 text-sm">
              Já tem uma conta? Fazer Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CompleteRegistrationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-600">Carregando...</p>
        </div>
      </div>
    }>
      <CompleteRegistrationContent />
    </Suspense>
  )
}