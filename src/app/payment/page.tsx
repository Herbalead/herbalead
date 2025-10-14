'use client'

import { useState } from 'react'
import { Check, Star, Zap, Shield, ArrowRight, CreditCard, Smartphone, Globe } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [loading, setLoading] = useState(false)

  const plans = {
    monthly: {
      price: 'R$ 60',
      period: '/mês',
      total: 'R$ 60',
      description: 'Acesso completo por 30 dias',
      features: [
        'Todas as 9 ferramentas',
        'Links personalizados ilimitados',
        'Dashboard completo',
        'Suporte por WhatsApp',
        'Relatórios de leads',
        'Sem taxa de setup'
      ]
    },
    yearly: {
      price: 'R$ 47,50',
      period: '/mês',
      total: 'R$ 570',
      description: 'Economize 20% pagando anualmente',
      features: [
        'Todas as 9 ferramentas',
        'Links personalizados ilimitados',
        'Dashboard completo',
        'Suporte prioritário',
        'Relatórios avançados',
        '2 meses grátis',
        'Sem taxa de setup'
      ]
    }
  }

  const currentPlan = plans[selectedPlan as keyof typeof plans]

  const handlePayment = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType: selectedPlan })
      })
      
      if (!response.ok) {
        throw new Error('Erro ao criar assinatura')
      }
      
      const { url } = await response.json()
      
      // Redirect to Stripe checkout
      window.location.href = url
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Erro ao processar assinatura. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/user" className="flex items-center space-x-3">
              <Image
                src="/logos/herbalead/herbalead-logo-horizontal.png"
                alt="Herbalead"
                width={140}
                height={45}
                className="h-12 w-auto"
              />
            </Link>
            <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium">
              🛡️ 7 dias para cancelar sem questionamentos
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            🚀 Plataforma de Leads Profissionais
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Escolha seu Plano<br />
            <span className="text-emerald-600">Herbalead</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transforme sua estratégia de vendas com ferramentas profissionais de geração de leads
          </p>
        </div>

        {/* Plan Selection */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 mb-12 border border-emerald-100">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Escolha seu plano</h2>
            
            {/* Plan Toggle */}
            <div className="flex justify-center mb-12">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-2 flex shadow-inner">
                <button
                  onClick={() => setSelectedPlan('monthly')}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    selectedPlan === 'monthly'
                      ? 'bg-white text-emerald-600 shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  Mensal
                </button>
                <button
                  onClick={() => setSelectedPlan('yearly')}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    selectedPlan === 'yearly'
                      ? 'bg-white text-emerald-600 shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  Anual
                </button>
              </div>
            </div>

            {/* Plan Details */}
            <div className="text-center mb-12">
              <div className="relative">
                <div className="text-7xl font-bold text-emerald-600 mb-4">
                  {currentPlan.price}
                </div>
                <div className="text-2xl text-gray-600 mb-4 font-medium">
                  {currentPlan.period}
                </div>
                <div className="text-lg text-gray-500 mb-6">
                  {currentPlan.description}
                </div>
                {selectedPlan === 'yearly' && (
                  <div className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-xl font-semibold inline-block">
                    Total anual: {currentPlan.total}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {currentPlan.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-emerald-50 rounded-xl">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-800 font-medium text-lg">{feature}</span>
              </div>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="border-t border-gray-200 pt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Formas de Pagamento Aceitas
            </h3>
            <div className="flex justify-center space-x-6 mb-12">
              <div className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <span className="text-blue-800 font-semibold">Cartão</span>
              </div>
              <div className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <Smartphone className="w-6 h-6 text-purple-600" />
                <span className="text-purple-800 font-semibold">PIX</span>
              </div>
              <div className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                <Globe className="w-6 h-6 text-green-600" />
                <span className="text-green-800 font-semibold">Boleto</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <button 
                onClick={handlePayment}
                disabled={loading}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-16 py-6 rounded-2xl font-bold text-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 flex items-center space-x-4 mx-auto disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-8 h-8" />
                    <span>Quero meus links agora</span>
                    <ArrowRight className="w-8 h-8" />
                  </>
                )}
              </button>
              <p className="text-lg text-gray-600 mt-6 font-medium">
                🛡️ 7 dias para cancelar • Sem questionamentos • Sem compromisso
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Cobrança automática</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Cartão de crédito</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Cancele quando quiser</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Guarantee */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-8 text-center border border-emerald-200 shadow-lg">
          <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Garantia de 7 dias
          </h3>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Cancele em até 7 dias sem questionamentos. Reembolso total garantido.
          </p>
        </div>
      </main>
    </div>
  )
}

