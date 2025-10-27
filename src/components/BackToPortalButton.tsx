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
  const { userData, getWhatsAppUrl, getButtonText } = useUserData()

  const handleBackToPortal = () => {
    try {
      if (typeof window === 'undefined') return

      if (portalUrl) {
        // Adicionar parâmetro indicando que a ferramenta foi completada
        try {
          const url = new URL(portalUrl, window.location.origin)
          if (toolId) {
            url.searchParams.set('completedTool', toolId)
          }
          window.location.href = url.toString()
        } catch (error) {
          // Se não conseguir parsear a URL, adicionar parâmetro manualmente
          const separator = portalUrl.includes('?') ? '&' : '?'
          const newUrl = toolId 
            ? `${portalUrl}${separator}completedTool=${toolId}`
            : portalUrl
          window.location.href = newUrl
        }
      } else {
        // Fallback: redirecionar para o Portal de Saúde
        // Extrair informações do usuário da URL atual
        const currentUrl = new URL(window.location.href)
        const userParam = currentUrl.searchParams.get('user')
        
        if (userParam) {
          try {
            const userData = JSON.parse(userParam)
            // Construir URL do Portal de Saúde com os dados do usuário
            const portalUrl = `/portal-saude?user=${encodeURIComponent(userParam)}`
            if (toolId) {
              const separator = portalUrl.includes('?') ? '&' : '?'
              window.location.href = `${portalUrl}&completedTool=${toolId}`
            } else {
              window.location.href = portalUrl
            }
          } catch (error) {
            console.error('Erro ao processar dados do usuário:', error)
            // Fallback final: ir para página inicial
            window.location.href = '/'
          }
        } else {
          // Se não há dados do usuário, ir para página inicial
          window.location.href = '/'
        }
      }
    } catch (error) {
      console.error('❌ Erro ao redirecionar:', error)
      // Fallback: ir para página inicial
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    }
  }

  const handleWhatsAppClick = () => {
    console.log('🔍 DEBUG: handleWhatsAppClick chamado')
    console.log('  - toolId:', toolId)
    console.log('  - userData:', userData)
    
    // Priorizar mensagem específica do link, senão usar mensagem baseada na ferramenta
    const getToolSpecificMessage = (toolId?: string) => {
      const toolMessages = {
        'bmi': 'Olá! Fiz o teste de IMC e gostaria de saber mais sobre meus resultados. Poderia me ajudar?',
        'protein': 'Olá! Fiz o teste de proteína e gostaria de entender melhor minhas necessidades nutricionais.',
        'hydration': 'Olá! Fiz o teste de hidratação e gostaria de saber como melhorar minha hidratação diária.',
        'parasite': 'Olá! Fiz o teste de parasitas e gostaria de saber mais sobre minha saúde intestinal.',
        'wellness-profile': 'Olá! Fiz o teste de bem-estar e gostaria de receber orientações para melhorar minha qualidade de vida.',
        'meal-planner': 'Olá! Fiz o teste de planejamento alimentar e gostaria de receber orientações nutricionais.',
        'nutrition-assessment': 'Olá! Fiz o teste nutricional e gostaria de saber como melhorar minha alimentação.',
        'body-composition': 'Olá! Fiz o teste de composição corporal e gostaria de entender melhor meus resultados.',
        'daily-wellness': 'Olá! Fiz o teste de bem-estar diário e gostaria de receber orientações para melhorar minha rotina.',
        'healthy-eating': 'Olá! Fiz o teste de alimentação saudável e gostaria de saber como melhorar meus hábitos alimentares.',
        'recruitment-potencial': 'Olá! Fiz o teste de potencial e gostaria de saber mais sobre oportunidades de crescimento.',
        'recruitment-ganhos': 'Olá! Fiz o teste de ganhos e gostaria de saber como multiplicar minha renda.',
        'recruitment-proposito': 'Olá! Fiz o teste de propósito e gostaria de saber como viver com mais equilíbrio.',
        'default': 'Olá! Fiz um teste de saúde e gostaria de saber mais sobre os resultados.'
      }
      
      return toolMessages[toolId as keyof typeof toolMessages] || toolMessages.default
    }
    
    // Usar mensagem específica baseada na ferramenta (não mais personalizada)
    const specificMessage = getToolSpecificMessage(toolId)
    console.log('🔍 Debug BackToPortalButton:')
    console.log('  - toolId:', toolId)
    console.log('  - specificMessage:', specificMessage)
    
    try {
      const whatsappUrl = getWhatsAppUrl(specificMessage)
      console.log('📱 Abrindo WhatsApp com mensagem específica:', whatsappUrl)
      
      if (whatsappUrl === '#') {
        console.error('❌ ERRO: WhatsApp URL é inválida (#)')
        alert('Erro: Não foi possível gerar o link do WhatsApp. Verifique se o telefone está configurado.')
        return
      }
      
      window.open(whatsappUrl, '_blank')
      console.log('✅ WhatsApp aberto com sucesso')
    } catch (error) {
      console.error('❌ ERRO ao abrir WhatsApp:', error)
      alert('Erro ao abrir WhatsApp: ' + error.message)
    }
  }

  // Função para gerar texto motivacional baseado na ferramenta
  const getMotivationalText = (toolId?: string) => {
    const motivationalTexts = {
      'bmi': '🚀 Fazer Mais Testes de Saúde',
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
