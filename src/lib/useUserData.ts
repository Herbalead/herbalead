'use client'

import { useEffect, useState } from 'react'

interface UserData {
  userId?: string
  userName?: string
  userPhone?: string
  linkId?: string
  customMessage?: string
  pageTitle?: string // Título personalizado
  buttonText?: string // Texto do botão personalizado
  redirect_url?: string // URL customizada de redirecionamento
}

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      // Obter dados do usuário da URL
      const urlParams = new URLSearchParams(window.location.search)
      const userParam = urlParams.get('user')
      
      console.log('🔍 DEBUG useUserData:')
      console.log('  - window.location.search:', window.location.search)
      console.log('  - userParam:', userParam)
      
      if (userParam) {
        const parsedUserData = JSON.parse(userParam)
        console.log('👤 Dados do usuário carregados:', parsedUserData)
        console.log('  - customMessage:', parsedUserData.customMessage)
        setUserData(parsedUserData)
      } else {
        console.log('⚠️ Nenhum dado de usuário encontrado na URL')
        console.log('⚠️ Usando fallback padrão')
        // Fallback para dados padrão - SEM TELEFONE FIXO
        console.log('⚠️ Usando fallback SEM telefone fixo')
        setUserData({
          userId: 'default',
          userName: 'Especialista',
          userPhone: '', // SEM telefone fixo - deve ser fornecido pela URL
          linkId: 'default',
          customMessage: 'Quer receber orientações personalizadas? Clique abaixo e fale comigo!'
        })
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados do usuário:', error)
      console.log('❌ Usando fallback de erro')
      // Fallback para dados padrão - SEM TELEFONE FIXO
      setUserData({
        userId: 'default',
        userName: 'Especialista',
        userPhone: '', // SEM telefone fixo - deve ser fornecido pela URL
        linkId: 'default',
        customMessage: 'Quer receber orientações personalizadas? Clique abaixo e fale comigo!'
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const getWhatsAppUrl = (message?: string) => {
    // SEMPRE priorizar mensagem específica passada como parâmetro, senão usar customMessage
    const finalMessage = message || userData?.customMessage || 'Quer receber orientações personalizadas? Clique abaixo e fale comigo!'
    
    console.log('🔍 Debug getWhatsAppUrl:')
    console.log('  - userData:', userData)
    console.log('  - redirect_url:', userData?.redirect_url)
    console.log('  - userPhone:', userData?.userPhone)
    console.log('  - customMessage:', userData?.customMessage)
    console.log('  - finalMessage:', finalMessage)
    
    // PRIORIDADE 1: Se existe redirect_url e não é WhatsApp, usar diretamente
    if (userData?.redirect_url && userData.redirect_url.trim() !== '') {
      const redirectUrl = userData.redirect_url.trim()
      
      // Se já é uma URL do WhatsApp, retornar como está
      if (redirectUrl.includes('wa.me') || redirectUrl.includes('api.whatsapp.com')) {
        // Se já tem mensagem na URL, retornar como está
        if (redirectUrl.includes('?text=')) {
          console.log('✅ Usando redirect_url do WhatsApp com mensagem:', redirectUrl)
          return redirectUrl
        }
        // Se não tem mensagem, adicionar
        const separator = redirectUrl.includes('?') ? '&' : '?'
        const finalUrl = `${redirectUrl}${separator}text=${encodeURIComponent(finalMessage)}`
        console.log('✅ Usando redirect_url do WhatsApp com mensagem adicionada:', finalUrl)
        return finalUrl
      }
      
      // Se é uma URL customizada (não WhatsApp), retornar diretamente
      console.log('✅ Usando redirect_url customizada:', redirectUrl)
      return redirectUrl
    }
    
    // PRIORIDADE 2: Se não tem redirect_url, usar telefone para gerar WhatsApp
    if (!userData?.userPhone) {
      console.log('⚠️ SEM TELEFONE E SEM REDIRECT_URL - não é possível gerar URL')
      return '#'
    }
    
    // Usar o telefone exatamente como está no banco (já com código do país)
    const cleanPhone = userData.userPhone.replace(/\D/g, '')
    
    console.log('✅ Usando telefone do usuário:', cleanPhone)
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(finalMessage)}`
  }

  const getCustomMessage = () => {
    const message = userData?.customMessage || 'Quer receber orientações personalizadas? Clique abaixo e fale comigo!'
    console.log('🔍 Debug getCustomMessage:')
    console.log('  - userData:', userData)
    console.log('  - customMessage:', userData?.customMessage)
    console.log('  - final message:', message)
    return message
  }

  const getPageTitle = () => {
    return userData?.pageTitle || 'Quer uma análise mais completa?'
  }

  const getButtonText = () => {
    return userData?.buttonText || 'Consultar Especialista'
  }

  return {
    userData,
    loading,
    getWhatsAppUrl,
    getCustomMessage,
    getPageTitle,
    getButtonText
  }
}
