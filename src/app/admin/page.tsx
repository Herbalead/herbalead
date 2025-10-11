'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  BookOpen, 
  Users, 
  Download, 
  Eye,
  Settings,
  BarChart3,
  FileText,
  Video,
  Lock,
  Unlock,
  ChevronDown,
  ChevronRight,
  UserPlus,
  Shield,
  LogOut,
  CheckCircle,
  XCircle,
  AlertCircle,
  X
} from 'lucide-react'
import HerbaleadLogo from '@/components/HerbaleadLogo'

interface Course {
  id: string
  title: string
  description: string
  modules: Module[]
  is_active: boolean
  created_at: string
  updated_at: string
}

interface CourseMaterial {
  id: string
  module_id: string
  title: string
  file_path: string
  file_type: string
  file_size: number
  download_count: number
  is_active: boolean
}

interface Module {
  id: string
  course_id: string
  title: string
  description: string
  duration: string
  video_url?: string
  materials: CourseMaterial[]
  order_index: number
  is_active: boolean
}


interface Professional {
  id: string
  name: string
  email: string
  is_active: boolean
  is_admin: boolean
  created_at: string
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

interface User {
  id: string
  email: string
  name?: string
  is_admin?: boolean
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [courses, setCourses] = useState<Course[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [materials, setMaterials] = useState<CourseMaterial[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set())
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    adminPassword: ''
  })

