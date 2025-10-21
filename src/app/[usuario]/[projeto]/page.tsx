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
    
    // Buscar dados reais do link no banco de dados
    // 1. Primeiro buscar o professional pelo username
    const { data: professional, error: profError } = await supabase
      .from('professionals')
      .select('id')
      .eq('username', usuario)
      .single()
    
    if (profError || !professional) {
      console.log('⚠️ Professional não encontrado:', profError?.message)
    }
    
    // 2. Buscar o link pelo user_id do professional
    const { data: link, error } = await supabase
      .from('links')
      .select('tool_name, page_title, custom_message, page_greeting')
      .eq('name', projeto)
      .eq('user_id', professional?.id)
      .single()
    
    if (error || !link) {
      console.log('⚠️ Link não encontrado no banco, usando fallback:', error?.message)
    }
    
    // Importar mensagens de ferramentas
    const { getToolMessage } = await import('@/lib/tool-messages')
    
    // Usar tool_name do banco se disponível, senão tentar mapear pelo nome do projeto
    let toolName = link?.tool_name
    
    if (!toolName) {
      const projectName = projeto.toLowerCase().replace(/[^a-z0-9]/g, '')
      
      // Mapear nomes em português para tool_name em inglês
      const toolNameMapping: { [key: string]: string } = {
        'imc': 'bmi',
        'hidratacao': 'hydration',
        'proteina': 'protein',
        'nutricao': 'nutrition-assessment',
        'avaliacao-nutricional': 'nutrition-assessment',
        'plano-alimentar': 'meal-planner',
        'calorias': 'calorie-calculator',
        'gordura-corporal': 'body-fat',
        'composicao-corporal': 'body-fat',
        'macronutrientes': 'macros',
        'consumo-agua': 'water-intake',
        'agua': 'hydration',
        'agua3': 'hydration',
        'potencial': 'recruitment-potencial',
        'ganhos': 'recruitment-ganhos',
        'proposito': 'recruitment-proposito'
      }
      
      toolName = toolNameMapping[projectName] || projectName
    }
    
    const toolMessage = getToolMessage(toolName)
    
    // Usar dados personalizados do link se disponíveis, senão usar dados da ferramenta
    const pageTitle = link?.page_title || toolMessage?.title || `${projeto} - HerbaLead`
    const pageDescription = link?.custom_message || link?.page_greeting || toolMessage?.description || 'Acesse nossa ferramenta especializada para cuidar da sua saúde.'
    const pageImage = toolMessage?.image || 'https://www.herbalead.com/logos/herbalead/herbalead-og-image.jpg'
    
    console.log('🔍 Metadados gerados:', {
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