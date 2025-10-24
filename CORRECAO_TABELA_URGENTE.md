# 🚨 CORREÇÃO URGENTE - TABELA PROFESSIONAL_LINKS

## ❌ PROBLEMA IDENTIFICADO:
A tabela `professional_links` no Supabase está faltando colunas que o código está tentando usar:
- `custom_message`
- `project_name` 
- `custom_slug`
- `secure_id`
- `redirect_type`
- `is_active`

## ✅ SOLUÇÃO:

### 1. Acesse o Supabase Dashboard:
- Vá para: https://supabase.com/dashboard
- Entre no seu projeto Herbalead

### 2. Execute o SQL:
- Clique em "SQL Editor" no menu lateral
- Cole o código do arquivo `sql/fix_professional_links_table.sql`
- Clique em "Run" para executar

### 3. Verifique se funcionou:
Após executar, você deve ver a mensagem:
```
Tabela professional_links corrigida com sucesso!
```

## 🔄 APÓS A CORREÇÃO:
1. Volte para o dashboard do Herbalead
2. Tente criar um link novamente
3. O erro deve desaparecer

## 📋 COLUNAS QUE SERÃO ADICIONADAS:
- `custom_message` (TEXT) - Para mensagens personalizadas
- `project_name` (VARCHAR) - Nome do projeto/estratégia  
- `custom_slug` (VARCHAR) - URL personalizada
- `secure_id` (VARCHAR) - ID único de segurança
- `redirect_type` (VARCHAR) - Tipo de redirecionamento
- `is_active` (BOOLEAN) - Status ativo/inativo

**Execute isso AGORA para resolver o problema!** 🚀

































