'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Plus, Link as LinkIcon, Users, TrendingUp, Calendar, Settings } from 'lucide-react'

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showCreateLinkModal, setShowCreateLinkModal] = useState(false)
  const [newLink, setNewLink] = useState({
    project_name: '',
    tool_name: 'bmi',
    cta_text: 'Falar com Especialista',
    redirect_url: '',
    custom_message: 'Quer receber orientações personalizadas? Clique abaixo e fale comigo!'
  })
  const [isCreatingLink, setIsCreatingLink] = useState(false)

  // Função para criar novo link
  const handleCreateLink = async () => {
    if (!newLink.project_name.trim()) {
      alert('Por favor, digite um nome para o projeto')
      return
    }
    if (!newLink.redirect_url.trim()) {
      alert('Por favor, digite uma URL de redirecionamento (WhatsApp, site, etc.)')
      return
    }

    setIsCreatingLink(true)
    try {
      // Simular criação de link (aqui você integraria com sua API)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Gerar URL personalizada
      const customSlug = newLink.project_name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 30)
      
      const customUrl = `https://herbalead.com/link/${customSlug}`
      
      alert(`Link criado com sucesso!\n\nURL: ${customUrl}\n\nCopie e compartilhe este link para gerar leads!`)
      
      // Reset form
      setNewLink({
        project_name: '',
        tool_name: 'bmi',
        cta_text: 'Falar com Especialista',
        redirect_url: '',
        custom_message: 'Quer receber orientações personalizadas? Clique abaixo e fale comigo!'
      })
      setShowCreateLinkModal(false)
      
    } catch (error) {
      console.error('Erro ao criar link:', error)
      alert('Erro ao criar link. Tente novamente.')
    } finally {
      setIsCreatingLink(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-600">
                Herbalead
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Usuário</span>
              <Link href="/login" className="text-gray-500 hover:text-gray-700">
                Sair
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('links')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'links'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Meus Links
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'leads'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Leads
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Configurações
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <LinkIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Links Criados</p>
                    <p className="text-2xl font-semibold text-gray-900">3</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Leads Coletados</p>
                    <p className="text-2xl font-semibold text-gray-900">12</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Conversões</p>
                    <p className="text-2xl font-semibold text-gray-900">25%</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg shadow p-6 border border-orange-200">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-orange-600">Dias Restantes</p>
                    <p className="text-2xl font-semibold text-orange-700">7</p>
                    <p className="text-xs text-orange-500">Período de teste</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setShowCreateLinkModal(true)}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-5 h-5 text-green-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Criar Novo Link</p>
                    <p className="text-sm text-gray-600">Gere um link personalizado para suas ferramentas</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => window.open('/quiz-builder', '_blank')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-5 h-5 text-purple-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Criar Quiz</p>
                    <p className="text-sm text-gray-600">Construa um quiz personalizado</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveTab('links')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Ver Relatórios</p>
                    <p className="text-sm text-gray-600">Acompanhe o desempenho dos seus links</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
              <div className="space-y-4">
                {/* Atividade de Exemplo */}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Novo lead coletado</p>
                    <p className="text-xs text-gray-500">Maria Silva completou o quiz "Desafio 7 Dias - IMC"</p>
                  </div>
                  <span className="text-xs text-gray-400">há 2h</span>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <LinkIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Link criado</p>
                    <p className="text-xs text-gray-500">"Desafio 7 Dias - IMC" foi criado e está ativo</p>
                  </div>
                  <span className="text-xs text-gray-400">há 1 dia</span>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Conversão realizada</p>
                    <p className="text-xs text-gray-500">João Santos entrou em contato via WhatsApp</p>
                  </div>
                  <span className="text-xs text-gray-400">há 2 dias</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'links' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Meus Links</h3>
              <button 
                onClick={() => setShowCreateLinkModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Link
              </button>
            </div>
            
            {/* Lista de Links (simulada) */}
            <div className="space-y-4">
              {/* Link de Exemplo */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Desafio 7 Dias - IMC</h4>
                    <p className="text-sm text-gray-600">Calculadora de IMC</p>
                    <p className="text-xs text-gray-500 mt-1">
                      https://herbalead.com/link/desafio-7-dias-imc
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Ativo
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      Copiar
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center text-xs text-gray-500">
                  <span>0 cliques</span>
                  <span className="mx-2">•</span>
                  <span>0 leads</span>
                  <span className="mx-2">•</span>
                  <span>Criado há 2 dias</span>
                </div>
              </div>

              {/* Estado vazio (comentado para mostrar exemplo) */}
              {/* <div className="text-center py-8">
                <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Nenhum link criado ainda</p>
                <p className="text-sm text-gray-400">Crie seu primeiro link personalizado para começar a gerar leads</p>
              </div> */}
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Leads Coletados</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  Exportar
                </button>
                <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Filtrar
                </button>
              </div>
            </div>
            
            {/* Lista de Leads (simulada) */}
            <div className="space-y-4">
              {/* Lead de Exemplo */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Maria Silva</h4>
                    <p className="text-sm text-gray-600">maria.silva@email.com</p>
                    <p className="text-xs text-gray-500 mt-1">
                      IMC: 24.2 • Peso Normal • 28 anos
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Novo
                    </span>
                    <span className="text-xs text-gray-500">há 2h</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                  <span>Fonte: Desafio 7 Dias - IMC</span>
                  <span>•</span>
                  <span>WhatsApp: (11) 99999-9999</span>
                </div>
              </div>

              {/* Estado vazio (comentado para mostrar exemplo) */}
              {/* <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Nenhum lead coletado ainda</p>
                <p className="text-sm text-gray-400">Compartilhe seus links para começar a receber leads</p>
              </div> */}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Configurações</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Plano Atual</p>
                  <p className="text-sm text-gray-600">Período de teste - 7 dias grátis</p>
                </div>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Fazer Upgrade
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Notificações</p>
                  <p className="text-sm text-gray-600">Receber alertas sobre novos leads</p>
                </div>
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                  Configurar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Criação de Link */}
        {showCreateLinkModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Criar Novo Link</h2>
                <button
                  onClick={() => setShowCreateLinkModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Nome do Projeto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Projeto *
                  </label>
                  <input
                    type="text"
                    value={newLink.project_name}
                    onChange={(e) => setNewLink({...newLink, project_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Ex: Desafio 7 Dias, Consulta Gratuita, etc."
                  />
                </div>

                {/* Ferramenta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ferramenta *
                  </label>
                  <select
                    value={newLink.tool_name}
                    onChange={(e) => setNewLink({...newLink, tool_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="bmi">Calculadora de IMC</option>
                    <option value="protein">Calculadora de Proteína</option>
                    <option value="body-composition">Composição Corporal</option>
                    <option value="meal-planner">Planejador de Refeições</option>
                    <option value="hydration">Monitor de Hidratação</option>
                    <option value="nutrition-assessment">Avaliação Nutricional</option>
                    <option value="perfil-bem-estar">Quiz: Perfil de Bem-Estar</option>
                    <option value="bem-estar-diario">Bem-Estar Diário</option>
                    <option value="alimentacao-saudavel">Alimentação Saudável</option>
                    <option value="desafio-7-dias">Desafio 7 Dias</option>
                    <option value="aproveitando-100">Aproveitando 100%</option>
                    <option value="metas-semanais">Metas Semanais</option>
                    <option value="inspirar-pessoas">Inspirar Pessoas</option>
                    <option value="perfil-empreendedor">Perfil Empreendedor</option>
                    <option value="onboarding-rapido">Onboarding Rápido</option>
                  </select>
                </div>

                {/* URL de Redirecionamento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de Redirecionamento *
                  </label>
                  <input
                    type="url"
                    value={newLink.redirect_url}
                    onChange={(e) => setNewLink({...newLink, redirect_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="https://wa.me/5511999999999 ou https://seusite.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Para onde o usuário será redirecionado após usar a ferramenta
                  </p>
                </div>

                {/* Texto do Botão */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texto do Botão
                  </label>
                  <input
                    type="text"
                    value={newLink.cta_text}
                    onChange={(e) => setNewLink({...newLink, cta_text: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Falar com Especialista"
                  />
                </div>

                {/* Mensagem Personalizada */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem Personalizada
                  </label>
                  <textarea
                    value={newLink.custom_message}
                    onChange={(e) => setNewLink({...newLink, custom_message: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Quer receber orientações personalizadas? Clique abaixo e fale comigo!"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateLinkModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateLink}
                  disabled={isCreatingLink}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isCreatingLink ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Criando...
                    </>
                  ) : (
                    'Criar Link'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
