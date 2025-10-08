# 🚨 CORREÇÃO URGENTE - Vercel 404 Error

## Problema Identificado
O erro 404 no Vercel indica que as variáveis de ambiente do Supabase não estão configuradas corretamente.

## Solução Imediata

### 1. Acesse o Dashboard do Vercel
- Vá para: https://vercel.com/dashboard
- Encontre o projeto "herbalead"
- Clique em "Settings" → "Environment Variables"

### 2. Adicione as Variáveis Obrigatórias
Adicione EXATAMENTE estas variáveis:

```
NEXT_PUBLIC_SUPABASE_URL=https://rjwuedzmapeozijjrcik.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqd3VlZHptYXBlb3ppampyY2lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MzI3MjMsImV4cCI6MjA3NTUwODcyM30.M5CFogx19_WnT_rU86fe1FUKn6yo4Dy-rKdZjRkUSd4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqd3VlZHptYXBlb3ppampyY2lrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkzMjcyMywiZXhwIjoyMDc1NTA4NzIzfQ.ve6NyK_3JRdiz_X-oAaYFoopQqLrnMV1OFRQI-H0A94
```

### 3. Redeploy
Após adicionar as variáveis:
- Vá para "Deployments"
- Clique nos três pontos do último deployment
- Selecione "Redeploy"

## Verificação
Após o redeploy, acesse: https://herbalead.vercel.app

## Status Atual
✅ Build local funcionando
✅ Código no GitHub atualizado
❌ Variáveis de ambiente no Vercel faltando

## Próximos Passos
1. Configure as variáveis no Vercel
2. Faça redeploy
3. Teste o site online

