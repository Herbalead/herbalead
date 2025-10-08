'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { User, LogOut, Plus, Eye, MessageSquare, Settings, Copy, Building, Phone, Mail, Zap, X, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  specialty?: string
  company?: string
  bio?: string
  profile_image?: string
  whatsapp_link?: string
  business_type?: string
  project_id?: string
  website_link?: string
}

export default function UserDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showReportsModal, setShowReportsModal] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [userLinks, setUserLinks] = useState<Array<{
    id: string;
    tool_name: string;
    project_name?: string;
    cta_text: string;
    redirect_url: string;
    custom_url: string;
    custom_message?: string;
    redirect_type: string;
    secure_id: string;
    is_active: boolean;
    views: number;
    created_at: string;
  }>>([])
  const [editingPhone, setEditingPhone] = useState('')
  const [authChecked, setAuthChecked] = useState(false)
  const [newLink, setNewLink] = useState({
    project_name: '',
    tool_name: '',
    cta_text: 'Saiba Mais',
    redirect_url: '',
    custom_url: '',
    custom_message: '',
    redirect_type: 'whatsapp'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    company: '',
    bio: '',
    business_type: '',
    website_link: ''
  })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        window.location.href = '/login'
        return
      }

      const { data: profile, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        setError('Erro ao carregar perfil')
        return
      }

      setUser(profile)
      setProfileData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        specialty: profile.specialty || '',
        company: profile.company || '',
        bio: profile.bio || '',
        business_type: profile.business_type || '',
        website_link: profile.website_link || ''
      })
      
      await fetchUserLinks(session.user.id)
    } catch (err) {
      console.error('Auth check error:', err)
      setError('Erro de autenticação')
    } finally {
      setLoading(false)
      setAuthChecked(true)
    }
  }

  const fetchUserLinks = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('professional_links')
        .select('*')
        .eq('professional_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching links:', error)
        return
      }

      setUserLinks(data || [])
    } catch (err) {
      console.error('Error fetching links:', err)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { error } = await supabase
        .from('professional_links')
        .insert({
          professional_id: session.user.id,
          project_name: newLink.project_name,
          tool_name: newLink.tool_name,
          cta_text: newLink.cta_text,
          redirect_url: newLink.redirect_url,
          custom_url: newLink.custom_url,
          custom_message: newLink.custom_message,
          redirect_type: newLink.redirect_type,
          secure_id: Math.random().toString(36).substring(2, 15),
          is_active: true
        })

      if (error) {
        console.error('Error creating link:', error)
        setSubmitStatus('error')
        return
      }

      setSubmitStatus('success')
      setNewLink({
        project_name: '',
        tool_name: '',
        cta_text: 'Saiba Mais',
        redirect_url: '',
        custom_url: '',
        custom_message: '',
        redirect_type: 'whatsapp'
      })
      setShowLinkModal(false)
      await fetchUserLinks(session.user.id)
    } catch (err) {
      console.error('Error creating link:', err)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { error } = await supabase
        .from('professionals')
        .update({
          name: profileData.name,
          phone: profileData.phone,
          specialty: profileData.specialty,
          company: profileData.company,
          bio: profileData.bio,
          business_type: profileData.business_type,
          website_link: profileData.website_link
        })
        .eq('id', session.user.id)

      if (error) {
        console.error('Error updating profile:', error)
        setSubmitStatus('error')
        return
      }

      setSubmitStatus('success')
      setShowProfileModal(false)
      await checkAuth()
    } catch (err) {
      console.error('Error updating profile:', err)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleLinkStatus = async (linkId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('professional_links')
        .update({ is_active: !isActive })
        .eq('id', linkId)

      if (error) {
        console.error('Error updating link status:', error)
        return
      }

      setUserLinks(prev => prev.map(link => 
        link.id === linkId ? { ...link, is_active: !isActive } : link
      ))
    } catch (err) {
      console.error('Error updating link status:', err)
    }
  }

  const deleteLink = async (linkId: string) => {
    if (!confirm('Tem certeza que deseja excluir este link?')) return

    try {
      const { error } = await supabase
        .from('professional_links')
        .delete()
        .eq('id', linkId)

      if (error) {
        console.error('Error deleting link:', error)
        return
      }

      setUserLinks(prev => prev.filter(link => link.id !== linkId))
    } catch (err) {
      console.error('Error deleting link:', err)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/login" className="text-green-600 hover:text-green-700">
            Voltar ao Login
          </Link>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Usuário não encontrado</p>
          <Link href="/login" className="text-green-600 hover:text-green-700">
            Voltar ao Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-600">
                Herbalead
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
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
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Perfil
            </button>
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Bem-vindo, {user.name}!</h2>
              <p className="text-gray-600 mb-6">
                Gerencie seus links profissionais e acompanhe o desempenho das suas ferramentas.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <Zap className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-800">Links Ativos</p>
                      <p className="text-2xl font-bold text-green-900">
                        {userLinks.filter(link => link.is_active).length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <Eye className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-800">Total de Visualizações</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {userLinks.reduce((sum, link) => sum + link.views, 0)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <MessageSquare className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-800">Total de Links</p>
                      <p className="text-2xl font-bold text-purple-900">{userLinks.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Links Recentes</h3>
                <button
                  onClick={() => setShowLinkModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Novo Link</span>
                </button>
              </div>
              
              {userLinks.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Nenhum link criado ainda</p>
                  <button
                    onClick={() => setShowLinkModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Criar Primeiro Link
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userLinks.slice(0, 5).map((link) => (
                    <div key={link.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{link.tool_name}</h4>
                          <p className="text-sm text-gray-500">{link.project_name}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {link.views} visualizações
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleLinkStatus(link.id, link.is_active)}
                            className={`p-1 rounded ${
                              link.is_active ? 'text-green-600' : 'text-gray-400'
                            }`}
                          >
                            {link.is_active ? (
                              <ToggleRight className="h-5 w-5" />
                            ) : (
                              <ToggleLeft className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteLink(link.id)}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Links Tab */}
        {activeTab === 'links' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Meus Links</h2>
              <button
                onClick={() => setShowLinkModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Novo Link</span>
              </button>
            </div>

            {userLinks.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum link criado</h3>
                <p className="text-gray-500 mb-6">Crie seu primeiro link para começar a gerar leads</p>
                <button
                  onClick={() => setShowLinkModal(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                >
                  Criar Primeiro Link
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {userLinks.map((link) => (
                  <div key={link.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{link.tool_name}</h3>
                        <p className="text-gray-600">{link.project_name}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleLinkStatus(link.id, link.is_active)}
                          className={`p-2 rounded ${
                            link.is_active ? 'text-green-600' : 'text-gray-400'
                          }`}
                        >
                          {link.is_active ? (
                            <ToggleRight className="h-5 w-5" />
                          ) : (
                            <ToggleLeft className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => deleteLink(link.id)}
                          className="p-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          URL do Link
                        </label>
                        <div className="flex">
                          <input
                            type="text"
                            value={`${window.location.origin}/link/${link.custom_url}`}
                            readOnly
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm"
                          />
                          <button
                            onClick={() => copyToClipboard(`${window.location.origin}/link/${link.custom_url}`)}
                            className="px-3 py-2 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-300"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Visualizações
                        </label>
                        <p className="text-lg font-semibold text-gray-900">{link.views}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Meu Perfil</h2>
              <button
                onClick={() => setShowProfileModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Editar Perfil</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <p className="text-gray-900">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <p className="text-gray-900">{user.phone || 'Não informado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
                  <p className="text-gray-900">{user.specialty || 'Não informado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                  <p className="text-gray-900">{user.company || 'Não informado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Negócio</label>
                  <p className="text-gray-900">{user.business_type || 'Não informado'}</p>
                </div>
              </div>
              
              {user.bio && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <p className="text-gray-900">{user.bio}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Create Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Criar Novo Link</h3>
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateLink} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Projeto
                  </label>
                  <input
                    type="text"
                    value={newLink.project_name}
                    onChange={(e) => setNewLink({ ...newLink, project_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Ferramenta
                  </label>
                  <input
                    type="text"
                    value={newLink.tool_name}
                    onChange={(e) => setNewLink({ ...newLink, tool_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Texto do Botão
                  </label>
                  <input
                    type="text"
                    value={newLink.cta_text}
                    onChange={(e) => setNewLink({ ...newLink, cta_text: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Personalizada
                  </label>
                  <input
                    type="text"
                    value={newLink.custom_url}
                    onChange={(e) => setNewLink({ ...newLink, custom_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="ex: meu-projeto-bmi"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL de Redirecionamento
                  </label>
                  <input
                    type="url"
                    value={newLink.redirect_url}
                    onChange={(e) => setNewLink({ ...newLink, redirect_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://wa.me/5511999999999"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem Personalizada
                  </label>
                  <textarea
                    value={newLink.custom_message}
                    onChange={(e) => setNewLink({ ...newLink, custom_message: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                    placeholder="Mensagem que será enviada junto com o link..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowLinkModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Criando...' : 'Criar Link'}
                  </button>
                </div>

                {submitStatus === 'success' && (
                  <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    Link criado com sucesso!
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    Erro ao criar link. Tente novamente.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Editar Perfil</h3>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Especialidade
                  </label>
                  <input
                    type="text"
                    value={profileData.specialty}
                    onChange={(e) => setProfileData({ ...profileData, specialty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa
                  </label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Negócio
                  </label>
                  <select
                    value={profileData.business_type}
                    onChange={(e) => setProfileData({ ...profileData, business_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Selecione...</option>
                    <option value="distribuidor">Distribuidor</option>
                    <option value="consultor">Consultor</option>
                    <option value="coach">Coach</option>
                    <option value="nutricionista">Nutricionista</option>
                    <option value="personal_trainer">Personal Trainer</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site/Instagram
                  </label>
                  <input
                    type="url"
                    value={profileData.website_link}
                    onChange={(e) => setProfileData({ ...profileData, website_link: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                    placeholder="Conte um pouco sobre você..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>

                {submitStatus === 'success' && (
                  <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    Perfil atualizado com sucesso!
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    Erro ao atualizar perfil. Tente novamente.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Reports Modal */}
      {showReportsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Relatórios</h3>
                <button
                  onClick={() => setShowReportsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <Zap className="h-6 w-6 text-green-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">Links Ativos</p>
                        <p className="text-2xl font-bold text-green-900">
                          {userLinks.filter(link => link.is_active).length}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <Eye className="h-6 w-6 text-blue-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-800">Total de Visualizações</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {userLinks.reduce((sum, link) => sum + link.views, 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <MessageSquare className="h-6 w-6 text-purple-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-purple-800">Total de Links</p>
                        <p className="text-2xl font-bold text-purple-900">{userLinks.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Detalhes dos Links</h4>
                  {userLinks.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhum dado disponível ainda.</p>
                      <p className="text-sm">Crie seus primeiros links para começar a gerar leads!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userLinks.map((link) => (
                        <div key={link.id} className="bg-white rounded-lg p-4 border">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium text-gray-900">{link.tool_name}</h5>
                              <p className="text-sm text-gray-600">{link.project_name}</p>
                              <p className="text-sm text-gray-500">
                                Criado em: {new Date(link.created_at).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900">{link.views}</p>
                              <p className="text-sm text-gray-500">visualizações</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowReportsModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}