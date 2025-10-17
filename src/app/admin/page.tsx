'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Link, 
  BarChart3, 
  TrendingUp, 
  Eye, 
  UserCheck, 
  UserX,
  Calendar,
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalLinks: number
  activeSubscriptions: number
  recentUsers: number
  conversionRate: string
}

interface User {
  id: string
  name: string
  email: string
  phone: string
  subscription_status: string
  subscription_plan: string
  created_at: string
  professional_links: Link[]
}

interface Link {
  id: string
  link_name: string
  tool_name: string
  cta_text: string
  created_at: string
}

interface ToolStats {
  toolStats: [string, number][]
  totalLinks: number
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [links, setLinks] = useState<any[]>([])
  const [toolStats, setToolStats] = useState<ToolStats | null>(null)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'links' | 'stats'>('dashboard')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Verificar se já está autenticado
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      setIsAuthenticated(true)
      loadDashboard()
    }
  }, [])

  const authenticate = async () => {
    if (!password) {
      setError('Digite a senha')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin?action=dashboard', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      })

      if (response.ok) {
        localStorage.setItem('admin_token', password)
        setIsAuthenticated(true)
        loadDashboard()
      } else {
        setError('Senha incorreta')
      }
    } catch (err) {
      setError('Erro ao autenticar')
    } finally {
      setLoading(false)
    }
  }

  const loadDashboard = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      const response = await fetch('/api/admin?action=dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err)
    }
  }

  const loadUsers = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      const response = await fetch('/api/admin?action=users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (err) {
      console.error('Erro ao carregar usuários:', err)
    }
  }

  const loadLinks = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      const response = await fetch('/api/admin?action=links', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setLinks(data.links)
      }
    } catch (err) {
      console.error('Erro ao carregar links:', err)
    }
  }

  const loadStats = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      const response = await fetch('/api/admin?action=stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setToolStats(data)
      }
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err)
    }
  }

  const handleTabChange = (tab: 'dashboard' | 'users' | 'links' | 'stats') => {
    setActiveTab(tab)
    
    if (tab === 'users') loadUsers()
    if (tab === 'links') loadLinks()
    if (tab === 'stats') loadStats()
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    setIsAuthenticated(false)
    setPassword('')
  }

  const getToolDisplayName = (toolName: string) => {
    const toolNames: Record<string, string> = {
      'bmi': 'Calculadora IMC',
      'protein': 'Calculadora de Proteína',
      'hydration': 'Calculadora de Hidratação',
      'body-composition': 'Composição Corporal',
      'meal-planner': 'Planejador de Refeições',
      'nutrition-assessment': 'Avaliação Nutricional',
      'wellness-profile': 'Quiz: Perfil de Bem-Estar',
      'daily-wellness': 'Tabela: Bem-Estar Diário',
      'healthy-eating': 'Quiz: Alimentação Saudável'
    }
    return toolNames[toolName] || toolName
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="text-gray-600 mt-2">HerbaLead</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha de Administrador
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && authenticate()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite a senha"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={authenticate}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Autenticando...' : 'Entrar'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-600">HerbaLead - Gestão de Usuários e Links</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'users', label: 'Usuários', icon: Users },
              { id: 'links', label: 'Links', icon: Link },
              { id: 'stats', label: 'Estatísticas', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleTabChange(id as any)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Link className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total de Links</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalLinks}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <UserCheck className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Assinaturas Ativas</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Resumo da Plataforma</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Usuários Recentes</h4>
                    <p className="text-3xl font-bold text-blue-600">{stats.recentUsers}</p>
                    <p className="text-sm text-gray-600">Últimos 7 dias</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Links por Usuário</h4>
                    <p className="text-3xl font-bold text-green-600">
                      {stats.totalUsers > 0 ? (stats.totalLinks / stats.totalUsers).toFixed(1) : 0}
                    </p>
                    <p className="text-sm text-gray-600">Média por usuário</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Usuários e Seus Links</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Links Criados
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cadastro
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.phone && (
                            <div className="text-sm text-gray-500">{user.phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.subscription_status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.subscription_status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                        {user.subscription_plan && (
                          <div className="text-xs text-gray-500 mt-1">{user.subscription_plan}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.professional_links?.length || 0} links</div>
                        {user.professional_links && user.professional_links.length > 0 && (
                          <div className="text-xs text-gray-500">
                            {user.professional_links.slice(0, 2).map(link => getToolDisplayName(link.tool_name)).join(', ')}
                            {user.professional_links.length > 2 && ` +${user.professional_links.length - 2} mais`}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'links' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Todos os Links Criados</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Link
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ferramenta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Criado por
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {links.map((link) => (
                    <tr key={link.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{link.link_name}</div>
                          <div className="text-sm text-gray-500">{link.cta_text}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {getToolDisplayName(link.tool_name)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{link.professionals?.name}</div>
                          <div className="text-sm text-gray-500">{link.professionals?.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(link.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'stats' && toolStats && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Ferramentas Mais Utilizadas</h3>
              <div className="space-y-4">
                {toolStats.toolStats.map(([tool, count], index) => (
                  <div key={tool} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-600 mr-4">#{index + 1}</span>
                      <span className="text-sm font-medium text-gray-900">{getToolDisplayName(tool)}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(count / toolStats.totalLinks) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo das Estatísticas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{toolStats.totalLinks}</div>
                  <div className="text-sm text-gray-600">Total de Links</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{toolStats.toolStats.length}</div>
                  <div className="text-sm text-gray-600">Ferramentas Diferentes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {toolStats.totalLinks > 0 ? (toolStats.totalLinks / toolStats.toolStats.length).toFixed(1) : 0}
                  </div>
                  <div className="text-sm text-gray-600">Média por Ferramenta</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}