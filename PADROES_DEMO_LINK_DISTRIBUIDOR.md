# Padrões Demo ↔ Link Distribuidor

## 📋 Visão Geral

Este documento estabelece os padrões obrigatórios para manter **100% de sincronização** entre:
- **Demo**: `/demo/[ferramenta]` (área de vendas)
- **Link Distribuidor**: `/[usuario]/[projeto]` (funcionalidade real)

## 🎯 Objetivo

Garantir que toda ferramenta tenha **experiência idêntica** no demo e no link do distribuidor, mantendo consistência visual, funcional e de conversão.

---

## 📐 Template Padrão Obrigatório

### 1. Estrutura de Páginas

```
┌─ Cabeçalho com Logo/Nome
├─ Seção de Impacto (Demo) / Header Simples (Link)
├─ Como Funciona (Demo) / Pular (Link)
├─ Formulário Interativo
├─ Resultados + Melhorias
├─ CTA Principal
└─ Disclaimer
```

### 2. Campos Padrão por Ferramenta

#### 📊 Calculadora de IMC
- **Obrigatórios**: Peso (kg), Altura (cm)
- **Complementares**: Idade, Gênero, Nível de Atividade Física

#### 🥤 Calculadora de Proteína
- **Obrigatórios**: Peso (kg), Objetivo (ganho/perda/mantenção)
- **Complementares**: Idade, Gênero, Nível de Atividade, Tipo de Exercício

#### 🍽️ Planejador de Refeições
- **Obrigatórios**: Peso, Altura, Objetivo
- **Complementares**: Idade, Gênero, Restrições Alimentares, Preferências

#### 💧 Calculadora de Hidratação
- **Obrigatórios**: Peso (kg), Nível de Atividade
- **Complementares**: Idade, Clima, Tipo de Exercício

#### 📝 Avaliação Nutricional
- **Obrigatórios**: Dados básicos + Questionário
- **Complementares**: Histórico médico, Medicamentos

---

## 🎨 Sistema de Cores Padrão

### CTA Principal (SEMPRE)
```css
/* Fundo */
background: linear-gradient(to right, #ecfdf5, #d1fae5)
border: 2px solid #a7f3d0

/* Título */
color: #1f2937

/* Subtítulo */
color: #4b5563

/* Botão */
background: #059669
color: #ffffff
border: 4px solid #047857
```

### Estados do Botão
```css
/* Hover */
background: #047857
transform: scale(1.05)

/* Focus */
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

---

## 💬 Linguagem Padrão

### Termos Obrigatórios
- ✅ **"Especialista"** (nunca "nutricionista" ou "médico")
- ✅ **"Procure um especialista"**
- ✅ **"Consulte um especialista"**
- ✅ **"Análise mais completa"**

### Termos Proibidos
- ❌ "Nutricionista"
- ❌ "Médico"
- ❌ "Profissional de saúde"
- ❌ "Doutor"

---

## 🎯 Gatilhos de Persuasão

### 1. Seção "O que você pode melhorar"
- **Sempre incluir** 3 melhorias específicas
- **Formato**: Cards com ícones
- **Tom**: Motivacional e específico

### 2. Recomendações Personalizadas
- **Sempre incluir** 3 recomendações
- **Formato**: Lista com bullets verdes
- **Tom**: Profissional e acionável

### 3. CTA Final
- **Sempre incluir** emoji de alvo 🎯
- **Sempre incluir** texto de impacto
- **Sempre incluir** botão destacado

---

## 📱 Responsividade Padrão

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Comportamento
- **Formulários**: 1 coluna (mobile), 2 colunas (desktop)
- **Cards**: 1 coluna (mobile), 3 colunas (desktop)
- **Botões**: Largura total (mobile), largura fixa (desktop)

---

## 🔄 Checklist de Implementação

### Para Cada Nova Ferramenta

#### ✅ Demo (`/demo/[ferramenta]`)
- [ ] Cabeçalho com texto de impacto
- [ ] Seção "Como funciona" com ícones
- [ ] Formulário com campos obrigatórios + complementares
- [ ] Resultados com melhorias + recomendações
- [ ] CTA com cores invertidas
- [ ] Disclaimer científico

#### ✅ Link Distribuidor (`/[usuario]/[projeto]`)
- [ ] **MESMA** estrutura do demo
- [ ] **MESMOS** campos obrigatórios + complementares
- [ ] **MESMOS** resultados + melhorias
- [ ] **MESMO** CTA com cores invertidas
- [ ] **MESMO** disclaimer
- [ ] **MESMA** linguagem neutra

#### ✅ Testes Obrigatórios
- [ ] Demo funcionando perfeitamente
- [ ] Link distribuidor funcionando perfeitamente
- [ ] Experiência idêntica em ambos
- [ ] Responsividade em mobile/tablet/desktop
- [ ] Botão WhatsApp funcionando
- [ ] Cálculos científicos corretos

---

## 🚀 Ferramentas MVP

### Prioridade 1 (Implementar Primeiro)
1. **Calculadora de IMC** ✅
2. **Calculadora de Proteína**
3. **Planejador de Refeições**
4. **Calculadora de Hidratação**
5. **Avaliação Nutricional**
6. **Quiz: Perfil de Bem-Estar**
7. **Tabela: Bem-Estar Diário**
8. **Quiz: Alimentação Saudável**

### Prioridade 2 (Fase 2)
- Composição Corporal
- Objetivos de Saúde
- Quiz: Inspirar Pessoas
- Quiz: Perfil Empreendedor
- Tabelas de Metas/Desafios

---

## 📚 Referências Científicas

### IMC
- **Fonte**: OMS (Organização Mundial da Saúde)
- **Fórmula**: Peso(kg) / Altura(m)²
- **Classificação**: < 18.5 (abaixo), 18.5-24.9 (normal), 25-29.9 (sobrepeso), ≥ 30 (obesidade)

### Proteína
- **Fonte**: Academia de Nutrição e Dietética
- **Cálculo**: 0.8-2.2g/kg peso corporal
- **Fatores**: Idade, sexo, atividade física, objetivos

### Hidratação
- **Fonte**: Instituto de Medicina
- **Cálculo**: 35ml/kg peso corporal + atividade física
- **Fatores**: Clima, tipo de exercício, sudorese

---

## ⚠️ Regras Críticas

### 1. Sincronização Obrigatória
- **NUNCA** implementar demo sem link distribuidor
- **SEMPRE** manter experiência idêntica
- **SEMPRE** testar ambos antes de deploy

### 2. Qualidade Científica
- **SEMPRE** usar fontes científicas confiáveis
- **SEMPRE** incluir disclaimer médico
- **SEMPRE** direcionar para especialista

### 3. Conversão
- **SEMPRE** usar cores invertidas no CTA
- **SEMPRE** incluir gatilhos de persuasão
- **SEMPRE** manter linguagem neutra

---

## 📞 Contato

Para dúvidas sobre implementação ou sugestões de melhoria, consulte este documento ou a equipe de desenvolvimento.

**Última atualização**: Janeiro 2025
**Versão**: 1.0
