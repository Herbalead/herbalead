-- Script para diagnosticar o problema do link "sadxas"
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se o usuário existe
SELECT 
    id,
    name,
    email,
    created_at
FROM professionals 
WHERE name ILIKE '%andre%faula%' 
   OR name ILIKE '%andre faula%'
   OR name ILIKE '%Andre Faula%'
ORDER BY created_at DESC;

-- 2. Verificar todos os links do usuário (se existir)
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.created_at,
    l.updated_at,
    p.name as professional_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.name ILIKE '%andre%faula%' 
   OR p.name ILIKE '%andre faula%'
   OR p.name ILIKE '%Andre Faula%'
ORDER BY l.created_at DESC;

-- 3. Verificar se há algum link com nome similar
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    p.name as professional_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE l.name ILIKE '%sadxas%'
   OR l.name ILIKE '%sad%'
   OR l.name ILIKE '%as%'
ORDER BY l.created_at DESC;

-- 4. Verificar todos os links ativos
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    p.name as professional_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE l.status = 'active'
ORDER BY l.created_at DESC
LIMIT 10;
