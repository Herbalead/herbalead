'use client'

import { useState } from 'react'
import { 
  Calculator, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Heart,
  Activity,
  Target,
  Share2,
  Copy
} from 'lucide-react'
import Link from 'next/link'

interface BMIResults {
  bmi: string
  category: string
  color: string
  recommendations: string[]
  idealWeight: {
    min: string
    max: string
  }
}

export default function BMICalculatorPage() {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: '',
    activity: ''
  })
  const [results, setResults] = useState<BMIResults | null>(null)
  const [showResults, setShowResults] = useState(false)

  const calculateBMI = () => {
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height) / 100 // Convert cm to meters
    
    if (!weight || !height) return null
    
    const bmi = weight / (height * height)
    
    let category = ''
    let color = ''
    let recommendations = []
    
    if (bmi < 18.5) {
      category = 'Abaixo do peso'
      color = 'text-blue-600'
      recommendations = [
        'Consulte um especialista para ganho de peso saudável',
        'Foque em alimentos nutritivos e calóricos',
        'Considere exercícios de força para ganho de massa muscular'
      ]
    } else if (bmi < 25) {
      category = 'Peso normal'
      color = 'text-green-600'
      recommendations = [
        'Mantenha uma alimentação equilibrada',
        'Continue praticando exercícios regularmente',
        'Monitore seu peso periodicamente'
      ]
    } else if (bmi < 30) {
      category = 'Sobrepeso'
      color = 'text-yellow-600'
      recommendations = [
        'Consulte um especialista para plano de emagrecimento',
        'Reduza calorias e aumente atividade física',
        'Foque em alimentos integrais e vegetais'
      ]
    } else {
      category = 'Obesidade'
      color = 'text-red-600'
      recommendations = [
        'Consulte um médico e especialista urgentemente',
        'Plano de emagrecimento supervisionado',
        'Acompanhamento médico regular'
      ]
    }
    
    return {
      bmi: bmi.toFixed(1),
      category,
      color,
      recommendations,
      idealWeight: {
        min: (18.5 * height * height).toFixed(1),
        max: (24.9 * height * height).toFixed(1)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const bmiResults = calculateBMI()
    if (bmiResults) {
      setResults(bmiResults)
      setShowResults(true)
    }
  }

  const copyResults = () => {
    if (!results) return
    const text = `Meu IMC: ${results.bmi} - ${results.category}\n\nRecomendações:\n${results.recommendations.map(r => `• ${r}`).join('\n')}\n\nCalculado com Herbalead - Ferramentas profissionais de bem-estar`
    navigator.clipboard.writeText(text)
    alert('Resultados copiados para a área de transferência!')
  }

  const shareResults = () => {
    if (!results) return
    const text = `Descobri meu IMC com Herbalead! Meu resultado: ${results.bmi} - ${results.category}. Que tal você também calcular o seu?`
    const url = window.location.href
    navigator.share({ title: 'Meu IMC - Herbalead', text, url })
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4">
              <button
                onClick={() => setShowResults(false)}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Seus Resultados</h1>
                  <p className="text-sm text-gray-600">Calculadora de IMC - Herbalead</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Summary */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Seu Resultado de IMC</h2>
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full mb-4">
                <span className="text-4xl font-bold text-emerald-600">{results.bmi}</span>
              </div>
              <h3 className={`text-2xl font-semibold ${results.color} mb-2`}>
                {results.category}
              </h3>
              <p className="text-gray-600">
                Peso ideal para sua altura: {results.idealWeight.min}kg - {results.idealWeight.max}kg
              </p>
            </div>

            {/* BMI Scale */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Escala de IMC</h4>
              <div className="relative h-8 bg-gray-200 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex">
                  <div className="w-1/4 bg-blue-500"></div>
                  <div className="w-1/4 bg-green-500"></div>
                  <div className="w-1/4 bg-yellow-500"></div>
                  <div className="w-1/4 bg-red-500"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white px-2 py-1 rounded text-sm font-medium">
                    Seu IMC: {results.bmi}
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>&lt; 18.5</span>
                <span>18.5 - 24.9</span>
                <span>25 - 29.9</span>
                <span>&gt; 30</span>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-emerald-50 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                Recomendações Personalizadas
              </h4>
              <ul className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2"></div>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* CTA Section */}
          <div className="bg-gray-50 rounded-xl p-8 text-center shadow-lg border border-gray-200">
            <h3 className="text-3xl font-bold mb-4 text-gray-800">
              🎯 Quer uma análise mais completa?
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Consulte um profissional de bem-estar para um plano personalizado baseado no seu IMC
            </p>
            <button 
              onClick={() => {
                // Buscar WhatsApp do distribuidor que criou o link
                const urlParams = new URLSearchParams(window.location.search)
                const ref = urlParams.get('ref') || 'andre-faula'
                
                // Por enquanto usar número fixo, depois conectar ao banco
                const whatsappUrl = 'https://wa.me/5519981868000?text=Olá! Gostaria de consultar um profissional de bem-estar baseado no meu resultado de IMC.'
                window.open(whatsappUrl, '_blank')
              }}
              className="px-12 py-6 bg-emerald-600 text-white rounded-xl font-bold text-xl hover:bg-emerald-700 transition-all duration-300 shadow-2xl transform hover:scale-110 hover:shadow-3xl flex items-center justify-center mx-auto border-4 border-emerald-500"
            >
              <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              Consultar Profissional de Bem-Estar
            </button>
          </div>
        </main>
      </div>
    )
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
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Calculadora de IMC</h1>
                <p className="text-sm text-gray-600">Análise corporal completa e personalizada</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">O que é o IMC?</h2>
          <p className="text-gray-600 mb-6">
            O Índice de Massa Corporal (IMC) é uma medida que relaciona peso e altura para avaliar se uma pessoa está 
            dentro de uma faixa de peso considerada saudável. É uma ferramenta útil para identificar possíveis riscos 
            à saúde relacionados ao peso.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Saúde</h3>
              <p className="text-sm text-gray-600">Avalia riscos relacionados ao peso</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Precisão</h3>
              <p className="text-sm text-gray-600">Baseado em dados científicos</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Personalizado</h3>
              <p className="text-sm text-gray-600">Recomendações específicas para você</p>
            </div>
          </div>
        </div>

        {/* Calculator Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Calcule seu IMC</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="25"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gênero *
                </label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>
            </div>

            {/* Physical Measurements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="300"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="70.5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Altura (cm) *
                </label>
                <input
                  type="number"
                  required
                  min="50"
                  max="250"
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="175"
                />
              </div>
            </div>


            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full px-8 py-4 bg-emerald-600 text-white rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center"
              >
                Calcular IMC
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </form>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Importante</h4>
              <p className="text-yellow-700 text-sm">
                O IMC é uma ferramenta de triagem e não substitui uma avaliação médica completa. 
                Consulte sempre um profissional de saúde para uma análise mais detalhada da sua saúde.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
