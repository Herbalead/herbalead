'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Plus, Link as LinkIcon, Users, TrendingUp, Calendar, Settings } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showCreateLinkModal, setShowCreateLinkModal] = useState(false)
  const [newLink, setNewLink] = useState({
    project_name: '',
    tool_name: 'bmi',
    cta_text: 'Falar com Especialista',
    redirect_url: '',
    custom_message: 'Quer receber orientações personalizadas? Clique abaixo e fale comigo!',
    capture_type: 'direct', // 'direct' ou 'capture'
    material_title: '',
    material_description: ''
  })
  const [isCreatingLink, setIsCreatingLink] = useState(false)
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    company: '',
    website: ''
  })
  const [userLinks, setUserLinks] = useState<Array<{
    id: string
    name: string
    tool: string
    url: string
    status: string
    clicks: number
    leads: number
    createdAt: string
    cta_text: string
    redirect_url: string
  }>>([])

  // Carregar dados do perfil do Supabase
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        console.log('Carregando perfil do usuário...')
        // Buscar dados do usuário atual do Supabase
        const { data: { user } } = await supabase.auth.getUser()
        console.log('Usuário encontrado:', user)
        
        if (user) {
          console.log('Buscando perfil do usuário:', user.id)
          // Buscar perfil do usuário na tabela professionals (onde estão os dados do cadastro)
          const { data: professional, error } = await supabase
            .from('professionals')
            .select('*')
            .eq('email', user.email)
            .single()

          if (error) {
            console.error('Erro ao buscar perfil:', error)
            console.error('Código do erro:', error.code)
            console.error('Mensagem do erro:', error.message)
            
            // Se não encontrou na tabela professionals, tentar na tabela profiles
            console.log('Tentando buscar na tabela profiles...')
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single()

            if (profileError) {
              console.log('Nenhum perfil encontrado, usando dados básicos')
              setUserProfile({
                name: user.user_metadata?.full_name || '',
                email: user.email || '',
                phone: '',
                specialty: '',
                company: '',
                website: ''
              })
              return
            }

            if (profile) {
              console.log('Perfil encontrado na tabela profiles:', profile)
              setUserProfile({
                name: profile.full_name || '',
                email: user.email || '',
                phone: profile.phone || '',
                specialty: profile.specialty || '',
                company: profile.company || '',
                website: profile.website || ''
              })
            }
            return
          }

          if (professional) {
            console.log('Perfil encontrado na tabela professionals:', professional)
            setUserProfile({
              name: professional.name || '',
              email: user.email || '',
              phone: professional.phone || '',
              specialty: professional.specialty || '',
              company: professional.company || '',
              website: professional.website_link || ''
            })
          } else {
            console.log('Nenhum perfil encontrado, usando dados básicos')
            setUserProfile({
              name: user.user_metadata?.full_name || '',
              email: user.email || '',
              phone: '',
              specialty: '',
              company: '',
              website: ''
            })
          }
        } else {
          // Fallback para dados de exemplo se não há usuário logado
          setUserProfile({
            name: 'João Silva',
            email: 'joao@email.com',
            phone: '+5511999999999',
            specialty: 'nutritionist',
            company: 'Nutrição & Vida',
            website: 'https://nutricaovida.com'
          })
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error)
        // Fallback para dados de exemplo em caso de erro
        setUserProfile({
          name: 'João Silva',
          email: 'joao@email.com',
          phone: '+5511999999999',
          specialty: 'nutritionist',
          company: 'Nutrição & Vida',
          website: 'https://nutricaovida.com'
        })
      }
    }

    loadUserProfile()
  }, [])

  // Carregar links do usuário
  useEffect(() => {
    const loadUserLinks = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data: links, error } = await supabase
            .from('links')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          if (error) {
            console.error('Erro ao carregar links:', error)
            return
          }

          if (links) {
            const formattedLinks = links.map(link => ({
              id: link.id,
              name: link.name,
              tool: link.tool_name,
              url: link.custom_url,
              status: link.status === 'active' ? 'Ativo' : 'Inativo',
              clicks: link.clicks || 0,
              leads: link.leads || 0,
              createdAt: new Date(link.created_at).toLocaleDateString('pt-BR'),
              cta_text: link.cta_text,
              redirect_url: link.redirect_url
            }))
            
            setUserLinks(formattedLinks)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar links:', error)
      }
    }

    loadUserLinks()
  }, [])

  // Função para salvar perfil no Supabase
  const saveProfile = async () => {
    try {
      console.log('Iniciando salvamento do perfil...')
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        console.error('Erro ao buscar usuário:', userError)
        alert('Erro de autenticação. Faça login novamente.')
        return
      }
      
      if (!user) {
        console.log('Usuário não logado')
        alert('Usuário não logado. Faça login primeiro.')
        return
      }

      console.log('Usuário encontrado:', user.id)
      console.log('Dados do perfil:', userProfile)

      // Garantir que o telefone tenha o formato correto (+55)
      let formattedPhone = userProfile.phone
      if (formattedPhone && !formattedPhone.startsWith('+55')) {
        const cleanPhone = formattedPhone.replace(/\D/g, '')
        if (cleanPhone.length >= 10) {
          formattedPhone = '+55' + cleanPhone
        }
      }

      console.log('Telefone formatado:', formattedPhone)

      // Dados para salvar na tabela professionals
      const professionalData = {
        name: userProfile.name,
        email: user.email,
        phone: formattedPhone,
        specialty: userProfile.specialty,
        company: userProfile.company,
        website_link: userProfile.website,
        updated_at: new Date().toISOString()
      }

      console.log('Dados para salvar na tabela professionals:', professionalData)

      // Salvar ou atualizar perfil na tabela professionals
      const { data, error } = await supabase
        .from('professionals')
        .upsert(professionalData, { onConflict: 'email' })
        .select()

      if (error) {
        console.error('Erro ao salvar perfil:', error)
        console.error('Código do erro:', error.code)
        console.error('Mensagem do erro:', error.message)
        console.error('Detalhes do erro:', error.details)
        alert(`Erro ao salvar perfil: ${error.message}`)
        return
      }

      console.log('Perfil salvo com sucesso:', data)

      // Atualizar o estado local com o telefone formatado
      setUserProfile(prev => ({
        ...prev,
        phone: formattedPhone
      }))

      alert('Perfil salvo com sucesso!')
    } catch (error) {
      console.error('Erro geral ao salvar perfil:', error)
      alert('Erro ao salvar perfil. Tente novamente.')
    }
  }

  // Função para preencher automaticamente o WhatsApp
  const fillWhatsApp = () => {
    if (userProfile.phone) {
      // Garantir que o telefone tenha o formato correto (+55)
      let cleanPhone = userProfile.phone.replace(/\D/g, '')
      
      // Se não começar com 55, adicionar
      if (!cleanPhone.startsWith('55')) {
        cleanPhone = '55' + cleanPhone
      }
      
      const whatsappUrl = `https://wa.me/${cleanPhone}`
      setNewLink({...newLink, redirect_url: whatsappUrl})
    }
  }

  // Função para preencher automaticamente o site
  const fillWebsite = () => {
    if (userProfile.website) {
      setNewLink({...newLink, redirect_url: userProfile.website})
    }
  }

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
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('Usuário não logado. Faça login primeiro.')
        return
      }

      // Buscar nome do usuário para criar URL
      const { data: userProfile } = await supabase
        .from('professionals')
        .select('name')
        .eq('id', user.id)
        .single()
      
      const userName = (userProfile?.name || 'usuario')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 30)
      
      const projectName = newLink.project_name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 30)
      
      const customUrl = `https://herbalead.com/${userName}/${projectName}`
      
      // Verificar se já existe um projeto com o mesmo nome para este usuário
      const { data: existingLink, error: checkError } = await supabase
        .from('links')
        .select('id, name')
        .eq('user_id', user.id)
        .ilike('name', `%${newLink.project_name}%`)
        .single()

      if (existingLink && !checkError) {
        alert(`Já existe um projeto com o nome "${newLink.project_name}" para este usuário. Escolha um nome diferente.`)
        return
      }
      
      // Salvar no Supabase
      const { data: savedLink, error } = await supabase
        .from('links')
        .insert({
          user_id: user.id,
          name: newLink.project_name,
          tool_name: newLink.tool_name,
          cta_text: newLink.cta_text,
          redirect_url: newLink.redirect_url,
          custom_url: customUrl,
          custom_message: newLink.custom_message,
          capture_type: newLink.capture_type,
          material_title: newLink.material_title,
          material_description: newLink.material_description,
          status: 'active'
        })
        .select()
        .single()

      if (error) {
        console.error('Erro ao salvar link:', error)
        alert('Erro ao criar link. Tente novamente.')
        return
      }
      
      // Criar objeto do link para o estado local
      const createdLink = {
        id: savedLink.id,
        name: savedLink.name,
        tool: savedLink.tool_name,
        url: savedLink.custom_url,
        status: 'Ativo',
        clicks: savedLink.clicks || 0,
        leads: savedLink.leads || 0,
        createdAt: new Date(savedLink.created_at).toLocaleDateString('pt-BR'),
        cta_text: savedLink.cta_text,
        redirect_url: savedLink.redirect_url
      }
      
      // Adicionar à lista de links
      setUserLinks(prev => [createdLink, ...prev])
      
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

  // Função para copiar link
  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      alert('Link copiado para a área de transferência!')
    } catch (error) {
      console.error('Erro ao copiar link:', error)
      alert('Erro ao copiar link. Tente novamente.')
    }
  }

  // Função para excluir link
  const deleteLink = async (linkId: string) => {
    if (!confirm('Tem certeza que deseja excluir este link?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId)

      if (error) {
        console.error('Erro ao excluir link:', error)
        alert('Erro ao excluir link. Tente novamente.')
        return
      }

      // Remover da lista local
      setUserLinks(prev => prev.filter(link => link.id !== linkId))
      alert('Link excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir link:', error)
      alert('Erro ao excluir link. Tente novamente.')
    }
  }

  // Função para editar link
  const editLink = (link: {
    id: string
    name: string
    tool: string
    cta_text: string
    redirect_url: string
  }) => {
    setNewLink({
      project_name: link.name,
      tool_name: link.tool,
      cta_text: link.cta_text,
      redirect_url: link.redirect_url,
      custom_message: 'Quer receber orientações personalizadas? Clique abaixo e fale comigo!'
    })
    setShowCreateLinkModal(true)
    // TODO: Implementar lógica de edição
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
              <span className="text-sm text-gray-700">{userProfile.name || 'Usuário'}</span>
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
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Perfil
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
                    <p className="text-2xl font-semibold text-gray-900">{userLinks.length}</p>
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
                    <p className="text-2xl font-semibold text-gray-900">0</p>
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
                    <p className="text-2xl font-semibold text-gray-900">0%</p>
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
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma atividade recente</p>
                <p className="text-sm text-gray-400 mt-2">Crie seu primeiro link para começar a coletar leads</p>
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
            
            {userLinks.length === 0 ? (
              <div className="text-center py-8">
                <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Nenhum link criado ainda</p>
                <p className="text-sm text-gray-400">Crie seu primeiro link personalizado para começar a gerar leads</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userLinks.map((link) => (
                  <div key={link.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{link.name}</h4>
                        <p className="text-sm text-gray-600">{link.tool}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {link.url}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {link.status}
                        </span>
                        <button 
                          onClick={() => copyLink(link.url)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Copiar
                        </button>
                        <button 
                          onClick={() => editLink(link)}
                          className="text-yellow-600 hover:text-yellow-800 text-sm"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => deleteLink(link.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center text-xs text-gray-500">
                      <span>{link.clicks} cliques</span>
                      <span className="mx-2">•</span>
                      <span>{link.leads} leads</span>
                      <span className="mx-2">•</span>
                      <span>Criado em {link.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Nenhum lead coletado ainda</p>
              <p className="text-sm text-gray-400">Compartilhe seus links para começar a receber leads</p>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Editar Perfil</h3>
            <div className="space-y-6">
              {/* Informações Pessoais */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Informações Pessoais</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone/WhatsApp *
                    </label>
                    <input
                      type="tel"
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="+5511999999999"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Formato: +5511999999999 (inclua o código do país)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Especialidade
                    </label>
                    <select 
                      value={userProfile.specialty}
                      onChange={(e) => setUserProfile({...userProfile, specialty: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Selecione sua especialidade</option>
                      <option value="nutritionist">Nutricionista</option>
                      <option value="personal-trainer">Personal Trainer</option>
                      <option value="wellness-coach">Coach de Bem-estar</option>
                      <option value="distributor">Distribuidor</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Informações Profissionais */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Informações Profissionais</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Empresa/Organização
                    </label>
                    <input
                      type="text"
                      value={userProfile.company}
                      onChange={(e) => setUserProfile({...userProfile, company: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Nome da sua empresa"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site/URL
                    </label>
                    <input
                      type="url"
                      value={userProfile.website}
                      onChange={(e) => setUserProfile({...userProfile, website: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="https://seusite.com"
                    />
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={saveProfile}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Salvar Alterações
                </button>
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Cancelar
                </button>
              </div>
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

                {/* Tipo de Captação */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Captação *
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="capture_type"
                        value="direct"
                        checked={newLink.capture_type === 'direct'}
                        onChange={(e) => setNewLink({...newLink, capture_type: e.target.value})}
                        className="mr-2"
                      />
                      <div>
                        <span className="font-medium">Botão Direto (WhatsApp)</span>
                        <p className="text-sm text-gray-500">Usuário clica e vai direto para seu WhatsApp</p>
                      </div>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="capture_type"
                        value="capture"
                        checked={newLink.capture_type === 'capture'}
                        onChange={(e) => setNewLink({...newLink, capture_type: e.target.value})}
                        className="mr-2"
                      />
                      <div>
                        <span className="font-medium">Captura de Dados (Lead)</span>
                        <p className="text-sm text-gray-500">Usuário preenche dados e você recebe notificação</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* URL de Redirecionamento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de Redirecionamento *
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <button
                      type="button"
                      onClick={fillWhatsApp}
                      className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                    >
                      Usar meu WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={fillWebsite}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                    >
                      Usar meu Site
                    </button>
                  </div>
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

                {/* Campos de Material (apenas se capture_type for 'capture') */}
                {newLink.capture_type === 'capture' && (
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-blue-900">Material Gratuito</h3>
                    <p className="text-sm text-blue-700">
                      Configure o material que o usuário receberá após preencher os dados
                    </p>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">
                        Título do Material *
                      </label>
                      <input
                        type="text"
                        value={newLink.material_title}
                        onChange={(e) => setNewLink({...newLink, material_title: e.target.value})}
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: E-book Guia Completo de Nutrição"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">
                        Descrição do Material *
                      </label>
                      <textarea
                        value={newLink.material_description}
                        onChange={(e) => setNewLink({...newLink, material_description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: Receba nosso guia completo com dicas de nutrição e alimentação saudável"
                      />
                    </div>
                  </div>
                )}
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
