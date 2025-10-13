-- Script para verificar se as mensagens personalizadas estão sendo salvas
-- Execute este script no Supabase SQL Editor

-- 1. Verificar todos os links com page_greeting
SELECT 
    id,
    name,
    tool_name,
    page_title,
    page_greeting,
    button_text,
    created_at,
    updated_at
FROM links 
WHERE page_greeting IS NOT NULL
ORDER BY updated_at DESC
LIMIT 10;

-- 2. Verificar se há links sem page_greeting
SELECT 
    COUNT(*) as total_links,
    COUNT(page_greeting) as com_page_greeting,
    COUNT(*) - COUNT(page_greeting) as sem_page_greeting
FROM links;

-- 3. Verificar um link específico (substitua pelo ID do seu link)
-- SELECT 
--     id,
--     name,
--     tool_name,
--     page_greeting,
--     custom_message
-- FROM links 
-- WHERE name = 'dsbgju,j'; -- Substitua pelo nome do seu projeto
