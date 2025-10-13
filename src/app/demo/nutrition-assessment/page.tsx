'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, ClipboardList, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function NutritionAssessmentDemoPage() {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    weight: '',
    height: '',
    activity: '',
    dietQuality: '',
    mealFrequency: '',
    waterIntake: '',
    healthConditions: [] as string[],
    symptoms: [] as string[]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Demo: Esta é uma simulação! Na versão real, você veria seus resultados aqui.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Avaliação Nutricional</h1>
                <p className="text-sm text-gray-600">Demo - Herbalead</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Impact Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-8 mb-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Veja como seus clientes terão uma experiência incrível
          </h2>
          <p className="text-xl text-green-100 mb-6">
            E como cada ferramenta pode gerar novos contatos automaticamente!
          </p>
          <div className="bg-white/20 rounded-lg p-4 inline-block">
            <p className="text-sm">
              💡 Esta é uma versão de demonstração. Quando você adquirir o acesso, poderá personalizar o botão, mensagem e link de destino (WhatsApp, formulário ou site).
            </p>
          </div>
        </div>

        {/* Nutrition Assessment Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Avaliação Nutricional Completa</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idade *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="25"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sexo *
                </label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full px-8 py-4 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                Testar Ferramenta (Demo)
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </form>
        </div>

        {/* Final CTA */}
        <div className="bg-gray-50 rounded-xl p-8 text-center shadow-lg border border-gray-200">
          <h3 className="text-3xl font-bold mb-4 text-gray-800">
            💼 Pronto para ter esta ferramenta com seu nome e link personalizado?
          </h3>
          <p className="text-gray-600 mb-8 text-lg">
            Clique em &quot;Assinar Agora&quot; e comece a gerar seus próprios leads com o Herbalead.
          </p>
          <button className="px-12 py-6 bg-green-600 text-white rounded-xl font-bold text-xl hover:bg-green-700 transition-all duration-300 shadow-2xl transform hover:scale-110 hover:shadow-3xl">
            Assinar Agora
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Importante</h4>
              <p className="text-yellow-700 text-sm">
                Esta avaliação é uma ferramenta de orientação e não substitui uma avaliação nutricional profissional completa. 
                Consulte sempre um especialista para uma análise detalhada da sua alimentação.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
