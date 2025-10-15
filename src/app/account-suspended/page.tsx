'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react'
import HerbaleadLogo from '@/components/HerbaleadLogo'

export default function AccountSuspendedPage() {
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const username = searchParams.get('user')

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <HerbaleadLogo />
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-orange-500">
            {/* Alert Icon */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Conta Temporariamente Indisponível
              </h1>
              <p className="text-gray-600">
                Este profissional está renovando sua assinatura
              </p>
            </div>

            {/* User Info */}
            {username && (
              <div className="bg-orange-50 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-2">
                  <ExternalLink className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="font-semibold text-orange-800">Profissional</span>
                </div>
                <p className="text-orange-700">
                  @{username}
                </p>
              </div>
            )}

            {/* Status Message */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">O que está acontecendo?</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Este profissional está renovando sua assinatura</li>
                <li>• Os links estarão disponíveis em breve</li>
                <li>• Todos os dados estão seguros</li>
                <li>• Você pode tentar novamente em alguns minutos</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Tentar Novamente
                  </>
                )}
              </button>

              <a
                href="/"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Voltar ao Início
              </a>
            </div>

            {/* Support Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Este problema persiste? Entre em contato conosco em{' '}
                <a href="mailto:suporte@herbalead.com" className="text-blue-600 hover:underline">
                  suporte@herbalead.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
