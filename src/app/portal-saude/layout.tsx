import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portal de Saúde - HerbaLead',
  description: 'Acesse ferramentas completas para avaliação da sua saúde, nutrição e bem-estar.',
  openGraph: {
    title: 'Portal de Saúde - HerbaLead',
    description: 'Acesse ferramentas completas para avaliação da sua saúde, nutrição e bem-estar.',
    url: 'https://www.herbalead.com/portal-saude',
    siteName: 'HerbaLead',
    images: [
      {
        url: 'https://www.herbalead.com/logos/herbalead/portal-saude-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Portal de Saúde - HerbaLead',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portal de Saúde - HerbaLead',
    description: 'Acesse ferramentas completas para avaliação da sua saúde, nutrição e bem-estar.',
    images: ['https://www.herbalead.com/logos/herbalead/portal-saude-og-image.jpg'],
  },
}

export default function PortalSaudeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

