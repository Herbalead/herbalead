-- Script para verificar o page_greeting de um link específico
-- Execute este script no Supabase SQL Editor

SELECT 
    id,
    name,
    tool_name,
    page_title,
    page_greeting,
    button_text,
    custom_message,
    created_at,
    updated_at
FROM links 
WHERE id = '859af27e-3f57-4db5-98c1-2c55b530a245';

-- Verificar também se há outros links com o mesmo nome
SELECT 
    id,
    name,
    tool_name,
    page_greeting,
    updated_at
FROM links 
WHERE name = 'asdfgh'
ORDER BY updated_at DESC;
