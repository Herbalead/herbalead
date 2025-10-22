'use client'

import { useState } from 'react'
import { getToolImage, getAvailableTools } from '@/lib/tool-image-mapping'

export default function TestImageSystemPage() {
  const [selectedTool, setSelectedTool] = useState('bmi')
  const [testUrl, setTestUrl] = useState('')
  
  const availableTools = getAvailableTools()
  const currentImage = getToolImage(selectedTool)
  
  const testUrls = [
    'https://www.herbalead.com/stephanie-izidio/proteina',
    'https://www.herbalead.com/cleuza-mizuno/imc',
    'https://www.herbalead.com/cleuza-mizuno/teste'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🧪 Teste do Sistema de Imagens OG
          </h1>
          
          {/* Seletor de Ferramenta */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🔧 Selecione uma Ferramenta:
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableTools.map((tool) => (
                <button
                  key={tool}
                  onClick={() => setSelectedTool(tool)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTool === tool
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium capitalize">
                    {tool.replace('-', ' ')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview da Imagem */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🖼️ Imagem da Ferramenta Selecionada:
            </h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-sm text-gray-600 mb-2">
                <strong>Ferramenta:</strong> {selectedTool}
              </div>
              <div className="text-sm text-gray-600 mb-4">
                <strong>URL da Imagem:</strong> {currentImage}
              </div>
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src={currentImage} 
                  alt={`Imagem OG para ${selectedTool}`}
                  className="w-full h-auto"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/1200x630/ff0000/ffffff?text=Imagem+Não+Encontrada'
                  }}
                />
              </div>
            </div>
          </div>

          {/* URLs de Teste */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🔗 URLs para Testar:
            </h2>
            <div className="space-y-3">
              {testUrls.map((url, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-blue-900">{url}</div>
                      <div className="text-sm text-blue-700">
                        {url.includes('stephanie') ? 'Stephanie - Proteína' : 
                         url.includes('cleuza') ? 'Cleusa - IMC/Teste' : 'Outro usuário'}
                      </div>
                    </div>
                    <button
                      onClick={() => setTestUrl(url)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Testar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Teste de URL Personalizada */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🎯 Teste URL Personalizada:
            </h2>
            <div className="flex gap-4">
              <input
                type="text"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                placeholder="Cole aqui uma URL para testar"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={() => window.open(testUrl, '_blank')}
                disabled={!testUrl}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                Abrir
              </button>
            </div>
          </div>

          {/* Instruções de Teste */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-yellow-800 mb-4">
              📋 Como Testar:
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-yellow-700">
              <li><strong>Copie uma URL</strong> de teste acima</li>
              <li><strong>Cole no WhatsApp</strong> e envie para você mesmo</li>
              <li><strong>Verifique se a imagem</strong> aparece corretamente</li>
              <li><strong>Teste diferentes ferramentas</strong> para ver imagens diferentes</li>
              <li><strong>Use o Facebook Debugger</strong> para forçar atualização do cache</li>
            </ol>
          </div>

          {/* Debug Info */}
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🔍 Informações de Debug:
            </h2>
            <div className="text-sm text-gray-600 space-y-2">
              <div><strong>Ferramentas Disponíveis:</strong> {availableTools.length}</div>
              <div><strong>Ferramenta Atual:</strong> {selectedTool}</div>
              <div><strong>Imagem Atual:</strong> {currentImage}</div>
              <div><strong>URL de Teste:</strong> {testUrl || 'Nenhuma selecionada'}</div>
            </div>
          </div>

          {/* Links Úteis */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              🔗 Links Úteis para Teste:
            </h2>
            <div className="space-y-2">
              <a 
                href="https://developers.facebook.com/tools/debug/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800"
              >
                🔧 Facebook Debugger (força atualização do cache)
              </a>
              <a 
                href="https://www.opengraph.xyz/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800"
              >
                🔍 OpenGraph.xyz (visualiza metadados)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
