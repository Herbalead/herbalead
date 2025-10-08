# 🚨 URGENTE: Configurar Variáveis de Ambiente no Vercel

## 🔍 **Problema Identificado:**
- ✅ Build local: Funcionando perfeitamente
- ❌ Vercel: Erro 404 porque build falha sem variáveis do Supabase
- 🔍 **Causa**: Variáveis de ambiente não configuradas no Vercel

## 🛠️ **SOLUÇÃO IMEDIATA:**

### **Passo 1: Acessar Vercel Dashboard**
1. Vá para [vercel.com](https://vercel.com)
2. Faça login na sua conta
3. Clique no projeto **"herbalead"**

### **Passo 2: Configurar Variáveis de Ambiente**
1. Clique em **"Settings"** (Configurações)
2. Clique em **"Environment Variables"** (Variáveis de Ambiente)
3. Clique em **"Add New"** (Adicionar Nova)

### **Passo 3: Adicionar TODAS as Variáveis**
Adicione uma por uma:

```
NEXT_PUBLIC_SUPABASE_URL = https://rjwuedzmapeozijjrcik.supabase.co
```

```
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqd3VlZHptYXBlb3ppampyY2lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MzI3MjMsImV4cCI6MjA3NTUwODcyM30.M5CFogx19_WnT_rU86fe1FUKn6yo4Dy-rKdZjRkUSd4
```

```
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqd3VlZHptYXBlb3ppampyY2lrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkzMjcyMywiZXhwIjoyMDc1NTA4NzIzfQ.ve6NyK_3JRdiz_X-oAaYFoopQqLrnMV1OFRQI-H0A94
```

```
NEXT_PUBLIC_APP_URL = https://herbalead.vercel.app
```

```
NEXT_PUBLIC_BASE_DOMAIN = herbalead.com
```

### **Passo 4: Configurar Ambientes**
Para cada variável:
- ✅ Marque **Production**
- ✅ Marque **Preview** 
- ✅ Marque **Development**

### **Passo 5: Salvar e Fazer Deploy**
1. Clique em **"Save"** (Salvar)
2. Vá para **"Deployments"** (Deploys)
3. Clique em **"Redeploy"** no último deployment
4. Ou faça um novo push para o GitHub

## ⏱️ **Tempo Estimado:**
- Configuração: 5 minutos
- Deploy: 2-3 minutos
- **Total: ~8 minutos**

## ✅ **Após Configurar:**
- O build no Vercel funcionará
- O site ficará online
- Todas as funcionalidades estarão disponíveis

## 🚨 **IMPORTANTE:**
**Sem essas variáveis, o Supabase não consegue conectar e o build falha!**

**Configure AGORA para resolver o erro 404!** 🎯

