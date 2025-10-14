'use client'

import { useEffect, useState, Suspense } from 'react'
import { CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function SuccessContent() {
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'pending' | 'error'>('loading')
  const searchParams = useSearchParams()
  
  useEffect(() => {
    // Get payment status from URL parameters
    const status = searchParams.get('status')
    
    if (status === 'approved') {
      setPaymentStatus('success')
    } else if (status === 'pending') {
      setPaymentStatus('pending')
    } else {
      setPaymentStatus('error')
    }
  }, [searchParams])

  const renderContent = () => {
    switch (paymentStatus) {
      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Pagamento Aprovado! 🎉
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Seu acesso ao Herbalead foi ativado com sucesso!
            </p>
            <div className="bg-green-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Próximos passos:
              </h3>
              <ul className="text-left text-green-700 space-y-2">
                <li>✅ Acesso liberado a todas as ferramentas</li>
                <li>✅ Email de boas-vindas enviado</li>
                <li>✅ Dashboard disponível</li>
                <li>✅ Suporte por WhatsApp ativo</li>
              </ul>
            </div>
            <Link 
              href="/user"
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center space-x-2"
            >
              <span>Acessar Dashboard</span>
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </Link>
          </div>
        )
      
      case 'pending':
        return (
          <div className="text-center">
            <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Pagamento em Análise ⏳
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Seu pagamento está sendo processado. Isso pode levar alguns minutos.
            </p>
            <div className="bg-yellow-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                O que acontece agora:
              </h3>
              <ul className="text-left text-yellow-700 space-y-2">
                <li>• Pagamento sendo verificado</li>
                <li>• Email de confirmação será enviado</li>
                <li>• Acesso será liberado automaticamente</li>
              </ul>
            </div>
            <p className="text-sm text-gray-500">
              Você receberá um email assim que o pagamento for confirmado.
            </p>
          </div>
        )
      
      case 'error':
        return (
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Pagamento Não Processado ❌
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Houve um problema com seu pagamento. Tente novamente.
            </p>
            <div className="bg-red-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Possíveis causas:
              </h3>
              <ul className="text-left text-red-700 space-y-2">
                <li>• Dados do cartão incorretos</li>
                <li>• Saldo insuficiente</li>
                <li>• Cartão bloqueado</li>
                <li>• Problema temporário</li>
              </ul>
            </div>
            <Link 
              href="/payment"
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center space-x-2"
            >
              <span>Tentar Novamente</span>
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </Link>
          </div>
        )
      
      default:
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">Verificando status do pagamento...</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderContent()}
        </div>
        
        <div className="text-center mt-8">
          <Link 
            href="/"
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            ← Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">Carregando...</p>
          </div>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}