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
  X,
  Edit3,
  GripVertical
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
  pdf_materials?: string
  pdf_files?: string[]
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
  email: string | undefined
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
  const [showBulkEditModal, setShowBulkEditModal] = useState(false)
  const [, setSelectedCourseForBulkEdit] = useState<string | null>(null)
  const [editingModules, setEditingModules] = useState<Module[]>([])
  const [showAddModuleModal, setShowAddModuleModal] = useState(false)
  const [showEditModuleModal, setShowEditModuleModal] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [moduleFormData, setModuleFormData] = useState({
    title: '',
    description: '',
    duration: '',
    video_url: '',
    pdf_materials: ''
  })
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null)

  useEffect(() => {
    checkAdminAccess()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Função para mostrar notificações
  const showNotification = (type: Notification['type'], title: string, message: string, duration: number = 5000) => {
    console.log('🔔 showNotification chamada:', { type, title, message })
    const id = Date.now().toString()
    const notification: Notification = { id, type, title, message, duration }
    
    console.log('📝 Adicionando notificação:', notification)
    setNotifications(prev => {
      const newNotifications = [...prev, notification]
      console.log('📋 Total de notificações:', newNotifications.length)
      return newNotifications
    })
    
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
        setUser({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name,
          is_admin: false
        })
        
        // Verificar se usuário é admin
        const { data: professional } = await supabase
          .from('professionals')
          .select('is_active, email, is_admin')
          .eq('id', user.id)
          .single()

        setIsAdmin(professional?.is_admin || false)
        
        if (professional?.is_admin) {
          setUser({ 
            id: user.id, 
            email: user.email || '', 
            name: user.user_metadata?.name,
            is_admin: professional.is_admin 
          })
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
      console.log('=== CARREGANDO DADOS DO SUPABASE ===')
      
      // Carregar cursos
      console.log('Carregando cursos...')
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })

      if (coursesError) {
        console.error('ERRO AO CARREGAR CURSOS:', coursesError)
        alert('ERRO: Não foi possível carregar os cursos')
        return
      }

      console.log('CURSOS CARREGADOS:', coursesData?.length || 0, coursesData)
      setCourses(coursesData || [])

      // Carregar módulos
      console.log('Carregando módulos...')
      const { data: modulesData, error: modulesError } = await supabase
        .from('course_modules')
        .select('*')
        .order('order_index', { ascending: true })

      if (modulesError) {
        console.error('ERRO AO CARREGAR MÓDULOS:', modulesError)
        alert('ERRO: Não foi possível carregar os módulos')
        return
      }

      console.log('MÓDULOS CARREGADOS:', modulesData?.length || 0, modulesData)
      setModules(modulesData || [])

      // Carregar materiais
      console.log('Carregando materiais...')
      const { data: materialsData, error: materialsError } = await supabase
        .from('course_materials')
        .select('*')
        .order('created_at', { ascending: false })

      if (materialsError) {
        console.error('ERRO AO CARREGAR MATERIAIS:', materialsError)
        alert('ERRO: Não foi possível carregar os materiais')
        return
      }

      console.log('MATERIAIS CARREGADOS:', materialsData?.length || 0, materialsData)
      setMaterials(materialsData || [])

      // Carregar profissionais
      console.log('Carregando profissionais...')
      const { data: professionalsData, error: professionalsError } = await supabase
        .from('professionals')
        .select('*')
        .order('created_at', { ascending: false })

      if (professionalsError) {
        console.error('ERRO AO CARREGAR PROFISSIONAIS:', professionalsError)
        alert('ERRO: Não foi possível carregar os profissionais')
        return
      }

      console.log('PROFISSIONAIS CARREGADOS:', professionalsData?.length || 0, professionalsData)
      setProfessionals(professionalsData || [])
      
      console.log('=== TODOS OS DADOS CARREGADOS COM SUCESSO ===')
    } catch (error) {
      console.error('ERRO GERAL AO CARREGAR DADOS:', error)
      alert('ERRO GERAL: ' + (error as Error).message)
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
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-8 text-white shadow-lg">
            <h1 className="text-4xl font-bold mb-2">
              🛠️ Painel Administrativo
            </h1>
            <p className="text-emerald-100 text-lg">
              Gerencie cursos, usuários e configurações do sistema
            </p>
            <div className="mt-4 flex items-center space-x-4">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="text-sm font-medium">Sistema Ativo</span>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="text-sm font-medium">Versão 2.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <nav className="flex">
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
                className={`flex items-center py-4 px-6 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
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
                onClick={() => alert('Funcionalidade de criar curso será implementada')}
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Usuários */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Usuários</h2>
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
                    <p className="text-sm text-gray-500">HerbaLead v2.0.0</p>
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
    </div>
  )
}