  useEffect(() => {
    checkAdminAccess()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Função para mostrar notificações
  const showNotification = (type: Notification['type'], title: string, message: string, duration: number = 5000) => {
    const id = Date.now().toString()
    const notification: Notification = { id, type, title, message, duration }
    
    setNotifications(prev => [...prev, notification])
    
    // Auto remover após o tempo especificado
    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const checkAdminAccess = async () => {
    try {
      // Verificar se há sessão administrativa no localStorage
      const adminSession = localStorage.getItem('admin_session')
      
      if (adminSession) {
        const session = JSON.parse(adminSession)
        if (session.admin_login && session.user.is_admin) {
          setUser(session.user)
          setIsAdmin(true)
          loadData()
          return
        }
      }

      // Se não há sessão administrativa, verificar login normal
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setUser(user)
        
        // Verificar se usuário é admin
        const { data: professional } = await supabase
          .from('professionals')
          .select('is_active, email, is_admin')
          .eq('id', user.id)
          .single()

        setIsAdmin(professional?.is_admin || false)
        
        if (professional?.is_admin) {
          loadData()
        }
      }
    } catch (error) {
      console.error('Erro ao verificar acesso admin:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadData = async () => {
    try {
      console.log('🔄 Carregando dados do Supabase...')
      
      // Carregar cursos
      console.log('📚 Carregando cursos...')
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })

      if (coursesError) {
        console.error('❌ Erro ao carregar cursos:', coursesError)
        showNotification('error', 'Erro de Conexão', 'Não foi possível carregar os cursos do banco de dados.')
        return
      }

      console.log('✅ Cursos carregados:', coursesData?.length || 0)
      setCourses(coursesData || [])

      // Carregar módulos
      console.log('📖 Carregando módulos...')
      const { data: modulesData, error: modulesError } = await supabase
        .from('course_modules')
        .select('*')
        .order('order_index', { ascending: true })

      if (modulesError) {
        console.error('❌ Erro ao carregar módulos:', modulesError)
        showNotification('error', 'Erro de Conexão', 'Não foi possível carregar os módulos do banco de dados.')
        return
      }

      console.log('✅ Módulos carregados:', modulesData?.length || 0)
      setModules(modulesData || [])

      // Carregar materiais
      console.log('📄 Carregando materiais...')
      const { data: materialsData, error: materialsError } = await supabase
        .from('course_materials')
        .select('*')
        .order('created_at', { ascending: false })

      if (materialsError) {
        console.error('❌ Erro ao carregar materiais:', materialsError)
        showNotification('error', 'Erro de Conexão', 'Não foi possível carregar os materiais do banco de dados.')
        return
      }

      console.log('✅ Materiais carregados:', materialsData?.length || 0)
      setMaterials(materialsData || [])

      // Carregar profissionais
      console.log('👥 Carregando profissionais...')
      const { data: professionalsData, error: professionalsError } = await supabase
        .from('professionals')
        .select('*')
        .order('created_at', { ascending: false })

      if (professionalsError) {
        console.error('❌ Erro ao carregar profissionais:', professionalsError)
        showNotification('error', 'Erro de Conexão', 'Não foi possível carregar os profissionais do banco de dados.')
        return
      }

      console.log('✅ Profissionais carregados:', professionalsData?.length || 0)
      setProfessionals(professionalsData || [])
      
      console.log('🎉 Todos os dados carregados com sucesso!')
    } catch (error) {
      console.error('❌ Erro geral ao carregar dados:', error)
      showNotification('error', 'Erro de Conexão', 'Erro ao conectar com o banco de dados. Verifique sua conexão.')
    }
  }

  const createCourse = async () => {
    const title = prompt('Título do curso:')
    const description = prompt('Descrição do curso:')
    
    if (!title || !description) return

    try {
      const { data, error } = await supabase
        .from('courses')
        .insert({
          title,
          description,
          modules: [],
          is_active: true
        })
        .select()
        .single()

      if (error) throw error
      
      setCourses([data, ...courses])
      showNotification('success', 'Curso Criado!', `"${title}" foi criado com sucesso!`)
    } catch (error) {
      console.error('Erro ao criar curso:', error)
      showNotification('error', 'Erro ao Criar Curso', 'Não foi possível criar o curso. Tente novamente.')
    }
  }

  const deleteCourse = async (courseId: string, courseTitle: string) => {
    if (!confirm(`Tem certeza que deseja excluir o curso "${courseTitle}"?\n\nEsta ação não pode ser desfeita e excluirá todos os módulos e materiais associados.`)) return

    try {
      console.log(`🗑️ Iniciando exclusão do curso: ${courseTitle} (ID: ${courseId})`)
      
      // Primeiro excluir todos os materiais dos módulos do curso
      const courseModules = modules.filter(m => m.course_id === courseId)
      console.log(`📄 Encontrados ${courseModules.length} módulos para excluir`)
      
      for (const courseModule of courseModules) {
        console.log(`🗑️ Excluindo materiais do módulo: ${courseModule.title}`)
        const { error: materialsError } = await supabase
          .from('course_materials')
          .delete()
          .eq('module_id', courseModule.id)

        if (materialsError) {
          console.error('❌ Erro ao excluir materiais:', materialsError)
          throw materialsError
        }
        console.log(`✅ Materiais do módulo ${courseModule.title} excluídos`)
      }

      // Depois excluir todos os módulos do curso
      console.log(`🗑️ Excluindo módulos do curso...`)
      const { error: modulesError } = await supabase
        .from('course_modules')
        .delete()
        .eq('course_id', courseId)

      if (modulesError) {
        console.error('❌ Erro ao excluir módulos:', modulesError)
        throw modulesError
      }
      console.log(`✅ Módulos do curso excluídos`)

      // Por fim excluir o curso
      console.log(`🗑️ Excluindo curso...`)
      const { error: courseError } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)

      if (courseError) {
        console.error('❌ Erro ao excluir curso:', courseError)
        throw courseError
      }
      console.log(`✅ Curso ${courseTitle} excluído com sucesso`)
      
      // Recarregar dados do banco para garantir sincronização
      await loadData()
      
      showNotification('success', 'Curso Excluído!', `"${courseTitle}" foi excluído com sucesso!`)
    } catch (error) {
      console.error('Erro ao excluir curso:', error)
      showNotification('error', 'Erro ao Excluir Curso', 'Não foi possível excluir o curso. Tente novamente.')
    }
  }

  const createModule = async (courseId: string) => {
    const title = prompt('Título do módulo:')
    const description = prompt('Descrição do módulo:')
    const duration = prompt('Duração (ex: 15 min):')
    
    if (!title || !description || !duration) return

    try {
      const { data, error } = await supabase
        .from('course_modules')
        .insert({
          course_id: courseId,
          title,
          description,
          duration,
          order_index: modules.length + 1,
          is_active: true
        })
        .select()
        .single()

      if (error) throw error
      
      setModules([...modules, data])
      showNotification('success', 'Módulo Criado!', `"${title}" foi criado com sucesso!`)
    } catch (error) {
      console.error('Erro ao criar módulo:', error)
      showNotification('error', 'Erro ao Criar Módulo', 'Não foi possível criar o módulo. Tente novamente.')
    }
  }

  const editModule = async (module: Module) => {
    const title = prompt('Título do módulo:', module.title)
    const description = prompt('Descrição do módulo:', module.description)
    const duration = prompt('Duração (ex: 15 min):', module.duration)
    const videoUrl = prompt('URL do vídeo (opcional):', module.video_url || '')
    
    if (!title || !description || !duration) return

    try {
      const { data, error } = await supabase
        .from('course_modules')
        .update({
          title,
          description,
          duration,
          video_url: videoUrl || null
        })
        .eq('id', module.id)
        .select()
        .single()

      if (error) throw error
      
      setModules(modules.map(m => m.id === module.id ? data : m))
      showNotification('success', 'Módulo Atualizado!', `"${title}" foi atualizado com sucesso!`)
    } catch (error) {
      console.error('Erro ao atualizar módulo:', error)
      showNotification('error', 'Erro ao Atualizar Módulo', 'Não foi possível atualizar o módulo. Tente novamente.')
    }
  }

  const deleteModule = async (moduleId: string) => {
    if (!confirm('Tem certeza que deseja excluir este módulo?')) return

    try {
      const { error } = await supabase
        .from('course_modules')
        .delete()
        .eq('id', moduleId)

      if (error) throw error
      
      setModules(modules.filter(m => m.id !== moduleId))
      showNotification('success', 'Módulo Excluído!', 'Módulo foi excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir módulo:', error)
      showNotification('error', 'Erro ao Excluir Módulo', 'Não foi possível excluir o módulo. Tente novamente.')
    }
  }

  const uploadMaterial = async (moduleId: string, category: string = 'document') => {
    const input = document.createElement('input')
    input.type = 'file'
    
    // Definir tipos aceitos baseado na categoria
    const acceptTypes = {
      document: '.pdf,.doc,.docx,.txt,.md',
      video: '.mp4,.webm,.mov,.avi',
      audio: '.mp3,.wav,.m4a,.ogg',
      image: '.jpg,.jpeg,.png,.gif,.svg',
      template: '.pdf,.doc,.docx,.xlsx,.pptx',
      checklist: '.pdf,.doc,.txt,.md'
    }
    
    input.accept = acceptTypes[category as keyof typeof acceptTypes] || '.pdf,.doc,.docx,.txt,.md'
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        // Validar tamanho do arquivo (100MB máximo)
        if (file.size > 100 * 1024 * 1024) {
          alert('Arquivo muito grande. Máximo 100MB.')
          return
        }

        // Upload do arquivo para Supabase Storage
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const filePath = `course-materials/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('course-materials')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        // Determinar tipo de arquivo baseado na extensão
        let fileType = 'unknown'
        if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(fileExt || '')) {
          fileType = 'document'
        } else if (['mp4', 'webm', 'mov', 'avi'].includes(fileExt || '')) {
          fileType = 'video'
        } else if (['mp3', 'wav', 'm4a', 'ogg'].includes(fileExt || '')) {
          fileType = 'audio'
        } else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(fileExt || '')) {
          fileType = 'image'
        }

        // Salvar metadados do material
        const { data, error } = await supabase
          .from('course_materials')
          .insert({
            module_id: moduleId,
            title: file.name,
            file_path: filePath,
            file_type: fileType,
            file_category: category,
            file_size: file.size,
            is_active: true
          })
          .select()
          .single()

        if (error) throw error
        
        setMaterials([data, ...materials])
        showNotification('success', 'Material Enviado!', `${fileType === 'video' ? 'Vídeo' : fileType === 'audio' ? 'Áudio' : 'Material'} enviado com sucesso!`)
      } catch (error) {
        console.error('Erro ao enviar material:', error)
        showNotification('error', 'Erro ao Enviar Material', 'Não foi possível enviar o material. Tente novamente.')
      }
    }
    
    input.click()
  }

  const toggleCourseStatus = async (courseId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_active: !currentStatus })
        .eq('id', courseId)

      if (error) throw error
      
      setCourses(courses.map(course => 
        course.id === courseId 
          ? { ...course, is_active: !currentStatus }
          : course
      ))
      
      showNotification('success', 'Status Alterado!', `Curso ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`)
    } catch (error) {
      console.error('Erro ao alterar status do curso:', error)
      showNotification('error', 'Erro ao Alterar Status', 'Não foi possível alterar o status do curso.')
    }
  }

  const toggleCourseExpansion = (courseId: string) => {
    const newExpanded = new Set(expandedCourses)
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId)
    } else {
      newExpanded.add(courseId)
    }
    setExpandedCourses(newExpanded)
  }

  const makeUserAdmin = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('professionals')
        .update({ is_admin: !currentStatus })
        .eq('id', userId)

      if (error) throw error
      
      setProfessionals(professionals.map(prof => 
        prof.id === userId 
          ? { ...prof, is_admin: !currentStatus }
          : prof
      ))
      
      showNotification('success', 'Status Admin Alterado!', `Usuário ${!currentStatus ? 'promovido a' : 'removido de'} administrador!`)
    } catch (error) {
      console.error('Erro ao alterar status de admin:', error)
      showNotification('error', 'Erro ao Alterar Status Admin', 'Não foi possível alterar o status de administrador.')
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('professionals')
        .update({ is_active: !currentStatus })
        .eq('id', userId)

      if (error) throw error
      
      setProfessionals(professionals.map(prof => 
        prof.id === userId 
          ? { ...prof, is_active: !currentStatus }
          : prof
      ))
      
      showNotification('success', 'Status Usuário Alterado!', `Usuário ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`)
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error)
      showNotification('error', 'Erro ao Alterar Status Usuário', 'Não foi possível alterar o status do usuário.')
    }
  }

  const addNewUser = async () => {
    if (!newUserData.name || !newUserData.email || !newUserData.password || !newUserData.adminPassword) {
      showNotification('warning', 'Campos Obrigatórios', 'Preencha todos os campos para criar o usuário.')
      return
    }

    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserData.email,
        password: newUserData.password,
        options: {
          data: {
            name: newUserData.name
          }
        }
      })

      if (authError) throw authError

      if (authData.user) {
        // Criar perfil profissional
        const { data: professionalData, error: professionalError } = await supabase
          .from('professionals')
          .insert({
            id: authData.user.id,
            name: newUserData.name,
            email: newUserData.email,
            is_active: true,
            is_admin: true,
            admin_password: newUserData.adminPassword // Será criptografado pelo trigger
          })
          .select()
          .single()

        if (professionalError) throw professionalError

        setProfessionals([professionalData, ...professionals])
        setShowAddUserModal(false)
        setNewUserData({ name: '', email: '', password: '', adminPassword: '' })
        
        showNotification('success', 'Usuário Criado!', `${newUserData.name} foi criado como administrador!`)
      }
    } catch (error: unknown) {
      console.error('Erro ao criar usuário:', error)
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível criar o usuário.'
      showNotification('error', 'Erro ao Criar Usuário', errorMessage)
    }
  }

  const handleLogout = async () => {
    // Limpar sessão administrativa
    localStorage.removeItem('admin_session')
    
    // Fazer logout do Supabase Auth se estiver logado
    await supabase.auth.signOut()
    
    // Redirecionar para login administrativo
    window.location.href = '/admin/login'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando área administrativa...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <HerbaleadLogo size="lg" variant="horizontal" responsive={true} />
              <button 
                onClick={() => window.location.href = '/admin/login'}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Fazer Login
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Acesso Restrito
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Esta área é restrita a administradores.
            </p>
            <button 
              onClick={() => window.location.href = '/admin/login'}
              className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Fazer Login
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sistema de Notificações */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => {
          const getIcon = () => {
            switch (notification.type) {
              case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />
              case 'error': return <XCircle className="w-5 h-5 text-red-600" />
              case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />
              case 'info': return <AlertCircle className="w-5 h-5 text-blue-600" />
              default: return <AlertCircle className="w-5 h-5 text-gray-600" />
            }
          }

          const getBgColor = () => {
            switch (notification.type) {
              case 'success': return 'bg-green-50 border-green-200'
              case 'error': return 'bg-red-50 border-red-200'
              case 'warning': return 'bg-yellow-50 border-yellow-200'
              case 'info': return 'bg-blue-50 border-blue-200'
              default: return 'bg-gray-50 border-gray-200'
            }
          }

          const getTextColor = () => {
            switch (notification.type) {
              case 'success': return 'text-green-800'
              case 'error': return 'text-red-800'
              case 'warning': return 'text-yellow-800'
              case 'info': return 'text-blue-800'
              default: return 'text-gray-800'
            }
          }

          return (
            <div
              key={notification.id}
              className={`max-w-sm w-full ${getBgColor()} border rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {getIcon()}
                </div>
                <div className="ml-3 flex-1">
                  <h3 className={`text-sm font-medium ${getTextColor()}`}>
                    {notification.title}
                  </h3>
                  <p className={`mt-1 text-sm ${getTextColor()} opacity-90`}>
                    {notification.message}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className={`inline-flex ${getTextColor()} hover:opacity-75`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <HerbaleadLogo size="lg" variant="horizontal" responsive={true} />
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.email}</span>
              <button 
                onClick={handleLogout}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🛠️ Painel Administrativo
          </h1>
          <p className="text-gray-600">
            Gerencie cursos, usuários e configurações do sistema
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
              { id: 'courses', name: 'Cursos', icon: BookOpen },
              { id: 'materials', name: 'Materiais', icon: Upload },
              { id: 'users', name: 'Usuários', icon: Users },
              { id: 'settings', name: 'Configurações', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Visão Geral</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <BookOpen className="w-8 h-8 text-emerald-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total de Cursos</p>
                    <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total de Módulos</p>
                    <p className="text-2xl font-bold text-gray-900">{modules.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total de Usuários</p>
                    <p className="text-2xl font-bold text-gray-900">{professionals.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <Download className="w-8 h-8 text-orange-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total de Downloads</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {materials.reduce((sum, m) => sum + m.download_count, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cursos */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Cursos</h2>
              <button
                onClick={createCourse}
                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Curso
              </button>
            </div>

            <div className="grid gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <button
                          onClick={() => toggleCourseExpansion(course.id)}
                          className="mr-2 p-1 hover:bg-gray-100 rounded"
                          title={expandedCourses.has(course.id) ? 'Recolher módulos' : 'Expandir módulos'}
                        >
                          {expandedCourses.has(course.id) ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        <h3 className="text-xl font-semibold text-gray-900 mr-3">
                          {course.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          course.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {course.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{course.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {modules.filter(m => m.course_id === course.id).length} módulos
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => createModule(course.id)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                        title="Adicionar módulo"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleCourseStatus(course.id, course.is_active)}
                        className={`p-2 rounded-lg ${
                          course.is_active 
                            ? 'text-red-600 hover:bg-red-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={course.is_active ? 'Desativar curso' : 'Ativar curso'}
                      >
                        {course.is_active ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteCourse(course.id, course.title)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Excluir curso"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Módulos do Curso - Só mostra quando expandido */}
                  {expandedCourses.has(course.id) && (
                    <div className="mt-4 space-y-3">
                      {modules.filter(m => m.course_id === course.id).map((module) => (
                        <div key={module.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-emerald-500">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <h4 className="text-lg font-semibold text-gray-900 mr-3">
                                  {module.title}
                                </h4>
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                  {module.duration}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-2">{module.description}</p>
                              <div className="flex items-center text-sm text-gray-500">
                                <FileText className="w-4 h-4 mr-1" />
                                {materials.filter(m => m.module_id === module.id).length} materiais
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => uploadMaterial(module.id, 'document')}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Enviar documento (PDF, DOC)"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => uploadMaterial(module.id, 'video')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Enviar vídeo (MP4, WebM)"
                              >
                                <Video className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => uploadMaterial(module.id, 'audio')}
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                                title="Enviar áudio (MP3, WAV)"
                              >
                                <Users className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => editModule(module)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Editar módulo"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteModule(module.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Excluir módulo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Materiais */}
        {activeTab === 'materials' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Materiais</h2>
            
            <div className="grid gap-4">
              {materials.map((material) => {
                const getIcon = (type: string) => {
                  switch (type) {
                    case 'video': return <Video className="w-8 h-8 text-red-600" />
                    case 'audio': return <Users className="w-8 h-8 text-purple-600" />
                    case 'image': return <Eye className="w-8 h-8 text-green-600" />
                    default: return <FileText className="w-8 h-8 text-blue-600" />
                  }
                }
                
                const getTypeColor = (type: string) => {
                  switch (type) {
                    case 'video': return 'bg-red-100 text-red-800'
                    case 'audio': return 'bg-purple-100 text-purple-800'
                    case 'image': return 'bg-green-100 text-green-800'
                    default: return 'bg-blue-100 text-blue-800'
                  }
                }
                
                return (
                  <div key={material.id} className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getIcon(material.file_type)}
                        <div className="ml-3">
                          <h3 className="font-semibold text-gray-900">{material.title}</h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(material.file_type)}`}>
                              {material.file_type.toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-500">
                              {(material.file_size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {material.download_count} downloads
                        </span>
                        <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Usuários */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Usuários</h2>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Novo Usuário Admin
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {professionals.map((professional) => (
                    <tr key={professional.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {professional.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {professional.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          professional.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {professional.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          professional.is_admin 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {professional.is_admin ? 'Admin' : 'Usuário'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => toggleUserStatus(professional.id, professional.is_active)}
                          className={`p-2 rounded-lg ${
                            professional.is_active 
                              ? 'text-red-600 hover:bg-red-50' 
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={professional.is_active ? 'Desativar usuário' : 'Ativar usuário'}
                        >
                          {professional.is_active ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => makeUserAdmin(professional.id, professional.is_admin)}
                          className={`p-2 rounded-lg ${
                            professional.is_admin 
                              ? 'text-orange-600 hover:bg-orange-50' 
                              : 'text-purple-600 hover:bg-purple-50'
                          }`}
                          title={professional.is_admin ? 'Remover admin' : 'Tornar admin'}
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Configurações */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistema</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Versão do Sistema</p>
                    <p className="text-sm text-gray-500">HerbaLead v1.0.0</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Ativo
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Banco de Dados</p>
                    <p className="text-sm text-gray-500">Supabase PostgreSQL</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Conectado
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Storage</p>
                    <p className="text-sm text-gray-500">Supabase Storage</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Ativo
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal para Adicionar Novo Usuário */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Novo Usuário Administrador</h3>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ex: João Silva"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ex: joao@exemplo.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha do Sistema
                </label>
                <input
                  type="password"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Senha para login normal"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha Administrativa
                </label>
                <input
                  type="password"
                  value={newUserData.adminPassword}
                  onChange={(e) => setNewUserData({...newUserData, adminPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Senha para área administrativa"
                />
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={addNewUser}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                Criar Usuário
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}