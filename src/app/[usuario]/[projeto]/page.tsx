import { Metadata } from 'next'
import PersonalizedLinkContent from './PersonalizedLinkContent'

interface PageProps {
  params: {
    usuario: string
    projeto: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { usuario, projeto } = await params
  
  try {
    // Importar Supabase dinamicamente
    const { supabase } = await import('@/lib/supabase')
    
    // Buscar dados do link incluindo a imagem OG
    const { data: link, error } = await supabase
      .from('links')
      .select('tool_name, page_title, custom_message, page_greeting, og_image')
      .eq('name', projeto)
      .single()
    
    if (error || !link) {
      console.log('⚠️ Link não encontrado no banco, usando fallback:', error?.message)
    }
    
    // Importar mensagens de ferramentas
    const { getToolMessage } = await import('@/lib/tool-messages')
    
    // Usar tool_name diretamente (muito mais simples!)
    const toolName = link?.tool_name || projeto.toLowerCase().replace(/[^a-z0-9]/g, '')
    const toolMessage = getToolMessage(toolName)
    
    const pageTitle = link?.page_title || toolMessage?.title || `${projeto} - HerbaLead`
    const pageDescription = link?.custom_message || link?.page_greeting || toolMessage?.description || 'Acesse nossa ferramenta especializada para cuidar da sua saúde.'
    // Usar imagem salva no banco ou fallback da ferramenta
    const pageImage = link?.og_image || toolMessage?.image || 'https://www.herbalead.com/logos/herbalead/herbalead-og-image.jpg'
    
    console.log('🔍 Metadados gerados (simplificado):', {
      toolName,
      pageTitle,
      pageDescription,
      pageImage,
      linkData: link
    })
    
    return {
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `https://www.herbalead.com/${usuario}/${projeto}`,
        siteName: 'HerbaLead',
        images: [
          {
            url: pageImage,
            width: 1200,
            height: 630,
            alt: pageTitle,
          },
        ],
        locale: 'pt_BR',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description: pageDescription,
        images: [pageImage],
      },
      other: {
        'theme-color': '#10b981',
      },
    }
  } catch (error) {
    console.error('❌ Erro ao gerar metadados:', error)
    
    // Fallback em caso de erro
    const fallbackTitle = `${projeto} - HerbaLead`
    const fallbackDescription = 'Acesse nossa ferramenta especializada para cuidar da sua saúde.'
    const fallbackImage = 'https://www.herbalead.com/logos/herbalead/herbalead-og-image.jpg'
    
    return {
      title: fallbackTitle,
      description: fallbackDescription,
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        url: `https://www.herbalead.com/${usuario}/${projeto}`,
        siteName: 'HerbaLead',
        images: [
          {
            url: fallbackImage,
            width: 1200,
            height: 630,
            alt: fallbackTitle,
          },
        ],
        locale: 'pt_BR',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: fallbackTitle,
        description: fallbackDescription,
        images: [fallbackImage],
      },
      other: {
        'theme-color': '#10b981',
      },
    }
  }
}

export default async function PersonalizedLinkPage({ params }: PageProps) {
  const awaitedParams = await params
  return <PersonalizedLinkContent params={awaitedParams} />
}