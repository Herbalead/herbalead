# 📋 PADRÕES DE FUNCIONALIDADES - HERBALEAD

## 🎯 VISÃO GERAL
Este documento estabelece os padrões obrigatórios para todas as funcionalidades (calculadoras) da plataforma Herbalead, garantindo consistência, qualidade e experiência do usuário uniforme.

---

## 🔧 REGRAS GERAIS OBRIGATÓRIAS

### 📝 FORMULÁRIO
- ❌ **NUNCA incluir:** Nome, Email, Telefone
- ✅ **Sempre incluir:** Apenas campos essenciais para o cálculo
- ✅ **Validação:** Todos os campos obrigatórios marcados com *
- ✅ **Layout:** Grid responsivo (1 coluna mobile, 2 colunas desktop)

### 🎨 INTERFACE
- ✅ **Cores:** Verde Herbalead (emerald-600/700)
- ✅ **Fundo:** Branco para formulário, cinza claro para seção CTA
- ✅ **Tipografia:** Fontes consistentes, hierarquia clara
- ✅ **Responsivo:** Funciona em todos os dispositivos

### 📱 BOTÃO CTA (CALL TO ACTION)
- ✅ **Fundo:** Verde escuro (bg-emerald-600)
- ✅ **Texto:** Branco
- ✅ **Conteúdo:** "Clique abaixo e começa a gerar seus leads agora"
- ✅ **Ícone:** Apenas WhatsApp (sem outros ícones)
- ✅ **Efeitos:** Hover, scale, sombra (SEM animate-pulse)
- ✅ **Tamanho:** Grande e destacado (px-12 py-6)
- ✅ **Posicionamento:** Após exibição dos resultados da calculadora

### 🔗 INTEGRAÇÃO WHATSAPP
- ✅ **Redirecionamento:** Para WhatsApp do distribuidor que criou o link
- ✅ **Mensagem:** Pré-definida baseada no resultado
- ✅ **Abertura:** Nova aba (_blank)

---

## 📊 FUNCIONALIDADES ESPECÍFICAS

### 🏃‍♂️ 1. CALCULADORA IMC
**Campos obrigatórios:**
- Idade * (number, 1-120)
- Gênero * (select: Masculino/Feminino)
- Peso (kg) * (number, 1-300, step 0.1)
- Altura (cm) * (number, 100-250)

**Cálculo:**
- Fórmula: peso / (altura/100)²
- Considerar gênero para interpretação
- Classificação OMS

**Recomendações:**
- Baseadas na faixa de IMC
- Linguagem acessível
- Foco em "especialista" (não "nutricionista")

### 🥩 2. CALCULADORA PROTEÍNA
**Campos obrigatórios:**
- Idade * (number, 1-120)
- Gênero * (select: Masculino/Feminino)
- Peso (kg) * (number, 1-300, step 0.1)
- Altura (cm) * (number, 100-250)
- Nível de atividade * (select: Sedentário/Leve/Moderado/Ativo/Muito Ativo)
- Objetivo * (select: Manter peso/Perder peso/Ganhar peso)

**Cálculo:**
- Baseado em tabelas OMS
- Considerar atividade física
- Fórmulas específicas por objetivo

**Recomendações:**
- Distribuição ao longo do dia
- Fontes de proteína
- Timing de consumo

### 💧 3. CALCULADORA HIDRATAÇÃO
**Campos obrigatórios:**
- Idade * (number, 1-120)
- Gênero * (select: Masculino/Feminino)
- Peso (kg) * (number, 1-300, step 0.1)
- Nível de atividade * (select: Sedentário/Leve/Moderado/Ativo/Muito Ativo)
- Clima * (select: Temperado/Quente/Muito Quente)

**Cálculo:**
- Baseado em peso corporal
- Ajuste por atividade
- Ajuste por clima
- Considerar idade

**Recomendações:**
- Distribuição ao longo do dia
- Sinais de desidratação
- Qualidade da água

