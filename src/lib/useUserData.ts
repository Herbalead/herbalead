'use client'

import { useEffect, useState } from 'react'

interface UserData {
  userId?: string
  userName?: string
  userPhone?: string
  linkId?: string
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
          linkId: 'default'
        })
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados do usuário:', error)
      // Fallback para dados padrão
      setUserData({
        userId: 'default',
        userName: 'Especialista',
        userPhone: '5519981868000',
        linkId: 'default'
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const getWhatsAppUrl = (message: string) => {
    if (!userData?.userPhone) {
      return `https://wa.me/5519981868000?text=${encodeURIComponent(message)}`
    }
    
    // Limpar e formatar o telefone
    const cleanPhone = userData.userPhone.replace(/\D/g, '')
    const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`
    
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
  }

  return {
    userData,
    loading,
    getWhatsAppUrl
  }
}
