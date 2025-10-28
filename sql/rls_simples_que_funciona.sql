-- RLS SIMPLES QUE FUNCIONA
-- Execute este script no Supabase SQL Editor

-- ============================================================
-- PARTE 1: DESABILITAR RLS TEMPORARIAMENTE
-- ============================================================

ALTER TABLE links DISABLE ROW LEVEL SECURITY;

SELECT 'RLS desabilitado temporariamente. Links devem aparecer agora.' as resultado;

-- ============================================================
-- PARTE 2: LIMPAR POLÍTICAS ANTIGAS
-- ============================================================

-- Remover TODAS as políticas
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'links') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON links';
    END LOOP;
END $$;

SELECT 'Políticas antigas removidas.' as resultado;

-- ============================================================
-- PARTE 3: CRIAR POLÍTICA SUPER SIMPLES
-- ============================================================

-- Habilita RLS
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Criar política que permite TUDO para authenticated
CREATE POLICY "links_authenticated_all" ON links
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Criar política pública para links ativos
CREATE POLICY "links_public_select" ON links
    FOR SELECT
    TO anon
    USING (status = 'active');

-- ============================================================
-- PARTE 4: VERIFICAR
-- ============================================================

SELECT 
    'Políticas atuais:' as info,
    policyname,
    cmd
FROM pg_policies 
WHERE tablename = 'links';

SELECT '✅ RLS habilitado. Teste agora!' as resultado;

-- INSTRUÇÕES:
-- 1. Feche e abra o navegador
-- 2. Faça login
-- 3. Os links devem aparecer

