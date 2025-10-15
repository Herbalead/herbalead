import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Herbalead - Bem-Estar Natural e Tecnologia',
  description: 'Conquiste novos clientes todos os dias com bem-estar natural e tecnologia. Ferramentas profissionais para gerar leads qualificados.',
  keywords: 'leads, bem-estar, qualidade de vida, herbalife, distribuidores, profissionais, marketing, herbalead',
  authors: [{ name: 'Herbalead Team' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Herbalead - Bem-Estar Natural e Tecnologia',
    description: 'Conquiste novos clientes todos os dias com bem-estar natural e tecnologia. Ferramentas profissionais para gerar leads qualificados.',
    url: 'https://www.herbalead.com',
    siteName: 'Herbalead',
    images: [
      {
        url: 'https://www.herbalead.com/og-images/herbalead-main-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Herbalead - Your Lead Accelerator',
        type: 'image/jpeg',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Herbalead - Bem-Estar Natural e Tecnologia',
    description: 'Conquiste novos clientes todos os dias com bem-estar natural e tecnologia.',
    images: ['https://www.herbalead.com/og-images/herbalead-main-og-image.jpg'],
    creator: '@herbalead',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#10B981',
}

// Headers moved to next.config.ts

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Herbalead" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#10B981" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* WhatsApp e redes sociais específicas - usando www para evitar redirecionamento */}
        <meta property="og:image" content="https://www.herbalead.com/og-images/herbalead-main-og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Herbalead - Your Lead Accelerator" />
        <meta property="og:image:type" content="image/png" />
        
        {/* WhatsApp específico - múltiplas configurações para garantir compatibilidade */}
        <meta property="og:image:secure_url" content="https://www.herbalead.com/og-images/herbalead-main-og-image.jpg" />
        <meta property="og:image:url" content="https://www.herbalead.com/og-images/herbalead-main-og-image.jpg" />
        
        {/* WhatsApp Business API */}
        <meta property="og:image" content="https://www.herbalead.com/og-images/herbalead-main-og-image.jpg" />
        
        {/* Twitter Cards */}
        <meta name="twitter:image" content="https://www.herbalead.com/og-images/herbalead-main-og-image.jpg" />
        <meta name="twitter:image:alt" content="Herbalead - Your Lead Accelerator" />
        
        {/* LinkedIn */}
        <meta property="og:image:url" content="https://www.herbalead.com/og-images/herbalead-main-og-image.jpg" />
        
        {/* Facebook */}
        <meta property="og:image:secure_url" content="https://www.herbalead.com/og-images/herbalead-main-og-image.jpg" />
        
        {/* Configurações adicionais para WhatsApp */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Herbalead" />
        <meta property="og:locale" content="pt_BR" />
        
        {/* Cache busting para forçar atualização */}
        <meta property="og:image" content="https://www.herbalead.com/logos/herbalead/herbalead-og-image.png?v=2024" />
        
        {/* Configurações específicas para WhatsApp */}
        <meta property="og:image:secure_url" content="https://www.herbalead.com/og-images/herbalead-main-og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}