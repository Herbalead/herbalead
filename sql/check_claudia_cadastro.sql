-- VERIFICAR CADASTRO DA CLAUDIA
-- Execute este script no Supabase SQL Editor

-- 1. Buscar usuário Claudia Vitto
SELECT 
    id,
    name,
    email,
    phone,
    username,
    is_active,
    subscription_status,
    created_at,
    updated_at
FROM professionals 
WHERE name ILIKE '%claudia%vitto%'
   OR name ILIKE '%claudia vitto%'
   OR name ILIKE '%Claudia%'
   OR email ILIKE '%claudia%'
ORDER BY created_at DESC;

-- 2. Buscar especificamente por 'claudiavitto'
SELECT 
    id,
    name,
    email,
    phone,
    username,
    is_active,
    subscription_status,
    created_at
FROM professionals 
WHERE username = 'claudiavitto'
   OR name = 'claudiavitto'
ORDER BY created_at DESC;

-- 3. Verificar links da Claudia
SELECT 
    l.id,
    l.name as projeto,
    l.tool_name as ferramenta,
    l.status,
    l.created_at,
    p.name as usuario,
    p.phone as telefone_usuario
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.name ILIKE '%claudia%'
   OR p.email ILIKE '%claudia%'
ORDER BY l.created_at DESC;

-- 4. Verificar se há telefone cadastrado
SELECT 
    id,
    name,
    email,
    phone,
    CASE 
        WHEN phone IS NULL THEN 'SEM TELEFONE'
        WHEN phone = '' THEN 'TELEFONE VAZIO'
        ELSE 'COM TELEFONE: ' || phone
    END as status_telefone
FROM professionals 
WHERE name ILIKE '%claudia%'
   OR email ILIKE '%claudia%';
