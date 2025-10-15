export const toolMessages = {
  'imc': {
    title: 'Calculadora de IMC Profissional',
    description: 'Calcule seu Índice de Massa Corporal com nossa calculadora especializada e receba orientações personalizadas.',
    shortMessage: 'Calcule seu IMC com nossa calculadora profissional 🏥'
  },
  'proteina': {
    title: 'Calculadora de Proteína Diária',
    description: 'Descubra exatamente quanta proteína você precisa por dia baseado no seu perfil e objetivos.',
    shortMessage: 'Descubra sua necessidade diária de proteína 💪'
  },
  'hidratacao': {
    title: 'Calculadora de Hidratação Ideal',
    description: 'Calcule sua necessidade diária de água para manter-se hidratado e saudável.',
    shortMessage: 'Calcule sua hidratação ideal 💧'
  },
  'nutricao': {
    title: 'Avaliação Nutricional Completa',
    description: 'Faça uma avaliação completa da sua alimentação com nosso especialista em nutrição.',
    shortMessage: 'Avalie sua alimentação com nosso especialista 🥗'
  },
  'bmi': {
    title: 'Calculadora de IMC Profissional',
    description: 'Calcule seu Índice de Massa Corporal com nossa calculadora especializada e receba orientações personalizadas.',
    shortMessage: 'Calcule seu IMC com nossa calculadora profissional 🏥'
  },
  'protein': {
    title: 'Calculadora de Proteína Diária',
    description: 'Descubra exatamente quanta proteína você precisa por dia baseado no seu perfil e objetivos.',
    shortMessage: 'Descubra sua necessidade diária de proteína 💪'
  },
  'hydration': {
    title: 'Calculadora de Hidratação Ideal',
    description: 'Calcule sua necessidade diária de água para manter-se hidratado e saudável.',
    shortMessage: 'Calcule sua hidratação ideal 💧'
  },
  'nutrition-assessment': {
    title: 'Avaliação Nutricional Completa',
    description: 'Faça uma avaliação completa da sua alimentação com nosso especialista em nutrição.',
    shortMessage: 'Avalie sua alimentação com nosso especialista 🥗'
  },
  'meal-planner': {
    title: 'Planejador de Refeições Inteligente',
    description: 'Crie um plano alimentar personalizado baseado nas suas necessidades nutricionais.',
    shortMessage: 'Crie seu plano alimentar personalizado 🍽️'
  },
  'calorie-calculator': {
    title: 'Calculadora de Calorias Diárias',
    description: 'Descubra quantas calorias você precisa consumir por dia para atingir seus objetivos.',
    shortMessage: 'Calcule suas calorias diárias ideais 🔥'
  },
  'body-fat': {
    title: 'Calculadora de Gordura Corporal',
    description: 'Estime seu percentual de gordura corporal com nossa calculadora especializada.',
    shortMessage: 'Estime seu percentual de gordura corporal 📊'
  },
  'macros': {
    title: 'Calculadora de Macronutrientes',
    description: 'Calcule a distribuição ideal de carboidratos, proteínas e gorduras para sua dieta.',
    shortMessage: 'Calcule seus macronutrientes ideais ⚖️'
  },
  'water-intake': {
    title: 'Calculadora de Consumo de Água',
    description: 'Descubra quanta água você deve beber por dia para manter-se hidratado.',
    shortMessage: 'Calcule seu consumo ideal de água 💧'
  }
}

export const getToolMessage = (toolName: string) => {
  return toolMessages[toolName as keyof typeof toolMessages] || {
    title: 'Ferramenta de Saúde e Bem-estar',
    description: 'Acesse nossa ferramenta especializada para cuidar da sua saúde.',
    shortMessage: 'Acesse nossa ferramenta de saúde 🏥'
  }
}
