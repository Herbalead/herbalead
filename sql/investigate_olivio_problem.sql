-- INVESTIGAÇÃO: Problema do link do Olívio
-- Link: https://www.herbalead.com/olivioortola/calculoimc
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se o usuário 'olivioortola' existe
SELECT 
    id,
    name,
    email,
    username,
    is_active,
    subscription_status,
    created_at
FROM professionals 
WHERE username = 'olivioortola' 
   OR name ILIKE '%olivio%ortola%'
   OR name ILIKE '%olivio ortola%'
   OR name ILIKE '%Olívio%'
ORDER BY created_at DESC;

-- 2. Verificar se existe usuário com hífen (olivio-ortola)
SELECT 
    id,
    name,
    email,
    username,
    is_active,
    subscription_status,
    created_at
FROM professionals 
WHERE username = 'olivio-ortola' 
   OR name ILIKE '%olivio-ortola%'
ORDER BY created_at DESC;

-- 3. Buscar links do usuário olivioortola
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.created_at,
    l.updated_at,
    p.name as professional_name,
    p.username
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.username = 'olivioortola' 
   OR p.name ILIKE '%olivio%ortola%'
ORDER BY l.created_at DESC;

-- 4. Buscar especificamente link de IMC (bmi)
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.page_title,
    l.page_greeting,
    l.button_text,
    l.created_at,
    p.name as professional_name,
    p.username
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE (p.username = 'olivioortola' OR p.name ILIKE '%olivio%ortola%')
  AND l.tool_name = 'bmi'
ORDER BY l.created_at DESC;

-- 5. Verificar se há links com nome 'calculoimc'
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    p.name as professional_name,
    p.username
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE l.name ILIKE '%calculoimc%'
   OR l.name ILIKE '%calculo%imc%'
ORDER BY l.created_at DESC;

-- 6. Verificar todos os usuários com 'olivio' no nome
SELECT 
    id,
    name,
    email,
    username,
    is_active,
    subscription_status
FROM professionals 
WHERE name ILIKE '%olivio%' 
   OR username ILIKE '%olivio%'
ORDER BY created_at DESC;

-- 7. Verificar links recentes do Olívio (últimos 5)
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.created_at,
    p.name as professional_name,
    p.username
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.name ILIKE '%olivio%'
ORDER BY l.created_at DESC
LIMIT 5;
