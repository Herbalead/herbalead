import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Herbalead - Bem-Estar Natural e Tecnologia',
  description: 'Conquiste novos clientes todos os dias com bem-estar natural e tecnologia. Ferramentas profissionais para gerar leads qualificados.',
  keywords: 'leads, bem-estar, qualidade de vida, herbalife, distribuidores, profissionais, marketing, herbalead',
  authors: [{ name: 'Herbalead Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#10B981',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const headers = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
}

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
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}