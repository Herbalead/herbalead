-- Verificar o link específico que está redirecionando para IMC
-- Baseado na URL: localhost:3000/calculators/bmi?user={"userId":"d20e0f84-c5f9-42c5-b4b3-7be8fad98b57","userName":"potencial",...}

-- 1. Buscar o link pelo ID que aparece na URL
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.page_title,
    l.page_greeting,
    l.button_text,
    l.custom_message,
    p.name as professional_name,
    p.phone as professional_phone,
    l.created_at,
    l.updated_at
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE l.id = 'ce889e88-88a8-4e29-bd9d-4beb1fc731f9';

-- 2. Se não encontrar pelo ID exato, buscar por partes do nome
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.page_title,
    l.page_greeting,
    l.button_text,
    l.custom_message,
    p.name as professional_name,
    p.phone as professional_phone,
    l.created_at,
    l.updated_at
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE l.name ILIKE '%potencial%'
   OR l.page_greeting ILIKE '%transformar suas habilidades%'
ORDER BY l.created_at DESC;

-- 3. Buscar pelo userId que aparece na URL
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.page_title,
    l.page_greeting,
    l.button_text,
    l.custom_message,
    p.name as professional_name,
    p.phone as professional_phone,
    l.created_at,
    l.updated_at
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE l.user_id = 'd20e0f84-c5f9-42c5-b4b3-7be8fad98b57';

-- 4. Listar todos os links com tool_name incorreto (que deveriam ser recruitment-*)
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    p.name as professional_name,
    l.created_at
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE l.tool_name NOT IN (
    'recruitment-potencial',
    'recruitment-ganhos', 
    'recruitment-proposito'
)
AND (
    l.name ILIKE '%potencial%' OR
    l.name ILIKE '%ganhos%' OR
    l.name ILIKE '%proposito%' OR
    l.page_greeting ILIKE '%transformar suas habilidades%' OR
    l.page_greeting ILIKE '%multiplicar minha renda%' OR
    l.page_greeting ILIKE '%multiplicar meu impacto%'
)
ORDER BY l.created_at DESC;
