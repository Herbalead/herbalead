# 🚨 CORREÇÃO RLS - VERSÃO 2 (SEM CONFLITOS)

## ❌ PROBLEMA IDENTIFICADO
**Erro**: "policy 'Anyone can create leads' for table 'leads' already exists"

**Causa**: Tentativa de criar políticas que já existem no banco.

## ✅ SOLUÇÃO CORRIGIDA

### 1. Acesse o Supabase SQL Editor
- **Link**: https://supabase.com/dashboard/project/rjwuedzmapeozijjrcik/sql

### 2. Execute o SQL Corrigido
**Use o arquivo**: `sql/fix_rls_policies_v2.sql`

Este arquivo:
- ✅ **Remove TODAS as políticas existentes** primeiro
- ✅ **Cria políticas com nomes únicos** (sem conflitos)
- ✅ **Permite cadastro público** de profissionais
- ✅ **Mantém segurança** (cada um vê apenas seus dados)

### 3. Teste o Cadastro
Após executar o SQL, teste novamente em:
- **Link**: https://herbalead.com/login

## 🔧 DIFERENÇAS DA VERSÃO 2

### Antes (V1 - Com Conflitos):
- ❌ Tentava criar políticas que já existiam
- ❌ Causava erro "policy already exists"

### Agora (V2 - Sem Conflitos):
- ✅ Remove TODAS as políticas existentes primeiro
- ✅ Cria políticas com nomes únicos:
  - `professionals_insert_public`
  - `professionals_select_own`
  - `leads_insert_public`
  - `leads_select_own`
  - etc.

## 📋 POLÍTICAS CRIADAS (V2)

### Professionals
- ✅ `professionals_insert_public` - Cadastro público
- ✅ `professionals_select_own` - Ver apenas próprios dados
- ✅ `professionals_update_own` - Editar apenas próprios dados
- ✅ `professionals_delete_own` - Deletar apenas próprios dados

### Leads
- ✅ `leads_insert_public` - Criar leads publicamente
- ✅ `leads_select_own` - Ver apenas próprios leads
- ✅ `leads_update_own` - Editar apenas próprios leads
- ✅ `leads_delete_own` - Deletar apenas próprios leads

### Professional Links
- ✅ `professional_links_select_public` - Ver links publicamente
- ✅ `professional_links_insert_own` - Criar apenas próprios links
- ✅ `professional_links_update_own` - Editar apenas próprios links
- ✅ `professional_links_delete_own` - Deletar apenas próprios links

### Lead Notes
- ✅ `lead_notes_insert_own` - Criar notas apenas para próprios leads
- ✅ `lead_notes_select_own` - Ver notas apenas de próprios leads
- ✅ `lead_notes_update_own` - Editar notas apenas de próprios leads
- ✅ `lead_notes_delete_own` - Deletar notas apenas de próprios leads

## 🎯 RESULTADO ESPERADO

Após executar o SQL V2:
1. ✅ **Sem erros de conflito**
2. ✅ **Cadastro de profissionais funcionará**
3. ✅ **Segurança mantida**
4. ✅ **Leads podem ser criados publicamente**
5. ✅ **Links podem ser visualizados publicamente**

## 🆘 SE AINDA NÃO FUNCIONAR

1. **Verifique se o SQL V2 foi executado sem erros**
2. **Aguarde alguns segundos para as políticas serem aplicadas**
3. **Teste o cadastro novamente**
4. **Verifique o console do navegador**

## 📞 STATUS ATUAL
- ❌ **Cadastro**: Bloqueado por política RLS (conflito de nomes)
- ✅ **Login**: Funcionando
- ✅ **Site**: Funcionando
- ✅ **Banco**: Configurado

**Próximo passo**: Executar o SQL V2 (sem conflitos)





