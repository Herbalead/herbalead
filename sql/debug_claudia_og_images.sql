-- DEBUG: Investigar problema das imagens OG da Claudia
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se o usuário 'claudiavitto' existe
SELECT 
    id,
    name,
    email,
    username,
    is_active,
    subscription_status
FROM professionals 
WHERE username = 'claudiavitto'
   OR name ILIKE '%claudia%vitto%'
ORDER BY created_at DESC;

-- 2. Verificar links da Claudia
SELECT 
    l.id,
    l.name as projeto,
    l.tool_name as ferramenta,
    l.status,
    l.page_title,
    l.page_greeting,
    l.created_at,
    p.name as usuario,
    p.username
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.username = 'claudiavitto'
   OR p.name ILIKE '%claudia%'
ORDER BY l.created_at DESC;

-- 3. Verificar especificamente link 'composicao-corporal'
SELECT 
    l.id,
    l.name as projeto,
    l.tool_name as ferramenta,
    l.status,
    l.page_title,
    l.page_greeting,
    p.name as usuario,
    p.username
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE (p.username = 'claudiavitto' OR p.name ILIKE '%claudia%')
  AND l.name = 'composicao-corporal'
ORDER BY l.created_at DESC;










