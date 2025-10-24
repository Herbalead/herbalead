-- VERIFICAR LINK PERSONALIZADO DA ARACY: herbalead.com/baruk
-- ================================================================

-- 1. BUSCAR LINK 'baruk' DA ARACY
SELECT 
    'LINKS' as tabela,
    id,
    name,
    tool_name,
    user_id,
    status,
    custom_url,
    created_at
FROM links 
WHERE name = 'baruk'
   OR custom_url ILIKE '%baruk%'
ORDER BY created_at DESC;

-- 2. VERIFICAR SE O LINK PERTENCE À ARACY
SELECT 
    'LINKS COM PROFESSIONAL' as tabela,
    l.id,
    l.name,
    l.tool_name,
    l.user_id,
    l.status,
    l.custom_url,
    p.name as professional_name,
    p.email as professional_email,
    l.created_at
FROM links l
LEFT JOIN professionals p ON l.user_id = p.id
WHERE l.name = 'baruk'
   OR l.custom_url ILIKE '%baruk%'
   OR p.email = 'vidasaudavelaracy@gmail.com'
ORDER BY l.created_at DESC;

-- 3. VERIFICAR TODOS OS LINKS DA ARACY
SELECT 
    'TODOS OS LINKS DA ARACY' as tabela,
    l.id,
    l.name,
    l.tool_name,
    l.user_id,
    l.status,
    l.custom_url,
    l.created_at
FROM links l
WHERE l.user_id = '2565faa4-8dd1-47f2-beba-074ed84c563c'
ORDER BY l.created_at DESC;

-- 4. VERIFICAR SE EXISTE ROTA /baruk
SELECT 
    'VERIFICAÇÃO ROTA' as status,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM links 
            WHERE name = 'baruk' 
               OR custom_url ILIKE '%baruk%'
        ) THEN '✅ LINK EXISTE'
        ELSE '❌ LINK NÃO EXISTE'
    END as resultado;
