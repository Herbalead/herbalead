'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Bug, MessageSquare, CheckCircle, Clock, BarChart3 } from 'lucide-react'

interface Question {
  id: number
  question: string
  options: {
    text: string
    points: number
  }[]
}

const questions: Question[] = [
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

export default function ParasiteDemoPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)
  const [totalPoints, setTotalPoints] = useState(0)

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
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4">
              <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Bug className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Quiz: Diagnóstico de Parasitas</h1>
                  <p className="text-sm text-gray-600">Demo - Herbalead</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Result */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {result.title}
              </h2>
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

            {/* Demo CTA */}
            <div className="text-center">
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg mb-4">
                📞 FALE COM UM ESPECIALISTA
              </button>
              <p className="text-sm text-gray-500">
                ✅ Um especialista entrará em contato em até 24h
              </p>
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
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <Bug className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quiz: Diagnóstico de Parasitas</h1>
                <p className="text-sm text-gray-600">Demo - Herbalead</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Impact Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-8 mb-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Veja como seus clientes terão uma experiência incrível
          </h2>
          <p className="text-xl text-green-100 mb-6">
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
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1️⃣</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Cliente responde o quiz</h4>
              <p className="text-sm text-gray-600">6 perguntas sobre sintomas e hábitos</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2️⃣</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Sistema analisa resultado</h4>
              <p className="text-sm text-gray-600">Alto, médio ou baixo risco de parasitas</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3️⃣</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Cliente entra em contato</h4>
              <p className="text-sm text-gray-600">Clica no botão e conversa com você automaticamente</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-green-600 font-semibold">💬 Você escolhe o texto e o link do botão!</p>
          </div>
        </div>

        {/* Quiz */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🔍 Quiz: Descubra se você tem parasitas
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Parasitas podem estar roubando seus nutrientes e energia
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                ⚠️ <strong>IMPORTANTE:</strong> Este é apenas um quiz educativo, 
                não substitui consulta médica ou diagnóstico profissional.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Pergunta {currentQuestion + 1} de {questions.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              {questions[currentQuestion].question}
            </h3>
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

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Responda com sinceridade para obter um resultado mais preciso
            </p>
          </div>
        </div>

        {/* Communication & Subscription Guidance */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-8 mb-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">
            🚀 Pronto para começar a gerar seus próprios leads?
          </h3>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Você acabou de ver como funciona! Agora imagine ter esta ferramenta com <strong>seu nome</strong>, <strong>seu link</strong> e <strong>sua mensagem personalizada</strong>.
          </p>
          
          <div className="bg-white/20 rounded-xl p-6 mb-8 backdrop-blur-sm">
            <h4 className="text-2xl font-bold text-white mb-4">✨ O que você vai receber:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-green-100">Quiz personalizado com seu nome</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-green-100">Link único para compartilhar</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-green-100">Mensagem personalizada para WhatsApp</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-green-100">Todas as 9 ferramentas disponíveis</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 mb-8">
            <h4 className="text-2xl font-bold text-gray-800 mb-4">💡 Como funciona na prática:</h4>
            <ul className="text-left text-gray-600 space-y-3 text-lg">
              <li className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">1</span>
                </div>
                <span>Cliente responde o quiz e vê o resultado</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">2</span>
                </div>
                <span>Clica no botão "Consultar Especialista"</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">3</span>
                </div>
                <span>É redirecionado automaticamente para seu WhatsApp</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">4</span>
                </div>
                <span>Mensagem personalizada já vem pronta</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">5</span>
                </div>
                <span>Você recebe o contato qualificado automaticamente!</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/20 rounded-xl p-6 mb-8">
            <h4 className="text-2xl font-bold text-white mb-4">🎯 Por que esta ferramenta é poderosa:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-white/10 rounded-lg p-4">
                <h5 className="font-bold text-white mb-2">🔍 Identifica Necessidade</h5>
                <p className="text-green-100 text-sm">Pessoas com sintomas de parasitas têm alta intenção de compra</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h5 className="font-bold text-white mb-2">💊 Solução Natural</h5>
                <p className="text-green-100 text-sm">Perfeita para distribuidores Herbalife com produtos de limpeza</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h5 className="font-bold text-white mb-2">📈 Alta Conversão</h5>
                <p className="text-green-100 text-sm">Quem faz o quiz já está interessado em soluções</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button className="bg-white text-green-600 font-bold py-4 px-8 rounded-lg text-xl hover:bg-green-50 transition-colors duration-200 shadow-lg mb-4">
              🚀 QUERO COMEÇAR AGORA
            </button>
            <p className="text-green-100 text-sm">
              ✅ Acesso imediato após o pagamento
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
