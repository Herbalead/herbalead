-- DIAGNÓSTICO - URLs não estão sendo salvas corretamente
-- Execute este script no Supabase SQL Editor

-- ============================================================
-- PARTE 1: VERIFICAR ESTRUTURA DA TABELA
-- ============================================================

-- 1.1 Verificar se a coluna redirect_url existe
SELECT 
    'PARTE 1.1 - Estrutura da coluna redirect_url' as diagnostico,
    column_name,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'links' 
  AND column_name = 'redirect_url';

-- 1.2 Verificar todas as colunas da tabela links
SELECT 
    'PARTE 1.2 - Todas as colunas da tabela links' as diagnostico,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'links' 
ORDER BY ordinal_position;

-- ============================================================
-- PARTE 2: VERIFICAR LINKS EXISTENTES
-- ============================================================

-- 2.1 Ver links recentes com redirect_url
SELECT 
    'PARTE 2.1 - Links com redirect_url' as diagnostico,
    l.id,
    l.name,
    l.tool_name,
    l.redirect_url,
    LENGTH(l.redirect_url) as tamanho_url,
    p.name as professional_name
FROM links l
LEFT JOIN professionals p ON l.user_id = p.id
ORDER BY l.created_at DESC
LIMIT 20;

-- 2.2 Ver links com redirect_url vazio ou NULL
SELECT 
    'PARTE 2.2 - Links sem redirect_url' as diagnostico,
    l.id,
    l.name,
    l.tool_name,
    l.redirect_url,
    CASE 
        WHEN l.redirect_url IS NULL THEN '❌ NULL'
        WHEN l.redirect_url = '' THEN '❌ VAZIO'
        ELSE '✅ OK'
    END as status_url
FROM links l
WHERE l.redirect_url IS NULL OR l.redirect_url = ''
ORDER BY l.created_at DESC
LIMIT 20;

-- ============================================================
-- PARTE 3: VERIFICAR CONSTRAINTS
-- ============================================================

-- 3.1 Ver constraints da tabela links
SELECT 
    'PARTE 3.1 - Constraints da tabela' as diagnostico,
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'links';

-- ============================================================
-- PARTE 4: CORREÇÃO (SE NECESSÁRIO)
-- ============================================================

-- 4.1 Se a coluna não existir, criar (executar se necessário)
/*
ALTER TABLE links ADD COLUMN IF NOT EXISTS redirect_url TEXT;
*/

-- 4.2 Verificar se há algum default que está sobrescrevendo
SELECT 
    'PARTE 4.2 - Verificar defaults' as diagnostico,
    column_name,
    column_default
FROM information_schema.columns 
WHERE table_name = 'links' 
  AND column_name IN ('redirect_url', 'custom_url')
  AND column_default IS NOT NULL;

-- ============================================================
-- PARTE 5: TESTE DE INSERT
-- ============================================================

-- 5.1 Contar links sem redirect_url válido
SELECT 
    'PARTE 5.1 - Resumo' as diagnostico,
    COUNT(*) as total_links,
    COUNT(CASE WHEN redirect_url IS NULL OR redirect_url = '' THEN 1 END) as sem_url,
    COUNT(CASE WHEN redirect_url IS NOT NULL AND redirect_url != '' THEN 1 END) as com_url
FROM links;

SELECT '✅ Execute esta query e me diga o resultado!' as proximo_passo;

