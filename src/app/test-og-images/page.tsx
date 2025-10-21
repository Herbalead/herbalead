'use client'

import { useState } from 'react'

export default function TestOGImagesPage() {
  const [testUrl, setTestUrl] = useState('')
  const [result, setResult] = useState('')

  const testLinks = [
    {
      name: 'IMC',
      url: 'https://www.herbalead.com/teste/imc',
      expectedImage: 'https://www.herbalead.com/logos/herbalead/imc-og-image.jpg'
    },
    {
      name: 'Proteína',
      url: 'https://www.herbalead.com/teste/proteina',
      expectedImage: 'https://www.herbalead.com/logos/herbalead/proteina-og-image.jpg'
    },
    {
      name: 'Wellness Profile',
      url: 'https://www.herbalead.com/teste/body-fat',
      expectedImage: 'https://www.herbalead.com/logos/herbalead/wellness-profile-og-image.jpg'
    },
    {
      name: 'Daily Wellness',
      url: 'https://www.herbalead.com/teste/macros',
      expectedImage: 'https://www.herbalead.com/logos/herbalead/daily-wellness-og-image.jpg'
    },
    {
      name: 'Healthy Eating',
      url: 'https://www.herbalead.com/teste/water-intake',
      expectedImage: 'https://www.herbalead.com/logos/herbalead/healthy-eating-og-image.jpg'
    }
  ]

  const testImage = async (url: string) => {
    try {
      const response = await fetch(url)
      if (response.ok) {
        setResult(`✅ Imagem acessível: ${url}`)
      } else {
        setResult(`❌ Erro ${response.status}: ${url}`)
      }
    } catch (error) {
      setResult(`❌ Erro de rede: ${url}`)
    }
  }

  const testOGTags = async (url: string) => {
    try {
      const response = await fetch(url)
      const html = await response.text()
      
      // Procurar por tags og:image
      const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i)
      
      if (ogImageMatch) {
        const imageUrl = ogImageMatch[1]
        setResult(`🔍 OG Image encontrada: ${imageUrl}`)
        
        // Testar se a imagem é acessível
        testImage(imageUrl)
      } else {
        setResult(`❌ Nenhuma tag og:image encontrada em: ${url}`)
      }
    } catch (error) {
      setResult(`❌ Erro ao testar: ${url}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 Teste de Imagens OG
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">🔗 Links de Teste</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testLinks.map((link, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-semibold text-green-600">{link.name}</h3>
                <p className="text-sm text-gray-600 mb-2">URL: {link.url}</p>
                <p className="text-sm text-gray-500 mb-3">Imagem esperada: {link.expectedImage}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => testOGTags(link.url)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Testar OG Tags
                  </button>
                  <button
                    onClick={() => testImage(link.expectedImage)}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                  >
                    Testar Imagem
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">🔍 Teste Manual</h2>
          <div className="flex space-x-4 mb-4">
            <input
              type="text"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              placeholder="Digite uma URL para testar"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => testOGTags(testUrl)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Testar
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">📊 Resultado</h2>
            <div className="bg-gray-100 p-4 rounded-md">
              <pre className="whitespace-pre-wrap text-sm">{result}</pre>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">🛠️ Ferramentas Externas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-blue-600 mb-2">Facebook Debugger</h3>
              <p className="text-sm text-gray-600 mb-2">
                Testa e força atualização do cache do Facebook/WhatsApp
              </p>
              <a
                href="https://developers.facebook.com/tools/debug/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                🔗 Abrir Facebook Debugger
              </a>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-green-600 mb-2">Twitter Card Validator</h3>
              <p className="text-sm text-gray-600 mb-2">
                Valida tags Open Graph e Twitter Cards
              </p>
              <a
                href="https://cards-dev.twitter.com/validator"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-700 text-sm"
              >
                🔗 Abrir Twitter Validator
              </a>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-yellow-800 mb-4">⚠️ Importante</h2>
          <ul className="text-yellow-700 space-y-2">
            <li>• <strong>Cache do WhatsApp:</strong> Pode demorar até 24h para atualizar</li>
            <li>• <strong>Facebook Debugger:</strong> Força atualização imediata</li>
            <li>• <strong>Novos links:</strong> Funcionam imediatamente</li>
            <li>• <strong>Links antigos:</strong> Podem precisar de tempo para atualizar</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
