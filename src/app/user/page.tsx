'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Plus, Link as LinkIcon, Users, TrendingUp, Calendar, Settings } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showCreateLinkModal, setShowCreateLinkModal] = useState(false)
  const [newLink, setNewLink] = useState({
    name: '',
    tool_name: 'bmi',
    cta_text: 'Falar com Especialista',
    redirect_url: '',
    custom_url: '',
    custom_message: 'Quer receber orientações personalizadas? Clique abaixo e fale comigo!',
    capture_type: 'direct', // 'direct' ou 'capture'
    material_title: '',
    material_description: ''
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [editingLink, setEditingLink] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null)
  const [userLinks, setUserLinks] = useState<any[]>([])
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    company: '',
    website: ''
  })
  const [editingProfile, setEditingProfile] = useState(false)
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    phone: '',
    specialty: '',
    company: '',
    website: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserProfile()
    loadUserLinks()
  }, [])

    const loadUserProfile = async () => {
      try {
      console.log('🔄 Carregando perfil do usuário...')
        // Buscar dados do usuário atual do Supabase
        const { data: { user } } = await supabase.auth.getUser()
      console.log('👤 Usuário encontrado:', user?.id, user?.email)
        
        if (user) {
        console.log('🔍 Buscando perfil do usuário:', user.email)
        // Buscar perfil do usuário na tabela professionals
          const { data: professional, error } = await supabase
            .from('professionals')
            .select('*')
            .eq('email', user.email)
            .single()

        console.log('📊 Resultado da busca:', professional)
        console.log('❌ Erro da busca:', error)

          if (professional) {
            setUserProfile({
            name: professional.name,
            email: professional.email,
              phone: professional.phone || '',
              specialty: professional.specialty || '',
              company: professional.company || '',
            website: professional.website || ''
            })
          console.log('👤 Perfil carregado:', professional.name)
          } else {
          console.log('❌ Nenhum perfil encontrado na tabela professionals')
          window.location.href = '/login'
          }
        } else {
        console.log('❌ Nenhum usuário logado, redirecionando para login...')
        window.location.href = '/login'
        }
      } catch (error) {
      console.error('❌ Erro ao carregar perfil:', error)
      window.location.href = '/login'
    } finally {
      setLoading(false)
    }
  }

    const loadUserLinks = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
        console.log('🔍 Carregando links para usuário:', user.id)
        console.log('📧 Email do usuário:', user.email)
        
        // Primeiro, vamos ver TODOS os links para debug
        const { data: allLinks, error: allLinksError } = await supabase
          .from('links')
          .select('*')
          .order('created_at', { ascending: false })
        
        console.log('📊 TODOS os links no banco:', allLinks)
        console.log('❌ Erro ao buscar todos os links:', allLinksError)
        
        // Agora buscar apenas os links do usuário atual
          const { data: links, error } = await supabase
            .from('links')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        console.log('🔍 Links do usuário atual:', links)
        console.log('❌ Erro ao buscar links do usuário:', error)

        // Se não encontrou links pelo user_id, tentar buscar pelo email do usuário
        if (!links || links.length === 0) {
          console.log('🔄 Nenhum link encontrado pelo user_id, tentando buscar pelo email...')
          
          // Buscar o professional_id pelo email
          const { data: professional, error: profError } = await supabase
            .from('professionals')
            .select('id')
            .eq('email', user.email)
            .single()
          
          console.log('👤 Professional encontrado:', professional)
          console.log('❌ Erro ao buscar professional:', profError)
          
          if (professional) {
            // Buscar links pelo professional_id
            const { data: linksByProf, error: linksError } = await supabase
              .from('links')
              .select('*')
              .eq('user_id', professional.id)
              .order('created_at', { ascending: false })
            
            console.log('🔍 Links pelo professional_id:', linksByProf)
            console.log('❌ Erro ao buscar links pelo professional:', linksError)
            
            if (linksByProf && linksByProf.length > 0) {
              setUserLinks(linksByProf)
            return
            }
          }
        }

        if (error) {
          console.error('❌ Erro ao carregar links:', error)
        } else {
          console.log('✅ Links carregados:', links)
          setUserLinks(links || [])
          }
        }
      } catch (error) {
      console.error('❌ Erro ao carregar links:', error)
    }
  }

  const openCreateLinkModal = () => {
    // Pré-preencher URL com WhatsApp do usuário
    const whatsappUrl = userProfile.phone 
      ? `https://wa.me/${userProfile.phone.replace(/\D/g, '')}`
      : 'https://wa.me/5511999999999'
    
    console.log('📱 Pré-preenchimento WhatsApp:', whatsappUrl)
    console.log('👤 Telefone do usuário:', userProfile.phone)
    
    setNewLink({
      ...newLink,
      redirect_url: whatsappUrl
    })
    setShowCreateLinkModal(true)
  }

  const createLink = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setErrorMessage('Usuário não está logado. Faça login novamente.')
        setShowErrorModal(true)
        return
      }

      console.log('🚀 Criando link para usuário:', user.id)
      console.log('📋 Dados do link:', newLink)

      // Validar campos obrigatórios
      if (!newLink.name.trim()) {
        setErrorMessage('Nome do projeto é obrigatório.')
        setShowErrorModal(true)
        return
      }
      
      if (!newLink.redirect_url.trim()) {
        setErrorMessage('URL de redirecionamento é obrigatória.')
        setShowErrorModal(true)
        return
      }

      const { data, error } = await supabase
        .from('links')
        .insert({
          user_id: user.id,
          name: newLink.name.trim(),
          tool_name: newLink.tool_name,
          cta_text: newLink.cta_text,
          redirect_url: newLink.redirect_url.trim(),
          custom_url: newLink.custom_url.trim(),
          custom_message: newLink.custom_message,
          capture_type: newLink.capture_type,
          material_title: newLink.material_title || '',
          material_description: newLink.material_description || '',
          status: 'active',
          clicks: 0,
          leads: 0
        })
        .select()

      if (error) {
        console.error('❌ Erro ao criar link:', error)
        
        // Mensagens amigáveis para o usuário
        let userFriendlyMessage = 'Não foi possível criar o link. '
        
        if (error.message.includes('name') || error.message.includes('project_name')) {
          userFriendlyMessage += 'Verifique se o nome do projeto está preenchido corretamente.'
        } else if (error.message.includes('redirect_url')) {
          userFriendlyMessage += 'Verifique se a URL de redirecionamento está correta.'
        } else if (error.message.includes('schema cache')) {
          userFriendlyMessage += 'Houve um problema técnico. Tente novamente em alguns segundos.'
          // Tentar novamente automaticamente após 3 segundos
          setTimeout(() => {
            createLink()
          }, 3000)
        } else if (error.message.includes('permission')) {
          userFriendlyMessage += 'Você não tem permissão para criar links. Faça login novamente.'
        } else {
          userFriendlyMessage += 'Tente novamente ou entre em contato com o suporte se o problema persistir.'
        }
        
        setErrorMessage(userFriendlyMessage)
        setShowErrorModal(true)
      } else {
        console.log('✅ Link criado com sucesso:', data)
        setUserLinks([data[0], ...userLinks])
        setShowCreateLinkModal(false)
        setNewLink({
          name: '',
          tool_name: 'bmi',
          cta_text: 'Falar com Especialista',
          redirect_url: '',
          custom_url: '',
          custom_message: 'Quer receber orientações personalizadas? Clique abaixo e fale comigo!',
          capture_type: 'direct',
          material_title: '',
          material_description: ''
        })
        setShowSuccessModal(true)
      }
    } catch (error) {
      console.error('❌ Erro inesperado ao criar link:', error)
      setErrorMessage('Erro inesperado ao criar link. Tente novamente.')
      setShowErrorModal(true)
    }
  }

  const editLink = (link: any) => {
    setEditingLink(link)
    setNewLink({
      name: link.name,
      tool_name: link.tool_name,
      cta_text: link.cta_text,
      redirect_url: link.redirect_url,
      custom_url: link.custom_url || '',
      custom_message: link.custom_message,
      capture_type: link.capture_type,
      material_title: link.material_title || '',
      material_description: link.material_description || ''
    })
    setShowEditModal(true)
  }

  const updateLink = async () => {
    try {
      if (!editingLink) return

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setErrorMessage('Usuário não está logado. Faça login novamente.')
        setShowErrorModal(true)
        return
      }

      console.log('🔄 Atualizando link:', editingLink.id)
      console.log('📋 Novos dados:', newLink)

      // Validar campos obrigatórios
      if (!newLink.name.trim()) {
        setErrorMessage('Nome do projeto é obrigatório.')
        setShowErrorModal(true)
        return
      }

      if (!newLink.redirect_url.trim()) {
        setErrorMessage('URL de redirecionamento é obrigatória.')
        setShowErrorModal(true)
        return
      }
      
      const { data, error } = await supabase
        .from('links')
        .update({
          name: newLink.name.trim(),
          tool_name: newLink.tool_name,
          cta_text: newLink.cta_text,
          redirect_url: newLink.redirect_url.trim(),
          custom_url: newLink.custom_url.trim(),
          custom_message: newLink.custom_message,
          capture_type: newLink.capture_type,
          material_title: newLink.material_title || '',
          material_description: newLink.material_description || '',
          updated_at: new Date().toISOString()
        })
        .eq('id', editingLink.id)
        .eq('user_id', user.id)
        .select()

      if (error) {
        console.error('❌ Erro ao atualizar link:', error)
        
        // Mensagens amigáveis para o usuário
        let userFriendlyMessage = 'Não foi possível atualizar o link. '
        
        if (error.message.includes('name') || error.message.includes('project_name')) {
          userFriendlyMessage += 'Verifique se o nome do projeto está preenchido corretamente.'
        } else if (error.message.includes('redirect_url')) {
          userFriendlyMessage += 'Verifique se a URL de redirecionamento está correta.'
        } else if (error.message.includes('schema cache')) {
          userFriendlyMessage += 'Houve um problema técnico. Tente novamente em alguns segundos.'
        } else if (error.message.includes('permission')) {
          userFriendlyMessage += 'Você não tem permissão para editar este link.'
        } else {
          userFriendlyMessage += 'Tente novamente ou entre em contato com o suporte se o problema persistir.'
        }
        
        setErrorMessage(userFriendlyMessage)
        setShowErrorModal(true)
      } else {
        console.log('✅ Link atualizado com sucesso:', data)
        setUserLinks(userLinks.map(link => 
          link.id === editingLink.id ? data[0] : link
        ))
        setShowEditModal(false)
        setEditingLink(null)
      setNewLink({
          name: '',
        tool_name: 'bmi',
        cta_text: 'Falar com Especialista',
        redirect_url: '',
          custom_url: '',
        custom_message: 'Quer receber orientações personalizadas? Clique abaixo e fale comigo!',
        capture_type: 'direct',
        material_title: '',
        material_description: ''
      })
        setShowSuccessModal(true)
      }
    } catch (error) {
      console.error('❌ Erro inesperado ao atualizar link:', error)
      setErrorMessage('Erro inesperado ao atualizar link. Tente novamente.')
      setShowErrorModal(true)
    }
  }

  const copyLink = async (link: any) => {
    try {
      // Gerar slug personalizado baseado no usuário e projeto
      const userSlug = userProfile.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const projectSlug = link.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const personalizedUrl = `${window.location.origin}/${userSlug}/${projectSlug}`
      
      // Copiar para a área de transferência
      await navigator.clipboard.writeText(personalizedUrl)
      
      // Mostrar feedback visual
      setCopiedLinkId(link.id)
      setTimeout(() => {
        setCopiedLinkId(null)
      }, 2000)
      
      console.log('✅ Link personalizado copiado:', personalizedUrl)
    } catch (error) {
      console.error('❌ Erro ao copiar link:', error)
      // Fallback para navegadores mais antigos
      const userSlug = userProfile.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const projectSlug = link.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const personalizedUrl = `${window.location.origin}/${userSlug}/${projectSlug}`
      
      const textArea = document.createElement('textarea')
      textArea.value = personalizedUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      
      setCopiedLinkId(link.id)
      setTimeout(() => {
        setCopiedLinkId(null)
      }, 2000)
    }
  }

  const deleteLink = async (linkId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setErrorMessage('Usuário não está logado. Faça login novamente.')
        setShowErrorModal(true)
      return
    }

      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId)
        .eq('user_id', user.id)

      if (error) {
        console.error('❌ Erro ao deletar link:', error)
        
        // Mensagens amigáveis para o usuário
        let userFriendlyMessage = 'Não foi possível deletar o link. '
        
        if (error.message.includes('permission')) {
          userFriendlyMessage += 'Você não tem permissão para deletar este link.'
        } else if (error.message.includes('not found')) {
          userFriendlyMessage += 'O link não foi encontrado ou já foi deletado.'
        } else {
          userFriendlyMessage += 'Tente novamente ou entre em contato com o suporte se o problema persistir.'
        }
        
        setErrorMessage(userFriendlyMessage)
        setShowErrorModal(true)
      } else {
        console.log('✅ Link deletado com sucesso')
        setUserLinks(userLinks.filter(link => link.id !== linkId))
        setShowSuccessModal(true)
      }
    } catch (error) {
      console.error('❌ Erro inesperado ao deletar link:', error)
      setErrorMessage('Erro inesperado ao deletar link. Tente novamente.')
      setShowErrorModal(true)
    }
  }

  const startEditingProfile = () => {
    setEditedProfile({
      name: userProfile.name,
      phone: userProfile.phone,
      specialty: userProfile.specialty,
      company: userProfile.company,
      website: userProfile.website
    })
    setEditingProfile(true)
  }

  const cancelEditingProfile = () => {
    setEditingProfile(false)
    setEditedProfile({
      name: '',
      phone: '',
      specialty: '',
      company: '',
      website: ''
    })
  }

  const saveProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Usuário não logado')
        return
      }

      const { error } = await supabase
        .from('professionals')
        .update({
          name: editedProfile.name,
          phone: editedProfile.phone,
          specialty: editedProfile.specialty,
          company: editedProfile.company,
          website: editedProfile.website
        })
        .eq('email', user.email)

      if (error) {
        console.error('Erro ao salvar perfil:', error)
        alert('Erro ao salvar perfil: ' + error.message)
      } else {
        setUserProfile({
          ...userProfile,
          name: editedProfile.name,
          phone: editedProfile.phone,
          specialty: editedProfile.specialty,
          company: editedProfile.company,
          website: editedProfile.website
        })
        setEditingProfile(false)
        alert('Perfil atualizado com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      alert('Erro ao salvar perfil')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-600">
                Herbalead
              </Link>
              </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{userProfile.name}</span>
              <Link href="/login" className="text-gray-500 hover:text-gray-700">
                Sair
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Visão Geral' },
              { id: 'links', name: 'Meus Links' },
              { id: 'leads', name: 'Leads' },
              { id: 'quizzes', name: 'Meus Quizzes' },
              { id: 'profile', name: 'Perfil' },
              { id: 'settings', name: 'Configurações' }
            ].map((tab) => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
                {tab.name}
            </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Botões de ação compactos no topo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
                onClick={openCreateLinkModal}
                className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Criar Novo Link</span>
            </button>
              
              <button 
                onClick={() => window.location.href = '/quiz-builder'}
                className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-2"
              >
                <Settings className="w-5 h-5" />
                <span>Criar Quiz</span>
            </button>
              
            <button
                onClick={() => setActiveTab('links')}
                className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <TrendingUp className="w-5 h-5" />
                <span>Ver Relatórios</span>
            </button>
        </div>

            {/* Atividade Recente - menor e no final */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
              {userLinks.length > 0 ? (
                <div className="space-y-3">
                  {userLinks.slice(0, 3).map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{link.project_name}</p>
                        <p className="text-sm text-gray-500">{link.tool_name}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(link.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma atividade recente</p>
                  <p className="text-sm text-gray-400 mt-2">Crie seu primeiro link para começar a coletar leads</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'links' && (
          <div className="space-y-6">
            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            </div>

            {/* Lista de Links */}
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
            
              {userLinks.length > 0 ? (
              <div className="space-y-4">
                {userLinks.map((link) => (
                    <div key={link.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{link.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">{link.tool_name}</p>
                          <p className="text-sm text-gray-600 mt-2">{link.custom_message}</p>
                          <div className="mt-2 space-y-2">
                            <div className="flex space-x-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {link.id.slice(0, 8)}...
                        </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {link.clicks || 0} cliques
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {link.leads || 0} leads
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
                              <strong>URL do Link:</strong> {window.location.origin}/{userProfile.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}/{link.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                        <button 
                            onClick={() => copyLink(link)}
                            className={`text-sm px-3 py-1 rounded-md transition-colors ${
                              copiedLinkId === link.id
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                            }`}
                          >
                            {copiedLinkId === link.id ? '✓ Copiado!' : '📋 Copiar Link'}
                        </button>
                        <button 
                          onClick={() => editLink(link)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => deleteLink(link.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                            Deletar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum link criado ainda</p>
                <button 
                    onClick={() => setShowCreateLinkModal(true)}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Criar Primeiro Link
                </button>
              </div>
              )}
            </div>
          </div>
        )}
            
        {activeTab === 'leads' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Leads</h3>
              <div className="text-center py-8">
              <p className="text-gray-500">Nenhum lead coletado ainda</p>
              <p className="text-sm text-gray-400 mt-2">Crie links para começar a coletar leads</p>
              </div>
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Meus Quizzes</h3>
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum quiz criado ainda</p>
              <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  Criar Primeiro Quiz
              </button>
              </div>
                    </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Perfil</h3>
              {!editingProfile && (
                      <button
                  onClick={startEditingProfile}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Editar Perfil
                      </button>
            )}
          </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                {editingProfile ? (
                    <input
                      type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{userProfile.name}</p>
                )}
                  </div>
              
                  <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-500">{userProfile.email}</p>
                <p className="text-xs text-gray-400">Email não pode ser alterado</p>
                  </div>
              
                  <div>
                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                {editingProfile ? (
                    <input
                      type="tel"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="+55 11 99999-9999"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{userProfile.phone || 'Não informado'}</p>
                )}
                  </div>
              
                  <div>
                <label className="block text-sm font-medium text-gray-700">Especialidade</label>
                {editingProfile ? (
                    <select 
                    value={editedProfile.specialty}
                    onChange={(e) => setEditedProfile({...editedProfile, specialty: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Selecione uma especialidade</option>
                      <option value="distributor">Distribuidor</option>
                    <option value="nutritionist">Nutricionista</option>
                    <option value="personal_trainer">Personal Trainer</option>
                    <option value="health_coach">Coach do Bem-estar</option>
                      <option value="other">Outro</option>
                    </select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{userProfile.specialty || 'Não informado'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Empresa</label>
                {editingProfile ? (
                    <input
                      type="text"
                    value={editedProfile.company}
                    onChange={(e) => setEditedProfile({...editedProfile, company: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Ex: Herbalife"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{userProfile.company || 'Não informado'}</p>
                )}
                  </div>
              
                  <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                {editingProfile ? (
                    <input
                      type="url"
                    value={editedProfile.website}
                    onChange={(e) => setEditedProfile({...editedProfile, website: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="https://meusite.com"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{userProfile.website || 'Não informado'}</p>
                )}
                </div>
              </div>

            {editingProfile && (
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={cancelEditingProfile}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button 
                  onClick={saveProfile}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Salvar Alterações
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Configurações</h3>
            <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700">Notificações</label>
                <p className="mt-1 text-sm text-gray-500">Configure suas preferências de notificação</p>
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700">Integrações</label>
                <p className="mt-1 text-sm text-gray-500">Conecte com outras ferramentas</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal para criar link */}
        {showCreateLinkModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Criar Novo Link</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome do Projeto</label>
                  <input
                    type="text"
                    value={newLink.name}
                    onChange={(e) => setNewLink({...newLink, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Ex: Consultoria Nutricional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Ferramenta</label>
                  <select
                    value={newLink.tool_name}
                    onChange={(e) => setNewLink({...newLink, tool_name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="bmi">Calculadora IMC</option>
                    <option value="protein">Calculadora de Proteína</option>
                    <option value="hydration">Calculadora de Hidratação</option>
                    <option value="body-composition">Composição Corporal</option>
                    <option value="meal-planner">Planejador de Refeições</option>
                    <option value="nutrition-assessment">Avaliação Nutricional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Texto do Botão</label>
                      <input
                    type="text"
                    value={newLink.cta_text}
                    onChange={(e) => setNewLink({...newLink, cta_text: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Ex: Falar com Especialista"
                  />
                      </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">URL de Redirecionamento</label>
                      <input
                    type="url"
                    value={newLink.redirect_url}
                    onChange={(e) => setNewLink({...newLink, redirect_url: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="https://wa.me/5511999999999"
                  />
                </div>
                
                      <div>
                  <label className="block text-sm font-medium text-gray-700">Mensagem Personalizada</label>
                  <textarea
                    value={newLink.custom_message}
                    onChange={(e) => setNewLink({...newLink, custom_message: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Quer receber orientações personalizadas? Clique abaixo e fale comigo!"
                  />
                  </div>
                </div>

              <div className="flex justify-end space-x-3 mt-6">
                    <button
                  onClick={() => setShowCreateLinkModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                  Cancelar
                    </button>
                    <button
                  onClick={createLink}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                  Criar Link
                    </button>
                  </div>
                </div>
          </div>
        </div>
      )}

      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Sucesso!</h3>
            <p className="text-gray-600 text-center mb-4">Link criado com sucesso!</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Editar Link</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Projeto</label>
                  <input
                  type="text"
                  value={newLink.name}
                  onChange={(e) => setNewLink({...newLink, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ex: Calculadora IMC"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ferramenta</label>
                <select
                  value={newLink.tool_name}
                  onChange={(e) => setNewLink({...newLink, tool_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="bmi">Calculadora IMC</option>
                  <option value="protein">Calculadora de Proteína</option>
                  <option value="hydration">Calculadora de Hidratação</option>
                </select>
                </div>
                    
                    <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Texto do Botão</label>
                  <input
                    type="text"
                    value={newLink.cta_text}
                    onChange={(e) => setNewLink({...newLink, cta_text: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ex: Falar com Especialista"
                  />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL de Redirecionamento</label>
                <input
                  type="url"
                  value={newLink.redirect_url}
                  onChange={(e) => setNewLink({...newLink, redirect_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://wa.me/5511999999999"
                  />
                </div>
                    
                    <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL Personalizada (Opcional)</label>
                      <input
                  type="url"
                  value={newLink.custom_url}
                  onChange={(e) => setNewLink({...newLink, custom_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://meusite.com/calculadora"
                      />
                    </div>
                    
                    <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem Personalizada</label>
                      <textarea
                  value={newLink.custom_message}
                  onChange={(e) => setNewLink({...newLink, custom_message: e.target.value})}
                        rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Quer receber orientações personalizadas? Clique abaixo e fale comigo!"
                      />
                    </div>
              </div>
              
            <div className="flex justify-end space-x-3 mt-6">
                <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingLink(null)
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                onClick={updateLink}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Atualizar Link
                </button>
              </div>
    </div>
  </div>
        )}

      {/* Modal de Erro */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Erro</h3>
            <p className="text-gray-600 text-center mb-4">{errorMessage}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}