'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Save, Info, Copy, ChevronDown, ChevronRight, ArrowLeft } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { getProjectConfig } from '@/lib/project-config'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Quiz {
  id?: string
  professional_id: string
  title: string
  description: string
  project_name: string // NOVO: Nome do projeto para URL personalizada
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
  }
  settings: {
    timeLimit?: number
    attempts?: number
    showCorrectAnswers: boolean
    randomizeQuestions: boolean
    customButtonText?: string
    congratulationsMessage?: string
    specialistButtonText?: string
    specialistRedirectUrl?: string
  }
  questions: Question[]
  is_active: boolean
  created_at?: string
}

interface Question {
  id?: string
  quiz_id?: string
  question_text: string
  question_type: 'multiple' | 'essay'
  order: number
  options?: string[]
  correct_answer?: number | string
  points?: number
  button_text?: string
}

export default function QuizBuilder() {
  const router = useRouter()
  const [projectDomain] = useState('herbalead')
  const [projectConfig] = useState<ReturnType<typeof getProjectConfig>>(getProjectConfig('fitness'))
  
  // Detectar projeto pelo subdomínio
  useEffect(() => {
    console.log('🔍 Quiz Builder initialized with herbalead project')
    
    // Limpar cache do localStorage para evitar problemas
    if (typeof window !== 'undefined') {
      localStorage.removeItem('quiz-builder-cache')
      localStorage.removeItem('quiz-draft')
    }
  }, [])

  // Cores padrão baseadas no projeto Herbalead
  const getDefaultColors = useCallback(() => {
    return {
      primary: '#10B981', // emerald-600 (Herbalead)
      secondary: '#059669', // emerald-700
      background: '#F0FDF4', // green-50
      text: '#1F2937' // gray-800
    }
  }, [])

  const [quiz, setQuiz] = useState<Quiz>({
    professional_id: '',
    title: 'Quiz de Bem-Estar',
    description: 'Descubra seu perfil de bem-estar e receba orientações personalizadas',
    project_name: '', // NOVO: Nome do projeto para URL personalizada
    colors: getDefaultColors(),
    settings: {
      showCorrectAnswers: true,
      randomizeQuestions: false,
      customButtonText: 'Próxima Questão',
      congratulationsMessage: 'Parabéns! Você concluiu o quiz com sucesso! 🎉',
      specialistButtonText: 'Consultar Profissional de Bem-Estar',
      specialistRedirectUrl: 'https://wa.me/5519981868000?text=Olá! Gostaria de consultar um profissional de bem-estar baseado no meu resultado do quiz.'
    },
    questions: [],
    is_active: true
  })

  const [previewQuestion, setPreviewQuestion] = useState(0)
  const [showColorInfo, setShowColorInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [showColors, setShowColors] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showQuestions, setShowQuestions] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showFinalPage, setShowFinalPage] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [savedQuizId, setSavedQuizId] = useState<string | null>(null)

  // Atualizar cores quando projeto mudar
  useEffect(() => {
    setQuiz(prev => ({
      ...prev,
      colors: getDefaultColors()
    }))
  }, [getDefaultColors])

  // Buscar usuário logado e perfil
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUser(user)
          setQuiz(prev => ({ ...prev, professional_id: user.id }))
          
          // Buscar perfil do usuário
          const { data: profile } = await supabase
            .from('professionals')
            .select('*')
            .eq('email', user.email)
            .single()
          
          if (profile) {
            console.log('👤 Perfil encontrado:', profile)
            setUserProfile(profile)
          } else {
            console.log('⚠️ Perfil não encontrado para email:', user.email)
            // Se não encontrar perfil, criar um temporário
            setUserProfile({ name: 'Usuário', email: user.email })
          }
        } else {
          // Se não há usuário logado, usar um ID temporário para desenvolvimento
          const tempUser = { id: 'temp-user-' + Date.now() }
          setUser(tempUser)
          setQuiz(prev => ({ ...prev, professional_id: tempUser.id }))
          setUserProfile({ name: 'Usuário', email: 'usuario@exemplo.com' })
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error)
        // Em caso de erro, usar um ID temporário para desenvolvimento
        const tempUser = { id: 'temp-user-' + Date.now() }
        setUser(tempUser)
        setQuiz(prev => ({ ...prev, professional_id: tempUser.id }))
        setUserProfile({ name: 'Usuário', email: 'usuario@exemplo.com' })
      }
    }
    getUser()
  }, [])

  const colorExplanations = {
    primary: {
      title: 'Cor Primária',
      description: 'Usada em botões principais, barras de progresso e destaques importantes. É a cor de ação do seu quiz.',
      example: 'Botão "Próxima", barra de progresso'
    },
    secondary: {
      title: 'Cor Secundária',
      description: 'Usada para elementos de apoio, badges e detalhes decorativos. Complementa a cor primária.',
      example: 'Tag "Múltipla Escolha", pontuação final'
    },
    background: {
      title: 'Cor de Fundo',
      description: 'A cor de fundo principal da tela onde o quiz aparece. Define a atmosfera geral.',
      example: 'Fundo atrás do card do quiz'
    },
    text: {
      title: 'Cor do Texto',
      description: 'Cor principal do texto, perguntas e respostas. Deve ter bom contraste com o fundo branco.',
      example: 'Perguntas, opções de resposta'
    }
  }

  // Templates de quiz pré-definidos
  const quizTemplates = {
    'bem-estar': {
      title: 'Quiz de Bem-Estar Completo',
      description: 'Avalie seu estilo de vida e receba orientações personalizadas para melhorar seu bem-estar',
      questions: [
        {
          question_text: 'Como você avalia sua qualidade de sono?',
          question_type: 'multiple' as const,
          options: ['Durmo muito bem, 7-8 horas por noite', 'Durmo bem, mas às vezes acordo cansado', 'Tenho dificuldade para dormir', 'Durmo pouco, menos de 6 horas'],
          correct_answer: 0,
          button_text: 'Próxima Questão'
        },
        {
          question_text: 'Qual é sua frequência de atividade física?',
          question_type: 'multiple' as const,
          options: ['Todos os dias', '3-4 vezes por semana', '1-2 vezes por semana', 'Raramente ou nunca'],
          correct_answer: 0,
          button_text: 'Próxima Questão'
        },
        {
          question_text: 'Como você descreve sua alimentação?',
          question_type: 'multiple' as const,
          options: ['Muito saudável e balanceada', 'Razoavelmente saudável', 'Às vezes como besteiras', 'Não me preocupo muito com alimentação'],
          correct_answer: 0,
          button_text: 'Próxima Questão'
        },
        {
          question_text: 'Como você gerencia o estresse no dia a dia?',
          question_type: 'multiple' as const,
          options: ['Tenho técnicas eficazes de relaxamento', 'Faço exercícios para aliviar', 'Às vezes me sinto sobrecarregado', 'Vivo constantemente estressado'],
          correct_answer: 0,
          button_text: 'Finalizar Quiz'
        }
      ]
    },
    'nutricao': {
      title: 'Quiz de Avaliação Nutricional',
      description: 'Descubra seus hábitos alimentares e receba dicas personalizadas de nutrição',
      questions: [
        {
          question_text: 'Quantas refeições você faz por dia?',
          question_type: 'multiple' as const,
          options: ['5-6 refeições pequenas', '3 refeições principais', '2 refeições grandes', 'Como quando tenho fome'],
          correct_answer: 0,
          button_text: 'Próxima Questão'
        },
        {
          question_text: 'Qual é sua principal fonte de proteína?',
          question_type: 'multiple' as const,
          options: ['Carnes magras e peixes', 'Ovos e laticínios', 'Leguminosas e grãos', 'Suplementos proteicos'],
          correct_answer: 0,
          button_text: 'Próxima Questão'
        },
        {
          question_text: 'Quantos copos de água você bebe por dia?',
          question_type: 'multiple' as const,
          options: ['8 ou mais copos', '6-7 copos', '4-5 copos', 'Menos de 4 copos'],
          correct_answer: 0,
          button_text: 'Finalizar Quiz'
        }
      ]
    },
    'fitness': {
      title: 'Quiz de Perfil Fitness',
      description: 'Identifique seu perfil de atividade física e objetivos de treino',
      questions: [
        {
          question_text: 'Qual é seu principal objetivo com a atividade física?',
          question_type: 'multiple' as const,
          options: ['Perder peso', 'Ganhar massa muscular', 'Melhorar condicionamento', 'Manter saúde geral'],
          correct_answer: 3,
          button_text: 'Próxima Questão'
        },
        {
          question_text: 'Qual tipo de exercício você prefere?',
          question_type: 'multiple' as const,
          options: ['Musculação', 'Cardio (corrida, bike)', 'Exercícios funcionais', 'Esportes coletivos'],
          correct_answer: 0,
          button_text: 'Próxima Questão'
        },
        {
          question_text: 'Quantas vezes por semana você pode se exercitar?',
          question_type: 'multiple' as const,
          options: ['Todos os dias', '4-5 vezes', '2-3 vezes', '1 vez ou menos'],
          correct_answer: 1,
          button_text: 'Finalizar Quiz'
        }
      ]
    }
  }

  const loadTemplate = (templateKey: string) => {
    const template = quizTemplates[templateKey as keyof typeof quizTemplates]
    if (template) {
      setQuiz(prev => ({
        ...prev,
        title: template.title,
        description: template.description,
        questions: template.questions.map((q, index) => ({
          ...q,
          order: index,
          points: 1
        }))
      }))
      setPreviewQuestion(0)
      setShowTemplates(false)
    }
  }

  const addQuestion = (type: 'multiple' | 'essay') => {
    const isLastQuestion = quiz.questions.length === 0
    const newQuestion: Question = {
      question_text: '',
      question_type: type,
      order: quiz.questions.length,
      options: type === 'multiple' ? ['', '', '', ''] : [],
      correct_answer: type === 'multiple' ? 0 : '',
      points: 1,
      button_text: isLastQuestion ? 'Finalizar Quiz' : 'Próxima Questão'
    }
    setQuiz({...quiz, questions: [...quiz.questions, newQuestion]})
    setPreviewQuestion(quiz.questions.length)
  }

  const updateQuestion = (id: number, field: string, value: string | number | string[]) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.map((q, index) => 
        index === id ? {...q, [field]: value} : q
      )
    })
  }

  const updateOption = (questionId: number, optionIndex: number, value: string) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.map((q, index) => 
        index === questionId 
          ? {...q, options: q.options?.map((opt, i) => i === optionIndex ? value : opt)}
          : q
      )
    })
  }

  const deleteQuestion = (id: number) => {
    const newQuestions = quiz.questions.filter((_, index) => index !== id)
    setQuiz({
      ...quiz,
      questions: newQuestions
    })
    if (previewQuestion >= newQuestions.length) {
      setPreviewQuestion(Math.max(0, newQuestions.length - 1))
    }
  }

  const updateColor = (colorKey: string, value: string) => {
    setQuiz({
      ...quiz,
      colors: {...quiz.colors, [colorKey]: value}
    })
  }

  const saveQuiz = async () => {
    if (!user) {
      alert('Usuário não encontrado')
      return
    }

    // Validar campos obrigatórios
    if (!quiz.title.trim()) {
      alert('⚠️ O título do quiz é obrigatório!')
      return
    }

    if (!quiz.project_name.trim()) {
      alert('⚠️ O nome do projeto é obrigatório!\n\nEste nome será usado para criar a URL personalizada do seu quiz.')
      return
    }

    // Validar se o nome do projeto já existe para este usuário
    try {
      const { data: existingQuiz } = await supabase
        .from('quizzes')
        .select('id, title')
        .eq('professional_id', user.id)
        .eq('project_name', quiz.project_name.trim())
        .neq('id', quiz.id || '') // Excluir o próprio quiz se estiver editando
        .single()

      if (existingQuiz) {
        alert(`⚠️ Já existe um quiz com o nome de projeto "${quiz.project_name}"!\n\nTítulo do quiz existente: "${existingQuiz.title}"\n\nEscolha um nome diferente para evitar conflitos.`)
        return
      }
    } catch (error) {
      // Se não encontrar nenhum quiz com esse nome, continua normalmente
      console.log('Nome do projeto disponível:', quiz.project_name)
    }

    // Validar se há pelo menos uma pergunta
    if (quiz.questions.length === 0) {
      alert('⚠️ Adicione pelo menos uma pergunta ao quiz!')
      return
    }

    // Validar se todas as perguntas têm texto
    const emptyQuestions = quiz.questions.some(q => !q.question_text.trim())
    if (emptyQuestions) {
      alert('⚠️ Todas as perguntas devem ter texto!')
      return
    }

    setLoading(true)
    try {
      // Salvar quiz
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .upsert({
          id: quiz.id,
          professional_id: user.id,
          title: quiz.title,
          description: quiz.description,
          project_name: quiz.project_name,
          colors: quiz.colors,
          settings: quiz.settings,
          is_active: quiz.is_active
        })
        .select()
        .single()

      if (quizError) throw quizError

      // Salvar perguntas
      if (quizData) {
        // Deletar perguntas antigas
        await supabase
          .from('questions')
          .delete()
          .eq('quiz_id', quizData.id)

        // Inserir novas perguntas
        const questionsToInsert = quiz.questions.map((q, index) => ({
          quiz_id: quizData.id,
          question_text: q.question_text,
          question_type: q.question_type,
          order_number: index,
          options: q.options,
          correct_answer: q.correct_answer,
          points: q.points || 1,
          button_text: q.button_text
        }))

        const { error: questionsError } = await supabase
          .from('questions')
          .insert(questionsToInsert)

        if (questionsError) throw questionsError

        setQuiz({...quiz, id: quizData.id})
        setSavedQuizId(quizData.id)
        setShowSuccessModal(true)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Erro ao salvar quiz:', error)
      alert('Erro ao salvar quiz. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // Componente de Preview ao Vivo
  const LivePreview = () => {
    const [showFinalPage, setShowFinalPage] = useState(false)
    const [currentPreviewQuestion, setCurrentPreviewQuestion] = useState(0)
    const [previewAnswers, setPreviewAnswers] = useState<{[key: number]: number}>({})

    if (quiz.questions.length === 0) {
      return (
        <div className="p-6">
          <div 
            className="h-full flex items-center justify-center p-8 rounded-lg"
            style={{backgroundColor: quiz.colors.background}}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{backgroundColor: quiz.colors.primary + '20'}}
              >
                <Plus size={32} style={{color: quiz.colors.primary}} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{color: quiz.colors.text}}>
                {quiz.title}
              </h3>
              <p className="text-gray-500 mb-4">{quiz.description}</p>
              <button
                className="px-6 py-3 rounded-lg text-white font-semibold text-lg transition-all hover:scale-105"
                style={{backgroundColor: quiz.colors.primary}}
              >
                Começar Quiz
              </button>
              <p className="text-sm text-gray-400 mt-4">
                Adicione perguntas para ver a prévia completa
              </p>
            </div>
          </div>
          
          {/* Preview das Configurações */}
          <div className="mt-6 bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-bold mb-4">⚙️ Configurações Ativas</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${quiz.settings.showCorrectAnswers ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className="text-sm text-gray-600">
                  {quiz.settings.showCorrectAnswers ? 'Mostrar respostas corretas' : 'Não mostrar respostas corretas'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${quiz.settings.randomizeQuestions ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className="text-sm text-gray-600">
                  {quiz.settings.randomizeQuestions ? 'Perguntas randomizadas' : 'Perguntas em ordem'}
                </span>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Botão Final:</strong> &quot;{quiz.settings.customButtonText || 'Falar com Especialista'}&quot;
                </p>
                {quiz.settings.specialistRedirectUrl && (
                  <p className="text-xs text-gray-500 mt-1">
                    Redireciona para: {quiz.settings.specialistRedirectUrl}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Se mostrar página final
    if (showFinalPage) {
      return (
        <div className="p-6">
          <div 
            className="h-full flex items-center justify-center p-8 rounded-lg"
            style={{backgroundColor: quiz.colors.background}}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
              {/* Navegação */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 justify-center">
                {quiz.questions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setShowFinalPage(false)
                      setCurrentPreviewQuestion(index)
                    }}
                    className="px-3 py-1 rounded text-sm font-medium whitespace-nowrap transition-all"
                    style={{
                      backgroundColor: quiz.colors.primary + '20',
                      color: quiz.colors.primary
                    }}
                  >
                    Q{index + 1}
                  </button>
                ))}
                <button
                  className="px-3 py-1 rounded text-sm font-medium whitespace-nowrap transition-all"
                  style={{
                    backgroundColor: quiz.colors.primary,
                    color: 'white'
                  }}
                >
                  🎯 Final
                </button>
              </div>

              {/* Página Final */}
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{backgroundColor: quiz.colors.primary + '20'}}
              >
                <span className="text-2xl">🎉</span>
              </div>
              
              <h3 
                className="text-xl font-bold mb-4"
                style={{color: quiz.colors.text}}
              >
                {quiz.settings.congratulationsMessage || 'Parabéns! Você concluiu o quiz com sucesso! 🎉'}
              </h3>
              
              <p className="text-gray-600 mb-6">
                Sua pontuação: <strong>8/10</strong>
              </p>
              
              <p className="text-sm text-gray-500 mb-6">
                Baseado nas suas respostas, recomendamos focar em exercícios de força e uma alimentação balanceada.
              </p>
              
              <button
                className="px-12 py-6 bg-emerald-600 text-white rounded-xl font-bold text-xl hover:bg-emerald-700 transition-all duration-300 shadow-2xl transform hover:scale-110 hover:shadow-3xl flex items-center justify-center mx-auto border-4 border-emerald-500"
              >
                <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                {quiz.settings.specialistButtonText || 'Consultar Profissional de Bem-Estar'}
              </button>
              
              {quiz.settings.specialistRedirectUrl && (
                <p className="text-xs text-gray-400 mt-3">
                  → {quiz.settings.specialistRedirectUrl}
                </p>
              )}
            </div>
          </div>
        </div>
      )
    }

    const question = quiz.questions[currentPreviewQuestion]

    return (
      <div className="p-6">
        <div 
          className="h-full flex items-center justify-center p-8 rounded-lg"
          style={{backgroundColor: quiz.colors.background}}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
            {/* Navegação entre perguntas */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 justify-center">
              {quiz.questions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPreviewQuestion(index)}
                  className="px-3 py-1 rounded text-sm font-medium whitespace-nowrap transition-all"
                  style={{
                    backgroundColor: currentPreviewQuestion === index 
                      ? quiz.colors.primary 
                      : quiz.colors.primary + '20',
                    color: currentPreviewQuestion === index ? 'white' : quiz.colors.primary
                  }}
                >
                  Q{index + 1}
                </button>
              ))}
              <button
                onClick={() => setShowFinalPage(true)}
                className="px-3 py-1 rounded text-sm font-medium whitespace-nowrap transition-all"
                style={{
                  backgroundColor: quiz.colors.secondary + '20',
                  color: quiz.colors.secondary
                }}
              >
                🎯 Final
              </button>
            </div>

            {/* Barra de Progresso */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span 
                  className="text-sm font-semibold"
                  style={{color: quiz.colors.secondary}}
                >
                  Questão {currentPreviewQuestion + 1} de {quiz.questions.length}
                </span>
                <span 
                  className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: quiz.colors.secondary + '20',
                    color: quiz.colors.secondary
                  }}
                >
                  {question.question_type === 'multiple' ? 'Múltipla Escolha' : 'Dissertativa'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentPreviewQuestion + 1) / quiz.questions.length) * 100}%`,
                    backgroundColor: quiz.colors.primary
                  }}
                />
              </div>
            </div>

            {/* Pergunta */}
            <h3 
              className="text-xl font-bold mb-6 text-left"
              style={{color: quiz.colors.text}}
            >
              {question.question_text || 'Digite a pergunta...'}
            </h3>

            {/* Opções de Resposta */}
            {question.question_type === 'multiple' ? (
              <div className="space-y-3 mb-6">
                {question.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setPreviewAnswers(prev => ({
                        ...prev,
                        [currentPreviewQuestion]: index
                      }))
                    }}
                    className="w-full p-4 rounded-lg border-2 text-left transition-all hover:scale-105"
                    style={{
                      borderColor: previewAnswers[currentPreviewQuestion] === index 
                        ? quiz.colors.primary 
                        : '#e5e7eb',
                      backgroundColor: previewAnswers[currentPreviewQuestion] === index 
                        ? quiz.colors.primary + '10' 
                        : 'white',
                      color: quiz.colors.text
                    }}
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center"
                        style={{
                          borderColor: previewAnswers[currentPreviewQuestion] === index 
                            ? quiz.colors.primary 
                            : '#d1d5db'
                        }}
                      >
                        {previewAnswers[currentPreviewQuestion] === index && (
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{backgroundColor: quiz.colors.primary}}
                          />
                        )}
                      </div>
                      {option || `Opção ${index + 1}`}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mb-6">
                <textarea
                  placeholder="Digite sua resposta aqui..."
                  className="w-full p-4 border-2 rounded-lg min-h-24 resize-none"
                  style={{
                    borderColor: quiz.colors.primary,
                    color: quiz.colors.text
                  }}
                />
              </div>
            )}

            {/* Botão de Navegação */}
            <div className="flex gap-3">
              {currentPreviewQuestion > 0 && (
                <button
                  onClick={() => setCurrentPreviewQuestion(currentPreviewQuestion - 1)}
                  className="flex-1 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                  style={{
                    backgroundColor: 'transparent',
                    color: quiz.colors.primary,
                    border: `2px solid ${quiz.colors.primary}`
                  }}
                >
                  Anterior
                </button>
              )}
              <button
                onClick={() => {
                  if (currentPreviewQuestion < quiz.questions.length - 1) {
                    setCurrentPreviewQuestion(currentPreviewQuestion + 1)
                  } else {
                    setShowFinalPage(true)
                  }
                }}
                className="flex-1 py-3 rounded-lg text-white font-semibold transition-all hover:scale-105"
                style={{backgroundColor: quiz.colors.primary}}
              >
                {currentPreviewQuestion < quiz.questions.length - 1 
                  ? (question.button_text || 'Próxima Questão')
                  : 'Finalizar Quiz'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Removido bloqueio de renderização - permitir acesso sem autenticação para desenvolvimento

  console.log('🎯 Quiz Builder renderizando:', { 
    quiz: quiz.title, 
    user: user?.id, 
    projectConfig: projectConfig?.name,
    questionsCount: quiz.questions.length 
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {projectDomain === 'herbalead' ? '🏋️ Herbalead Quiz Builder' : 'Construtor de Quiz'}
            </h1>
            <p className="text-sm text-gray-600">
              {projectDomain === 'herbalead' 
                ? 'Crie quizzes personalizados para fitness e academia'
                : 'Crie quizzes personalizados para seus clientes'
              }
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center gap-2 hover:bg-gray-600"
              onClick={() => router.push('/user')}
            >
              <ArrowLeft size={18} />
              Voltar ao Dashboard
            </button>
            {quiz.id && (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const url = `${window.location.origin}/quiz/${quiz.id}`
                    navigator.clipboard.writeText(url)
                    alert('Link copiado para a área de transferência!')
                  }
                }}
              >
                <Copy size={18} />
                Copiar Link
              </button>
            )}
            <button
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-700 disabled:opacity-50"
              onClick={saveQuiz}
              disabled={loading || quiz.questions.length === 0}
            >
              <Save size={18} />
              {loading ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar Quiz'}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Painel Editor - Esquerda */}
        <div className="w-full lg:w-1/2 min-w-0 p-4 lg:p-6 space-y-4 lg:space-y-6">
          {/* Templates de Quiz */}
          <div className="bg-white rounded-lg shadow">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-bold">🎯 Templates de Quiz</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Comece rápido</span>
                {showTemplates ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </div>
            </button>
            
            {showTemplates && (
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => loadTemplate('bem-estar')}
                    className="p-4 border-2 border-emerald-200 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-all text-left"
                  >
                    <div className="text-emerald-600 font-bold mb-2">🏃‍♂️ Bem-Estar</div>
                    <div className="text-sm text-gray-600 mb-2">Avaliação completa de estilo de vida</div>
                    <div className="text-xs text-gray-500">4 perguntas</div>
                  </button>
                  
                  <button
                    onClick={() => loadTemplate('nutricao')}
                    className="p-4 border-2 border-emerald-200 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-all text-left"
                  >
                    <div className="text-emerald-600 font-bold mb-2">🥗 Nutrição</div>
                    <div className="text-sm text-gray-600 mb-2">Hábitos alimentares e hidratação</div>
                    <div className="text-xs text-gray-500">3 perguntas</div>
                  </button>
                  
                  <button
                    onClick={() => loadTemplate('fitness')}
                    className="p-4 border-2 border-emerald-200 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-all text-left"
                  >
                    <div className="text-emerald-600 font-bold mb-2">💪 Fitness</div>
                    <div className="text-sm text-gray-600 mb-2">Perfil de atividade física</div>
                    <div className="text-xs text-gray-500">3 perguntas</div>
                  </button>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    💡 <strong>Dica:</strong> Escolha um template para começar rapidamente. Você pode personalizar tudo depois!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Informações do Quiz */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">📋 Informações do Quiz</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={quiz.title}
                  onChange={(e) => setQuiz({...quiz, title: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    !quiz.title.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Quiz de Conhecimentos Gerais"
                  required
                />
                {!quiz.title.trim() && (
                  <p className="text-xs text-red-500 mt-1">
                    ⚠️ Este campo é obrigatório
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nome do Projeto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={quiz.project_name}
                  onChange={(e) => setQuiz({...quiz, project_name: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    !quiz.project_name.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Ex: quiz-bem-estar"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  🔗 Usado para criar URL personalizada: /{userProfile?.name?.toLowerCase().replace(/\s+/g, '-') || 'usuario'}/quiz/{quiz.project_name || 'projeto'}
                </p>
                {!quiz.project_name.trim() && (
                  <p className="text-xs text-red-500 mt-1">
                    ⚠️ Este campo é obrigatório para criar a URL do quiz
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea
                  value={quiz.description}
                  onChange={(e) => setQuiz({...quiz, description: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  rows={3}
                  placeholder="Breve descrição do seu quiz"
                />
              </div>
            </div>
          </div>

          {/* Personalização de Cores */}
          <div className="bg-white rounded-lg shadow">
            <button
              onClick={() => setShowColors(!showColors)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-bold">🎨 Cores do Quiz</h2>
              {showColors ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            
            {showColors && (
              <div className="px-6 pb-6">
                <div className="space-y-4">
              {Object.entries(colorExplanations).map(([key, info]) => (
                <div key={key} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">{info.title}</label>
                    <button
                      onMouseEnter={() => setShowColorInfo(key)}
                      onMouseLeave={() => setShowColorInfo(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Info size={16} />
                    </button>
                  </div>
                  
                  {showColorInfo === key && (
                    <div className="absolute right-0 top-0 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl z-10">
                      <p className="font-semibold mb-1">{info.description}</p>
                      <p className="text-gray-300">Exemplo: {info.example}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={quiz.colors[key as keyof typeof quiz.colors]}
                      onChange={(e) => updateColor(key, e.target.value)}
                      className="w-14 h-11 rounded cursor-pointer border"
                    />
                    <input
                      type="text"
                      value={quiz.colors[key as keyof typeof quiz.colors]}
                      onChange={(e) => updateColor(key, e.target.value)}
                      className="flex-1 px-3 py-2 border rounded font-mono text-sm"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              ))}
                </div>
              </div>
            )}
          </div>

          {/* Perguntas */}
          <div className="bg-white rounded-lg shadow">
            <button
              onClick={() => setShowQuestions(!showQuestions)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-bold">❓ Perguntas</h2>
              <div className="flex items-center gap-2">
                {quiz.questions.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {quiz.questions.length} pergunta{quiz.questions.length !== 1 ? 's' : ''}
                  </span>
                )}
                {showQuestions ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </div>
            </button>
            
            {showQuestions && (
              <div className="px-6 pb-6">
                <div className="flex justify-end mb-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => addQuestion('multiple')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 text-sm"
                    >
                      <Plus size={16} />
                      Múltipla Escolha
                    </button>
                    <button
                      onClick={() => addQuestion('essay')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2 hover:bg-green-600 text-sm"
                    >
                      <Plus size={16} />
                      Dissertativa
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
              {quiz.questions.map((question, qIndex) => (
                <div 
                  key={qIndex} 
                  className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
                    previewQuestion === qIndex 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPreviewQuestion(qIndex)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-semibold text-gray-600">
                      Questão {qIndex + 1} - {
                        question.question_type === 'multiple' ? '✓ Múltipla Escolha' : '✍️ Dissertativa'
                      }
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteQuestion(qIndex)
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={question.question_text}
                    onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                    placeholder="Digite a pergunta..."
                    className="w-full px-3 py-2 border rounded mb-3 font-medium"
                    onClick={(e) => e.stopPropagation()}
                  />

                  {question.question_type === 'multiple' && (
                    <div className="space-y-2 mb-3">
                      <p className="text-xs font-medium text-gray-500 mb-2">
                        Opções (selecione a correta):
                      </p>
                      {question.options?.map((option, oIndex) => (
                        <div key={oIndex} className="flex gap-2 items-center">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={question.correct_answer === oIndex}
                            onChange={() => updateQuestion(qIndex, 'correct_answer', oIndex)}
                            className="w-4 h-4"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            placeholder={`Opção ${oIndex + 1}`}
                            className="flex-1 px-3 py-2 border rounded text-sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Campo de texto do botão */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Texto do Botão:
                    </label>
                    <input
                      type="text"
                      value={question.button_text || (qIndex === quiz.questions.length - 1 ? 'Finalizar Quiz' : 'Próxima Questão')}
                      onChange={(e) => updateQuestion(qIndex, 'button_text', e.target.value)}
                      placeholder={qIndex === quiz.questions.length - 1 ? 'Finalizar Quiz' : 'Próxima Questão'}
                      className="w-full px-3 py-2 border rounded text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              ))}

              {quiz.questions.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Plus size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Adicione sua primeira pergunta</p>
                </div>
              )}
                </div>
              </div>
            )}
          </div>

          {/* Página Final */}
          <div className="bg-white rounded-lg shadow">
            <button
              onClick={() => setShowFinalPage(!showFinalPage)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-bold">🏁 Página Final</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Última página</span>
                {showFinalPage ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </div>
            </button>
            
            {showFinalPage && (
              <div className="px-6 pb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Configure como será a última página que aparece após o usuário finalizar o quiz
                </p>

                <div className="space-y-4">
                  {/* Mensagem de Parabéns */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-800">Mensagem de Parabéns</label>
                    <textarea
                      value={quiz.settings.congratulationsMessage || 'Parabéns! Você concluiu o quiz com sucesso! 🎉'}
                      onChange={(e) => setQuiz({
                        ...quiz, 
                        settings: {...quiz.settings, congratulationsMessage: e.target.value}
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Ex: Parabéns! Você concluiu o quiz com sucesso! 🎉"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500">
                      💬 Mensagem que aparece quando o usuário finaliza o quiz
                    </p>
                  </div>

                  {/* Botão do Especialista */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-800">Texto do Botão WhatsApp</label>
                    <input
                      type="text"
                      value={quiz.settings.specialistButtonText || 'Consultar Profissional de Bem-Estar'}
                      onChange={(e) => setQuiz({
                        ...quiz, 
                        settings: {...quiz.settings, specialistButtonText: e.target.value}
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Ex: Consultar Profissional de Bem-Estar"
                    />
                    <p className="text-xs text-gray-500">
                      📱 Texto do botão que abre o WhatsApp
                    </p>
                  </div>

                  {/* URL de Redirecionamento */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-800">Link do WhatsApp</label>
                    <input
                      type="url"
                      value={quiz.settings.specialistRedirectUrl || ''}
                      onChange={(e) => setQuiz({
                        ...quiz, 
                        settings: {...quiz.settings, specialistRedirectUrl: e.target.value}
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Ex: https://wa.me/5519981868000?text=Olá! Gostaria de consultar..."
                    />
                    <p className="text-xs text-gray-500">
                      🔗 Link completo do WhatsApp com mensagem pré-definida
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Configurações */}
          <div className="bg-white rounded-lg shadow">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-bold">⚙️ Configurações do Quiz</h2>
              {showSettings ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            
            {showSettings && (
              <div className="px-6 pb-6">
                <div className="space-y-6">
                  {/* Configurações de Comportamento */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">🎯 Comportamento do Quiz</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-800">Mostrar respostas corretas</label>
                          <p className="text-xs text-gray-600 mt-1">
                            Após finalizar o quiz, o usuário vê quais respostas estavam certas ou erradas
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            💡 Útil para quizzes educativos e de conhecimento
                          </p>
                        </div>
                        <button
                          onClick={() => setQuiz({
                            ...quiz, 
                            settings: {...quiz.settings, showCorrectAnswers: !quiz.settings.showCorrectAnswers}
                          })}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            quiz.settings.showCorrectAnswers ? 'bg-emerald-500' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            quiz.settings.showCorrectAnswers ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-800">Randomizar perguntas</label>
                          <p className="text-xs text-gray-600 mt-1">
                            As perguntas aparecem em ordem diferente para cada pessoa
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            💡 Evita que pessoas "coloquem" umas das outras
                          </p>
                        </div>
                        <button
                          onClick={() => setQuiz({
                            ...quiz, 
                            settings: {...quiz.settings, randomizeQuestions: !quiz.settings.randomizeQuestions}
                          })}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            quiz.settings.randomizeQuestions ? 'bg-emerald-500' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            quiz.settings.randomizeQuestions ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

        </div>

        {/* Preview ao Vivo - Direita */}
        <div className="w-full lg:w-1/2 min-w-0 bg-gray-100 border-t lg:border-t-0 lg:border-l flex flex-col">
          <div className="sticky top-0 bg-white border-b px-6 py-3 flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-700">👁️ Preview ao Vivo</h2>
            <p className="text-xs text-gray-500">Veja como seu quiz aparece em tempo real</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <LivePreview />
          </div>
        </div>
      </div>

      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Criado com Sucesso!</h2>
              <p className="text-gray-600 mb-6">
                Seu quiz '{quiz.title}' está pronto para ser compartilhado.
              </p>

              {/* Detalhes do Quiz */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                  </svg>
                  Detalhes do Quiz
                </h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Título:</strong> {quiz.title}</p>
                  <p><strong>Projeto:</strong> {quiz.project_name || 'Não definido'}</p>
                  <p><strong>Botão Final:</strong> {quiz.settings.specialistButtonText}</p>
                </div>
              </div>

              {/* Link do Quiz */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                  Link do Quiz
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/${userProfile?.name?.toLowerCase().replace(/\s+/g, '-') || 'usuario'}/quiz/${quiz.project_name || 'projeto'}`}
                    readOnly
                    className="flex-1 px-3 py-2 border rounded text-sm bg-gray-100"
                  />
                  <button
                    onClick={async () => {
                      const url = `${window.location.origin}/${userProfile?.name?.toLowerCase().replace(/\s+/g, '-') || 'usuario'}/quiz/${quiz.project_name || 'projeto'}`
                      await navigator.clipboard.writeText(url)
                      alert('Link copiado!')
                    }}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium transition-colors"
                  >
                    📋 Copiar
                  </button>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/${userProfile?.name?.toLowerCase().replace(/\s+/g, '-') || 'usuario'}/quiz/${quiz.project_name || 'projeto'}`
                    window.open(url, '_blank')
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Visualizar Quiz
                </button>
                
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Continuar Editando
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}