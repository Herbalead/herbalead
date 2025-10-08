'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calculator, Globe, ArrowRight, Users, TrendingUp, Star, Mail, MessageSquare, Shield, Play, Zap, Target, Award } from 'lucide-react'

export default function UniversalLandingPage() {
  const [showContactForm, setShowContactForm] = useState(false)
  const [projectDomain, setProjectDomain] = useState('')
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profession: '',
    message: ''
  })

  useEffect(() => {
    // Detectar projeto pelo subdomínio
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      const subdomain = hostname.split('.')[0]
      
      console.log('🔍 Detecting project:', { hostname, subdomain })
      
      // Se não é localhost e tem subdomínio válido
      if (!hostname.includes('localhost') && subdomain !== 'www' && subdomain.length > 2) {
        setProjectDomain(subdomain)
        console.log('✅ Project detected:', subdomain)
        
        // Se é fitlead, mostrar página de apresentação do projeto
        if (subdomain === 'fitlead') {
          console.log('🎯 FitLead project detected - showing presentation page')
          // Não redirecionar, mostrar página de apresentação
        }
      } else {
        console.log('❌ No project detected')
      }
    }
  }, [router])

  const getProjectName = () => {
    switch (projectDomain) {
      case 'fitlead': return 'FitLead'
      case 'nutri': return 'Nutri'
      case 'beauty': return 'Beauty'
      default: return 'Herbalead'
    }
  }

  const handleMainAction = () => {
    if (projectDomain) {
      // Se há um domínio específico, redirecionar para a página do projeto
      window.location.href = `https://${projectDomain}`
    } else {
      // Se não há domínio, rolar até a seção de ferramentas
      const toolsSection = document.getElementById('tools-section')
      if (toolsSection) {
        toolsSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const content = {
    title: 'Herbalead',
    subtitle: 'Tecnologia para Distribuidores de Bem-Estar',
    description: '',
    heroTitle: 'Acelere seus contatos',
    heroSubtitle: 'Automatize suas captações, fortaleça sua presença digital e transforme seu Espaço Vida Saudável em uma máquina de resultados.',
    ctaButton: 'Conheça ferramentas disponíveis',
    ctaButtonSecondary: 'Testar agora',
      benefits: [
        {
          icon: Users,
        title: 'Gere Leads Automáticos e Segmentados',
        description: 'Capture dados dos clientes via quizzes e avaliações personalizadas'
        },
        {
          icon: TrendingUp,
        title: 'Crie Desafios e Metas para Engajamento',
        description: 'Desafios de 7 dias, metas semanais e acompanhamento da sua equipe'
        },
        {
          icon: Star,
        title: 'Fortaleça seu Espaço Vida Saudável',
        description: 'Tecnologia que demonstra sua expertise e aumenta conversões'
        }
      ],
      howItWorks: {
      title: 'Como o Herbalead ajuda você na prática',
        steps: [
          {
            step: '1',
          title: 'Configure suas Ferramentas',
          description: 'Personalize quizzes e calculadoras com sua marca e produtos'
          },
          {
            step: '2',
          title: 'Compartilhe com seus Clientes',
          description: 'Envie links personalizados para prospects e clientes atuais'
          },
          {
            step: '3',
          title: 'Duplique sua Operação',
          description: 'Acompanhe metas, gerencie equipe e cresça todos os dias'
          }
        ]
      },
      whyChoose: {
      title: 'Por que Escolher o Herbalead?',
      subtitle: 'Tecnologia criada para quem vive de bem-estar — e quer crescer com ele',
        benefits: [
          {
            icon: 'users',
          title: 'Gere Leads Automáticos e Segmentados',
          description: 'Capture dados dos clientes via quizzes e avaliações personalizadas'
    },
    {
            icon: 'trending',
          title: 'Crie Desafios e Metas para Engajamento',
          description: 'Desafios de 7 dias, metas semanais e acompanhamento da sua equipe'
    },
    {
            icon: 'star',
          title: 'Fortaleça seu Espaço Vida Saudável',
          description: 'Tecnologia que demonstra sua expertise e aumenta conversões'
    },
    {
            icon: 'shield',
          title: 'Duplique sua Operação com Tecnologia Simples',
          description: 'Sistema seguro para captura e armazenamento de informações dos seus clientes'
          }
        ]
      },
    socialProof: 'Milhares de distribuidores estão gerando resultados',
      rating: '4.9/5 avaliação',
    footer: '© 2024 Herbalead. Todos os direitos reservados.',
      contactForm: {
        title: 'Entre em Contato',
        name: 'Nome Completo',
        email: 'E-mail',
        profession: 'Área de Atuação',
      professionPlaceholder: 'Ex: Distribuidor Herbalife, Coach de Bem-Estar...',
        message: 'Sua Dúvida ou Interesse',
      messagePlaceholder: 'Conte-nos como podemos ajudar você a acelerar seu crescimento...',
        cancel: 'Cancelar',
        send: 'Enviar',
        contactInfo: 'Entraremos em contato através do e-mail:',
      emailAddress: 'contato@herbalead.com'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Aqui você pode implementar o envio do e-mail
    // Por enquanto, vamos apenas mostrar um alerta
    alert(`Mensagem enviada! Entraremos em contato em breve através do e-mail: ${formData.email}`)
    
    // Reset do formulário
    setFormData({
      name: '',
      email: '',
      profession: '',
      message: ''
    })
    setShowContactForm(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {projectDomain ? getProjectName() : content.title}
                </h1>
                <p className="text-xs text-gray-600">{content.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="https://wa.me/5519996049800" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                WhatsApp
              </a>
              <button 
                onClick={() => router.push('/login')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Acessar agora
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            {/* Badge removido conforme solicitado */}
          </div>
          
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            {content.heroTitle}
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {content.heroSubtitle}
          </p>

          {/* Social Proof */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white"></div>
                </div>
                <span className="ml-3">{content.socialProof}</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span>{content.rating}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleMainAction}
              className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center"
            >
          {projectDomain ? (
            <>
              <MessageSquare className="w-5 h-5 mr-2" />
              Saiba Mais sobre {getProjectName()}
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          ) : (
            <>
              <MessageSquare className="w-5 h-5 mr-2" />
                  {content.ctaButton}
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
            </button>
            
            <button
              onClick={() => router.push('/login')}
              className="px-8 py-4 bg-white text-emerald-600 border border-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
            >
              {content.ctaButtonSecondary}
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h4>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools-section" className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Ferramentas Profissionais Disponíveis</h2>
            <p className="text-lg text-gray-600">Teste nossas ferramentas e veja como elas podem aumentar suas conversões</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {/* Example Tools */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                <Calculator className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Calculadora de IMC</h3>
              <p className="text-xs text-gray-600 mb-3">Calcule o Índice de Massa Corporal</p>
              <div className="flex items-center text-emerald-600 font-medium text-xs">
                <Play className="w-3 h-3 mr-1" />
                Testar Demo
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mb-3">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Calculadora de Proteína</h3>
              <p className="text-xs text-gray-600 mb-3">Calcule necessidades proteicas</p>
              <div className="flex items-center text-emerald-600 font-medium text-xs">
                <Play className="w-3 h-3 mr-1" />
                Testar Demo
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mb-3">
                <Target className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Composição Corporal</h3>
              <p className="text-xs text-gray-600 mb-3">Avalie massa muscular e gordura</p>
              <div className="flex items-center text-emerald-600 font-medium text-xs">
                <Play className="w-3 h-3 mr-1" />
                Testar Demo
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Planejador de Refeições</h3>
              <p className="text-xs text-gray-600 mb-3">Crie planos alimentares</p>
              <div className="flex items-center text-emerald-600 font-medium text-xs">
                <Play className="w-3 h-3 mr-1" />
                Testar Demo
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center mb-3">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Calculadora de Hidratação</h3>
              <p className="text-xs text-gray-600 mb-3">Avalie necessidades de água</p>
              <div className="flex items-center text-emerald-600 font-medium text-xs">
                <Play className="w-3 h-3 mr-1" />
                Testar Demo
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                <Award className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Avaliação Nutricional</h3>
              <p className="text-xs text-gray-600 mb-3">Questionário de hábitos</p>
              <div className="flex items-center text-emerald-600 font-medium text-xs">
                <Play className="w-3 h-3 mr-1" />
                Testar Demo
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mb-3">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Objetivos de Saúde</h3>
              <p className="text-xs text-gray-600 mb-3">Defina e acompanhe metas</p>
              <div className="flex items-center text-emerald-600 font-medium text-xs">
                <Play className="w-3 h-3 mr-1" />
                Testar Demo
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mb-3">
                <Star className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Quiz: Perfil de Bem-Estar</h3>
              <p className="text-xs text-gray-600 mb-3">Descubra o perfil dos leads</p>
              <div className="flex items-center text-emerald-600 font-medium text-xs">
                <Play className="w-3 h-3 mr-1" />
                Testar Demo
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center mb-3">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Tabela: Bem-Estar Diário</h3>
              <p className="text-xs text-gray-600 mb-3">Acompanhe métricas diárias</p>
              <div className="flex items-center text-emerald-600 font-medium text-xs">
                <Play className="w-3 h-3 mr-1" />
                Testar Demo
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-8 h-8 bg-lime-500 rounded-lg flex items-center justify-center mb-3">
                <Calculator className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Quiz: Alimentação Saudável</h3>
              <p className="text-xs text-gray-600 mb-3">Avalie hábitos alimentares</p>
              <div className="flex items-center text-emerald-600 font-medium text-xs">
                <Play className="w-3 h-3 mr-1" />
                Testar Demo
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mb-3">
                <Target className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Tabela: Desafio 7 Dias</h3>
              <p className="text-xs text-gray-600 mb-3">Engaje com desafios</p>
              <div className="flex items-center text-emerald-600 font-medium text-xs">
                <Play className="w-3 h-3 mr-1" />
                Testar Demo
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center mb-3">
                <Award className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Quiz: Aproveitando 100%</h3>
              <p className="text-xs text-gray-600 mb-3">Maximize o potencial</p>
              <div className="flex items-center text-emerald-600 font-medium text-xs">
                <Play className="w-3 h-3 mr-1" />
                Testar Demo
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mb-3">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Tabela: Metas Semanais</h3>
              <p className="text-xs text-gray-600 mb-3">Defina metas semanais</p>
              <div className="flex items-center text-emerald-600 font-medium text-xs">
                <Play className="w-3 h-3 mr-1" />
                Testar Demo
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Quiz: Inspirar Pessoas</h3>
              <p className="text-xs text-gray-600 mb-3">Identifique líderes</p>
              <div className="flex items-center text-emerald-600 font-medium text-xs">
                <Play className="w-3 h-3 mr-1" />
                Testar Demo
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center mb-3">
                <Star className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Quiz: Perfil Empreendedor</h3>
              <p className="text-xs text-gray-600 mb-3">Descubra perfis</p>
              <div className="flex items-center text-emerald-600 font-medium text-xs">
                <Play className="w-3 h-3 mr-1" />
                Testar Demo
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center mb-3">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Tabela: Onboarding Rápido</h3>
              <p className="text-xs text-gray-600 mb-3">Facilite integração</p>
              <div className="flex items-center text-emerald-600 font-medium text-xs">
                <Play className="w-3 h-3 mr-1" />
                Testar Demo
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-8 h-8 bg-slate-500 rounded-lg flex items-center justify-center mb-3">
                <Calculator className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Calculadora de Calorias</h3>
              <p className="text-xs text-gray-600 mb-3">Calcule necessidades calóricas</p>
              <div className="flex items-center text-emerald-600 font-medium text-xs">
                <Play className="w-3 h-3 mr-1" />
                Testar Demo
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-8 h-8 bg-fuchsia-500 rounded-lg flex items-center justify-center mb-3">
                <Target className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Quiz: Estilo de Vida</h3>
              <p className="text-xs text-gray-600 mb-3">Avalie hábitos de vida</p>
              <div className="flex items-center text-emerald-600 font-medium text-xs">
                <Play className="w-3 h-3 mr-1" />
                Testar Demo
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {content.howItWorks.title}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.howItWorks.steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {step.step}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h4>
                <p className="text-gray-600">
                  {step.description}
                </p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {content.whyChoose.title}
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {content.whyChoose.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.whyChoose.benefits.map((benefit, index) => {
              const getIcon = (iconName: string) => {
                switch (iconName) {
                  case 'users':
                    return <Users className="w-8 h-8 text-emerald-600" />
                  case 'trending':
                    return <TrendingUp className="w-8 h-8 text-emerald-600" />
                  case 'star':
                    return <Star className="w-8 h-8 text-yellow-600" />
                  case 'shield':
                    return <Shield className="w-8 h-8 text-purple-600" />
                  default:
                    return <Users className="w-8 h-8 text-emerald-600" />
                }
              }

              const getIconBg = (iconName: string) => {
                switch (iconName) {
                  case 'users':
                    return 'bg-emerald-100'
                  case 'trending':
                    return 'bg-emerald-100'
                  case 'star':
                    return 'bg-yellow-100'
                  case 'shield':
                    return 'bg-purple-100'
                  default:
                    return 'bg-emerald-100'
                }
              }

              return (
                <div key={index} className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className={`w-16 h-16 ${getIconBg(benefit.icon)} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    {getIcon(benefit.icon)}
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{content.contactForm.title}</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {content.contactForm.name}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {content.contactForm.email}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {content.contactForm.profession}
                </label>
                <input
                  type="text"
                  required
                  value={formData.profession}
                  onChange={(e) => setFormData({...formData, profession: e.target.value})}
                  placeholder={content.contactForm.professionPlaceholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {content.contactForm.message}
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder={content.contactForm.messagePlaceholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {content.contactForm.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {content.contactForm.send}
                </button>
              </div>
            </form>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>{content.contactForm.contactInfo}</p>
              <p className="font-semibold text-emerald-600">{content.contactForm.emailAddress}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold">{content.title}</h4>
            </div>
            <p className="text-gray-400 mb-4">
              {content.subtitle}
            </p>
            <p className="text-sm text-gray-500">
              {content.footer}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}