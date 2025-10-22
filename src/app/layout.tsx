import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Herbalead, seu acelerador de leads',
  description: 'Conquiste novos clientes todos os dias com Herbalead, ferramenta profissional para gerar leads qualificados.',
  keywords: 'leads, bem-estar, qualidade de vida, herbalife, distribuidores, profissionais, marketing, herbalead',
  authors: [{ name: 'Herbalead Team' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Herbalead, seu acelerador de leads',
    description: 'Conquiste novos clientes todos os dias com Herbalead, ferramenta profissional para gerar leads qualificados.',
    url: 'https://www.herbalead.com',
    siteName: 'Herbalead',
    images: [
      {
        url: 'https://www.herbalead.com/logos/herbalead/herbalead-og-image.jpg',
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
    title: 'Herbalead, seu acelerador de leads',
    description: 'Conquiste novos clientes todos os dias com Herbalead, ferramenta profissional para gerar leads qualificados.',
    images: ['https://www.herbalead.com/logos/herbalead/herbalead-og-image.jpg'],
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
        
        {/* Configurações adicionais para WhatsApp */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Herbalead" />
        <meta property="og:locale" content="pt_BR" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}