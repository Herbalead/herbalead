// Mapeamento simples: Ferramenta = Imagem fixa
export const toolImageMap = {
  'bmi': 'https://www.herbalead.com/logos/herbalead/imc-og-image.jpg',
  'protein': 'https://www.herbalead.com/logos/herbalead/proteina-og-image.jpg',
  'hydration': 'https://www.herbalead.com/logos/herbalead/hidratacao-og-image.jpg',
  'body-composition': 'https://www.herbalead.com/logos/herbalead/body-fat-og-image.jpg',
  'meal-planner': 'https://www.herbalead.com/logos/herbalead/meal-planner-og-image.jpg',
  'nutrition-assessment': 'https://www.herbalead.com/logos/herbalead/nutricao-og-image.jpg',
  'wellness-profile': 'https://www.herbalead.com/logos/herbalead/wellness-profile-og-image.jpg',
  'daily-wellness': 'https://www.herbalead.com/logos/herbalead/daily-wellness-og-image.jpg',
  'healthy-eating': 'https://www.herbalead.com/logos/herbalead/healthy-eating-og-image.jpg',
  'recruitment-potencial': 'https://www.herbalead.com/logos/herbalead/recruitment-potencial-og-image.jpg',
  'recruitment-ganhos': 'https://www.herbalead.com/logos/herbalead/recruitment-ganhos-og-image.jpg',
  'recruitment-proposito': 'https://www.herbalead.com/logos/herbalead/recruitment-proposito-og-image.jpg',
  // Fallback para ferramentas não mapeadas
  'default': 'https://www.herbalead.com/logos/herbalead/herbalead-og-image.jpg'
} as const

// Função para obter imagem da ferramenta
export const getToolImage = (toolName: string): string => {
  return toolImageMap[toolName as keyof typeof toolImageMap] || toolImageMap.default
}

// Função para obter todas as ferramentas disponíveis
export const getAvailableTools = (): string[] => {
  return Object.keys(toolImageMap).filter(key => key !== 'default')
}
