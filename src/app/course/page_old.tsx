'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Download, Play, CheckCircle, Lock, BookOpen, Award } from 'lucide-react'
import HerbaleadLogo from '@/components/HerbaleadLogo'

interface CourseModule {
  id: string
  title: string
  description: string
  duration: string
  completed: boolean
  locked: boolean
  videoUrl?: string
  materials: {
    name: string
    type: 'pdf' | 'template' | 'checklist'
    path: string
  }[]
}

export default function CoursePage() {
  const [user, setUser] = useState<any>(null)
  const [hasAccess, setHasAccess] = useState(false)
  const [modules, setModules] = useState<CourseModule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUserAccess()
  }, [])

  const checkUserAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setUser(user)
        
        // Verificar se usuário tem acesso (usuário ativo)
        const { data: professional } = await supabase
          .from('professionals')
          .select('is_active, name, email')
          .eq('id', user.id)
          .single()

        console.log('Professional data:', professional) // Debug
        
        if (professional) {
          setHasAccess(professional.is_active)
          console.log('User access:', professional.is_active) // Debug
        } else {
          console.log('No professional found for user:', user.id) // Debug
        }
      }
      
      loadCourseModules()
    } catch (error) {
      console.error('Erro ao verificar acesso:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCourseModules = async () => {
    try {
      // Buscar módulos do banco de dados
      const { data: modulesData, error } = await supabase
        .from('course_modules')
        .select(`
          *,
          course_materials (*)
        `)
        .eq('course_id', (await supabase.from('courses').select('id').eq('title', 'Treinamento Inicial - HerbaLead').single()).data?.id)
        .order('order_index', { ascending: true })

      if (error) throw error

      // Converter para formato CourseModule
      const courseModules: CourseModule[] = modulesData?.map(module => ({
        id: module.id,
        title: module.title,
        description: module.description,
        duration: module.duration,
        completed: false,
        locked: false,
        videoUrl: module.video_url,
        materials: module.course_materials?.map(material => ({
          name: material.title,
          type: material.file_type as 'pdf' | 'template' | 'checklist',
          path: material.file_path
        })) || []
      })) || []

      setModules(courseModules)
    } catch (error) {
      console.error('Erro ao carregar módulos:', error)
      // Fallback para dados estáticos se houver erro
      const courseModules: CourseModule[] = [
        {
          id: '1',
          title: 'Visão Geral da Plataforma',
          description: 'Entenda o que é o HerbaLead, como funciona e como pode transformar seu negócio',
          duration: '10 min',
          completed: false,
          locked: false,
          videoUrl: undefined,
          materials: []
        },
        {
          id: '2',
          title: 'Introdução à Plataforma',
          description: 'Aprenda os primeiros passos no HerbaLead',
          duration: '15 min',
          completed: false,
          locked: false,
          videoUrl: undefined,
          materials: [
            { name: 'Guia de Cadastro', type: 'pdf', path: '/course/materials/01-guia-cadastro.md' }
          ]
        },
        {
          id: '3',
          title: 'Criação de Links',
          description: 'Como criar e personalizar seus materiais',
          duration: '20 min',
          completed: false,
          locked: false,
          videoUrl: undefined,
          materials: [
            { name: 'Tutorial de Links', type: 'pdf', path: '/course/materials/02-tutorial-links.md' }
          ]
        },
        {
          id: '4',
          title: 'Quiz Builder',
          description: 'Criando avaliações interativas',
          duration: '25 min',
          completed: false,
          locked: false,
          videoUrl: undefined,
          materials: [
            { name: 'Guia Quiz Builder', type: 'pdf', path: '/course/materials/03-guia-quiz-builder.md' }
          ]
        },
        {
          id: '5',
          title: 'Estratégias de Vendas',
          description: 'Técnicas de captura e conversão',
          duration: '30 min',
          completed: false,
          locked: false,
          videoUrl: undefined,
          materials: [
            { name: 'Manual de Vendas', type: 'pdf', path: '/course/materials/04-manual-vendas.md' }
          ]
        },
        {
          id: '6',
          title: 'Recursos Avançados',
          description: 'Integrações e otimizações',
          duration: '35 min',
          completed: false,
          locked: false,
          videoUrl: undefined,
          materials: [
            { name: 'Guia Avançado', type: 'pdf', path: '/course/materials/05-guia-avancado.md' }
          ]
        },
        {
          id: '7',
          title: 'Certificação',
          description: 'Conclusão e próximos passos',
          duration: '5 min',
          completed: false,
          locked: false,
          videoUrl: undefined,
          materials: [
            { name: 'Template Certificado', type: 'pdf', path: '/course/materials/06-certificado-template.md' }
          ]
        }
      ]
      
      setModules(courseModules)
    }
  }

  const downloadMaterial = async (materialPath: string, materialName: string) => {
    if (!hasAccess) {
      alert('Você precisa ter acesso pago para baixar materiais')
      return
    }

    try {
      // Buscar o conteúdo do arquivo Markdown
      const response = await fetch(materialPath)
      const markdownContent = await response.text()
      
      // Converter Markdown para HTML básico
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${materialName}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              color: #333;
            }
            h1 { color: #10B981; border-bottom: 2px solid #10B981; padding-bottom: 10px; }
            h2 { color: #059669; margin-top: 30px; }
            h3 { color: #047857; }
            code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; }
            pre { background: #f3f4f6; padding: 15px; border-radius: 8px; overflow-x: auto; }
            blockquote { border-left: 4px solid #10B981; padding-left: 15px; margin-left: 0; color: #6B7280; }
            ul, ol { padding-left: 20px; }
            li { margin-bottom: 5px; }
            .highlight { background: #D1FAE5; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .warning { background: #FEF3C7; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .info { background: #DBEAFE; padding: 15px; border-radius: 8px; margin: 15px 0; }
          </style>
        </head>
        <body>
          ${markdownContent
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/`(.*)`/gim, '<code>$1</code>')
            .replace(/^\- (.*$)/gim, '<li>$1</li>')
            .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
            .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
            .replace(/\n\n/gim, '</p><p>')
            .replace(/^(?!<[h|l|b|p])/gim, '<p>')
            .replace(/(?<!>)$/gim, '</p>')
            .replace(/<p><\/p>/gim, '')
            .replace(/<p>(<h[1-6])/gim, '$1')
            .replace(/(<\/h[1-6]>)<\/p>/gim, '$1')
            .replace(/<p>(<li)/gim, '<ul>$1')
            .replace(/(<\/li>)<\/p>/gim, '$1</ul>')
            .replace(/<p>(<blockquote)/gim, '$1')
            .replace(/(<\/blockquote>)<\/p>/gim, '$1')
          }
        </body>
        </html>
      `
      
      // Criar blob com HTML
      const blob = new Blob([htmlContent], { type: 'text/html' })
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${materialName}.html`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      alert('Material baixado com sucesso! Abra o arquivo HTML no seu navegador.')
    } catch (error) {
      console.error('Erro ao baixar material:', error)
      alert('Erro ao baixar material. Tente novamente.')
    }
  }

  const watchVideo = (videoUrl: string) => {
    if (!hasAccess) {
      alert('Você precisa ter acesso pago para assistir aos vídeos')
      return
    }
    
    window.open(videoUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando curso...</p>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <HerbaleadLogo size="lg" variant="horizontal" responsive={true} />
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Acesso Restrito ao Curso
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {user 
                ? 'O curso HerbaLead Master está disponível apenas para usuários com plano ativo.'
                : 'Faça login para acessar o curso HerbaLead Master.'
              }
            </p>
            
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-emerald-800 mb-2">
                🎓 HerbaLead Master Course
              </h2>
              <p className="text-emerald-700 mb-4">
                6 módulos completos com vídeos, materiais e certificação
              </p>
              <ul className="text-left text-emerald-700 space-y-2">
                <li>✅ Introdução à Plataforma</li>
                <li>✅ Criação de Links</li>
                <li>✅ Quiz Builder</li>
                <li>✅ Estratégias de Vendas</li>
                <li>✅ Recursos Avançados</li>
                <li>✅ Certificação</li>
              </ul>
            </div>

            <div className="space-y-4">
              {!user ? (
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Fazer Login
                </button>
              ) : (
                <div className="space-y-4">
                  <button 
                    onClick={() => window.location.href = '/user'}
                    className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Voltar ao Dashboard
                  </button>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                      🚀 Quer Acessar o Curso?
                    </h3>
                    <p className="text-blue-700 mb-3">
                      Entre em contato conosco para ativar seu acesso ao curso completo!
                    </p>
                    <button 
                      onClick={() => window.open('https://api.whatsapp.com/send?phone=5519996049800&text=Olá!%20Gostaria%20de%20ativar%20meu%20acesso%20ao%20curso%20HerbaLead%20Master.', '_blank')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Falar no WhatsApp
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    Ou entre em contato para saber sobre nossos planos
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <HerbaleadLogo size="lg" variant="horizontal" responsive={true} />
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.email}</span>
              <button 
                onClick={() => window.location.href = '/user'}
                className="text-gray-500 hover:text-gray-700"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎓 Treinamento Inicial - HerbaLead
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Curso completo para dominar a plataforma HerbaLead e transformar seu negócio em uma máquina de resultados
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 mb-8">
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              {modules.length} Módulos
            </div>
            <div className="flex items-center">
              <Play className="w-4 h-4 mr-2" />
              2h 10min
            </div>
            <div className="flex items-center">
              <Award className="w-4 h-4 mr-2" />
              Certificação
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg p-6 text-white mb-8">
            <h2 className="text-2xl font-bold mb-2">🚀 Pronto para Começar?</h2>
            <p className="text-emerald-100 mb-4">
              Acesse todos os módulos, materiais e vídeos do curso completo
            </p>
            <button 
              onClick={() => {
                const firstModule = document.getElementById('module-1')
                if (firstModule) {
                  firstModule.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="px-8 py-4 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center mx-auto"
            >
              <Play className="w-5 h-5 mr-2" />
              Iniciar Curso Agora
            </button>
          </div>
        </div>

        <div className="grid gap-6">
          {modules.map((module, index) => (
            <div key={module.id} id={`module-${module.id}`} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="bg-emerald-100 text-emerald-800 text-sm font-medium px-3 py-1 rounded-full mr-3">
                      Módulo {module.id}
                    </span>
                    <span className="text-sm text-gray-500">{module.duration}</span>
                    {module.completed && (
                      <CheckCircle className="w-5 h-5 text-emerald-600 ml-2" />
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {module.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {module.description}
                  </p>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => watchVideo(module.videoUrl!)}
                      className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Assistir Vídeo
                    </button>

                    <div className="flex items-center space-x-2">
                      {module.materials.map((material, idx) => (
                        <button
                          key={idx}
                          onClick={() => downloadMaterial(material.path, material.name)}
                          className="flex items-center px-3 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                          title="Baixar material em HTML"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          {material.name} (HTML)
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-emerald-800 mb-2">
              🏆 Certificação HerbaLead Master
            </h3>
            <p className="text-emerald-700 mb-4">
              Complete todos os módulos para receber seu certificado oficial
            </p>
            <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
              Baixar Certificado
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
