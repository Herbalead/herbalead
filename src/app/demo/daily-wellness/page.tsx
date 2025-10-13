'use client'

import { useState } from 'react'
import { 
  ArrowLeft, 
  ArrowRight, 
  AlertTriangle, 
  Calendar
} from 'lucide-react'
import Link from 'next/link'

interface WellnessEntry {
  date: string
  sleep: number
  exercise: number
  nutrition: number
  hydration: number
  mood: number
  energy: number
  stress: number
  notes: string
}

export default function DailyWellnessDemoPage() {
  const [wellnessEntry, setWellnessEntry] = useState<WellnessEntry>({
    date: new Date().toISOString().split('T')[0],
    sleep: 0,
    exercise: 0,
    nutrition: 0,
    hydration: 0,
    mood: 0,
    energy: 0,
    stress: 0,
    notes: ''
  })

  // const calculateWellnessScore = () => {
    const { sleep, exercise, nutrition, hydration, mood, energy, stress } = wellnessEntry
    
    // Calculate total score (0-10 scale for each category)
    const totalScore = sleep + exercise + nutrition + hydration + mood + energy + (10 - stress) // Stress is inverted
    const maxScore = 70 // 7 categories × 10 points each
    const percentage = (totalScore / maxScore) * 100
    
    let category = ''
    let color = ''
    let recommendations = []
    let improvements = []
    let wellnessTips = []
    
    if (percentage >= 80) {
      category = 'Excelente Dia'
      color = 'text-green-600'
      recommendations = [
        'Continue mantendo seus hábitos saudáveis',
        'Compartilhe suas estratégias com outros',
        'Monitore regularmente para manter o equilíbrio'
      ]
      improvements = [
        'Manter excelente qualidade de vida',
        'Otimizar ainda mais seu bem-estar',
        'Prevenir possíveis desequilíbrios futuros'
      ]
    } else if (percentage >= 60) {
      category = 'Bom Dia'
      color = 'text-blue-600'
      recommendations = [
        'Identifique áreas específicas para melhorar',
        'Mantenha os hábitos que já funcionam bem',
        'Considere pequenos ajustes na rotina'
      ]
      improvements = [
        'Melhorar áreas específicas de bem-estar',
        'Otimizar qualidade de vida',
        'Prevenir problemas futuros'
      ]
    } else if (percentage >= 40) {
      category = 'Dia Regular'
      color = 'text-yellow-600'
      recommendations = [
        'Consulte um especialista para orientação',
        'Foque em uma área por vez para melhorar',
        'Estabeleça metas realistas e alcançáveis'
      ]
      improvements = [
        'Melhorar qualidade de vida',
        'Reduzir níveis de estresse',
        'Otimizar hábitos de saúde'
      ]
    } else {
      category = 'Dia Precisa de Atenção'
      color = 'text-red-600'
      recommendations = [
        'Consulte um especialista urgentemente',
        'Priorize sua saúde física e mental',
        'Considere apoio profissional para mudanças'
      ]
      improvements = [
        'Melhorar saúde geral',
        'Reduzir riscos à saúde',
        'Estabelecer hábitos saudáveis'
      ]
    }
    
    wellnessTips = [
      'Registre seus hábitos diariamente para identificar padrões',
      'Estabeleça metas pequenas e alcançáveis',
      'Celebre pequenas vitórias ao longo do caminho',
      'Mantenha consistência mesmo em dias difíceis',
      'Ajuste suas metas conforme necessário',
      'Busque apoio quando precisar',
      'Lembre-se: progresso, não perfeição',
      'Reflita sobre o que funcionou bem hoje'
    ]
    
    return {
      totalScore: totalScore.toString(),
      category,
      color,
      recommendations,
      improvements,
      wellnessTips,
      weeklyAverage: percentage.toFixed(0)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Demo não mostra resultados, apenas simula o processo
    alert('Demo: Esta é uma simulação! Na versão real, você veria seus resultados aqui.')
  }

  const handleInputChange = (field: keyof WellnessEntry, value: number | string) => {
    setWellnessEntry(prev => ({
      ...prev,
      [field]: value
    }))
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tabela: Bem-Estar Diário</h1>
                <p className="text-sm text-gray-600">Demo - Herbalead</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Impact Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl shadow-lg p-8 mb-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Veja como seus clientes terão uma experiência incrível
          </h2>
          <p className="text-xl text-teal-100 mb-6">
            E como cada ferramenta pode gerar novos contatos automaticamente!
          </p>
          <div className="bg-white/20 rounded-lg p-4 inline-block">
            <p className="text-sm">
              💡 Esta é uma versão de demonstração. Quando você adquirir o acesso, poderá personalizar o botão, mensagem e link de destino (WhatsApp, formulário ou site).
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🚀 Como funciona esta ferramenta para gerar leads
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-600">1️⃣</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Cliente registra hábitos</h4>
              <p className="text-sm text-gray-600">Avalia sono, exercício, alimentação e humor diariamente</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-600">2️⃣</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Sistema calcula score</h4>
              <p className="text-sm text-gray-600">Analisa padrões e fornece recomendações personalizadas</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-600">3️⃣</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Cliente entra em contato</h4>
              <p className="text-sm text-gray-600">Clica no botão e conversa com você automaticamente</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-teal-600 font-semibold">💬 Você escolhe o texto e o link do botão!</p>
          </div>
        </div>

        {/* Wellness Table */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Registre seu Bem-Estar Diário</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data *
              </label>
              <input
                type="date"
                required
                value={wellnessEntry.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Wellness Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualidade do Sono (0-10) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="10"
                  value={wellnessEntry.sleep}
                  onChange={(e) => handleInputChange('sleep', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="8"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exercício Físico (0-10) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="10"
                  value={wellnessEntry.exercise}
                  onChange={(e) => handleInputChange('exercise', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="7"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alimentação (0-10) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="10"
                  value={wellnessEntry.nutrition}
                  onChange={(e) => handleInputChange('nutrition', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="8"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hidratação (0-10) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="10"
                  value={wellnessEntry.hydration}
                  onChange={(e) => handleInputChange('hydration', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="9"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Humor (0-10) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="10"
                  value={wellnessEntry.mood}
                  onChange={(e) => handleInputChange('mood', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="8"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de Energia (0-10) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="10"
                  value={wellnessEntry.energy}
                  onChange={(e) => handleInputChange('energy', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="7"
                />
              </div>
            </div>

            {/* Stress Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível de Estresse (0-10) *
              </label>
              <input
                type="number"
                required
                min="0"
                max="10"
                value={wellnessEntry.stress}
                onChange={(e) => handleInputChange('stress', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="3"
              />
              <p className="text-sm text-gray-500 mt-1">0 = sem estresse, 10 = muito estressado</p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações (opcional)
              </label>
              <textarea
                value={wellnessEntry.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                rows={3}
                placeholder="Como foi seu dia? O que funcionou bem? O que pode melhorar?"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full px-8 py-4 bg-teal-600 text-white rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center"
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
          <button className="px-12 py-6 bg-teal-600 text-white rounded-xl font-bold text-xl hover:bg-teal-700 transition-all duration-300 shadow-2xl transform hover:scale-110 hover:shadow-3xl">
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
                Esta tabela é uma ferramenta de orientação para monitoramento pessoal. 
                Não substitui uma avaliação profissional completa. Consulte sempre um especialista.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