### 🏋️‍♂️ 4. COMPOSIÇÃO CORPORAL
**Campos obrigatórios:**
- Idade * (number, 1-120)
- Gênero * (select: Masculino/Feminino)
- Peso (kg) * (number, 1-300, step 0.1)
- Altura (cm) * (number, 100-250)
- Circunferência cintura * (number, 50-150)
- Circunferência quadril * (number, 70-150)
- Nível de atividade * (select: Sedentário/Leve/Moderado/Ativo/Muito Ativo)

**Cálculo:**
- IMC
- Relação cintura/quadril
- Percentual de gordura estimado
- Massa muscular estimada

**Recomendações:**
- Interpretação dos resultados
- Metas por gênero
- Estratégias de melhoria

### 🍽️ 5. PLANEJADOR DE REFEIÇÕES
**Campos obrigatórios:**
- Idade * (number, 1-120)
- Gênero * (select: Masculino/Feminino)
- Peso (kg) * (number, 1-300, step 0.1)
- Altura (cm) * (number, 100-250)
- Nível de atividade * (select: Sedentário/Leve/Moderado/Ativo/Muito Ativo)
- Objetivo * (select: Manter peso/Perder peso/Ganhar peso)
- Restrições alimentares (select: Nenhuma/Vegetariano/Vegano/Sem glúten/Sem lactose)

**Cálculo:**
- Calorias diárias
- Distribuição de macronutrientes
- Planejamento de refeições

**Recomendações:**
- Exemplos de refeições
- Dicas de preparo
- Suplementação se necessário

### 🔍 6. AVALIAÇÃO NUTRICIONAL
**Campos obrigatórios:**
- Idade * (number, 1-120)
- Gênero * (select: Masculino/Feminino)
- Peso (kg) * (number, 1-300, step 0.1)
- Altura (cm) * (number, 100-250)
- Nível de atividade * (select: Sedentário/Leve/Moderado/Ativo/Muito Ativo)
- Hábitos alimentares * (select: Regular/Irregular/Muito irregular)
- Suplementação atual (text)

**Cálculo:**
- Análise completa nutricional
- Identificação de deficiências
- Recomendações personalizadas

**Recomendações:**
- Plano alimentar
- Suplementação
- Mudanças de hábitos

---

## 🎬 PÁGINAS DE DEMONSTRAÇÃO

### 📍 ESTRUTURA OBRIGATÓRIA
Todas as páginas de demonstração (`/demo/*`) devem seguir esta estrutura:

1. **Formulário de teste** - Campos específicos da funcionalidade
2. **Exibição de resultados** - Cálculo e recomendações
3. **Botão "Consultar Especialista"** - Roxo, após resultados
4. **Seção CTA simples** - Fundo branco, após botão consultar

### 🎯 SEÇÃO CTA APÓS DEMONSTRAÇÃO
```html
<div className="bg-white rounded-xl p-8 text-center shadow-lg border border-gray-200 mt-8">
  <h3 className="text-3xl font-bold mb-4 text-gray-800">
    💼 Pronto para gerar seus próprios links com seu nome pessoal?
  </h3>
  <p className="text-gray-600 mb-8 text-lg">
    Clique em "Quero gerar meus links" e comece a gerar seus próprios leads com o Herbalead.
  </p>
  <button 
    onClick={() => window.location.href = '/payment'}
    className="px-12 py-6 bg-emerald-600 text-white rounded-xl font-bold text-xl hover:bg-emerald-700 transition-all duration-300 shadow-2xl transform hover:scale-110 hover:shadow-3xl"
  >
    Clique abaixo e começa a gerar seus leads agora
  </button>
</div>
```

### 🚫 REGRAS PARA DEMONSTRAÇÕES
- ❌ **NUNCA incluir:** Seções complexas com múltiplas informações
- ❌ **NUNCA incluir:** Listas de benefícios extensas
- ❌ **NUNCA incluir:** Ofertas especiais detalhadas
- ✅ **SEMPRE incluir:** Apenas o essencial: título, descrição e botão
- ✅ **SEMPRE incluir:** Botão "Consultar Especialista" após resultados
- ✅ **SEMPRE incluir:** Seção CTA simples após demonstração

---

