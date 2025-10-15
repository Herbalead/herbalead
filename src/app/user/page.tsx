'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Plus, Link as LinkIcon, Users, TrendingUp, Settings, BookOpen } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import HerbaleadLogo from '@/components/HerbaleadLogo'
import HelpButton from '@/components/HelpButton'

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
    material_description: '',
    // Novos campos para personalização
    page_title: 'Quer uma análise mais completa?',
    page_greeting: '',
    button_text: 'Consultar Especialista'
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [editingLink, setEditingLink] = useState<Record<string, unknown> | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null)
  const [userLinks, setUserLinks] = useState<Record<string, unknown>[]>([])
  const [userQuizzes, setUserQuizzes] = useState<Record<string, unknown>[]>([])
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    company: '',
    subscription_status: ''
  })
  const [editingProfile, setEditingProfile] = useState(false)
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    phone: '',
    specialty: '',
    company: ''
  })
  const [countryCode, setCountryCode] = useState('55')
  const [loading, setLoading] = useState(true)

  // Função para normalizar texto removendo acentos e caracteres especiais
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/[^a-z0-9-]/g, '') // Remove caracteres especiais
      .replace(/-+/g, '-') // Remove hífens duplicados
      .replace(/^-|-$/g, '') // Remove hífens do início e fim
  }

  // Função para gerar mensagem personalizada por ferramenta
  const getCustomMessageByTool = (): string => {
    return 'Quer uma análise mais completa?'
  }

  useEffect(() => {
    loadUserProfile()
    loadUserLinks()
    loadUserQuizzes()
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
            .select('*, subscription_status')
            .eq('email', user.email)
            .single()

          console.log('📊 Resultado da busca:', professional)
          console.log('❌ Erro da busca:', error)

          if (professional) {
            // Extrair código do país do telefone
            const phone = professional.phone || ''
            let extractedCountryCode = '55' // padrão Brasil
            let phoneWithoutCode = phone
            
            if (phone.startsWith('55')) {
              extractedCountryCode = '55'
              phoneWithoutCode = phone.substring(2)
            } else if (phone.startsWith('1')) {
              extractedCountryCode = '1'
              phoneWithoutCode = phone.substring(1)
            } else if (phone.startsWith('44')) {
              extractedCountryCode = '44'
              phoneWithoutCode = phone.substring(2)
            } else if (phone.startsWith('33')) {
              extractedCountryCode = '33'
              phoneWithoutCode = phone.substring(2)
            } else if (phone.startsWith('49')) {
              extractedCountryCode = '49'
              phoneWithoutCode = phone.substring(2)
            } else if (phone.startsWith('34')) {
              extractedCountryCode = '34'
              phoneWithoutCode = phone.substring(2)
            } else if (phone.startsWith('39')) {
              extractedCountryCode = '39'
              phoneWithoutCode = phone.substring(2)
            } else if (phone.startsWith('52')) {
              extractedCountryCode = '52'
              phoneWithoutCode = phone.substring(2)
            } else if (phone.startsWith('54')) {
              extractedCountryCode = '54'
              phoneWithoutCode = phone.substring(2)
            } else if (phone.startsWith('56')) {
              extractedCountryCode = '56'
              phoneWithoutCode = phone.substring(2)
            } else if (phone.startsWith('57')) {
              extractedCountryCode = '57'
              phoneWithoutCode = phone.substring(2)
            } else if (phone.startsWith('51')) {
              extractedCountryCode = '51'
              phoneWithoutCode = phone.substring(2)
            }
            
            const profileData = {
              name: professional.name || '',
              email: professional.email || '',
              phone: phoneWithoutCode,
              specialty: professional.specialty || '',
              company: professional.company || '',
              subscription_status: professional.subscription_status || ''
            }
            
            console.log('👤 Perfil carregado:', profileData)
            console.log('🌍 Código do país extraído:', extractedCountryCode)
            setUserProfile(profileData)
            setCountryCode(extractedCountryCode)
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

  const loadUserQuizzes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        console.log('🔍 Carregando quizzes para usuário:', user.id)
        
        const { data: quizzes, error } = await supabase
          .from('quizzes')
          .select('*')
          .eq('professional_id', user.id)
          .order('created_at', { ascending: false })

        console.log('📊 Quizzes do usuário:', quizzes)
        console.log('❌ Erro ao buscar quizzes:', error)

        if (error) {
          console.error('❌ Erro ao carregar quizzes:', error)
        } else {
          setUserQuizzes(quizzes || [])
        }
      }
    } catch (error) {
      console.error('❌ Erro ao carregar quizzes:', error)
    }
  }

  const deleteQuiz = async (quizId: string) => {
    try {
      console.log('🗑️ Iniciando exclusão do quiz:', quizId)
      
      // Verificar se o quiz existe antes de tentar apagar
      const { data: existingQuiz, error: checkError } = await supabase
        .from('quizzes')
        .select('id, title, project_name')
        .eq('id', quizId)
        .single()
      
      if (checkError || !existingQuiz) {
        console.error('❌ Quiz não encontrado:', checkError)
        alert('Quiz não encontrado ou já foi excluído.')
        return
      }
      
      console.log('📊 Quiz encontrado para exclusão:', existingQuiz)
      
      // Primeiro apagar as perguntas relacionadas
      console.log('🗑️ Apagando perguntas do quiz...')
      const { error: questionsError, count: questionsDeleted } = await supabase
        .from('questions')
        .delete({ count: 'exact' })
        .eq('quiz_id', quizId)
      
      console.log('📊 Perguntas apagadas:', questionsDeleted)
      
      if (questionsError) {
        console.error('❌ Erro ao apagar perguntas:', questionsError)
        alert('Erro ao apagar perguntas do quiz. Tente novamente.')
        return
      }
      
      // Depois apagar o quiz
      console.log('🗑️ Apagando quiz principal...')
      const { error: quizError, count: quizDeleted } = await supabase
        .from('quizzes')
        .delete({ count: 'exact' })
        .eq('id', quizId)
      
      console.log('📊 Quiz apagado:', quizDeleted)
      
      if (quizError) {
        console.error('❌ Erro ao apagar quiz:', quizError)
        alert('Erro ao apagar quiz. Tente novamente.')
        return
      }
      
      if (quizDeleted === 0) {
        console.warn('⚠️ Nenhum quiz foi apagado - pode já ter sido excluído')
        alert('Quiz não encontrado ou já foi excluído.')
        return
      }
      
      console.log('✅ Quiz e perguntas apagados com sucesso!')
      
      // Recarregar a lista de quizzes
      console.log('🔄 Recarregando lista de quizzes...')
      await loadUserQuizzes()
      
      alert('Quiz apagado com sucesso!')
      
    } catch (error) {
      console.error('❌ Erro ao apagar quiz:', error)
      alert('Erro ao apagar quiz. Tente novamente.')
    }
  }

  const openCreateLinkModal = () => {
    // Pré-preencher apenas o telefone básico - sem mensagem automática
    console.log('🔍 DEBUG openCreateLinkModal:')
    console.log('  - userProfile.phone:', userProfile.phone)
    console.log('  - countryCode atual:', countryCode)
    
    const cleanPhone = userProfile.phone.replace(/\D/g, '')
    const fullPhone = `${countryCode}${cleanPhone}`
    
    // URL básica apenas com telefone - distribuidor controla a mensagem
    const whatsappUrl = userProfile.phone 
      ? `https://wa.me/${fullPhone}`
      : 'https://wa.me/5511999999999'
    
    // Mensagem padrão apenas para o preview/exibição
    const defaultMessage = getCustomMessageByTool()
    
    console.log('📱 URL básica WhatsApp (sem mensagem):', whatsappUrl)
    console.log('👤 Telefone do usuário:', userProfile.phone)
    console.log('🌍 Código do país selecionado:', countryCode)
    console.log('📞 Telefone completo:', fullPhone)
    console.log('💬 Mensagem para preview:', defaultMessage)
    
    setNewLink({
      ...newLink,
      redirect_url: whatsappUrl, // Apenas telefone - distribuidor adiciona mensagem se quiser
      custom_message: defaultMessage,
      page_greeting: newLink.page_greeting || defaultMessage // Usar a mensagem já editada ou a padrão
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

      // Verificar se já existe um projeto com o mesmo nome para este usuário
      const { data: existingLinks, error: checkError } = await supabase
        .from('links')
        .select('id, name')
        .eq('user_id', user.id)
        .ilike('name', newLink.name.trim())

      if (checkError) {
        console.error('❌ Erro ao verificar projetos existentes:', checkError)
        setErrorMessage('Erro interno. Tente novamente.')
        setShowErrorModal(true)
        return
      }

      if (existingLinks && existingLinks.length > 0) {
        setErrorMessage(`Já existe um projeto com o nome "${newLink.name.trim()}". Escolha um nome diferente.`)
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
          custom_message: newLink.page_greeting, // Usar page_greeting em vez de custom_message
          capture_type: newLink.capture_type,
          material_title: newLink.material_title || '',
          material_description: newLink.material_description || '',
          // Novos campos
          page_title: newLink.page_title || 'Quer uma análise mais completa?',
          page_greeting: newLink.page_greeting || 'Gostaria de saber mais',
          button_text: newLink.button_text || 'Consultar Especialista',
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
          material_description: '',
          // Novos campos
          page_title: 'Quer uma análise mais completa?',
          page_greeting: 'Gostaria de saber mais',
          button_text: 'Consultar Especialista'
        })
        setShowSuccessModal(true)
      }
    } catch (error) {
      console.error('❌ Erro inesperado ao criar link:', error)
      setErrorMessage('Erro inesperado ao criar link. Tente novamente.')
      setShowErrorModal(true)
    }
  }

  const editLink = (link: Record<string, unknown>) => {
    setEditingLink(link)
    
    // Usar apenas os valores salvos no banco - sem extrair da URL
    setNewLink({
      name: String(link.name || ''),
      tool_name: String(link.tool_name || ''),
      cta_text: String(link.cta_text || ''),
      redirect_url: String(link.redirect_url || ''),
      custom_url: String(link.custom_url || ''),
      custom_message: String(link.custom_message || ''),
      capture_type: String(link.capture_type || ''),
      material_title: String(link.material_title || ''),
      material_description: String(link.material_description || ''),
      // Novos campos
      page_title: String(link.page_title || 'Quer uma análise mais completa?'),
      page_greeting: String(link.page_greeting || 'Olá!'),
      button_text: String(link.button_text || 'Consultar Especialista')
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

      // Verificar se já existe outro projeto com o mesmo nome para este usuário (excluindo o atual)
      const { data: existingLinks, error: checkError } = await supabase
        .from('links')
        .select('id, name')
        .eq('user_id', user.id)
        .ilike('name', newLink.name.trim())
        .neq('id', editingLink.id)

      if (checkError) {
        console.error('❌ Erro ao verificar projetos existentes:', checkError)
        setErrorMessage('Erro interno. Tente novamente.')
        setShowErrorModal(true)
        return
      }

      if (existingLinks && existingLinks.length > 0) {
        setErrorMessage(`Já existe outro projeto com o nome "${newLink.name.trim()}". Escolha um nome diferente.`)
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
          custom_message: newLink.page_greeting, // Usar page_greeting em vez de custom_message
          capture_type: newLink.capture_type,
          material_title: newLink.material_title || '',
          material_description: newLink.material_description || '',
          // Novos campos
          page_title: newLink.page_title || 'Quer uma análise mais completa?',
          page_greeting: newLink.page_greeting || 'Gostaria de saber mais',
          button_text: newLink.button_text || 'Consultar Especialista',
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
        material_description: '',
        // Novos campos
        page_title: 'Quer uma análise mais completa?',
        page_greeting: 'Gostaria de saber mais',
        button_text: 'Consultar Especialista'
      })
        setShowSuccessModal(true)
      }
    } catch (error) {
      console.error('❌ Erro inesperado ao atualizar link:', error)
      setErrorMessage('Erro inesperado ao atualizar link. Tente novamente.')
      setShowErrorModal(true)
    }
  }

  const copyLink = async (link: Record<string, unknown>) => {
    try {
      // Gerar slug personalizado baseado no usuário e projeto usando normalização
      const userSlug = normalizeText(userProfile.name)
      const projectSlug = normalizeText(String(link.name || ''))
      const personalizedUrl = `${window.location.origin}/${userSlug}/${projectSlug}`
      
      // Copiar para a área de transferência
      await navigator.clipboard.writeText(personalizedUrl)
      
      // Mostrar feedback visual
      setCopiedLinkId(String(link.id || ''))
      setTimeout(() => {
        setCopiedLinkId(null)
      }, 2000)
      
      console.log('✅ Link personalizado copiado:', personalizedUrl)
    } catch (error) {
      console.error('❌ Erro ao copiar link:', error)
      // Fallback para navegadores mais antigos
      const userSlug = userProfile.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const projectSlug = String(link.name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const personalizedUrl = `${window.location.origin}/${userSlug}/${projectSlug}`
      
      const textArea = document.createElement('textarea')
      textArea.value = personalizedUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      
      setCopiedLinkId(String(link.id || ''))
      setTimeout(() => {
        setCopiedLinkId(null)
      }, 2000)
    }
  }

  const deleteLink = async (linkId: string) => {
    // Encontrar o link para mostrar o nome na confirmação
    const linkToDelete = userLinks.find(link => link.id === linkId)
    const linkName = linkToDelete?.name || 'este link'
    
    // Confirmação antes de deletar
    if (!confirm(`Tem certeza que deseja deletar "${linkName}"?\n\nEsta ação não pode ser desfeita.`)) {
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setErrorMessage('Usuário não está logado. Faça login novamente.')
        setShowErrorModal(true)
        return
      }

      console.log('🗑️ Deletando link:', linkName, '(ID:', linkId, ')')

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
        console.log('✅ Link deletado com sucesso:', linkName)
        setUserLinks(userLinks.filter(link => link.id !== linkId))
        
        // Mostrar mensagem de sucesso específica para deleção
        setShowDeleteSuccessModal(true)
      }
    } catch (error) {
      console.error('❌ Erro inesperado ao deletar link:', error)
      setErrorMessage('Erro inesperado ao deletar link. Tente novamente.')
      setShowErrorModal(true)
    }
  }

  const startEditingProfile = () => {
    console.log('🔄 Iniciando edição do perfil...')
    console.log('👤 Perfil atual:', userProfile)
    
    setEditedProfile({
      name: userProfile.name || '',
      phone: userProfile.phone || '',
      specialty: userProfile.specialty || '',
      company: userProfile.company || ''
    })
    
    console.log('📝 Perfil editável configurado:', {
      name: userProfile.name || '',
      phone: userProfile.phone || '',
      specialty: userProfile.specialty || '',
      company: userProfile.company || ''
    })
    
    setEditingProfile(true)
  }

  const cancelEditingProfile = () => {
    setEditingProfile(false)
    setEditedProfile({
      name: '',
      phone: '',
      specialty: '',
      company: ''
    })
  }

  const saveProfile = async () => {
    try {
      console.log('🔄 Salvando perfil...')
      console.log('📋 Dados do perfil editado:', editedProfile)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error('❌ Usuário não logado')
        alert('Usuário não logado')
        return
      }

      console.log('👤 Usuário logado:', user.email)

      // Validar campos obrigatórios
      if (!editedProfile.name.trim()) {
        alert('Nome é obrigatório')
        return
      }

      const { error } = await supabase
        .from('professionals')
        .update({
          name: editedProfile.name.trim(),
          phone: `${countryCode}${editedProfile.phone.replace(/\D/g, '')}`,
          specialty: editedProfile.specialty.trim(),
          company: editedProfile.company.trim()
        })
        .eq('email', user.email)

      console.log('📊 Resultado da atualização:', error)
      console.log('📞 Telefone salvo:', `${countryCode}${editedProfile.phone.replace(/\D/g, '')}`)

      if (error) {
        console.error('❌ Erro ao salvar perfil:', error)
        alert('Erro ao salvar perfil: ' + error.message)
      } else {
        console.log('✅ Perfil salvo com sucesso!')
        
        // Atualizar o estado local
        setUserProfile({
          ...userProfile,
          name: editedProfile.name.trim(),
          phone: editedProfile.phone.trim(),
          specialty: editedProfile.specialty.trim(),
          company: editedProfile.company.trim()
        })
        
        setEditingProfile(false)
        alert('Perfil atualizado com sucesso!')
      }
    } catch (error) {
      console.error('❌ Erro inesperado ao salvar perfil:', error)
      alert('Erro inesperado ao salvar perfil')
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
              <HerbaleadLogo size="lg" variant="horizontal" />
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

      {/* Notificação de assinatura */}
      {(!userProfile.subscription_status || userProfile.subscription_status !== 'active') && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">
                    Seus links estão bloqueados até você ativar sua assinatura
                  </h3>
                  <p className="text-sm opacity-90 mt-1">
                    Ative sua assinatura para liberar todos os seus links e começar a gerar leads.
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Link
                  href="/payment"
                  className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Ativar Assinatura
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

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
                onClick={() => window.location.href = '/course'}
                className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Acessar Curso</span>
            </button>
              
        </div>

            {/* Atividade Recente - menor e no final */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
              {userLinks.length > 0 ? (
                <div className="space-y-3">
                  {userLinks.slice(0, 3).map((link) => (
                    <div key={String(link.id || '')} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{String(link.project_name || '')}</p>
                        <p className="text-sm text-gray-500">{String(link.tool_name || '')}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(String(link.created_at || '')).toLocaleDateString()}
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
                onClick={openCreateLinkModal}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Link
              </button>
            </div>
            
              {userLinks.length > 0 ? (
              <div className="space-y-4">
                {userLinks.map((link) => (
                    <div key={String(link.id)} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{String(link.name)}</h4>
                          <p className="text-sm text-gray-500 mt-1">{String(link.tool_name)}</p>
                          <p className="text-sm text-gray-600 mt-2">{String(link.custom_message)}</p>
                          <div className="mt-2 space-y-2">
                            <div className="flex space-x-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {String(link.id).slice(0, 8)}...
                        </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {String(link.clicks || 0)} cliques
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {String(link.leads || 0)} leads
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
                              <strong>URL do Link:</strong> {window.location.origin}/{normalizeText(userProfile.name)}/{normalizeText(String(link.name))}
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
                          onClick={() => deleteLink(String(link.id))}
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
                    onClick={openCreateLinkModal}
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
            
            {userQuizzes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum quiz criado ainda</p>
                <button 
                  onClick={() => window.location.href = '/quiz-builder'}
                  className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Criar Primeiro Quiz
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userQuizzes.map((quiz: Record<string, unknown>) => (
                  <div key={quiz.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{quiz.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Projeto: {quiz.project_name} | 
                          Criado em: {new Date(quiz.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            const url = `${window.location.origin}/${userProfile.name?.toLowerCase().replace(/\s+/g, '-') || 'usuario'}/quiz/${quiz.project_name}`
                            navigator.clipboard.writeText(url)
                            alert('Link copiado!')
                          }}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                        >
                          Copiar Link
                        </button>
                        <button
                          onClick={() => window.open(`/quiz-builder?id=${quiz.id}`, '_blank')}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Tem certeza que deseja apagar o quiz "${quiz.title}"? Esta ação não pode ser desfeita.`)) {
                              deleteQuiz(quiz.id)
                            }
                          }}
                          className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 flex items-center"
                          title="Apagar quiz"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                  <div className="flex space-x-2">
                    <div className="w-24">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="55">🇧🇷 +55</option>
                        <option value="1">🇺🇸 +1</option>
                        <option value="44">🇬🇧 +44</option>
                        <option value="33">🇫🇷 +33</option>
                        <option value="49">🇩🇪 +49</option>
                        <option value="34">🇪🇸 +34</option>
                        <option value="39">🇮🇹 +39</option>
                        <option value="52">🇲🇽 +52</option>
                        <option value="54">🇦🇷 +54</option>
                        <option value="56">🇨🇱 +56</option>
                        <option value="57">🇨🇴 +57</option>
                        <option value="51">🇵🇪 +51</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <input
                        type="tel"
                        value={editedProfile.phone}
                        onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="11 99999-9999"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{countryCode} {userProfile.phone || 'Não informado'}</p>
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
              {/* Assinatura */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Assinatura</h4>
                    <p className="text-sm text-gray-500">Gerencie sua assinatura e pagamentos</p>
                  </div>
                  <Link
                    href="/user/subscription"
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Gerenciar
                  </Link>
                </div>
              </div>

              {/* Notificações */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notificações</label>
                  <p className="mt-1 text-sm text-gray-500">Configure suas preferências de notificação</p>
                </div>
              </div>
              
              {/* Integrações */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Integrações</label>
                  <p className="mt-1 text-sm text-gray-500">Conecte com outras ferramentas</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal para criar link com preview */}
        {showCreateLinkModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Criar Novo Link</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Coluna esquerda - Formulário */}
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
                      <option value="wellness-profile">Quiz: Perfil de Bem-Estar</option>
                      <option value="daily-wellness">Tabela: Bem-Estar Diário</option>
                      <option value="healthy-eating">Quiz: Alimentação Saudável</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">🎯 Título Principal</label>
                    <input
                      type="text"
                      value={newLink.page_title}
                      onChange={(e) => setNewLink({...newLink, page_title: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Quer uma análise mais completa?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">💬 Texto Descritivo</label>
                    <textarea
                      value={newLink.page_greeting}
                      onChange={(e) => setNewLink({...newLink, page_greeting: e.target.value})}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Adicione aqui sua mensagem personalizada..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Esta mensagem aparece na página para estimular o cliente
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">🔗 Texto do Botão</label>
                    <input
                      type="text"
                      value={newLink.button_text}
                      onChange={(e) => setNewLink({...newLink, button_text: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Consultar Especialista"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">📱 URL de Redirecionamento</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newLink.redirect_url}
                        onChange={(e) => setNewLink({...newLink, redirect_url: e.target.value})}
                        className="mt-1 flex-1 border border-gray-300 rounded-md px-3 py-2"
                        placeholder="https://wa.me/5511999999999"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const cleanPhone = userProfile.phone.replace(/\D/g, '')
                          const fullPhone = `${countryCode}${cleanPhone}`
                          const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(newLink.page_greeting)}`
                          setNewLink({...newLink, redirect_url: whatsappUrl})
                          console.log('📝 URL atualizada com mensagem:', whatsappUrl)
                        }}
                        className="mt-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                        title="Adicionar mensagem do texto descritivo"
                      >
                        📝
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      💡 <strong>Controle total:</strong> Cole aqui apenas o telefone OU clique no 📝 para adicionar a mensagem automaticamente
                    </p>
                  </div>
                </div>

                {/* Coluna direita - Preview */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-700 mb-4">📱 Chamada para ação</h4>
                  
                  {/* Preview Card */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                    <div className="text-center space-y-4">
                      {/* Título Principal */}
                      <h2 className="text-xl font-bold text-gray-800">
                        🎯 {newLink.page_title || 'Quer uma análise mais completa?'}
                      </h2>
                      
                      {/* Texto Descritivo */}
                      <p className="text-gray-700 leading-relaxed">
                        {newLink.page_greeting || 'Adicione aqui sua mensagem personalizada...'}
                      </p>
                      
                      {/* Botão */}
                      <button 
                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        onClick={() => {
                          if (newLink.redirect_url) {
                            window.open(newLink.redirect_url, '_blank')
                          }
                        }}
                      >
                        💬 {newLink.button_text || 'Consultar Especialista'}
                      </button>
                    </div>
                  </div>

                  {/* Informações do Link */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-700 mb-2">📋 Informações do Link</h5>
                    <div className="space-y-2 text-sm">
                      <div><strong>Projeto:</strong> {newLink.name || 'Nome não definido'}</div>
                      <div><strong>Ferramenta:</strong> {newLink.tool_name}</div>
                      <div><strong>URL:</strong> 
                        <span className="text-blue-600 break-all">
                          {newLink.redirect_url || 'URL não definida'}
                        </span>
                      </div>
                    </div>
                  </div>
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

      {/* Modal de Sucesso para Deleção */}
      {showDeleteSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Link Deletado!</h3>
            <p className="text-gray-600 text-center mb-4">O link foi removido com sucesso.</p>
            <button
              onClick={() => setShowDeleteSuccessModal(false)}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              OK
            </button>
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

      {/* Modal de Edição com preview */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Editar Link</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Coluna esquerda - Formulário */}
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
                    <option value="body-composition">Composição Corporal</option>
                    <option value="meal-planner">Planejador de Refeições</option>
                    <option value="nutrition-assessment">Avaliação Nutricional</option>
                    <option value="wellness-profile">Quiz: Perfil de Bem-Estar</option>
                    <option value="daily-wellness">Tabela: Bem-Estar Diário</option>
                    <option value="healthy-eating">Quiz: Alimentação Saudável</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">🎯 Título Principal</label>
                  <input
                    type="text"
                    value={newLink.page_title}
                    onChange={(e) => setNewLink({...newLink, page_title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Quer uma análise mais completa?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">💬 Texto Descritivo</label>
                  <textarea
                    value={newLink.page_greeting}
                    onChange={(e) => setNewLink({...newLink, page_greeting: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Olá! Vi que você calculou seu IMC. Tenho orientações personalizadas que podem ajudar muito no seu bem-estar. Gostaria de mais informações?"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Esta mensagem aparece na página para estimular o cliente
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">🔗 Texto do Botão</label>
                  <input
                    type="text"
                    value={newLink.button_text}
                    onChange={(e) => setNewLink({...newLink, button_text: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Consultar Especialista"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">📱 URL de Redirecionamento</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newLink.redirect_url}
                      onChange={(e) => setNewLink({...newLink, redirect_url: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="https://wa.me/5511999999999"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const cleanPhone = userProfile.phone.replace(/\D/g, '')
                        const fullPhone = `${countryCode}${cleanPhone}`
                        const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(newLink.page_greeting)}`
                        setNewLink({...newLink, redirect_url: whatsappUrl})
                        console.log('📝 URL atualizada com mensagem:', whatsappUrl)
                      }}
                      className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                      title="Adicionar mensagem do texto descritivo"
                    >
                      📝
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    💡 <strong>Controle total:</strong> Cole aqui apenas o telefone OU clique no 📝 para adicionar a mensagem automaticamente
                  </p>
                </div>
              </div>

              {/* Coluna direita - Preview */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-700 mb-4">📱 Chamada para ação</h4>
                
                {/* Preview Card */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                  <div className="text-center space-y-4">
                    {/* Título Principal */}
                    <h2 className="text-xl font-bold text-gray-800">
                      🎯 {newLink.page_title || 'Quer uma análise mais completa?'}
                    </h2>
                    
                    {/* Texto Descritivo */}
                    <p className="text-gray-700 leading-relaxed">
                      {newLink.page_greeting || 'Gostaria de saber mais'}
                    </p>
                    
                    {/* Botão */}
                    <button 
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      onClick={() => {
                        if (newLink.redirect_url) {
                          window.open(newLink.redirect_url, '_blank')
                        }
                      }}
                    >
                      💬 {newLink.button_text || 'Consultar Especialista'}
                    </button>
                  </div>
                </div>

                {/* Informações do Link */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-700 mb-2">📋 Informações do Link</h5>
                  <div className="space-y-2 text-sm">
                    <div><strong>Projeto:</strong> {newLink.name || 'Nome não definido'}</div>
                    <div><strong>Ferramenta:</strong> {newLink.tool_name}</div>
                    <div><strong>URL:</strong> 
                      <span className="text-blue-600 break-all">
                        {newLink.redirect_url || 'URL não definida'}
                      </span>
                    </div>
                  </div>
                </div>
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
      
      {/* Botão de Ajuda */}
      <HelpButton />
    </div>
  )
}