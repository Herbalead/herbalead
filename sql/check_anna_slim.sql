-- Verificar se o usuário "Anna Slim" existe e seus links
-- Script para diagnosticar problema de localização

-- 1. Buscar profissional "Anna Slim"
SELECT 
    id,
    name,
    email,
    phone,
    created_at
FROM professionals 
WHERE name ILIKE '%anna%slim%' 
   OR name ILIKE '%anna slim%'
   OR name ILIKE '%Anna Slim%'
ORDER BY created_at DESC;

-- 2. Se encontrou o profissional, buscar seus links
-- (Substitua 'ID_DO_PROFISSIONAL' pelo ID obtido na consulta anterior)
SELECT 
    id,
    name,
    tool_name,
    status,
    created_at,
    updated_at
FROM links 
WHERE user_id = (
    SELECT id FROM professionals 
    WHERE name ILIKE '%anna%slim%' 
       OR name ILIKE '%anna slim%'
       OR name ILIKE '%Anna Slim%'
    LIMIT 1
)
ORDER BY created_at DESC;

-- 3. Buscar especificamente o link "potencail"
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    p.name as professional_name,
    l.created_at
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE l.name ILIKE '%potencail%'
   OR l.name ILIKE '%potencial%'
ORDER BY l.created_at DESC;

-- 4. Listar todos os profissionais para comparação
SELECT 
    id,
    name,
    email,
    created_at
FROM professionals 
ORDER BY name;