## 🎨 PADRÕES VISUAIS

### 🎯 SEÇÃO CTA (CALL TO ACTION)
```css
/* Container */
bg-gray-50 rounded-xl p-8 text-center shadow-lg border border-gray-200

/* Título */
text-3xl font-bold mb-4 text-gray-800

/* Descrição */
text-gray-600 mb-8 text-lg

/* Botão */
px-12 py-6 bg-emerald-600 text-white rounded-xl font-bold text-xl
hover:bg-emerald-700 transition-all duration-300 shadow-2xl
transform hover:scale-110 hover:shadow-3xl flex items-center justify-center
mx-auto border-4 border-emerald-500
```

### 📱 ÍCONE WHATSAPP
```svg
<svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 24 24">
  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
</svg>
```

---

## 🔗 INTEGRAÇÃO DE LINKS

### 📍 ESTRUTURA DE URL
```
/{usuario}/{projeto}
```
- **usuario:** Nome do distribuidor (slug)
- **projeto:** Nome do projeto (slug)

### 🔄 REDIRECIONAMENTO
1. Cliente acessa link personalizado
2. Sistema busca dados do link no banco
3. Incrementa contador de cliques
4. Redireciona diretamente para calculadora
5. Exibe resultado com botão CTA personalizado

### 📱 WHATSAPP INTEGRATION
```javascript
const whatsappUrl = `https://wa.me/${distributorPhone}?text=${encodeURIComponent(message)}`
window.open(whatsappUrl, '_blank')
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### ✅ ANTES DE CRIAR UMA NOVA FUNCIONALIDADE
- [ ] Definir campos obrigatórios específicos
- [ ] Estabelecer fórmulas de cálculo
- [ ] Criar recomendações personalizadas
- [ ] Definir mensagem WhatsApp específica

### ✅ DURANTE A IMPLEMENTAÇÃO
- [ ] Seguir padrões visuais obrigatórios
- [ ] Implementar validação de campos
- [ ] Conectar ao sistema de links
- [ ] Testar responsividade
- [ ] Validar cálculos
- [ ] **NOVO:** Adicionar botão "Consultar Especialista" após resultados
- [ ] **NOVO:** Implementar seção CTA simples após demonstração
- [ ] **NOVO:** Usar texto padrão "Clique abaixo e começa a gerar seus leads agora"

### ✅ APÓS A IMPLEMENTAÇÃO
- [ ] Testar fluxo completo
- [ ] Verificar integração WhatsApp
- [ ] Validar em diferentes dispositivos
- [ ] Confirmar mensagens de erro
- [ ] Documentar especificidades

---

## 🚨 REGRAS CRÍTICAS

### ❌ NUNCA FAZER
- Incluir campos de contato (nome, email, telefone)
- Usar cores diferentes do padrão Herbalead
- Adicionar ícones além do WhatsApp
- Usar animate-pulse no botão CTA
- Criar intermediários entre link e calculadora
- **NOVO:** Incluir seções complexas nas demonstrações
- **NOVO:** Usar textos diferentes do padrão estabelecido

### ✅ SEMPRE FAZER
- Usar texto personalizado do link no botão CTA
- Conectar WhatsApp ao distribuidor correto
- Manter consistência visual
- Validar todos os campos obrigatórios
- Fornecer recomendações baseadas em evidências
- **NOVO:** Usar texto "Clique abaixo e começa a gerar seus leads agora"
- **NOVO:** Manter demonstrações simples e diretas
- **NOVO:** Incluir botão "Consultar Especialista" após resultados

---

## 📞 SUPORTE

**Para dúvidas sobre este documento:**
- Consulte este arquivo: `PADROES_FUNCIONALIDADES_HERBALEAD.md`
- Mantenha sempre atualizado
- Use como referência obrigatória

---

**📅 Última atualização:** Janeiro 2025  
**🔄 Versão:** 2.0  
**👥 Aplicável a:** Todas as funcionalidades da plataforma Herbalead  
**🆕 Novidades v2.0:** Padrões atualizados para páginas de demonstração, texto CTA padronizado, estrutura simplificada
