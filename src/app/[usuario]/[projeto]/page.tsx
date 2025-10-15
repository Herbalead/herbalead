import { Metadata } from 'next'
import PersonalizedLinkContent from './PersonalizedLinkContent'

interface PageProps {
  params: {
    usuario: string
    projeto: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { usuario, projeto } = params
  
  // Importar dinamicamente para evitar problemas de SSR
  const { getToolMessage } = await import('@/lib/tool-messages')
  
  // Tentar determinar a ferramenta baseada no nome do projeto
  const toolName = projeto.toLowerCase().replace(/[^a-z0-9]/g, '')
  const toolMessage = getToolMessage(toolName)
  
  const pageTitle = toolMessage?.title || `${projeto} - HerbaLead`
  const pageDescription = toolMessage?.description || 'Acesse nossa ferramenta especializada para cuidar da sua saúde.'
  
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
          url: 'https://www.herbalead.com/logos/herbalead/herbalead-og-image.jpg',
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
      images: ['https://www.herbalead.com/logos/herbalead/herbalead-og-image.jpg'],
    },
    other: {
      'theme-color': '#10b981',
    },
  }
}

export default function PersonalizedLinkPage({ params }: PageProps) {
  return <PersonalizedLinkContent params={params} />
}