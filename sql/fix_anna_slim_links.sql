-- CORREÇÃO: Buscar links da Anna Slim usando o ID correto
-- Usuário: Anna Slim (ID: 51d526c5-bd9f-4dae-8c04-759fdd88013f)

-- 1. Buscar todos os links da Anna Slim
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.user_id,
    p.name as user_name,
    p.email as user_email,
    l.created_at,
    l.status,
    l.clicks,
    l.leads
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE l.user_id = '51d526c5-bd9f-4dae-8c04-759fdd88013f'
ORDER BY l.created_at DESC;

-- 2. Verificar se existe link com nome que normalize para 'imc'
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.user_id,
    p.name as user_name,
    l.created_at,
    -- Mostrar como o nome seria normalizado
    LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                REGEXP_REPLACE(l.name, '[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]', '', 'g'),
                '\s+', '-', 'g'
            ),
            '[^a-z0-9-]', '', 'g'
        )
    ) as normalized_link_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE l.user_id = '51d526c5-bd9f-4dae-8c04-759fdd88013f'
AND (
    LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                REGEXP_REPLACE(l.name, '[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]', '', 'g'),
                '\s+', '-', 'g'
            ),
            '[^a-z0-9-]', '', 'g'
        )
    ) = 'imc'
    OR l.name ILIKE '%imc%'
    OR l.tool_name = 'bmi'
);

-- 3. Se não existir link 'imc', criar um para Anna Slim
-- (Execute apenas se não encontrar links na query acima)
INSERT INTO links (
    user_id,
    name,
    tool_name,
    cta_text,
    redirect_url,
    custom_url,
    custom_message,
    capture_type,
    material_title,
    material_description,
    page_title,
    page_greeting,
    button_text,
    status,
    clicks,
    leads
) VALUES (
    '51d526c5-bd9f-4dae-8c04-759fdd88013f', -- Anna Slim
    'IMC',
    'bmi',
    'Falar com Especialista',
    'https://www.herbalead.com/calculators/bmi',
    'https://www.herbalead.com/nna-lim/imc', -- URL com nome normalizado correto
    'Quer receber orientações personalizadas? Clique abaixo e fale comigo!',
    'direct',
    '',
    '',
    'Quer uma análise mais completa?',
    'Olá! Quer calcular seu IMC?',
    'Consultar Especialista',
    'active',
    0,
    0
) ON CONFLICT DO NOTHING;

-- 4. Verificar se o link foi criado
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.custom_url,
    l.created_at
FROM links l
WHERE l.user_id = '51d526c5-bd9f-4dae-8c04-759fdd88013f'
AND l.name = 'IMC';
