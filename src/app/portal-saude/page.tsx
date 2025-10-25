'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, ArrowLeft, Calculator, Heart, Bug, Droplets, Apple, Target } from 'lucide-react'
import HerbaleadLogo from '@/components/HerbaleadLogo'
import { useUserData } from '@/lib/useUserData'

export default function PortalSaudePage() {
  const { userData, getWhatsAppUrl, getCustomMessage, getPageTitle, getButtonText } = useUserData()
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [completedTools, setCompletedTools] = useState<string[]>([])

  // Ferramentas disponíveis no portal (todas as ferramentas)
  const allTools = [
    {
      id: 'bmi',
      name: 'Descobrir meu peso ideal',
      description: 'Calcule seu IMC e veja se está no peso ideal',
      icon: Calculator,
      color: 'bg-blue-500',
      href: '/calculators/bmi'
    },
    {
      id: 'protein',
      name: 'Calcular minha proteína',
      description: 'Veja quanto de proteína você precisa por dia',
      icon: Calculator,
      color: 'bg-purple-500',
      href: '/calculators/protein'
    },
    {
      id: 'hydration',
      name: 'Calcular minha hidratação',
      description: 'Veja quanto de água você precisa beber',
      icon: Droplets,
      color: 'bg-cyan-500',
      href: '/calculators/hydration'
    },
    {
      id: 'body-composition',
      name: 'Avaliar composição corporal',
      description: 'Analise sua composição corporal completa',
      icon: Target,
      color: 'bg-indigo-500',
      href: '/calculators/body-composition'
    },
    {
      id: 'meal-planner',
      name: 'Planejar minha alimentação',
      description: 'Monte seu plano alimentar personalizado',
      icon: Apple,
      color: 'bg-orange-500',
      href: '/calculators/meal-planner'
    },
    {
      id: 'nutrition-assessment',
      name: 'Avaliar minha nutrição',
      description: 'Teste seus conhecimentos sobre nutrição',
      icon: Target,
      color: 'bg-pink-500',
      href: '/calculators/nutrition-assessment'
    },
    {
      id: 'wellness-profile',
      name: 'Testar meu bem-estar',
      description: 'Avalie seu perfil de bem-estar completo',
      icon: Heart,
      color: 'bg-green-500',
      href: '/quiz-builder'
    },
    {
      id: 'daily-wellness',
      name: 'Acompanhar bem-estar diário',
      description: 'Monitore seu bem-estar todos os dias',
      icon: Heart,
      color: 'bg-teal-500',
      href: '/calculators/daily-wellness'
    },
    {
      id: 'healthy-eating',
      name: 'Quiz alimentação saudável',
      description: 'Teste seus hábitos alimentares',
      icon: Apple,
      color: 'bg-lime-500',
      href: '/calculators/healthy-eating'
    },
    {
      id: 'parasite',
      name: 'Verificar minha saúde',
      description: 'Descubra se tem parasitas afetando sua saúde',
      icon: Bug,
      color: 'bg-red-500',
      href: '/parasite'
    },
    {
      id: 'recruitment-potencial',
      name: 'Descobrir meu potencial',
      description: 'Veja seu potencial de crescimento',
      icon: Target,
      color: 'bg-emerald-500',
      href: '/quiz/potencial'
    },
    {
      id: 'recruitment-ganhos',
      name: 'Multiplicar minha renda',
      description: 'Descubra como aumentar seus ganhos',
      icon: Target,
      color: 'bg-yellow-500',
      href: '/quiz/ganhos'
    },
    {
      id: 'recruitment-proposito',
      name: 'Viver com propósito',
      description: 'Encontre equilíbrio e propósito na vida',
      icon: Heart,
      color: 'bg-violet-500',
      href: '/quiz/proposito'
    }
  ]

  // Filtrar ferramentas baseado nas selecionadas
  const getSelectedTools = () => {
    // Por enquanto, vamos usar todas as ferramentas básicas de saúde
    // TODO: Implementar sistema de seleção baseado no link criado
    const basicHealthTools = ['bmi', 'protein', 'hydration', 'body-composition', 'meal-planner', 'nutrition-assessment', 'wellness-profile', 'daily-wellness', 'healthy-eating', 'parasite']
    return allTools.filter(tool => basicHealthTools.includes(tool.id))
  }
  
  const availableTools = getSelectedTools()

  // Verificar se todas as ferramentas foram completadas
  const allToolsCompleted = completedTools.length === availableTools.length

  // Se uma ferramenta foi selecionada, redirecionar com parâmetro de retorno
  if (selectedTool) {
    const tool = availableTools.find(t => t.id === selectedTool)
    if (tool) {
      // Adicionar parâmetro para voltar ao portal após completar
      const returnUrl = encodeURIComponent(window.location.href)
      window.location.href = `${tool.href}?returnToPortal=${returnUrl}`
      return null
    }
  }

  // Verificar se voltou de uma ferramenta (via URL params)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const completedTool = urlParams.get('completedTool')
    if (completedTool && !completedTools.includes(completedTool)) {
      setCompletedTools([...completedTools, completedTool])
      // Limpar URL params
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [completedTools])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <HerbaleadLogo size="lg" variant="horizontal" responsive={true} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            💚 {getPageTitle()}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {getCustomMessage()}
          </p>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <p className="text-gray-700 text-lg">
              É gratuito e vai te dar insights valiosos sobre sua saúde! ✨
            </p>
          </div>
        </div>

        {/* Progress Section */}
        {completedTools.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📊 Seu Progresso
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-emerald-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(completedTools.length / availableTools.length) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {completedTools.length}/{availableTools.length} completos
              </span>
            </div>
          </div>
        )}

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {availableTools.map((tool) => {
            const IconComponent = tool.icon
            const isCompleted = completedTools.includes(tool.id)
            
            return (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 ${
                  isCompleted 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-transparent hover:border-green-200'
                } group`}
              >
                <div className="text-center">
                  <div className={`${tool.color} rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                    isCompleted ? 'opacity-60' : ''
                  }`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    isCompleted ? 'text-green-700' : 'text-gray-900'
                  }`}>
                    {tool.name}
                    {isCompleted && <span className="ml-2">✅</span>}
                  </h3>
                  <p className={`text-sm ${
                    isCompleted ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {tool.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-8 text-center shadow-2xl border-2 border-emerald-200">
          <h3 className="text-3xl font-bold mb-4 text-gray-800">
            🎯 {allToolsCompleted ? 'Parabéns! Você completou todos os testes!' : 'Precisa de ajuda personalizada?'}
          </h3>
          <p className="text-gray-600 mb-8 text-lg">
            {allToolsCompleted 
              ? 'Agora você tem um panorama completo da sua saúde. Fale com um especialista para orientações específicas!'
              : 'Fale com um especialista e receba orientações específicas para sua saúde!'
            }
          </p>
          <button 
            onClick={() => {
              const whatsappUrl = getWhatsAppUrl()
              console.log('📱 Abrindo WhatsApp:', whatsappUrl)
              console.log('👤 Dados do usuário:', userData)
              window.open(whatsappUrl, '_blank')
            }}
            className="px-12 py-6 bg-emerald-600 text-white rounded-xl font-bold text-xl hover:bg-emerald-700 transition-all duration-300 shadow-2xl transform hover:scale-110 hover:shadow-3xl flex items-center justify-center mx-auto border-4 border-emerald-500"
          >
            <MessageCircle className="w-8 h-8 mr-3" />
            {getButtonText()}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            ⚠️ <strong>IMPORTANTE:</strong> Estas ferramentas são educativas e não substituem consulta médica profissional.
          </p>
        </div>
      </main>
    </div>
  )
}
