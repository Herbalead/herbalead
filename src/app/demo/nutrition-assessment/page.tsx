'use client'

import { useState } from 'react'
import { 
  ArrowLeft, 
  ArrowRight, 
  AlertTriangle, 
  ClipboardList
} from 'lucide-react'
import Link from 'next/link'

interface NutritionData {
  age: string
  gender: string
  weight: string
  height: string
  activity: string
  dietQuality: string
  mealFrequency: string
  waterIntake: string
  supplements: string
  healthConditions: string[]
  symptoms: string[]
}

interface _NutritionResults {
  bmi: string
  tdee: string
  score: string
  category: string
  color: string
  recommendations: string[]
  improvements: string[]
  nutritionalNeeds: {
    calories: string
    protein: string
    carbs: string
    fat: string
    fiber: string
    water: string
  }
}

export default function NutritionAssessmentDemoPage() {
  const [formData, setFormData] = useState<NutritionData>({
    age: '',
    gender: '',
    weight: '',
    height: '',
    activity: '',
    dietQuality: '',
    mealFrequency: '',
    waterIntake: '',
    supplements: '',
    healthConditions: [],
    symptoms: []
  })

  const healthConditions = [
    'Diabetes',
    'Hipertensão',
    'Colesterol alto',
    'Problemas digestivos',
    'Alergias alimentares',
    'Intolerâncias'
  ]

  const symptoms = [
    'Fadiga constante',
    'Dores de cabeça',
    'Problemas digestivos',
    'Irritabilidade',
    'Dificuldade de concentração',
    'Alterações de humor'
  ]

  const _calculateNutritionAssessment = () => {
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height) / 100
    const age = parseInt(formData.age)
    
    // Cálculo do IMC
    const bmi = weight / (height * height)
    
    // Cálculo do TDEE (Taxa Metabólica Basal + Atividade)
    let bmr = 0
    if (formData.gender === 'masculino') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height * 100) - (5.677 * age)
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height * 100) - (4.330 * age)
    }
    
    // Fator de atividade
    const activityFactors = {
      'sedentario': 1.2,
      'leve': 1.375,
      'moderado': 1.55,
      'intenso': 1.725,
      'muito-intenso': 1.9
    }
    
    const tdee = bmr * (activityFactors[formData.activity as keyof typeof activityFactors] || 1.55)
    
    // Avaliação da qualidade da dieta
    let dietScore = 0
    switch(formData.dietQuality) {
      case 'excelente': dietScore = 4; break
      case 'boa': dietScore = 3; break
      case 'regular': dietScore = 2; break
      case 'ruim': dietScore = 1; break
    }
    
    // Avaliação da frequência de refeições
    let mealScore = 0
    switch(formData.mealFrequency) {
      case '6+': mealScore = 4; break
      case '4-5': mealScore = 3; break
      case '3': mealScore = 2; break
      case '1-2': mealScore = 1; break
    }
    
    // Avaliação da hidratação
    let waterScore = 0
    switch(formData.waterIntake) {
      case 'excelente': waterScore = 4; break
      case 'adequada': waterScore = 3; break
      case 'insuficiente': waterScore = 1; break
    }
    
    // Penalidades por condições de saúde e sintomas
    const healthPenalty = formData.healthConditions.length * 0.5
    const symptomPenalty = formData.symptoms.length * 0.3
    
    // Cálculo do score total
    const totalScore = dietScore + mealScore + waterScore - healthPenalty - symptomPenalty
    const maxScore = 12
    const percentage = (totalScore / maxScore) * 100
    
    let category = ''
    let color = ''
    let recommendations = []
    let improvements = []
    
    if (percentage >= 80) {
      category = 'Excelente Estado Nutricional'
      color = 'text-green-600'
      recommendations = [
        'Continue mantendo seus hábitos alimentares saudáveis',
        'Monitore regularmente sua composição corporal',
        'Considere otimizações específicas para seus objetivos',
        'Mantenha a consistência na hidratação'
      ]
      improvements = [
        'Manter excelente qualidade nutricional',
        'Otimizar ainda mais sua alimentação',
        'Prevenir possíveis desequilíbrios futuros'
      ]
    } else if (percentage >= 60) {
      category = 'Bom Estado Nutricional'
      color = 'text-blue-600'
      recommendations = [
        'Melhore gradualmente a qualidade da sua alimentação',
        'Ajuste a frequência das refeições conforme necessário',
        'Mantenha hidratação adequada',
        'Considere suplementação específica se necessário'
      ]
      improvements = [
        'Melhorar qualidade alimentar',
        'Otimizar hidratação',
        'Ajustar frequência de refeições'
      ]
    } else if (percentage >= 40) {
      category = 'Estado Nutricional Regular'
      color = 'text-yellow-600'
      recommendations = [
        'Foque em melhorar a qualidade da alimentação',
        'Estabeleça uma rotina regular de refeições',
        'Aumente a ingestão de água',
        'Considere buscar orientação nutricional profissional'
      ]
      improvements = [
        'Melhorar qualidade alimentar',
        'Estabelecer rotina alimentar',
        'Otimizar hidratação'
      ]
    } else {
      category = 'Estado Nutricional Precisa Atenção'
      color = 'text-red-600'
      recommendations = [
        'Busque orientação nutricional profissional urgente',
        'Implemente mudanças graduais na alimentação',
        'Priorize hidratação adequada',
        'Considere avaliação médica completa',
        'Foque em alimentos integrais e nutritivos'
      ]
      improvements = [
        'Melhorar saúde nutricional',
        'Reduzir riscos à saúde',
        'Estabelecer hábitos alimentares saudáveis'
      ]
    }
    
    // Necessidades nutricionais específicas
    const nutritionalNeeds = {
      calories: tdee.toFixed(0),
      protein: (weight * 1.2).toFixed(0), // g/kg
      carbs: (tdee * 0.45 / 4).toFixed(0), // 45% das calorias
      fat: (tdee * 0.25 / 9).toFixed(0), // 25% das calorias
      fiber: (weight * 0.4).toFixed(0), // g/kg
      water: (weight * 35).toFixed(0) // ml/kg
    }

    return {
      bmi: bmi.toFixed(1),
      tdee: tdee.toFixed(0),
      score: totalScore.toFixed(1),
      category,
      color,
      recommendations,
      improvements,
      nutritionalNeeds
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Demo não mostra resultados, apenas simula o processo
    alert('Demo: Esta é uma simulação! Na versão real, você veria seus resultados aqui.')
  }

  const handleHealthConditionChange = (condition: string) => {
    const conditions = formData.healthConditions.includes(condition)
      ? formData.healthConditions.filter(c => c !== condition)
      : [...formData.healthConditions, condition]
    
    setFormData({ ...formData, healthConditions: conditions })
  }

  const handleSymptomChange = (symptom: string) => {
    const symptoms = formData.symptoms.includes(symptom)
      ? formData.symptoms.filter(s => s !== symptom)
      : [...formData.symptoms, symptom]
    
    setFormData({ ...formData, symptoms })
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

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🚀 Como funciona esta ferramenta para gerar leads
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1️⃣</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Cliente preenche avaliação</h4>
              <p className="text-sm text-gray-600">Dados pessoais, hábitos alimentares e condições de saúde</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2️⃣</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Sistema analisa perfil</h4>
              <p className="text-sm text-gray-600">Calcula necessidades nutricionais e fornece recomendações</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3️⃣</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Cliente entra em contato</h4>
              <p className="text-sm text-gray-600">Clica no botão e conversa com você automaticamente</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-green-600 font-semibold">💬 Você escolhe o texto e o link do botão!</p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  min="100"
                  max="250"
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="175"
                />
              </div>
            </div>

            {/* Lifestyle Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de Atividade *
                </label>
                <select
                  required
                  value={formData.activity}
                  onChange={(e) => setFormData({...formData, activity: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="sedentario">Sedentário (pouco ou nenhum exercício)</option>
                  <option value="leve">Leve (exercício leve 1-3 dias/semana)</option>
                  <option value="moderado">Moderado (exercício moderado 3-5 dias/semana)</option>
                  <option value="intenso">Intenso (exercício intenso 6-7 dias/semana)</option>
                  <option value="muito-intenso">Muito Intenso (exercício muito intenso, trabalho físico)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualidade da Dieta *
                </label>
                <select
                  required
                  value={formData.dietQuality}
                  onChange={(e) => setFormData({...formData, dietQuality: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="excelente">Excelente (alimentos integrais, variados)</option>
                  <option value="boa">Boa (maioria alimentos saudáveis)</option>
                  <option value="regular">Regular (mistura de alimentos)</option>
                  <option value="ruim">Ruim (muitos alimentos processados)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refeições por Dia *
                </label>
                <select
                  required
                  value={formData.mealFrequency}
                  onChange={(e) => setFormData({...formData, mealFrequency: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="1-2">1-2 refeições</option>
                  <option value="3">3 refeições</option>
                  <option value="4-5">4-5 refeições</option>
                  <option value="6+">6+ refeições</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hidratação *
                </label>
                <select
                  required
                  value={formData.waterIntake}
                  onChange={(e) => setFormData({...formData, waterIntake: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="excelente">Excelente (3L+ por dia)</option>
                  <option value="adequada">Adequada (2-3L por dia)</option>
                  <option value="insuficiente">Insuficiente (menos de 2L por dia)</option>
                </select>
              </div>
            </div>

            {/* Health Conditions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Condições de Saúde (opcional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {healthConditions.map((condition) => (
                  <label key={condition} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.healthConditions.includes(condition)}
                      onChange={() => handleHealthConditionChange(condition)}
                      className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{condition}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Sintomas (opcional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {symptoms.map((symptom) => (
                  <label key={symptom} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.symptoms.includes(symptom)}
                      onChange={() => handleSymptomChange(symptom)}
                      className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{symptom}</span>
                  </label>
                ))}
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