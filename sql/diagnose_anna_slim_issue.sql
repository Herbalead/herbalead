-- Diagnóstico completo do problema do link anna-slim/imc
-- URL: https://www.herbalead.com/anna-slim/imc

-- 1. Verificar se existe usuário com nome que normalize para 'anna-slim'
SELECT 
    id,
    name,
    email,
    username,
    is_active,
    subscription_status,
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
WHERE LOWER(
    REGEXP_REPLACE(
        REGEXP_REPLACE(
            REGEXP_REPLACE(name, '[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]', '', 'g'),
            '\s+', '-', 'g'
        ),
        '[^a-z0-9-]', '', 'g'
    )
) = 'anna-slim'
OR name ILIKE '%anna%'
OR username = 'anna-slim';

-- 2. Verificar todos os usuários ativos
SELECT 
    id,
    name,
    email,
    username,
    is_active,
    subscription_status
FROM professionals 
WHERE is_active = true
ORDER BY name;

-- 3. Verificar se existe link 'imc' para qualquer usuário
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.user_id,
    p.name as user_name,
    p.email as user_email,
    l.created_at
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE LOWER(
    REGEXP_REPLACE(
        REGEXP_REPLACE(
            REGEXP_REPLACE(l.name, '[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]', '', 'g'),
            '\s+', '-', 'g'
        ),
        '[^a-z0-9-]', '', 'g'
    )
) = 'imc'
OR l.name ILIKE '%imc%'
OR l.tool_name = 'bmi';

-- 4. Verificar todos os links existentes
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.user_id,
    p.name as user_name,
    l.created_at
FROM links l
JOIN professionals p ON l.user_id = p.id
ORDER BY l.created_at DESC
LIMIT 10;

-- 5. Verificar estrutura da tabela links
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'links' 
ORDER BY ordinal_position;
