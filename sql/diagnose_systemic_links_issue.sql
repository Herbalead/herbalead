-- DIAGNÓSTICO SISTÊMICO: Testar múltiplos links para identificar problema geral
-- Este script vai verificar se há problemas sistêmicos na tabela links

-- 1. Verificar estrutura da tabela links
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'links' 
ORDER BY ordinal_position;

-- 2. Verificar se há links órfãos (sem usuário)
SELECT 
    l.id,
    l.name,
    l.user_id,
    l.created_at
FROM links l
LEFT JOIN professionals p ON l.user_id = p.id
WHERE p.id IS NULL
LIMIT 10;

-- 3. Verificar links com user_id nulo
SELECT 
    id,
    name,
    tool_name,
    user_id,
    created_at
FROM links 
WHERE user_id IS NULL
LIMIT 10;

-- 4. Verificar links com status inativo
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.user_id,
    p.name as user_name,
    l.created_at
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE l.status != 'active' OR l.status IS NULL
LIMIT 10;

-- 5. Verificar links recentes (últimos 10)
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.user_id,
    p.name as user_name,
    p.is_active as user_active,
    p.subscription_status,
    l.status as link_status,
    l.created_at
FROM links l
JOIN professionals p ON l.user_id = p.id
ORDER BY l.created_at DESC
LIMIT 10;

-- 6. Verificar se há problemas de permissão na tabela links
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE tablename = 'links';

-- 7. Contar total de links por status
SELECT 
    status,
    COUNT(*) as total
FROM links 
GROUP BY status;

-- 8. Verificar se há links duplicados
SELECT 
    name,
    user_id,
    COUNT(*) as duplicates
FROM links 
GROUP BY name, user_id
HAVING COUNT(*) > 1
LIMIT 10;
