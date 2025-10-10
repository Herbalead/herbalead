'use client'

import { useState } from 'react'
import { 
  Calculator, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Heart,
  Activity,
  Target,
  Star,
  MessageCircle,
  Brain
} from 'lucide-react'
import Link from 'next/link'

interface WellnessResults {
  score: string
  category: string
  color: string
  recommendations: string[]
  improvements: string[]
  wellnessTips: string[]
  profile: string
}

export default function WellnessProfileDemoPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<WellnessResults | null>(null)

  const questions = [
    {
      id: 1,
      text: "Como você avalia sua qualidade de sono?",
      options: [
        "Durmo muito bem, 7-9 horas por noite",
        "Durmo bem na maioria das noites",
        "Tenho dificuldades ocasionais para dormir",
        "Frequentemente tenho problemas de sono"
      ]
    },
    {
      id: 2,
      text: "Qual é o seu nível de estresse no dia a dia?",
      options: [
        "Muito baixo, me sinto relaxado",
        "Baixo, consigo gerenciar bem",
        "Moderado, às vezes me sinto sobrecarregado",
        "Alto, me sinto constantemente estressado"
      ]
    },
    {
      id: 3,
      text: "Com que frequência você pratica atividade física?",
      options: [
        "Diariamente ou quase todos os dias",
        "3-4 vezes por semana",
        "1-2 vezes por semana",
        "Raramente ou nunca"
      ]
    },
    {
      id: 4,
      text: "Como você avalia sua alimentação?",
      options: [
        "Muito saudável, como alimentos nutritivos",
        "Boa, tento manter uma dieta equilibrada",
        "Regular, às vezes como bem",
        "Preciso melhorar minha alimentação"
      ]
    },
    {
      id: 5,
      text: "Como está sua saúde mental e emocional?",
      options: [
        "Excelente, me sinto feliz e equilibrado",
        "Boa, geralmente me sinto bem",
        "Regular, tenho altos e baixos",
        "Preciso de ajuda para melhorar"
      ]
    },
    {
      id: 6,
      text: "Qual é a qualidade dos seus relacionamentos?",
      options: [
        "Excelente, tenho relacionamentos fortes",
        "Boa, me sinto conectado com outros",
        "Regular, alguns relacionamentos são difíceis",
        "Preciso melhorar minhas conexões"
      ]
    },
    {
      id: 7,
      text: "Como você gerencia seu tempo livre?",
      options: [
        "Muito bem, faço atividades que gosto",
        "Bem, consigo relaxar e me divertir",
        "Regular, às vezes me sinto sobrecarregado",
        "Mal, não tenho tempo para mim"
      ]
    },
    {
      id: 8,
      text: "Qual é o seu nível de energia durante o dia?",
      options: [
        "Muito alto, me sinto energizado",
        "Alto, geralmente tenho boa energia",
        "Moderado, às vezes me sinto cansado",
        "Baixo, frequentemente me sinto fatigado"
      ]
    }
  ]

  const calculateWellnessScore = () => {
    let totalScore = 0
    let maxScore = questions.length * 4 // 4 points per question max
    
    questions.forEach((_, index) => {
      const answer = answers[index]
      if (answer !== undefined) {
        totalScore += (4 - answer) // Reverse scoring (0 = best, 3 = worst)
      }
    })
    
    const percentage = (totalScore / maxScore) * 100
    
    let category = ''
    let color = ''
    let profile = ''
    let recommendations = []
    let improvements = []
    let wellnessTips = []
    
    if (percentage >= 80) {
      category = 'Excelente Bem-Estar'
      color = 'text-green-600'
      profile = 'Você tem um perfil de bem-estar exemplar! Sua vida está bem equilibrada em todos os aspectos.'
      recommendations = [
        'Continue mantendo seus hábitos saudáveis',
        'Compartilhe suas estratégias com outros',
        'Monitore regularmente para manter o equilíbrio'
      ]
      improvements = [
        'Manter excelente qualidade de vida',
        'Otimizar ainda mais seu bem-estar',
        'Prevenir possíveis desequilíbrios futuros'
      ]
    } else if (percentage >= 60) {
      category = 'Bom Bem-Estar'
      color = 'text-blue-600'
      profile = 'Você tem um bom perfil de bem-estar, com alguns aspectos que podem ser melhorados.'
      recommendations = [
        'Identifique áreas específicas para melhorar',
        'Mantenha os hábitos que já funcionam bem',
        'Considere pequenos ajustes na rotina'
      ]
      improvements = [
        'Melhorar áreas específicas de bem-estar',
        'Otimizar qualidade de vida',
        'Prevenir problemas futuros'
      ]
    } else if (percentage >= 40) {
      category = 'Bem-Estar Regular'
      color = 'text-yellow-600'
      profile = 'Seu bem-estar está em um nível regular, com oportunidades significativas de melhoria.'
      recommendations = [
        'Consulte um especialista para orientação',
        'Foque em uma área por vez para melhorar',
        'Estabeleça metas realistas e alcançáveis'
      ]
      improvements = [
        'Melhorar qualidade de vida',
        'Reduzir níveis de estresse',
        'Otimizar hábitos de saúde'
      ]
    } else {
      category = 'Bem-Estar Precisa de Atenção'
      color = 'text-red-600'
      profile = 'Seu bem-estar precisa de atenção imediata. É importante buscar ajuda profissional.'
      recommendations = [
        'Consulte um especialista urgentemente',
        'Priorize sua saúde física e mental',
        'Considere apoio profissional para mudanças'
      ]
      improvements = [
        'Melhorar saúde geral',
        'Reduzir riscos à saúde',
        'Estabelecer hábitos saudáveis'
      ]
    }
    
    wellnessTips = [
      'Mantenha uma rotina de sono consistente',
      'Pratique técnicas de relaxamento diariamente',
      'Inclua atividade física na sua rotina',
      'Alimente-se de forma equilibrada e nutritiva',
      'Dedique tempo para atividades que trazem prazer',
      'Mantenha conexões sociais positivas',
      'Gerencie o estresse de forma saudável',
      'Busque ajuda profissional quando necessário'
    ]
    
    return {
      score: percentage.toFixed(0),
      category,
      color,
      profile,
      recommendations,
      improvements,
      wellnessTips
    }
  }

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Demo não mostra resultados, apenas simula o processo
      alert('Demo: Esta é uma simulação! Na versão real, você veria seus resultados aqui.')
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quiz: Perfil de Bem-Estar</h1>
                <p className="text-sm text-gray-600">Demo - Herbalead</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Impact Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 mb-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Veja como seus clientes terão uma experiência incrível
          </h2>
          <p className="text-xl text-indigo-100 mb-6">
            E como cada ferramenta pode gerar novos contatos automaticamente!
          </p>
          <div className="bg-white/20 rounded-lg p-4 inline-block">
            <p className="text-sm">
              💡 Esta é uma versão de demonstração. Quando você adquirir o acesso, poderá personalizar o botão, mensagem e link de destino (WhatsApp, formulário ou site).
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🚀 Como funciona esta ferramenta para gerar leads
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1️⃣</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Cliente responde quiz</h4>
              <p className="text-sm text-gray-600">8 perguntas sobre bem-estar físico, mental e emocional</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2️⃣</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Sistema analisa perfil</h4>
              <p className="text-sm text-gray-600">Calcula score e fornece recomendações personalizadas</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3️⃣</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Cliente entra em contato</h4>
              <p className="text-sm text-gray-600">Clica no botão e conversa com você automaticamente</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-indigo-600 font-semibold">💬 Você escolhe o texto e o link do botão!</p>
          </div>
        </div>

        {/* Quiz */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Pergunta {currentQuestion + 1} de {questions.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {questions[currentQuestion].text}
          </h2>

          <div className="space-y-3 mb-8">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(currentQuestion, index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  answers[currentQuestion] === index
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    answers[currentQuestion] === index
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion] === index && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </button>
            
            <button
              onClick={nextQuestion}
              disabled={answers[currentQuestion] === undefined}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Próxima'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gray-50 rounded-xl p-8 text-center shadow-lg border border-gray-200">
          <h3 className="text-3xl font-bold mb-4 text-gray-800">
            💼 Pronto para ter esta ferramenta com seu nome e link personalizado?
          </h3>
          <p className="text-gray-600 mb-8 text-lg">
            Clique em "Assinar Agora" e comece a gerar seus próprios leads com o Herbalead.
          </p>
          <button className="px-12 py-6 bg-indigo-600 text-white rounded-xl font-bold text-xl hover:bg-indigo-700 transition-all duration-300 shadow-2xl transform hover:scale-110 hover:shadow-3xl">
            Assinar Agora
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Importante</h4>
              <p className="text-yellow-700 text-sm">
                Este quiz é uma ferramenta de orientação e não substitui uma avaliação profissional completa. 
                Consulte sempre um especialista para uma análise detalhada do seu bem-estar.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
