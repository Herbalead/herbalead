# INSTRUÇÕES PARA RECUPERAR SEUS LINKS

## ⚠️ PROBLEMA ATUAL
Erro 403 - Links existem no banco mas não aparecem na interface

## 🔍 DIAGNÓSTICO - Execute em Ordem

### Passo 1: Execute no Supabase SQL Editor

Copie e execute APENAS esta primeira parte:

```sql
-- Ver se os links existem
SELECT 
    l.id,
    l.name,
    l.user_id,
    l.status,
    p.name as professional_name,
    p.email as professional_email
FROM links l
LEFT JOIN professionals p ON l.user_id = p.id
ORDER BY l.created_at DESC
LIMIT 20;
```

**Me diga:** Apareceram links nesta consulta? Se SIM, os links existem no banco. Se NÃO, os links realmente foram apagados.

---

## ✅ SOLUÇÃO RÁPIDA (se os links existirem)

### Opção 1: Desabilitar RLS temporariamente

Execute no Supabase SQL Editor:

```sql
-- Desabilitar RLS para resolver o problema de permissão
ALTER TABLE links DISABLE ROW LEVEL SECURITY;
```

Depois:
1. Feche completamente o navegador
2. Abra novamente
3. Faça login
4. Os links devem aparecer

---

### Opção 2: Recriar políticas corretas

Execute no Supabase SQL Editor:

```sql
-- Limpar todas as políticas
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'links') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON links';
    END LOOP;
END $$;

-- Criar política SIMPLES e PERMISSIVA
CREATE POLICY "links_all_authenticated" ON links
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Política pública para links ativos
CREATE POLICY "links_public_active" ON links
    FOR SELECT
    TO anon
    USING (status = 'active');
```

Depois:
1. Feche completamente o navegador
2. Abra novamente
3. Faça login
4. Os links devem aparecer

---

## 🔍 DIAGNÓSTICO AVANÇADO

Se as opções acima não funcionarem, execute o arquivo completo:

`sql/diagnostico_completo_links_sumidos.sql`

Ele vai mostrar:
- Quantos links existem no banco
- Se os links têm professional_id correto
- Se as políticas RLS estão corretas
- Se há links órfãos

---

## ❓ PRIMEIRA COISA: Confirmar se os links existem

Execute esta query simples primeiro:

```sql
SELECT COUNT(*) FROM links;
```

**Se retornar 0**: Os links foram apagados (precisa investigar como/por quê)

**Se retornar um número > 0**: Os links existem, é problema de permissão (RLS)

---

## 📝 ME DIGA:

1. O que aparece quando você executa `SELECT COUNT(*) FROM links;`?
2. Já executou o `sql/corrigir_rls_links_403.sql`? O que apareceu?
3. Os links ainda não aparecem na interface?

