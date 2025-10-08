# Configuração das Variáveis de Ambiente no Vercel

## 🚀 Passos para configurar no Vercel:

### 1. Acesse o Dashboard do Vercel
- Vá para [vercel.com](https://vercel.com)
- Faça login na sua conta
- Selecione o projeto "herbalead"

### 2. Configure as Variáveis de Ambiente
Vá em **Settings** → **Environment Variables** e adicione:

#### Supabase Configuration:
```
NEXT_PUBLIC_SUPABASE_URL = https://rjwuedzmapeozijjrcik.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqd3VlZHptYXBlb3ppampyY2lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MzI3MjMsImV4cCI6MjA3NTUwODcyM30.M5CFogx19_WnT_rU86fe1FUKn6yo4Dy-rKdZjRkUSd4
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqd3VlZHptYXBlb3ppampyY2lrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkzMjcyMywiZXhwIjoyMDc1NTA4NzIzfQ.ve6NyK_3JRdiz_X-oAaYFoopQqLrnMV1OFRQI-H0A94
```

#### App Configuration:
```
NEXT_PUBLIC_APP_URL = https://herbalead.vercel.app
NEXT_PUBLIC_BASE_DOMAIN = herbalead.com
```

#### Stripe Configuration (quando disponível):
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_your_publishable_key_here
STRIPE_SECRET_KEY = sk_test_your_secret_key_here
```

### 3. Configurar Ambientes
- Marque todas as variáveis para **Production**, **Preview** e **Development**
- Clique em **Save**

### 4. Fazer Novo Deploy
- Vá para **Deployments**
- Clique em **Redeploy** no último deployment
- Ou faça um novo push para o GitHub

## ✅ Após configurar:
- O build deve funcionar corretamente
- As APIs do Supabase estarão funcionais
- O projeto estará online em https://herbalead.vercel.app

## 🔍 Verificação:
Após o deploy, teste:
- Acesse a URL do projeto
- Teste as calculadoras
- Verifique se os dados estão sendo salvos no Supabase

