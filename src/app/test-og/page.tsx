'use client'

import { useState } from 'react'

export default function TestOGPage() {
  const [testUrl, setTestUrl] = useState('https://herbalead.com')

  const testOG = () => {
    // Abrir ferramenta de debug do Facebook (que também funciona para WhatsApp)
    window.open(`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(testUrl)}`, '_blank')
  }

  const testWhatsApp = () => {
    // Criar link do WhatsApp para testar
    const message = `Teste do preview do Herbalead: ${testUrl}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🔍 Teste de Open Graph - Herbalead
          </h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                📱 Configurações Atuais
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p><strong>URL da Imagem:</strong> https://herbalead.com/logos/herbalead/herbalead-og-image.png</p>
                <p><strong>Tamanho:</strong> 1200x630px</p>
                <p><strong>Tipo:</strong> PNG</p>
                <p><strong>Alt Text:</strong> Herbalead - Your Lead Accelerator</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                🧪 Ferramentas de Teste
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL para testar:
                  </label>
                  <input
                    type="url"
                    value={testUrl}
                    onChange={(e) => setTestUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={testOG}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <span>🔍</span>
                    <span>Testar no Facebook Debugger</span>
                  </button>
                  
                  <button
                    onClick={testWhatsApp}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                  >
                    <span>📱</span>
                    <span>Testar no WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                📋 Checklist de Verificação
              </h2>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span>Imagem OG existe no servidor</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span>Tamanho correto (1200x630px)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span>Meta tags configuradas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">⚠️</span>
                  <span>Cache pode precisar ser limpo</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                🔧 Soluções Comuns
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Se a imagem não aparecer:</h3>
                <ul className="list-disc list-inside text-yellow-700 space-y-1">
                  <li>Use o Facebook Debugger para limpar o cache</li>
                  <li>Verifique se a URL da imagem está acessível</li>
                  <li>Teste em diferentes dispositivos</li>
                  <li>Espere alguns minutos para propagação</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                🖼️ Preview da Imagem OG
              </h2>
              <div className="border border-gray-300 rounded-lg p-4">
                <img
                  src="/logos/herbalead/herbalead-og-image.png"
                  alt="Herbalead OG Image Preview"
                  className="max-w-full h-auto rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                  }}
                />
                <div className="hidden text-red-500 text-center py-4">
                  ❌ Imagem não encontrada
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
