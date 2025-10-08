# 🚨 CORREÇÃO URGENTE - Erro de Política RLS

## ❌ PROBLEMA IDENTIFICADO
**Erro**: "new row violates row-level security policy for table 'professionals'"

**Causa**: As políticas RLS estão impedindo o cadastro público de novos profissionais.

## ✅ SOLUÇÃO IMEDIATA

### 1. Acesse o Supabase SQL Editor
- **Link**: https://supabase.com/dashboard/project/rjwuedzmapeozijjrcik/sql

### 2. Execute o SQL de Correção
Copie e cole o código do arquivo `sql/fix_rls_policies.sql` no SQL Editor.

### 3. Verifique se Funcionou
Após executar o SQL, teste o cadastro novamente em:
- **Link**: https://herbalead.com/login

## 🔧 O QUE O SQL CORRIGE

### Antes (Problemático):
- ❌ Política restritiva: "Professionals can manage their own data"
- ❌ Impedia cadastro público de novos profissionais

### Depois (Corrigido):
- ✅ "Anyone can create professional profile" - Permite cadastro público
- ✅ "Professionals can view their own data" - Mantém segurança
- ✅ "Professionals can update their own data" - Permite edição própria
- ✅ "Professionals can delete their own data" - Permite exclusão própria

## 📋 POLÍTICAS CORRIGIDAS

### Professionals (Profissionais)
- ✅ **INSERT**: Qualquer pessoa pode criar perfil (cadastro)
- ✅ **SELECT**: Profissional vê apenas seus dados
- ✅ **UPDATE**: Profissional edita apenas seus dados
- ✅ **DELETE**: Profissional deleta apenas seus dados

### Leads
- ✅ **INSERT**: Qualquer pessoa pode criar lead
- ✅ **SELECT/UPDATE/DELETE**: Profissional gerencia apenas seus leads

### Professional Links
- ✅ **SELECT**: Qualquer pessoa pode ver links (público)
- ✅ **INSERT/UPDATE/DELETE**: Profissional gerencia apenas seus links

### Lead Notes
- ✅ **Todas operações**: Profissional gerencia apenas notas de seus leads

## 🎯 RESULTADO ESPERADO

Após executar o SQL:
1. ✅ Cadastro de profissionais funcionará
2. ✅ Segurança mantida (cada um vê apenas seus dados)
3. ✅ Leads podem ser criados publicamente
4. ✅ Links podem ser visualizados publicamente

## 🆘 SE AINDA NÃO FUNCIONAR

1. **Verifique se o SQL foi executado sem erros**
2. **Aguarde alguns segundos para as políticas serem aplicadas**
3. **Teste o cadastro novamente**
4. **Verifique o console do navegador para outros erros**

## 📞 STATUS ATUAL
- ❌ **Cadastro**: Bloqueado por política RLS
- ✅ **Login**: Funcionando
- ✅ **Site**: Funcionando
- ✅ **Banco**: Configurado

**Próximo passo**: Executar o SQL de correção das políticas RLS


