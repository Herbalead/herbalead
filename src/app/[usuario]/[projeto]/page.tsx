'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function PersonalizedLinkPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [linkData, setLinkData] = useState<{
    name?: string
    tool_name?: string
    redirect_url?: string
    cta_text?: string
    custom_message?: string
    capture_type?: string
    material_title?: string
    material_description?: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const usuario = params.usuario as string
  const projeto = params.projeto as string

  useEffect(() => {
    const loadLinkData = async () => {
      try {
        console.log('🔍 Buscando link para:', { usuario, projeto })
        
        // Buscar o usuário pelo slug (busca exata primeiro, depois aproximada)
        let { data: professionals, error: profError } = await supabase
          .from('professionals')
          .select('id, name, email')
          .ilike('name', usuario.replace(/-/g, ' '))
        
        // Se não encontrou exato, tentar busca aproximada
        if (!professionals || professionals.length === 0) {
          const { data: profApprox, error: profApproxError } = await supabase
            .from('professionals')
            .select('id, name, email')
            .ilike('name', `%${usuario.replace(/-/g, ' ')}%`)
          
          if (profApproxError) {
            console.error('❌ Erro ao buscar professional (aproximado):', profApproxError)
            setError('Usuário não encontrado')
            return
          }
          
          professionals = profApprox
        }
        
        if (profError) {
          console.error('❌ Erro ao buscar professional:', profError)
          setError('Usuário não encontrado')
          return
        }

        if (!professionals || professionals.length === 0) {
          console.log('❌ Nenhum professional encontrado para:', usuario)
          setError('Usuário não encontrado')
          return
        }

        const professional = professionals[0]
        console.log('👤 Professional encontrado:', professional)

        // Buscar o link pelo nome do projeto e user_id (busca exata primeiro)
        let { data: links, error: linksError } = await supabase
          .from('links')
          .select('*')
          .eq('user_id', professional.id)
          .ilike('name', projeto.replace(/-/g, ' '))
        
        // Se não encontrou exato, tentar busca aproximada
        if (!links || links.length === 0) {
          const { data: linksApprox, error: linksApproxError } = await supabase
            .from('links')
            .select('*')
            .eq('user_id', professional.id)
            .ilike('name', `%${projeto.replace(/-/g, ' ')}%`)
          
          if (linksApproxError) {
            console.error('❌ Erro ao buscar links (aproximado):', linksApproxError)
            setError('Link não encontrado')
            return
          }
          
          links = linksApprox
        }
        
        if (linksError) {
          console.error('❌ Erro ao buscar links:', linksError)
          setError('Link não encontrado')
          return
        }

        if (!links || links.length === 0) {
          console.log('❌ Nenhum link encontrado para:', projeto)
          setError('Link não encontrado')
          return
        }

        const link = links[0]
        console.log('🔗 Link encontrado:', link)
        
        // Incrementar cliques
        await supabase
          .from('links')
          .update({ clicks: (link.clicks || 0) + 1 })
          .eq('id', link.id)

        setLinkData(link)
        
        // REDIRECIONAMENTO AUTOMÁTICO para a ferramenta baseada no tool_name
        if (link.tool_name) {
          console.log('🚀 Redirecionando para ferramenta:', link.tool_name)
          
          // Mapear tool_name para a URL da ferramenta (versão completa)
          const toolUrls: { [key: string]: string } = {
            'bmi': '/calculators/bmi',
            'protein': '/calculators/protein',
            'hydration': '/calculators/hydration',
            'body-composition': '/calculators/body-composition',
            'meal-planner': '/calculators/meal-planner',
            'nutrition-assessment': '/calculators/nutrition-assessment',
            'wellness-profile': '/quiz-builder',
            'daily-wellness': '/calculators/daily-wellness',
            'healthy-eating': '/calculators/healthy-eating'
          }
          
          const toolUrl = toolUrls[link.tool_name] || '/calculators/bmi'
          console.log('🎯 URL da ferramenta:', toolUrl)
          
          // REDIRECIONAMENTO DIRETO - sem tela intermediária
          window.location.replace(toolUrl)
          return
        }
      } catch (error) {
        console.error('❌ Erro ao carregar link:', error)
        setError('Erro interno do servidor')
      } finally {
        setLoading(false)
      }
    }

    if (usuario && projeto) {
      loadLinkData()
    }
  }, [usuario, projeto])

  const handleRedirect = () => {
    if (linkData?.redirect_url && typeof linkData.redirect_url === 'string') {
      window.open(linkData.redirect_url, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Link não encontrado</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {linkData?.name}
            </h1>
            <p className="text-gray-600">
              Ferramenta: {linkData?.tool_name}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {linkData?.custom_message || 'Quer receber orientações personalizadas?'}
              </h2>
              
              <button
                onClick={handleRedirect}
                className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
              >
                {linkData?.cta_text || 'Falar com Especialista'}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm">
            <p>Powered by Herbalead</p>
          </div>
        </div>
      </div>
    </div>
  )
}
