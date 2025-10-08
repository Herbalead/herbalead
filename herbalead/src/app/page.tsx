'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calculator, Globe, ArrowRight, Users, TrendingUp, Star, Shield, Play, Target, Award, Zap } from 'lucide-react'

export default function HerbaleadLandingPage() {
  // Fix: Corrigir erro de build no Vercel
  const router = useRouter()
  const [showContactForm, setShowContactForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    question: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setTimeout(() => {
          setShowContactForm(false)
          setSubmitStatus('idle')
          setFormData({ name: '', phone: '', question: '' })
        }, 2000)
      } else {
        throw new Error('Erro ao enviar mensagem')
      }
    } catch (error) {
      console.error('Erro ao enviar contato:', error)
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDemoClick = (demoType: string) => {
    // Redirecionar para demos específicos do Herbalead
    switch(demoType) {
      // Ferramentas Básicas
      case 'bmi':
        router.push('/demo/bmi')
        break
      case 'protein':
        router.push('/demo/protein')
        break
      case 'body-composition':
        router.push('/demo/body-composition')
        break
      case 'meal-planner':
        router.push('/demo/meal-planner')
        break
      case 'hydration':
        router.push('/demo/hydration')
        break
      case 'nutrition-assessment':
        router.push('/demo/nutrition-assessment')
        break
      case 'health-goals':
        router.push('/demo/quiz/health-goals')
        break
      
      // Para Leads Frios
      case 'perfil-bem-estar':
        router.push('/tools/perfil-bem-estar')
        break
      case 'bem-estar-diario':
        router.push('/tools/bem-estar-diario')
        break
      case 'alimentacao-saudavel':
        router.push('/tools/alimentacao-saudavel')
        break
      
      // Para Clientes Atuais
      case 'desafio-7-dias':
        router.push('/tools/desafio-7-dias')
        break
      case 'aproveitando-100':
        router.push('/tools/aproveitando-100')
        break
      case 'metas-semanais':
        router.push('/tools/metas-semanais')
        break
      
      // Para Recrutamento
      case 'inspirar-pessoas':
        router.push('/tools/inspirar-pessoas')
        break
      case 'perfil-empreendedor':
        router.push('/tools/perfil-empreendedor')
        break
      case 'onboarding-rapido':
        router.push('/tools/onboarding-rapido')
        break
      
      default:
        router.push('/demo/bmi')
    }
  }

  const demos = [
    // 📊 Ferramentas Básicas
    {
      id: 'bmi',
      title: 'Calculadora de IMC',
      description: 'Calcule o Índice de Massa Corporal dos seus clientes',
      icon: Calculator,
      color: 'bg-blue-500',
      category: 'Ferramentas Básicas',
      tag: '+ Usado pelos distribuidores'
    },
    {
      id: 'protein',
      title: 'Calculadora de Proteína',
      description: 'Calcule necessidades proteicas individuais',
      icon: Zap,
      color: 'bg-orange-500',
      category: 'Ferramentas Básicas',
      tag: '+ Usado pelos distribuidores'
    },
    {
      id: 'body-composition',
      title: 'Composição Corporal',
      description: 'Avalie massa muscular, gordura e hidratação',
      icon: Target,
      color: 'bg-green-500',
      category: 'Ferramentas Básicas',
      tag: '+ Usado pelos distribuidores'
    },
    {
      id: 'meal-planner',
      title: 'Planejador de Refeições',
      description: 'Crie planos alimentares personalizados',
      icon: Users,
      color: 'bg-pink-500',
      category: 'Ferramentas Básicas',
      tag: '+ Usado pelos distribuidores'
    },
    {
      id: 'hydration',
      title: 'Calculadora de Hidratação',
      description: 'Avalie necessidades de água e eletrólitos',
      icon: Globe,
      color: 'bg-cyan-500',
      category: 'Ferramentas Básicas',
      tag: '+ Usado pelos distribuidores'
    },
    {
      id: 'nutrition-assessment',
      title: 'Avaliação Nutricional',
      description: 'Questionário completo de hábitos alimentares',
      icon: Award,
      color: 'bg-purple-500',
      category: 'Ferramentas Básicas',
      tag: '+ Usado pelos distribuidores'
    },
    {
      id: 'health-goals',
      title: 'Objetivos de Saúde',
      description: 'Defina e acompanhe objetivos de saúde personalizados',
      icon: TrendingUp,
      color: 'bg-indigo-500',
      category: 'Ferramentas Básicas',
      tag: '+ Usado pelos distribuidores'
    },
    
    // 🎯 Para Leads Frios
    {
      id: 'perfil-bem-estar',
      title: 'Quiz: Perfil de Bem-Estar',
      description: 'Descubra o perfil de bem-estar dos seus leads',
      icon: Star,
      color: 'bg-yellow-500',
      category: 'Para Leads Frios',
      tag: 'Atraia clientes com este quiz'
    },
    {
      id: 'bem-estar-diario',
      title: 'Tabela: Bem-Estar Diário',
      description: 'Acompanhe métricas de bem-estar diárias',
      icon: Shield,
      color: 'bg-teal-500',
      category: 'Para Leads Frios',
      tag: 'Atraia clientes com este quiz'
    },
    {
      id: 'alimentacao-saudavel',
      title: 'Quiz: Alimentação Saudável',
      description: 'Avalie hábitos alimentares e oriente nutricionalmente',
      icon: Calculator,
      color: 'bg-lime-500',
      category: 'Para Leads Frios',
      tag: 'Atraia clientes com este quiz'
    },
    
    // 💚 Para Clientes Atuais
    {
      id: 'desafio-7-dias',
      title: 'Tabela: Desafio 7 Dias',
      description: 'Engaje clientes com desafios de 7 dias',
      icon: Target,
      color: 'bg-red-500',
      category: 'Para Clientes Atuais',
      tag: 'Ideal para desafios de 7 dias'
    },
    {
      id: 'aproveitando-100',
      title: 'Quiz: Aproveitando 100%',
      description: 'Maximize o potencial dos seus clientes',
      icon: Award,
      color: 'bg-amber-500',
      category: 'Para Clientes Atuais',
      tag: 'Ideal para desafios de 7 dias'
    },
    {
      id: 'metas-semanais',
      title: 'Tabela: Metas Semanais',
      description: 'Defina e acompanhe metas semanais',
      icon: TrendingUp,
      color: 'bg-emerald-500',
      category: 'Para Clientes Atuais',
      tag: 'Ideal para desafios de 7 dias'
    },
    
    // 🧭 Para Recrutamento
    {
      id: 'inspirar-pessoas',
      title: 'Quiz: Inspirar Pessoas',
      description: 'Identifique líderes e inspiradores',
      icon: Users,
      color: 'bg-violet-500',
      category: 'Para Recrutamento',
      tag: '+ Usado pelos distribuidores'
    },
    {
      id: 'perfil-empreendedor',
      title: 'Quiz: Perfil Empreendedor',
      description: 'Descubra perfis empreendedores',
      icon: Star,
      color: 'bg-rose-500',
      category: 'Para Recrutamento',
      tag: '+ Usado pelos distribuidores'
    },
    {
      id: 'onboarding-rapido',
      title: 'Tabela: Onboarding Rápido',
      description: 'Facilite integração de novos membros',
      icon: Shield,
      color: 'bg-sky-500',
      category: 'Para Recrutamento',
      tag: '+ Usado pelos distribuidores'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Herbalead</h1>
                <p className="text-sm text-gray-600">Tecnologia para Distribuidores de Bem-Estar</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowContactForm(true)}
                className="px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Falar Conosco
              </button>
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Começar Agora
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            A ferramenta que ajuda distribuidores de bem-estar a 
            <span className="text-emerald-600"> conquistar novos clientes todos os dias.</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Automatize suas captações, fortaleça sua presença digital e transforme seu negócio em uma máquina de resultados.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('ferramentas')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center"
            >
              <Play className="w-5 h-5 mr-2" />
              Ferramentas Disponíveis
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button
              onClick={() => router.push('/register')}
              className="px-8 py-4 bg-white text-emerald-600 border border-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
            >
              Começar
            </button>
          </div>
        </div>
      </section>

      {/* Benefícios Diretos */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Transforme seu negócio em uma máquina de resultados
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Gere leads automáticos e segmentados
              </h3>
              <p className="text-gray-600 text-sm">
                Capture dados qualificados dos seus clientes automaticamente através de quizzes e avaliações personalizadas
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Capture dados dos clientes via quizzes e avaliações
              </h3>
              <p className="text-gray-600 text-sm">
                Colete informações valiosas sobre objetivos, hábitos e necessidades dos seus clientes
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Crie desafios e metas para engajamento
              </h3>
              <p className="text-gray-600 text-sm">
                Mantenha seus clientes engajados com desafios de 7 dias e acompanhamento de metas semanais
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Acompanhe o progresso da sua equipe
              </h3>
              <p className="text-gray-600 text-sm">
                Monitore resultados, conversões e performance da sua equipe de distribuidores em tempo real
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Tools Section */}
      <section id="ferramentas" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ferramentas Profissionais Disponíveis
            </h2>
            <p className="text-xl text-gray-600">
              Teste nossas ferramentas e veja como elas podem aumentar suas conversões
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demos.map((demo) => (
              <div
                key={demo.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer relative"
                onClick={() => handleDemoClick(demo.id)}
              >
                {/* Tag */}
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                    {demo.tag}
                  </span>
                </div>
                
                <div className={`w-12 h-12 ${demo.color} rounded-lg flex items-center justify-center mb-4`}>
                  <demo.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {demo.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {demo.description}
                </p>
                <div className="flex items-center text-emerald-600 font-medium">
                  <Play className="w-4 h-4 mr-2" />
                  Testar Demo
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call Final */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para acelerar seu crescimento?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Junte-se aos distribuidores que já estão transformando seus negócios em máquinas de resultados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('ferramentas')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <Play className="w-5 h-5 mr-2" />
              Testar Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button
              onClick={() => router.push('/register')}
              className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-colors"
            >
              Começar
            </button>
          </div>
        </div>
      </section>

      {/* Modal de Contato */}
      {showContactForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Falar Conosco</h2>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone/WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sua Dúvida *
                </label>
                <textarea
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Como podemos ajudar você?"
                />
              </div>
              
              {submitStatus === 'success' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">
                    ✅ Mensagem enviada com sucesso! Entraremos em contato em breve.
                  </p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">
                    ❌ Erro ao enviar mensagem. Tente novamente.
                  </p>
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}