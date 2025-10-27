'use client'

import { useState, useEffect } from 'react'
import { Phone, Users, DollarSign, Calendar, Download, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface PaidUser {
  id: string
  name: string
  email: string
  phone: string
  subscription_status: string
  plan_type: string
  created_at: string
  last_payment_date: string
  total_paid: number
}

export default function PaidUsersPhones() {
  const [users, setUsers] = useState<PaidUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showPhones, setShowPhones] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [stats, setStats] = useState({
    totalPaidUsers: 0,
    monthlyUsers: 0,
    yearlyUsers: 0,
    totalRevenue: 0
  })

  useEffect(() => {
    loadPaidUsers()
  }, [])

  const loadPaidUsers = async () => {
    try {
      setLoading(true)
      
      // Buscar usuários que pagaram (têm assinatura ativa)
      const { data: paidUsers, error } = await supabase
        .from('professionals')
        .select(`
          id,
          name,
          email,
          phone,
          subscription_status,
          created_at,
          subscriptions!inner(
            id,
            status,
            plan_type,
            payment_source,
            current_period_end,
            created_at
          ),
          payments(
            id,
            amount,
            created_at,
            status
          )
        `)
        .eq('subscription_status', 'active')
        .eq('subscriptions.status', 'active')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao carregar usuários:', error)
        return
      }

      // Processar dados
      const processedUsers = paidUsers?.map(user => {
        const latestPayment = user.payments?.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0]

        const totalPaid = user.payments?.reduce((sum: number, payment: any) => 
          sum + (payment.amount || 0), 0
        ) || 0

        return {
          id: user.id,
          name: user.name || 'Nome não informado',
          email: user.email,
          phone: user.phone || 'Telefone não informado',
          subscription_status: user.subscription_status,
          plan_type: user.subscriptions?.[0]?.plan_type || 'unknown',
          created_at: user.created_at,
          last_payment_date: latestPayment?.created_at || user.created_at,
          total_paid: totalPaid
        }
      }) || []

      setUsers(processedUsers)

      // Calcular estatísticas
      const monthlyUsers = processedUsers.filter(u => u.plan_type === 'monthly').length
      const yearlyUsers = processedUsers.filter(u => u.plan_type === 'yearly').length
      const totalRevenue = processedUsers.reduce((sum, user) => sum + user.total_paid, 0)

      setStats({
        totalPaidUsers: processedUsers.length,
        monthlyUsers,
        yearlyUsers,
        totalRevenue
      })

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm)
    
    const matchesPlan = planFilter === 'all' || user.plan_type === planFilter
    
    return matchesSearch && matchesPlan
  })

  const exportToCSV = () => {
    const csvContent = [
      ['Nome', 'Email', 'Telefone', 'Plano', 'Data do Pagamento', 'Valor Total Pago'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.phone,
        user.plan_type === 'monthly' ? 'Mensal' : 'Anual',
        new Date(user.last_payment_date).toLocaleDateString('pt-BR'),
        `R$ ${(user.total_paid / 100).toFixed(2)}`
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `usuarios_pagantes_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatPhone = (phone: string) => {
    if (!phone || phone === 'Telefone não informado') return phone
    
    // Remover caracteres não numéricos
    const numbers = phone.replace(/\D/g, '')
    
    // Formatar telefone brasileiro
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
    } else if (numbers.length === 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    }
    
    return phone
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Phone className="w-8 h-8 text-green-600 mr-3" />
                Telefones de Usuários Pagantes
              </h1>
              <p className="text-gray-600 mt-2">
                Lista de todos os usuários que realizaram pagamentos
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPhones(!showPhones)}
                className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                  showPhones 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {showPhones ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showPhones ? 'Ocultar Telefones' : 'Mostrar Telefones'}
              </button>
              
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </button>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Total Pagantes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPaidUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Plano Mensal</p>
                <p className="text-2xl font-bold text-gray-900">{stats.monthlyUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Plano Anual</p>
                <p className="text-2xl font-bold text-gray-900">{stats.yearlyUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-emerald-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {(stats.totalRevenue / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="sm:w-48">
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Todos os Planos</option>
                <option value="monthly">Mensal</option>
                <option value="yearly">Anual</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
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
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plano
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Pagamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Pago
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {showPhones ? formatPhone(user.phone) : '•••••••••••'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.plan_type === 'yearly' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.plan_type === 'yearly' ? 'Anual' : 'Mensal'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(user.last_payment_date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {(user.total_paid / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum usuário encontrado</p>
            </div>
          )}
        </div>

        {/* Informações de Segurança */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <EyeOff className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Informações Sensíveis
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Os telefones são informações sensíveis. Use o botão "Mostrar Telefones" apenas quando necessário.
                  Os dados são protegidos e não são expostos publicamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
