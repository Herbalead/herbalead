'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Download, X } from 'lucide-react'

interface QRCodeGeneratorProps {
  url: string
  linkName: string
}

export default function QRCodeGenerator({ url, linkName }: QRCodeGeneratorProps) {
  const [showModal, setShowModal] = useState(false)

  const downloadQRCode = () => {
    const svg = document.getElementById('qrcode-svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = `${linkName}-qrcode.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(url)
    alert('URL copiada para a área de transferência!')
  }

  return (
    <>
      {/* Botão para abrir modal */}
      <button
        onClick={() => setShowModal(true)}
        className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
        title="Gerar QR Code"
      >
        QR Code
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">QR Code - {linkName}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <QRCodeSVG
                  id="qrcode-svg"
                  value={url}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>

            {/* URL */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">URL:</p>
              <div className="flex items-center space-x-2">
                <code className="flex-1 text-xs bg-gray-100 p-2 rounded border border-gray-300 truncate">
                  {url}
                </code>
                <button
                  onClick={copyUrl}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Copiar
                </button>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex space-x-3">
              <button
                onClick={downloadQRCode}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Baixar QR Code</span>
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

