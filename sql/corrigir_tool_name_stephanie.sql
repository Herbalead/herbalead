-- Script para corrigir o tool_name dos links da Stephanie
-- Problema: tool_name "protein-calculator" não existe, o correto é "protein"

-- 1. Verificar os links atuais da Stephanie
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.custom_url,
    p.name as professional_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.id = '8d0ccf34-e8a7-4baa-b25a-39158918a11b'
ORDER BY l.created_at DESC;

-- 2. Atualizar o tool_name para "protein" (ferramenta correta)
UPDATE links 
SET tool_name = 'protein'
WHERE user_id = '8d0ccf34-e8a7-4baa-b25a-39158918a11b'
  AND name IN ('proteina', 'minhaproteina');

-- 3. Verificar se a atualização funcionou
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.custom_url,
    p.name as professional_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.id = '8d0ccf34-e8a7-4baa-b25a-39158918a11b'
ORDER BY l.created_at DESC;

-- 4. Testar as URLs após a correção
-- https://www.herbalead.com/stephanie-izidio/proteina
-- https://www.herbalead.com/stephanie-izidio/minhaproteina
