'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import HerbaleadLogo from '@/components/HerbaleadLogo'
import { useUserData } from '@/lib/useUserData'

export default function ParasitePage() {
  const { userData, getWhatsAppUrl, getCustomMessage, getPageTitle, getButtonText } = useUserData()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)
  const [totalPoints, setTotalPoints] = useState(0)

  const questions = [
    {
      id: 1,
      question: "Você sente cansaço excessivo mesmo dormindo bem?",
      options: [
        { text: "Sim, sempre", points: 3 },
        { text: "Às vezes", points: 2 },
        { text: "Não", points: 1 }
      ]
    },
    {
      id: 2,
      question: "Você tem problemas digestivos frequentes?",
      options: [
        { text: "Sim, sempre", points: 3 },
        { text: "Às vezes", points: 2 },
        { text: "Raramente", points: 1 }
      ]
    },
    {
      id: 3,
      question: "Você viaja para lugares com saneamento básico precário?",
      options: [
        { text: "Sim, frequentemente", points: 3 },
        { text: "Às vezes", points: 2 },
        { text: "Nunca", points: 1 }
      ]
    },
    {
      id: 4,
      question: "Você tem contato direto com animais domésticos?",
      options: [
        { text: "Sim, diariamente", points: 3 },
        { text: "Às vezes", points: 2 },
        { text: "Não", points: 1 }
      ]
    },
    {
      id: 5,
      question: "Você sente coceira anal, especialmente à noite?",
      options: [
        { text: "Sim, frequentemente", points: 3 },
        { text: "Às vezes", points: 2 },
        { text: "Nunca", points: 1 }
      ]
    },
    {
      id: 6,
      question: "Você tem perda de peso sem motivo aparente?",
      options: [
        { text: "Sim", points: 3 },
        { text: "Às vezes", points: 2 },
        { text: "Não", points: 1 }
      ]
    }
  ]

  const handleAnswer = (points: number) => {
    const newAnswers = [...answers, points]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      const total = newAnswers.reduce((sum, points) => sum + points, 0)
      setTotalPoints(total)
      setShowResult(true)
    }
  }

  const getResult = () => {
    if (totalPoints >= 12) {
      return {
        level: 'high',
        title: '🚨 ALTO RISCO DE PARASITAS',
        message: 'Baseado nas suas respostas, você apresenta sintomas que podem indicar presença de parasitas.',
        details: [
          'Parasitas podem estar roubando seus nutrientes',
          'Causando inflamação intestinal',
          'Comprometendo sua imunidade'
        ],
        solution: '💡 SOLUÇÃO NATURAL DISPONÍVEL'
      }
    } else if (totalPoints >= 7) {
      return {
        level: 'medium',
        title: '⚠️ RISCO MODERADO',
        message: 'Você apresenta alguns sinais que podem indicar presença de parasitas silenciosos.',
        details: [
          'Mesmo sem sintomas evidentes, parasitas podem afetar sua absorção de nutrientes',
          'Comprometer sua energia',
          'Enfraquecer sua imunidade'
        ],
        solution: '💡 PREVENÇÃO É A MELHOR ESTRATÉGIA'
      }
    } else {
      return {
        level: 'low',
        title: '✅ BAIXO RISCO ATUAL',
        message: 'Ótimo! Você apresenta baixo risco de parasitas.',
        details: [
          'Mas lembre-se: parasitas podem afetar qualquer pessoa',
          'Manter uma alimentação equilibrada e hábitos saudáveis é fundamental para prevenção'
        ],
        solution: '💡 FORTALEÇA SUA IMUNIDADE'
      }
    }
  }

  if (showResult) {
    const result = getResult()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <HerbaleadLogo size="lg" variant="horizontal" responsive={true} />
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {result.title}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {result.message}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                O que isso significa:
              </h3>
              <ul className="space-y-3">
                {result.details.map((detail, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-gray-700">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                {result.solution}
              </h3>
              <p className="text-green-700 mb-4">
                Um especialista em nutrição pode te ajudar com:
              </p>
              <ul className="space-y-2 text-green-700">
                <li>• Limpeza intestinal natural</li>
                <li>• Fortalecimento da imunidade</li>
                <li>• Absorção otimizada de nutrientes</li>
                <li>• Suplementação personalizada</li>
              </ul>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 text-center shadow-2xl border-2 border-green-200">
              <h3 className="text-3xl font-bold mb-4 text-gray-800">
                🎯 {getPageTitle()}
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                {getCustomMessage()}
              </p>
              <button 
                onClick={() => {
                  const whatsappUrl = getWhatsAppUrl()
                  console.log('📱 Abrindo WhatsApp:', whatsappUrl)
                  console.log('👤 Dados do usuário:', userData)
                  window.open(whatsappUrl, '_blank')
                }}
                className="px-12 py-6 bg-green-600 text-white rounded-xl font-bold text-xl hover:bg-green-700 transition-all duration-300 shadow-2xl transform hover:scale-110 hover:shadow-3xl flex items-center justify-center mx-auto border-4 border-green-500"
              >
                <MessageCircle className="w-8 h-8 mr-3" />
                {getButtonText()}
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                ⚠️ <strong>IMPORTANTE:</strong> Este é apenas um quiz educativo, 
                não substitui consulta médica ou diagnóstico profissional.
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <HerbaleadLogo size="lg" variant="horizontal" responsive={true} />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🔍 {getPageTitle()}
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {getCustomMessage()}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {questions[currentQuestion].question}
            </h2>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.points)}
                  className="w-full text-left p-4 border border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors duration-200"
                >
                  <span className="text-gray-700">{option.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}