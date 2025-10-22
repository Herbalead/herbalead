// Exemplo de uso do PhoneInput unificado
// Substitua os campos de telefone existentes por este componente

import React, { useState } from 'react'
import PhoneInput, { usePhoneInput } from '@/components/PhoneInput'

export default function ExamplePhoneForm() {
  const { phone, formattedPhone, isValid, handlePhoneChange } = usePhoneInput()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '55'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isValid) {
      alert('Por favor, insira um telefone válido')
      return
    }
    
    console.log('Dados do formulário:', {
      ...formData,
      phone: phone, // Formato para armazenamento: 5511999999999
      formattedPhone: formattedPhone, // Formato para exibição: (11) 99999-9999
      isValid: isValid
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Telefone *
        </label>
        <PhoneInput
          value={phone}
          onChange={handlePhoneChange}
          placeholder="11999999999"
          required={true}
          showCountrySelector={true}
          defaultCountry="55"
          className="w-full"
        />
        
        {/* Mostrar status de validação */}
        {phone && (
          <div className="mt-2 text-sm">
            {isValid ? (
              <span className="text-green-600">✅ Telefone válido</span>
            ) : (
              <span className="text-red-600">❌ Telefone inválido</span>
            )}
            <div className="text-gray-500 mt-1">
              <div>Armazenamento: {phone}</div>
              <div>Exibição: {formattedPhone}</div>
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className={`w-full py-2 px-4 rounded-md font-medium ${
          isValid 
            ? 'bg-green-600 text-white hover:bg-green-700' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Enviar Formulário
      </button>
    </form>
  )
}
