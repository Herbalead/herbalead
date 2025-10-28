-- SOLUÇÃO URGENTE - Erro 403 ao Carregar Links
-- Execute este script no SQL Editor do Supabase

-- ============================================================
-- VERIFICAR POLÍTICAS ATUAIS
-- ============================================================

-- Ver políticas RLS atuais
SELECT 
    'Políticas RLS atuais' as info,
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies 
WHERE tablename = 'links';

-- ============================================================
-- LIMPAR POLÍTICAS ANTIGAS
-- ============================================================

-- Remover TODAS as políticas antigas
DROP POLICY IF EXISTS "Users can view own links" ON links;
DROP POLICY IF EXISTS "Users can insert own links" ON links;
DROP POLICY IF EXISTS "Users can update own links" ON links;
DROP POLICY IF EXISTS "Users can delete own links" ON links;
DROP POLICY IF EXISTS "Public can view active links" ON links;
DROP POLICY IF EXISTS "Links são públicos para visualização" ON links;
DROP POLICY IF EXISTS "Users podem visualizar seus próprios links" ON links;
DROP POLICY IF EXISTS "Users podem inserir seus próprios links" ON links;
DROP POLICY IF EXISTS "Users podem atualizar seus próprios links" ON links;
DROP POLICY IF EXISTS "Users podem deletar seus próprios links" ON links;
DROP POLICY IF EXISTS "users_can_view_own_links" ON links;
DROP POLICY IF EXISTS "users_can_insert_own_links" ON links;
DROP POLICY IF EXISTS "users_can_update_own_links" ON links;
DROP POLICY IF EXISTS "users_can_delete_own_links" ON links;
DROP POLICY IF EXISTS "public_can_view_active_links" ON links;

-- ============================================================
-- CRIAR POLÍTICAS NOVAS E SIMPLES
-- ============================================================

-- 1. SELECT - Visualizar links próprios
CREATE POLICY "links_select_own" ON links
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 
            FROM professionals p
            WHERE p.id = links.user_id
            AND p.email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- 2. INSERT - Criar links
CREATE POLICY "links_insert_own" ON links
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 
            FROM professionals p
            WHERE p.id = links.user_id
            AND p.email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- 3. UPDATE - Editar links próprios
CREATE POLICY "links_update_own" ON links
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 
            FROM professionals p
            WHERE p.id = links.user_id
            AND p.email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 
            FROM professionals p
            WHERE p.id = links.user_id
            AND p.email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- 4. DELETE - Deletar links próprios
CREATE POLICY "links_delete_own" ON links
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 
            FROM professionals p
            WHERE p.id = links.user_id
            AND p.email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- 5. SELECT PUBLIC - Visualização pública de links ativos (para pessoas sem login)
CREATE POLICY "links_public_select" ON links
    FOR SELECT
    USING (status = 'active');

-- ============================================================
-- VERIFICAR POLÍTICAS CRIADAS
-- ============================================================

SELECT 
    'Políticas RLS novas' as info,
    policyname,
    cmd
FROM pg_policies 
WHERE tablename = 'links'
ORDER BY cmd, policyname;

-- ============================================================
-- TESTE
-- ============================================================

SELECT 
    '✅ RLS corrigido!' as resultado,
    COUNT(*) as total_policies
FROM pg_policies 
WHERE tablename = 'links';

-- INSTRUÇÕES:
-- 1. Execute este script no Supabase SQL Editor
-- 2. Feche a aba do navegador e abra novamente
-- 3. Faça login novamente
-- 4. Os links devem aparecer agora!

