-- Script para corrigir o tool_name do link "sadxas" do usuário "andre-faula"
-- Execute este script no Supabase SQL Editor

-- Primeiro, vamos verificar o link atual
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    p.name as professional_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.name ILIKE '%andre%faula%' 
  AND l.name ILIKE '%sadxas%'
ORDER BY l.updated_at DESC;

-- Atualizar o tool_name para recruitment-potencial
UPDATE links 
SET 
    tool_name = 'recruitment-potencial',
    updated_at = NOW()
WHERE id IN (
    SELECT l.id
    FROM links l
    JOIN professionals p ON l.user_id = p.id
    WHERE p.name ILIKE '%andre%faula%' 
      AND l.name ILIKE '%sadxas%'
      AND l.status = 'active'
);

-- Verificar se a atualização funcionou
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.updated_at,
    p.name as professional_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.name ILIKE '%andre%faula%' 
  AND l.name ILIKE '%sadxas%'
ORDER BY l.updated_at DESC;
