-- Script para diagnosticar problemas com a Stephanie Izidio
-- URL: https://www.herbalead.com/stephanie-izidio/calculadora-proteina

-- 1. Verificar se a Stephanie Izidio existe e está ativa
SELECT 
    id,
    name,
    email,
    username,
    is_active,
    subscription_status,
    created_at,
    -- Mostrar como o nome seria normalizado
    LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                REGEXP_REPLACE(name, '[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]', '', 'g'),
                '\s+', '-', 'g'
            ),
            '[^a-z0-9-]', '', 'g'
        )
    ) as normalized_name
FROM professionals 
WHERE name ILIKE '%stephanie%izidio%'
   OR name ILIKE '%stephanie%'
   OR email ILIKE '%stephanie%'
ORDER BY created_at DESC;

-- 2. Verificar todos os links da Stephanie Izidio
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.cta_text,
    l.redirect_url,
    l.status,
    l.created_at,
    p.name as user_name,
    p.email as user_email,
    -- Mostrar como o nome do projeto seria normalizado
    LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                REGEXP_REPLACE(l.name, '[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]', '', 'g'),
                '\s+', '-', 'g'
            ),
            '[^a-z0-9-]', '', 'g'
        )
    ) as normalized_project_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.name ILIKE '%stephanie%izidio%'
   OR p.name ILIKE '%stephanie%'
ORDER BY l.created_at DESC;

-- 3. Verificar especificamente se existe link "calculadora-proteina" ou similar
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.user_id,
    p.name as user_name,
    p.email as user_email,
    l.created_at
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.name ILIKE '%stephanie%izidio%'
  AND (
    LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                REGEXP_REPLACE(l.name, '[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]', '', 'g'),
                '\s+', '-', 'g'
            ),
            '[^a-z0-9-]', '', 'g'
        )
    ) = 'calculadora-proteina'
    OR l.name ILIKE '%calculadora%proteina%'
    OR l.name ILIKE '%proteina%'
    OR l.tool_name ILIKE '%proteina%'
  );

-- 4. Verificar todos os links ativos da Stephanie
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.created_at
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.name ILIKE '%stephanie%izidio%'
  AND l.status = 'active'
ORDER BY l.created_at DESC;

-- 5. Verificar se existe algum link com "minhaproteina" também
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.user_id,
    p.name as user_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.name ILIKE '%stephanie%izidio%'
  AND (
    LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                REGEXP_REPLACE(l.name, '[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]', '', 'g'),
                '\s+', '-', 'g'
            ),
            '[^a-z0-9-]', '', 'g'
        )
    ) = 'minhaproteina'
    OR l.name ILIKE '%minhaproteina%'
  );

-- 6. Contar total de links da Stephanie
SELECT 
    p.name as user_name,
    COUNT(l.id) as total_links,
    COUNT(CASE WHEN l.status = 'active' THEN 1 END) as active_links,
    COUNT(CASE WHEN l.status = 'inactive' THEN 1 END) as inactive_links
FROM professionals p
LEFT JOIN links l ON p.id = l.user_id
WHERE p.name ILIKE '%stephanie%izidio%'
GROUP BY p.id, p.name;
