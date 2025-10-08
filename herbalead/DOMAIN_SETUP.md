# 🔧 Configuração do Domínio herbalead.com no Vercel

## 🚨 **Problema Identificado:**
- ✅ Projeto funcionando localmente: http://localhost:3001
- ❌ Domínio herbalead.com: Erro 404 NOT_FOUND
- 🔍 **Causa**: Domínio não configurado no Vercel

## 🛠️ **Soluções:**

### **Solução 1: Usar Domínio do Vercel (Temporário)**
1. Acesse [vercel.com](https://vercel.com)
2. Faça login na sua conta
3. Vá para o projeto "herbalead"
4. Copie a URL do projeto (ex: `herbalead-xxx.vercel.app`)
5. Use essa URL temporariamente

### **Solução 2: Configurar Domínio Personalizado (Definitivo)**

#### **Passo 1: Acessar Configurações**
1. Vá para [vercel.com](https://vercel.com)
2. Selecione o projeto "herbalead"
3. Clique em **Settings**
4. Clique em **Domains**

#### **Passo 2: Adicionar Domínio**
1. Clique em **Add Domain**
2. Digite: `herbalead.com`
3. Clique em **Add**

#### **Passo 3: Configurar DNS**
O Vercel mostrará instruções para configurar o DNS:

**Opção A: Se você tem acesso ao DNS do domínio:**
- Adicione um registro CNAME:
  - **Name**: `@` ou `herbalead.com`
  - **Value**: `cname.vercel-dns.com`

**Opção B: Se você usa um provedor de DNS:**
- Siga as instruções específicas do Vercel
- Geralmente envolve adicionar registros A ou CNAME

#### **Passo 4: Verificar Configuração**
1. Aguarde alguns minutos para propagação
2. Teste: `https://herbalead.com`
3. Deve mostrar o projeto Herbalead

## 🔍 **Verificações Importantes:**

### **1. Variáveis de Ambiente no Vercel**
Certifique-se de que estão configuradas:
```
NEXT_PUBLIC_SUPABASE_URL = https://rjwuedzmapeozijjrcik.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL = https://herbalead.com
NEXT_PUBLIC_BASE_DOMAIN = herbalead.com
```

### **2. Deploy Status**
- Verifique se o último deploy foi bem-sucedido
- Se necessário, faça um novo deploy

### **3. SSL Certificate**
- O Vercel configura automaticamente SSL
- Aguarde alguns minutos após configurar o domínio

## 🚀 **Status Atual:**
- **✅ Projeto**: Funcionando perfeitamente
- **✅ GitHub**: Atualizado
- **✅ Vercel**: Deploy realizado
- **❌ Domínio**: Precisa ser configurado

## 📞 **Próximos Passos:**
1. Configure o domínio no Vercel
2. Aguarde propagação DNS
3. Teste o acesso
4. Se houver problemas, verifique as variáveis de ambiente

**O projeto está funcionando perfeitamente, só precisa configurar o domínio!** 🎯

