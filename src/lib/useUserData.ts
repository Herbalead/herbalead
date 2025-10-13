'use client'

import { useEffect, useState } from 'react'

interface UserData {
  userId?: string
  userName?: string
  userPhone?: string
  linkId?: string
  customMessage?: string
}

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      // Obter dados do usuário da URL
      const urlParams = new URLSearchParams(window.location.search)
      const userParam = urlParams.get('user')
      
      if (userParam) {
        const parsedUserData = JSON.parse(userParam)
        console.log('👤 Dados do usuário carregados:', parsedUserData)
        setUserData(parsedUserData)
      } else {
        console.log('⚠️ Nenhum dado de usuário encontrado na URL')
        // Fallback para dados padrão
        setUserData({
          userId: 'default',
          userName: 'Especialista',
          userPhone: '5519981868000',
          linkId: 'default',
          customMessage: 'Quer receber orientações personalizadas? Clique abaixo e fale comigo!'
        })
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados do usuário:', error)
      // Fallback para dados padrão
      setUserData({
        userId: 'default',
        userName: 'Especialista',
        userPhone: '5519981868000',
        linkId: 'default',
        customMessage: 'Quer receber orientações personalizadas? Clique abaixo e fale comigo!'
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const getWhatsAppUrl = (message?: string) => {
    // Usar mensagem personalizada se disponível, senão usar a mensagem passada como parâmetro
    const finalMessage = userData?.customMessage || message || 'Quer receber orientações personalizadas? Clique abaixo e fale comigo!'
    
    console.log('🔍 Debug getWhatsAppUrl:')
    console.log('  - userData:', userData)
    console.log('  - userPhone:', userData?.userPhone)
    console.log('  - customMessage:', userData?.customMessage)
    console.log('  - finalMessage:', finalMessage)
    
    if (!userData?.userPhone) {
      console.log('⚠️ Usando telefone fixo (fallback)')
      return `https://wa.me/5519981868000?text=${encodeURIComponent(finalMessage)}`
    }
    
    // Limpar e formatar o telefone
    const cleanPhone = userData.userPhone.replace(/\D/g, '')
    const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`
    
    console.log('✅ Usando telefone do usuário:', formattedPhone)
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(finalMessage)}`
  }

  const getCustomMessage = () => {
    return userData?.customMessage || 'Quer receber orientações personalizadas? Clique abaixo e fale comigo!'
  }

  return {
    userData,
    loading,
    getWhatsAppUrl,
    getCustomMessage
  }
}
