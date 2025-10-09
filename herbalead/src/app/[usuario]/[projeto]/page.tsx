'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface LinkData {
  id: string
  name: string
  tool_name: string
  cta_text: string
  redirect_url: string
  custom_message: string
  status: string
  user_id: string
  profiles: {
    full_name: string
    specialty: string
    company: string
  }
}

export default function UserProjectPage({ params }: { params: Promise<{ usuario: string; projeto: string }> }) {
  const [linkData, setLinkData] = useState<LinkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchLinkData = async () => {
      try {
        const resolvedParams = await params
        console.log('🔍 Buscando link para usuário:', resolvedParams.usuario, 'projeto:', resolvedParams.projeto)
        
        // Buscar o usuário pelo nome (slug)
        const { data: userData, error: userError } = await supabase
          .from('professionals')
          .select('id, name, email')
          .ilike('name', `%${resolvedParams.usuario.replace(/-/g, ' ')}%`)
          .single()

        if (userError || !userData) {
          console.error('Usuário não encontrado:', userError)
          setError('Usuário não encontrado')
          return
        }

        console.log('👤 Usuário encontrado:', userData)

        // Buscar o projeto do usuário na tabela links
        const { data: linkData, error: linkError } = await supabase
          .from('links')
          .select(`
            id,
            name,
            tool_name,
            cta_text,
            redirect_url,
            custom_message,
            status,
            user_id
          `)
          .eq('user_id', userData.id)
          .ilike('name', `%${resolvedParams.projeto.replace(/-/g, ' ')}%`)
          .eq('status', 'active')
          .single()

        if (linkError || !linkData) {
          console.error('Projeto não encontrado:', linkError)
          setError('Projeto não encontrado ou inativo')
          return
        }

        console.log('📊 Projeto encontrado:', linkData)
        console.log('🔧 Tool name:', linkData.tool_name)
        
        // REDIRECIONAMENTO IMEDIATO para a ferramenta
        if (linkData.tool_name) {
          const toolUrl = `/tools/${linkData.tool_name}?ref=${resolvedParams.usuario}/${resolvedParams.projeto}`
          console.log('🚀 Redirecionando para ferramenta:', toolUrl)
          window.location.href = toolUrl
          return
        } else {
          console.error('❌ Tool name não encontrado:', linkData)
        }
        
        // Buscar dados do profissional (apenas se não redirecionou)
        const { data: professionalData } = await supabase
          .from('professionals')
          .select('name, specialty, company')
          .eq('id', linkData.user_id)
          .single()
        
        // Criar estrutura completa
        const formattedLinkData: LinkData = {
          ...linkData,
          profiles: {
            full_name: professionalData?.name || 'Profissional',
            specialty: professionalData?.specialty || '',
            company: professionalData?.company || ''
          }
        }
        
        setLinkData(formattedLinkData)
      } catch (error) {
        console.error('Erro ao buscar dados do link:', error)
        setError('Erro interno do servidor')
      } finally {
        setLoading(false)
      }
    }

    fetchLinkData()
  }, [params, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando link...</p>
        </div>
      </div>
    )
  }

  if (error || !linkData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link não encontrado</h1>
          <p className="text-gray-600 mb-4">{error || 'Este link não existe ou foi desativado'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔗</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {linkData.name || 'Link Personalizado'}
          </h1>
          <p className="text-gray-600">
            Ferramenta: {linkData.tool_name.replace('-', ' ')}
          </p>
        </div>

        {linkData.custom_message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Mensagem:</strong><br/>
              {linkData.custom_message}
            </p>
          </div>
        )}

        {linkData.profiles && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-700">
              👨‍⚕️ <strong>Profissional:</strong> {linkData.profiles.full_name}
              {linkData.profiles.specialty && ` - ${linkData.profiles.specialty}`}
              {linkData.profiles.company && ` (${linkData.profiles.company})`}
            </p>
          </div>
        )}

        <button
          onClick={() => window.location.href = linkData.redirect_url}
          className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-lg"
        >
          {linkData.cta_text || 'Falar com Especialista'}
        </button>

        <div className="mt-4 text-xs text-gray-500 text-center">
          Link personalizado • Herbalead
        </div>
      </div>
    </div>
  )
}
