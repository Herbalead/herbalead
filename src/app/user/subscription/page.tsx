'use client'

import { useState, useEffect } from 'react'
import { 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  ArrowLeft,
  Settings,
  DollarSign,
  Clock,
  User
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface SubscriptionData {
  subscription: {
    subscription_id: string
    stripe_subscription_id: string
    status: string
    plan_type: string
    current_period_start: string
    current_period_end: string
    cancel_at_period_end: boolean
    canceled_at: string | null
  } | null
  payments: Array<{
    payment_id: string
    amount: number
    currency: string
    status: string
    description: string
    created_at: string
  }>
  hasActiveSubscription: boolean
}

export default function SubscriptionSettingsPage() {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        await loadSubscriptionData(user.id)
      }
    }
    getUser()
  }, [])

  const loadSubscriptionData = async (userId: string) => {
    try {
      const response = await fetch(`/api/subscription?userId=${userId}`)
      const data = await response.json()
      setSubscriptionData(data)
    } catch (error) {
      console.error('Erro ao carregar dados da assinatura:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscriptionAction = async (action: string, subscriptionId: string, additionalData?: any) => {
    setActionLoading(action)
    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          subscriptionId,
          ...additionalData
        })
      })

      const result = await response.json()
      
      if (result.success) {
        alert(result.message)
        // Recarregar dados
        if (user) {
          await loadSubscriptionData(user.id)
        }
      } else {
        alert('Erro: ' + result.error)
      }
    } catch (error) {
      console.error('Erro na ação:', error)
      alert('Erro ao processar ação')
    } finally {
      setActionLoading(null)
    }
  }

  const formatCurrency = (amount: number, currency: string = 'brl') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'canceled': return 'text-red-600 bg-red-50'
      case 'past_due': return 'text-yellow-600 bg-yellow-50'
      case 'trialing': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />
      case 'canceled': return <XCircle className="w-4 h-4" />
      case 'past_due': return <AlertTriangle className="w-4 h-4" />
      case 'trialing': return <Clock className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa'
      case 'canceled': return 'Cancelada'
      case 'past_due': return 'Pagamento em Atraso'
      case 'trialing': return 'Período de Teste'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando dados da assinatura...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/user" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Configurações de Assinatura</h1>
                <p className="text-sm text-gray-600">Gerencie sua assinatura e pagamentos</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!subscriptionData?.hasActiveSubscription ? (
          // Sem assinatura ativa
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nenhuma Assinatura Ativa</h2>
            <p className="text-gray-600 mb-8">
              Você não possui uma assinatura ativa no momento. Assine um plano para ter acesso completo ao Herbalead.
            </p>
            <Link
              href="/payment"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Assinar Plano
            </Link>
          </div>
        ) : (
          // Com assinatura ativa
          <div className="space-y-8">
            {/* Status da Assinatura */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Status da Assinatura</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Plano Atual</h3>
                  <p className="text-2xl font-bold text-emerald-600">
                    {subscriptionData.subscription?.plan_type === 'monthly' ? 'Mensal' : 'Anual'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {subscriptionData.subscription?.plan_type === 'monthly' ? 'R$ 60,00/mês' : 'R$ 570,00/ano'}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscriptionData.subscription?.status || '')}`}>
                    {getStatusIcon(subscriptionData.subscription?.status || '')}
                    <span className="ml-2">{getStatusText(subscriptionData.subscription?.status || '')}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Próximo Pagamento</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {subscriptionData.subscription?.current_period_end ? 
                      formatDate(subscriptionData.subscription.current_period_end) : 'N/A'}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Cancelamento</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {subscriptionData.subscription?.cancel_at_period_end ? 
                      'Será cancelada no final do período' : 'Não programado'}
                  </p>
                </div>
              </div>
            </div>

            {/* Ações da Assinatura */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Gerenciar Assinatura</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subscriptionData.subscription?.cancel_at_period_end ? (
                  <button
                    onClick={() => handleSubscriptionAction('reactivate', subscriptionData.subscription!.stripe_subscription_id)}
                    disabled={actionLoading === 'reactivate'}
                    className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === 'reactivate' ? (
                      <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    )}
                    Reativar Assinatura
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscriptionAction('cancel', subscriptionData.subscription!.stripe_subscription_id)}
                    disabled={actionLoading === 'cancel'}
                    className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === 'cancel' ? (
                      <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <XCircle className="w-5 h-5 mr-2" />
                    )}
                    Cancelar Assinatura
                  </button>
                )}

                <button
                  onClick={() => handleSubscriptionAction('change_plan', subscriptionData.subscription!.stripe_subscription_id, {
                    newPlanType: subscriptionData.subscription?.plan_type === 'monthly' ? 'yearly' : 'monthly'
                  })}
                  disabled={actionLoading === 'change_plan'}
                  className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading === 'change_plan' ? (
                    <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="w-5 h-5 mr-2" />
                  )}
                  Alterar para {subscriptionData.subscription?.plan_type === 'monthly' ? 'Anual' : 'Mensal'}
                </button>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">Importante</h4>
                    <p className="text-yellow-700 text-sm">
                      Ao cancelar a assinatura, você perderá o acesso ao Herbalead no final do período atual. 
                      Você pode reativar a qualquer momento antes do cancelamento efetivo.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Histórico de Pagamentos */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Histórico de Pagamentos</h2>
              
              {subscriptionData.payments.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Nenhum pagamento encontrado</p>
              ) : (
                <div className="space-y-4">
                  {subscriptionData.payments.map((payment) => (
                    <div key={payment.payment_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          payment.status === 'succeeded' ? 'bg-green-500' : 
                          payment.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                        <div>
                          <p className="font-semibold text-gray-900">{payment.description}</p>
                          <p className="text-sm text-gray-600">{formatDate(payment.created_at)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(payment.amount, payment.currency)}</p>
                        <p className={`text-sm ${
                          payment.status === 'succeeded' ? 'text-green-600' : 
                          payment.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {payment.status === 'succeeded' ? 'Pago' : 
                           payment.status === 'failed' ? 'Falhou' : 'Pendente'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
