-- Script para verificar o tool_name do link "sadxas" do usuário "andre-faula"
-- Execute este script no Supabase SQL Editor

-- Buscar o usuário andre-faula
SELECT 
    id,
    name,
    email
FROM professionals 
WHERE name ILIKE '%andre%faula%' OR name ILIKE '%andre faula%';

-- Buscar o link "sadxas" do usuário andre-faula
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.page_title,
    l.page_greeting,
    l.button_text,
    l.status,
    l.created_at,
    l.updated_at,
    p.name as professional_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.name ILIKE '%andre%faula%' 
  AND l.name ILIKE '%sadxas%'
ORDER BY l.updated_at DESC;

-- Verificar todos os links do usuário andre-faula
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.created_at
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.name ILIKE '%andre%faula%'
ORDER BY l.created_at DESC;
