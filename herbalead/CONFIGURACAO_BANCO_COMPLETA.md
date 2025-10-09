# 🗄️ CONFIGURAÇÃO COMPLETA DO BANCO DE DADOS SUPABASE

## 📋 PASSO A PASSO PARA CRIAR AS TABELAS

### 1. Acesse o Supabase Dashboard
- **Link**: https://supabase.com/dashboard/project/rjwuedzmapeozijjrcik/sql
- Faça login na sua conta Supabase

### 2. Execute o SQL Completo
Copie e cole o código SQL do arquivo `herbalead_complete_setup.sql` no SQL Editor do Supabase.

### 3. Verificação das Tabelas Criadas
Após executar o SQL, você deve ter estas tabelas:

✅ **professionals** - Dados dos profissionais
✅ **leads** - Leads capturados
✅ **lead_notes** - Notas dos leads
✅ **professional_links** - Links personalizados
✅ **projects** - Projetos multi-tenancy
✅ **auth_users** - Usuários do sistema

## 🔧 CONFIGURAÇÃO DAS VARIÁVEIS NO VERCEL

### 1. Acesse o Vercel Dashboard
- **Link**: https://vercel.com/dashboard
- Encontre o projeto "herbalead"

### 2. Configure as Variáveis de Ambiente
Vá em **Settings** → **Environment Variables** e adicione:

```
NEXT_PUBLIC_SUPABASE_URL = https://rjwuedzmapeozijjrcik.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqd3VlZHptYXBlb3ppampyY2lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MzI3MjMsImV4cCI6MjA3NTUwODcyM30.M5CFogx19_WnT_rU86fe1FUKn6yo4Dy-rKdZjRkUSd4
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqd3VlZHptYXBlb3ppampyY2lrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkzMjcyMywiZXhwIjoyMDc1NTA4NzIzfQ.ve6NyK_3JRdiz_X-oAaYFoopQqLrnMV1OFRQI-H0A94
```

### 3. Faça Redeploy
- Vá em **Deployments**
- Clique nos três pontos do último deployment
- Selecione **"Redeploy"**

## 📊 ESTRUTURA DAS TABELAS

### Professionals
- `id` - UUID único
- `name` - Nome do profissional
- `email` - Email único
- `phone` - Telefone
- `specialty` - Especialidade
- `company` - Empresa
- `is_active` - Status ativo/inativo
- `max_leads` - Limite de leads

### Leads
- `id` - UUID único
- `professional_id` - Referência ao profissional
- `name` - Nome do lead
- `email` - Email do lead
- `phone` - Telefone do lead
- `age`, `gender`, `weight`, `height` - Dados físicos
- `calculator_type` - Tipo de calculadora usada
- `results` - Resultados em JSON
- `status` - Status do lead (new, contacted, converted)
- `priority` - Prioridade (low, medium, high)

### Professional Links
- `id` - UUID único
- `professional_id` - Referência ao profissional
- `tool_name` - Nome da ferramenta
- `custom_url` - URL personalizada
- `redirect_url` - URL de redirecionamento

## 🔐 SEGURANÇA (RLS)

O sistema já está configurado com Row Level Security:
- Profissionais só veem seus próprios dados
- Leads podem ser criados publicamente
- Links podem ser visualizados publicamente
- Notas só são visíveis para o profissional dono do lead

## ✅ CHECKLIST FINAL

- [ ] SQL executado no Supabase
- [ ] Tabelas criadas e verificadas
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Redeploy realizado
- [ ] Site funcionando online

## 🆘 SE ALGO DER ERRADO

1. **Verifique se todas as variáveis foram adicionadas**
2. **Confirme que o SQL foi executado sem erros**
3. **Aguarde alguns minutos após o redeploy**
4. **Teste em modo incógnito**

## 📞 LINKS ÚTEIS

- **Supabase SQL Editor**: https://supabase.com/dashboard/project/rjwuedzmapeozijjrcik/sql
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Site Herbalead**: https://herbalead.vercel.app (após configuração)



