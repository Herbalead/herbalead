'use client'

import { MessageSquare, Download } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

interface SpecialistCTAProps {
  toolName?: string
  className?: string
}

interface LinkData {
  id: string
  tool_name: string
  cta_text: string
  redirect_url: string
  custom_message: string
  redirect_type: string
  project_name?: string
  custom_slug?: string
  capture_type?: string
  material_title?: string
  material_description?: string
  professional: {
    name: string
    specialty?: string
    company?: string
  }
}

export default function SpecialistCTA({ className = '' }: SpecialistCTAProps) {
  const [linkData, setLinkData] = useState<LinkData | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchLinkData = async () => {
      // Evitar múltiplas execuções
      if (linkData) {
        console.log('⚠️ Dados já carregados, pulando busca...')
        return
      }
      
      console.log('🔍 SpecialistCTA: Iniciando busca de dados...')
      const urlParams = new URLSearchParams(window.location.search)
      const linkId = urlParams.get('ref') || urlParams.get('link')
      
      console.log('🌐 URL atual:', window.location.href)
      console.log('🔗 LinkId encontrado:', linkId)
      
      if (linkId) {
        try {
          console.log('🔍 Buscando dados do link com ref:', linkId)
          
          // Extrair usuário e projeto do ref (formato: usuario/projeto)
          const refParts = linkId.split('/')
          const usuario = refParts[0]
          const projeto = refParts[1]
          
          console.log('👤 Usuário extraído:', usuario)
          console.log('📋 Projeto extraído:', projeto)
          
          // Buscar o usuário pelo nome
          const { data: userData, error: userError } = await supabase
            .from('professionals')
            .select('id, name, email')
            .ilike('name', `%${usuario.replace(/-/g, ' ')}%`)
            .single()

          if (userError || !userData) {
            console.error('❌ Usuário não encontrado:', userError)
            return
          }

          console.log('👤 Usuário encontrado:', userData)

          // Buscar o projeto do usuário na tabela links
          const { data, error } = await supabase
            .from('links')
            .select(`
              id,
              tool_name,
              cta_text,
              redirect_url,
              custom_message,
              capture_type,
              material_title,
              material_description,
              user_id
            `)
            .eq('user_id', userData.id)
            .ilike('name', `%${projeto.replace(/-/g, ' ')}%`)
            .eq('status', 'active')
            .single()
          
          console.log('📊 Dados encontrados:', { data, error })
          
          if (!error && data) {
            console.log('✅ Dados carregados com sucesso:', data)
            
            // Buscar dados do profissional
            const { data: professionalData, error: professionalError } = await supabase
              .from('professionals')
              .select('name, specialty, company')
              .eq('id', data.user_id)
              .single()

            // Corrigir estrutura dos dados do Supabase
            const linkData: LinkData = {
              ...data,
              redirect_type: 'whatsapp', // Assumindo WhatsApp por padrão
              project_name: projeto, // Usar o nome do projeto extraído
              custom_slug: `${usuario}/${projeto}`,
              professional: {
                name: professionalData?.name || 'Profissional',
                specialty: professionalData?.specialty || '',
                company: professionalData?.company || ''
              }
            }
            setLinkData(linkData)
            console.log('🎯 LinkData final:', linkData)
            console.log('💬 Custom message:', linkData.custom_message)
            console.log('🔘 CTA text:', linkData.cta_text)
            console.log('🔗 Redirect URL:', linkData.redirect_url)
          } else {
            console.error('❌ Erro ao buscar dados:', error)
          }
        } catch (error) {
          console.error('❌ Erro ao buscar dados do link:', error)
        }
      } else {
        console.log('⚠️ Nenhum ref encontrado na URL')
      }
      setLoading(false)
    }

    fetchLinkData()
  }, []) // Remover dependências para evitar loop

  const handleContactSpecialist = () => {
    if (!linkData) return
    
    // Se for captura de dados, redirecionar para página de sucesso
    if (linkData.capture_type === 'capture') {
      window.location.href = `/success/${linkData.id}`
    } else {
      // Se for botão direto, redirecionar para WhatsApp/Site
      if (linkData.redirect_url) {
        window.location.href = linkData.redirect_url
      } else {
        window.location.href = '/herbalead'
      }
    }
  }

  if (loading) {
    return (
      <div className={`mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-emerald-200 rounded mb-3"></div>
          <div className="h-10 bg-emerald-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200 ${className}`}>
      {/* Mostrar apenas a mensagem personalizada (sem label) */}
      {linkData?.custom_message && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            {linkData.custom_message}
          </p>
        </div>
      )}
      
      {/* Botão personalizado */}
      <button
        onClick={handleContactSpecialist}
        className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center justify-center"
      >
        {linkData?.capture_type === 'capture' ? (
          <>
            <Download className="w-5 h-5 mr-2" />
            {linkData?.cta_text || 'Receber Material Gratuito'}
          </>
        ) : (
          <>
            <MessageSquare className="w-5 h-5 mr-2" />
            {linkData?.cta_text || 'Falar com Especialista'}
          </>
        )}
      </button>
      
      {/* Debug info - remover depois */}
      {process.env.NODE_ENV === 'development' && linkData && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <strong>Debug:</strong> {linkData.custom_slug} → {linkData.redirect_url}
        </div>
      )}
    </div>
  )
}
