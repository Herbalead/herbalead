'use client'

import { ArrowLeft, MessageCircle } from 'lucide-react'
import { useUserData } from '@/lib/useUserData'

interface BackToPortalButtonProps {
  portalUrl?: string
  toolId?: string
  showWhatsAppButton?: boolean
}

export default function BackToPortalButton({ 
  portalUrl, 
  toolId, 
  showWhatsAppButton = true 
}: BackToPortalButtonProps) {
  const { getWhatsAppUrl, getButtonText } = useUserData()

  const handleBackToPortal = () => {
    if (portalUrl) {
      // Adicionar parâmetro indicando que a ferramenta foi completada
      const url = new URL(portalUrl)
      if (toolId) {
        url.searchParams.set('completedTool', toolId)
      }
      window.location.href = url.toString()
    } else {
      // Fallback: voltar para a página anterior
      window.history.back()
    }
  }

  const handleWhatsAppClick = () => {
    const whatsappUrl = getWhatsAppUrl()
    console.log('📱 Abrindo WhatsApp:', whatsappUrl)
    window.open(whatsappUrl, '_blank')
  }

  // Função para gerar texto motivacional baseado na ferramenta
  const getMotivationalText = (toolId?: string) => {
    const motivationalTexts = {
      'bmi': '🚀 Descobrir Mais Sobre Sua Saúde',
      'protein': '💪 Explorar Outras Avaliações',
      'hydration': '💧 Fazer Mais Testes de Saúde',
      'parasite': '🦠 Continuar Investigando',
      'wellness-profile': '🧘 Explorar Mais Avaliações',
      'meal-planner': '🍎 Descobrir Outras Ferramentas',
      'nutrition-assessment': '🎯 Fazer Mais Testes',
      'body-composition': '📏 Continuar Avaliando',
      'daily-wellness': '📅 Explorar Mais Opções',
      'healthy-eating': '🥗 Descobrir Outras Avaliações',
      'recruitment-potencial': '🌱 Explorar Mais Possibilidades',
      'recruitment-ganhos': '💰 Descobrir Outras Oportunidades',
      'recruitment-proposito': '💫 Continuar Explorando',
      'default': '🚀 Fazer Mais Avaliações de Saúde'
    }
    
    return motivationalTexts[toolId as keyof typeof motivationalTexts] || motivationalTexts.default
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      {/* Botão WhatsApp */}
      {showWhatsAppButton && (
        <button
          onClick={handleWhatsAppClick}
          className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all duration-300 shadow-xl transform hover:scale-105 flex items-center justify-center border-2 border-green-500"
        >
          <MessageCircle className="w-6 h-6 mr-3" />
          {getButtonText()}
        </button>
      )}

      {/* Botão Voltar ao Menu */}
      <button
        onClick={handleBackToPortal}
        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-xl transform hover:scale-105 flex items-center justify-center border-2 border-blue-400"
      >
        <ArrowLeft className="w-6 h-6 mr-3" />
        {getMotivationalText(toolId)}
      </button>
    </div>
  )
}
