// Script simples para criar imagens OG usando Canvas API
const fs = require('fs');
const path = require('path');

// Função para criar imagem OG simples
function createOGImage(toolName, title, subtitle, icon, gradient) {
  const canvas = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 0;
            padding: 0;
            width: 1200px;
            height: 630px;
            background: ${gradient};
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Arial', sans-serif;
            color: white;
            text-align: center;
        }
        .container {
            max-width: 800px;
        }
        .icon {
            font-size: 120px;
            margin-bottom: 30px;
        }
        .title {
            font-size: 48px;
            font-weight: bold;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .subtitle {
            font-size: 28px;
            margin-bottom: 40px;
            opacity: 0.9;
        }
        .cta {
            font-size: 24px;
            font-weight: 600;
            background: rgba(255,255,255,0.9);
            color: #10B981;
            padding: 15px 30px;
            border-radius: 30px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">${icon}</div>
        <div class="title">${title}</div>
        <div class="subtitle">${subtitle}</div>
        <div class="cta">Descobrir Agora</div>
    </div>
</body>
</html>`;
  
  return canvas;
}

// Definir as imagens OG
const ogImages = {
  'hidratacao': {
    title: 'Calculadora de Hidratação',
    subtitle: 'Descubra quanta água você precisa beber por dia',
    icon: '💧',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  'proteina': {
    title: 'Calculadora de Proteína',
    subtitle: 'Descubra sua necessidade diária de proteína',
    icon: '💪',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  'imc': {
    title: 'Calculadora de IMC',
    subtitle: 'Descubra seu Índice de Massa Corporal ideal',
    icon: '⚖️',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  'nutricao': {
    title: 'Avaliação Nutricional',
    subtitle: 'Descubra seu perfil nutricional personalizado',
    icon: '🥗',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  'meal-planner': {
    title: 'Planejador de Refeições',
    subtitle: 'Crie um plano alimentar personalizado',
    icon: '🍽️',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  },
  'calorie-calculator': {
    title: 'Calculadora de Calorias',
    subtitle: 'Descubra suas calorias diárias ideais',
    icon: '🔥',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  },
  'body-fat': {
    title: 'Calculadora de Gordura Corporal',
    subtitle: 'Estime seu percentual de gordura corporal',
    icon: '📊',
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
  },
  'macros': {
    title: 'Calculadora de Macronutrientes',
    subtitle: 'Calcule seus macronutrientes ideais',
    icon: '⚖️',
    gradient: 'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)'
  },
  'recruitment-potencial': {
    title: 'Descubra Seu Potencial',
    subtitle: 'Faça nosso teste de liderança',
    icon: '🌟',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  'recruitment-ganhos': {
    title: 'Calcule Seus Ganhos',
    subtitle: 'Descubra seu potencial de renda',
    icon: '💰',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  'recruitment-proposito': {
    title: 'Encontre Seu Propósito',
    subtitle: 'Descubra seu verdadeiro propósito de vida',
    icon: '🎯',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  'wellness-profile': {
    title: 'Quiz: Perfil de Bem-Estar',
    subtitle: 'Descubra o perfil de bem-estar dos seus leads',
    icon: '🌟',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  'daily-wellness': {
    title: 'Tabela: Bem-Estar Diário',
    subtitle: 'Acompanhe métricas de bem-estar diárias',
    icon: '📊',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  'healthy-eating': {
    title: 'Quiz: Alimentação Saudável',
    subtitle: 'Avalie hábitos alimentares e oriente nutricionalmente',
    icon: '🥗',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  }
};

// Criar os arquivos HTML
const ogImagesDir = path.join(__dirname, 'public', 'og-images');

console.log('🖼️ Criando imagens OG...');

Object.entries(ogImages).forEach(([toolName, config]) => {
  const htmlContent = createOGImage(toolName, config.title, config.subtitle, config.icon, config.gradient);
  const htmlPath = path.join(ogImagesDir, `${toolName}-og-image.html`);
  
  fs.writeFileSync(htmlPath, htmlContent);
  console.log(`✅ Criado: ${toolName}-og-image.html`);
});

console.log('🎉 Imagens OG criadas com sucesso!');

