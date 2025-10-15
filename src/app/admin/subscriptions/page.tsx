'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  UserCheck,
  CreditCard,
  Download,
  RefreshCw,
  Settings,
  BarChart3,
  PieChart
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalUsers: number
  activeSubscriptions: number
  monthlyRevenue: number
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
  stripe_customer_id: string
  created_at: string
  subscriptions: Array<{
    id: string
    status: string
    plan_type: string
    current_period_end: string
    cancel_at_period_end: boolean
  }>
}

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  description: string
  created_at: string
  subscriptions: {
    user_id: string
    professionals: {
      name: string
      email: string
    }
  }
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  
  // Filtros
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes, paymentsRes] = await Promise.all([
        fetch('/api/admin?action=dashboard'),
        fetch('/api/admin?action=users'),
        fetch('/api/admin?action=payments')
      ])

      const [statsData, usersData, paymentsData] = await Promise.all([
        statsRes.json(),
        usersRes.json(),
        paymentsRes.json()
      ])

      setStats(statsData)
      setUsers(usersData.users || [])
      setPayments(paymentsData.payments || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (action: string, userId: string, subscriptionId?: string, newPlan?: string) => {
    setActionLoading(action)
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          userId,
          subscriptionId,
          newPlan
        })
      })

      const result = await response.json()
      
      if (result.success) {
        alert(result.message)
        await loadDashboardData() // Recarregar dados
      } else {
        alert('Erro: ' + result.error)
      }
    } catch (error) {
      console.error('Erro na ação:', error)
      alert('Erro ao processar ação')
    } finally {
      setActionLoading(null)
    }
  }

  const handleGiveGracePeriod = async (userId: string) => {
    setActionLoading(userId)
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'give_grace_period',
          userId: userId,
          days: 10
        })
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        await loadDashboardData()
        alert(result.message || 'Período de graça de 10 dias concedido com sucesso!')
      } else {
        alert('Erro: ' + (result.error || result.message || 'Erro desconhecido'))
      }
    } catch (error) {
      console.error('Erro ao conceder período de graça:', error)
      alert('Erro ao conceder período de graça: ' + (error instanceof Error ? error.message : 'Erro desconhecido'))
    } finally {
      setActionLoading(null)
    }
  }

  const formatCurrency = (amount: number, currency: string = 'brl') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'canceled': return 'text-red-600 bg-red-50'
      case 'past_due': return 'text-yellow-600 bg-yellow-50'
      case 'inactive': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo'
      case 'canceled': return 'Cancelado'
      case 'past_due': return 'Em Atraso'
      case 'inactive': return 'Inativo'
      case 'unpaid': return 'Não Pago'
      default: return status
    }
  }

  // Função para filtrar usuários
  const getFilteredUsers = () => {
    return users.filter(user => {
      // Filtro por status
      if (statusFilter !== 'all' && user.subscription_status !== statusFilter) {
        return false
      }

      // Filtro por plano
      const userPlan = user.subscriptions?.[0]?.plan_type || user.subscription_plan
      if (planFilter !== 'all' && userPlan !== planFilter) {
        return false
      }

      // Filtro por busca (nome ou email)
      if (searchTerm && !user.name?.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !user.email?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Filtro por data
      if (dateFilter !== 'all') {
        const userDate = new Date(user.created_at)
        const now = new Date()
        const daysDiff = Math.floor((now.getTime() - userDate.getTime()) / (1000 * 60 * 60 * 24))
        
        switch (dateFilter) {
          case 'today':
            if (daysDiff !== 0) return false
            break
          case 'week':
            if (daysDiff > 7) return false
            break
          case 'month':
            if (daysDiff > 30) return false
            break
          case 'year':
            if (daysDiff > 365) return false
            break
        }
      }

      return true
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando dados administrativos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-sm text-gray-600">Gestão de usuários e assinaturas</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center"
            >
              <Settings className="w-4 h-4 mr-2" />
              Voltar ao Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
              { id: 'users', name: 'Usuários', icon: Users },
              { id: 'payments', name: 'Pagamentos', icon: CreditCard },
              { id: 'reports', name: 'Relatórios', icon: PieChart }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
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

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Assinaturas Ativas</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Receita (30 dias)</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
              <div className="space-y-3">
                {payments.slice(0, 5).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        payment.status === 'succeeded' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">
                          {payment.subscriptions?.professionals?.name || 'Usuário'}
                        </p>
                        <p className="text-sm text-gray-600">{payment.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(payment.amount, payment.currency)}</p>
                      <p className="text-sm text-gray-600">{formatDate(payment.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Gestão de Usuários</h3>
            </div>
            
            {/* Filtros */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Busca por nome/email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                  <input
                    type="text"
                    placeholder="Nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Filtro por status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">Todos os status</option>
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                    <option value="past_due">Em Atraso</option>
                    <option value="canceled">Cancelado</option>
                    <option value="unpaid">Não Pago</option>
                  </select>
                </div>

                {/* Filtro por plano */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plano</label>
                  <select
                    value={planFilter}
                    onChange={(e) => setPlanFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">Todos os planos</option>
                    <option value="monthly">Mensal</option>
                    <option value="yearly">Anual</option>
                  </select>
                </div>

                {/* Filtro por data */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Cadastro</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">Todas as datas</option>
                    <option value="today">Hoje</option>
                    <option value="week">Última semana</option>
                    <option value="month">Último mês</option>
                    <option value="year">Último ano</option>
                  </select>
                </div>
              </div>
              
              {/* Contador de resultados */}
              <div className="mt-3 text-sm text-gray-600">
                Mostrando {getFilteredUsers().length} de {users.length} usuários
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plano</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cadastro</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período de Graça</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredUsers().map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name || 'Sem nome'}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.subscription_status)}`}>
                          {getStatusText(user.subscription_status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.subscriptions?.[0]?.plan_type === 'monthly' ? 'Mensal' : 
                         user.subscriptions?.[0]?.plan_type === 'yearly' ? 'Anual' : 
                         user.subscription_plan === 'monthly' ? 'Mensal' :
                         user.subscription_plan === 'yearly' ? 'Anual' : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.subscription_status === 'active' && user.grace_period_end ? (
                          <div>
                            <div className="text-xs text-purple-600">Período de graça</div>
                            <div className="text-xs">{formatDate(user.grace_period_end)}</div>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {user.subscription_status === 'active' ? (
                          <button
                            onClick={() => handleUserAction('deactivate_user', user.id)}
                            disabled={actionLoading === 'deactivate_user'}
                            className="text-red-600 hover:text-red-900"
                          >
                            Desativar
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserAction('activate_user', user.id)}
                            disabled={actionLoading === 'activate_user'}
                            className="text-green-600 hover:text-green-900"
                          >
                            Ativar
                          </button>
                        )}
                        
                        {user.subscriptions?.[0] && (
                          <>
                            <button
                              onClick={() => handleUserAction('change_plan', user.id, user.subscriptions[0].id, 
                                user.subscription_plan === 'monthly' ? 'yearly' : 'monthly')}
                              disabled={actionLoading === 'change_plan'}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Alterar Plano
                            </button>
                            
                            <button
                              onClick={() => handleUserAction('cancel_subscription', user.id, user.subscriptions[0].id)}
                              disabled={actionLoading === 'cancel_subscription'}
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                        
                        {/* Botão de período de graça */}
                        <button
                          onClick={() => handleGiveGracePeriod(user.id)}
                          disabled={actionLoading === user.id}
                          className="text-purple-600 hover:text-purple-900 ml-2"
                          title="Conceder 10 dias de período de graça"
                        >
                          {actionLoading === user.id ? '...' : '10 dias'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Histórico de Pagamentos</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.subscriptions?.professionals?.name || 'Usuário'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.subscriptions?.professionals?.email || 'Email não disponível'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(payment.amount, payment.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.status === 'succeeded' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                        }`}>
                          {payment.status === 'succeeded' ? 'Pago' : 'Falhou'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payment.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatórios Financeiros</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <Download className="w-6 h-6 text-emerald-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Exportar Usuários</h4>
                  <p className="text-sm text-gray-600">CSV com todos os usuários</p>
                </button>
                
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <Download className="w-6 h-6 text-emerald-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Exportar Pagamentos</h4>
                  <p className="text-sm text-gray-600">CSV com histórico de pagamentos</p>
                </button>
                
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <BarChart3 className="w-6 h-6 text-emerald-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Relatório Mensal</h4>
                  <p className="text-sm text-gray-600">Análise de receita e churn</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
