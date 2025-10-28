# Correção de Problemas na Edição e Deleção de Links

## Problemas Identificados

### 1. ❌ BUG CRÍTICO - Função `updateLink` (Linha 1734)

**Problema:** A função estava usando `user.id` (ID de `auth.users`) em vez de `professional.id` (ID de `professionals`)

```javascript
// ❌ ERRADO (antes)
.eq('user_id', user.id)

// ✅ CORRETO (depois)  
.eq('user_id', professional.id)
```

**Consequência:** 
- A edição não funcionava porque o Supabase não encontrava o link
- O erro era silencioso e não mostrava a causa real
- A query retornava 0 linhas porque `user.id` nunca correspondia a `user_id` na tabela `links`

### 2. ✅ Função `deleteLink` estava CORRETA

A função `deleteLink` (linha 1865) já estava usando `professional.id` corretamente:

```javascript
.eq('user_id', professional.id)
```

### 3. 🔍 Pode haver problemas de RLS (Row Level Security)

O script de diagnóstico irá verificar se as políticas RLS estão corretas.

## Correções Aplicadas

1. ✅ **Corrigido** o uso de `user.id` para `professional.id` na função `updateLink`
2. ✅ **Criado** script de diagnóstico completo: `sql/diagnostico_edicao_delecao_links.sql`
3. ✅ **Criado** script de correção RLS: `sql/diagnosticar_problemas_criacao_link.sql`

## Como Diagnosticar

### Passo 1: Execute o diagnóstico no Supabase

Execute o arquivo `sql/diagnostico_edicao_delecao_links.sql` no SQL Editor do Supabase. Este script vai:

- ✅ Verificar se RLS está habilitado
- ✅ Verificar políticas RLS existentes  
- ✅ Verificar permissões de tabela
- ✅ Verificar relação entre professionals e links
- ✅ Identificar links órfãos
- ✅ Verificar problemas com auth.uid()
- ✅ Fazer análise completa de permissões

### Passo 2: Execute a correção se necessário

Se o diagnóstico identificar problemas de RLS, execute:

```sql
sql/diagnosticar_problemas_criacao_link.sql
```

Este script vai:
- Adicionar coluna `og_image` se não existir
- Corrigir foreign keys
- Criar/atualizar políticas RLS corretas
- Atualizar imagens OG dos links existentes

## Estrutura Esperada

A tabela `links` deve ter a seguinte estrutura:

```sql
- id (UUID, PRIMARY KEY)
- user_id (UUID, FOREIGN KEY -> professionals.id)
- name (TEXT)
- tool_name (TEXT)
- cta_text (TEXT)
- redirect_url (TEXT)
- custom_url (TEXT)
- custom_message (TEXT)
- status (TEXT) -- 'active', 'inactive', 'deleted'
- capture_type (TEXT)
- material_title (TEXT)
- material_description (TEXT)
- page_title (TEXT)
- page_greeting (TEXT)
- button_text (TEXT)
- og_image (TEXT) -- NOVO CAMPO
- clicks (INTEGER)
- leads (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Políticas RLS Necessárias

A tabela `links` deve ter as seguintes políticas RLS:

### 1. SELECT - Visualizar links próprios

```sql
CREATE POLICY "users_can_view_own_links" ON links
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM professionals p
            JOIN auth.users au ON p.email = au.email
            WHERE p.id = links.user_id
            AND au.id = auth.uid()
        )
    );
```

### 2. INSERT - Criar links

```sql
CREATE POLICY "users_can_insert_own_links" ON links
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM professionals p
            JOIN auth.users au ON p.email = au.email
            WHERE p.id = links.user_id
            AND au.id = auth.uid()
        )
    );
```

### 3. UPDATE - Editar links próprios

```sql
CREATE POLICY "users_can_update_own_links" ON links
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM professionals p
            JOIN auth.users au ON p.email = au.email
            WHERE p.id = links.user_id
            AND au.id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM professionals p
            JOIN auth.users au ON p.email = au.email
            WHERE p.id = links.user_id
            AND au.id = auth.uid()
        )
    );
```

### 4. DELETE - Deletar links próprios

```sql
CREATE POLICY "users_can_delete_own_links" ON links
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM professionals p
            JOIN auth.users au ON p.email = au.email
            WHERE p.id = links.user_id
            AND au.id = auth.uid()
        )
    );
```

### 5. SELECT PUBLIC - Visualização pública de links ativos

```sql
CREATE POLICY "public_can_view_active_links" ON links
    FOR SELECT
    USING (status = 'active');
```

## Fluxo Correto de Operações

### Editar Link:
1. Usuário clica em "Editar"
2. Sistema abre modal com dados do link
3. Usuário modifica campos
4. Sistema busca `professional.id` baseado no email de `auth.users`
5. Sistema executa UPDATE na tabela `links` usando `professional.id` ✅
6. Sistema atualiza a lista localmente

### Deletar Link:
1. Usuário clica em "Deletar"
2. Sistema confirma a ação
3. Sistema busca `professional.id` baseado no email de `auth.users`
4. Sistema executa DELETE na tabela `links` usando `professional.id` ✅
5. Sistema remove da lista localmente

## Testes Recomendados

Após aplicar as correções, testar:

1. ✅ Criar um novo link
2. ✅ Editar o link criado
3. ✅ Deletar o link criado
4. ✅ Verificar se as alterações persistem após refresh
5. ✅ Verificar se links órfãos foram identificados
6. ✅ Verificar se RLS está funcionando corretamente

## Arquivos Modificados

- ✅ `src/app/user/page.tsx` - Linha 1734 corrigida
- 📄 `sql/diagnostico_edicao_delecao_links.sql` - Novo arquivo de diagnóstico
- 📄 `sql/diagnosticar_problemas_criacao_link.sql` - Novo arquivo de correção

## Próximos Passos

1. Execute `sql/diagnostico_edicao_delecao_links.sql` no Supabase
2. Analise os resultados do diagnóstico
3. Se necessário, execute `sql/diagnosticar_problemas_criacao_link.sql`
4. Teste as funções de editar e deletar links
5. Verifique se os problemas foram resolvidos

