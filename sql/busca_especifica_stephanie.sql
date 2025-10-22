-- Busca específica do link da Stephanie Izidio
-- ID da Stephanie: 8d0ccf34-e8a7-4baa-b25a-39158918a11b

-- 1. Buscar TODOS os links da Stephanie (sem filtros de status)
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.cta_text,
    l.redirect_url,
    l.custom_url,
    l.status,
    l.clicks,
    l.leads,
    l.created_at,
    l.updated_at,
    p.name as user_name,
    p.email as user_email
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.id = '8d0ccf34-e8a7-4baa-b25a-39158918a11b'
ORDER BY l.created_at DESC;

-- 2. Buscar links com "calculadora" ou "proteina" em qualquer campo
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.cta_text,
    l.redirect_url,
    l.custom_url,
    l.status,
    p.name as user_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.id = '8d0ccf34-e8a7-4baa-b25a-39158918a11b'
  AND (
    l.name ILIKE '%calculadora%'
    OR l.name ILIKE '%proteina%'
    OR l.tool_name ILIKE '%calculadora%'
    OR l.tool_name ILIKE '%proteina%'
    OR l.cta_text ILIKE '%calculadora%'
    OR l.cta_text ILIKE '%proteina%'
    OR l.redirect_url ILIKE '%calculadora%'
    OR l.redirect_url ILIKE '%proteina%'
  );

-- 3. Verificar se existe algum link com custom_url contendo "stephanie-izidio"
SELECT 
    l.id,
    l.name,
    l.custom_url,
    l.status,
    p.name as user_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE l.custom_url ILIKE '%stephanie%izidio%'
   OR l.custom_url ILIKE '%calculadora%proteina%';

-- 4. Buscar TODOS os links criados recentemente (últimos 7 dias)
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.created_at,
    p.name as user_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE l.created_at >= NOW() - INTERVAL '7 days'
ORDER BY l.created_at DESC
LIMIT 20;

-- 5. Contar links por status para a Stephanie
SELECT 
    l.status,
    COUNT(*) as total
FROM links l
WHERE l.user_id = '8d0ccf34-e8a7-4baa-b25a-39158918a11b'
GROUP BY l.status;
