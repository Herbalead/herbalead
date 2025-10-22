-- Script corrigido para a Stephanie Izidio
-- Problema: links.user_id referencia users.id, não professionals.id

-- 1. Primeiro, vamos encontrar o ID correto da Stephanie na tabela users
SELECT 
    u.id as user_id,
    u.email,
    p.id as professional_id,
    p.name as professional_name,
    p.email as professional_email
FROM users u
JOIN professionals p ON u.email = p.email
WHERE p.name ILIKE '%stephanie%izidio%'
   OR p.email ILIKE '%stephanie%';

-- 2. Se não encontrar, vamos buscar todos os usuários com email similar
SELECT 
    u.id as user_id,
    u.email,
    p.id as professional_id,
    p.name as professional_name
FROM users u
LEFT JOIN professionals p ON u.email = p.email
WHERE u.email ILIKE '%stephanie%'
ORDER BY u.created_at DESC;

-- 3. Verificar se existe algum link da Stephanie usando o ID correto
-- (Execute primeiro as consultas acima para encontrar o user_id correto)
-- Substitua 'USER_ID_CORRETO' pelo ID encontrado na consulta acima

-- Exemplo de como seria (substitua pelo ID real):
/*
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.created_at,
    u.email as user_email
FROM links l
JOIN users u ON l.user_id = u.id
WHERE l.user_id = 'USER_ID_CORRETO_AQUI'
ORDER BY l.created_at DESC;
*/

-- 4. Criar link para "proteina" (substitua USER_ID_CORRETO pelo ID real)
-- Descomente e substitua o ID quando encontrar o user_id correto:

/*
INSERT INTO links (
    id,
    user_id,
    name,
    tool_name,
    cta_text,
    redirect_url,
    custom_url,
    custom_message,
    status,
    clicks,
    leads,
    created_at,
    updated_at,
    capture_type,
    material_title,
    material_description,
    page_title,
    page_greeting,
    button_text
) VALUES (
    gen_random_uuid(),
    'USER_ID_CORRETO_AQUI', -- Substitua pelo user_id encontrado acima
    'proteina',
    'protein-calculator',
    'Calcule sua necessidade de proteína diária',
    'https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre cálculo de proteína.',
    'stephanie-izidio/proteina',
    'Descubra quanta proteína você precisa por dia para seus objetivos!',
    'active',
    0,
    0,
    NOW(),
    NOW(),
    'whatsapp',
    'Calculadora de Proteína',
    'Ferramenta para calcular suas necessidades diárias de proteína',
    'Calculadora de Proteína - Stephanie Izidio',
    'Olá! Vamos calcular sua necessidade de proteína diária.',
    'Calcular Proteína'
);
*/

-- 5. Criar link para "minhaproteina" (substitua USER_ID_CORRETO pelo ID real)
/*
INSERT INTO links (
    id,
    user_id,
    name,
    tool_name,
    cta_text,
    redirect_url,
    custom_url,
    custom_message,
    status,
    clicks,
    leads,
    created_at,
    updated_at,
    capture_type,
    material_title,
    material_description,
    page_title,
    page_greeting,
    button_text
) VALUES (
    gen_random_uuid(),
    'USER_ID_CORRETO_AQUI', -- Substitua pelo user_id encontrado acima
    'minhaproteina',
    'protein-calculator',
    'Minha Proteína - Calcule suas necessidades',
    'https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre minha proteína diária.',
    'stephanie-izidio/minhaproteina',
    'Descubra quanta proteína você precisa por dia!',
    'active',
    0,
    0,
    NOW(),
    NOW(),
    'whatsapp',
    'Minha Proteína',
    'Ferramenta para calcular suas necessidades diárias de proteína',
    'Minha Proteína - Stephanie Izidio',
    'Olá! Vamos descobrir sua necessidade de proteína diária.',
    'Calcular Minha Proteína'
);
*/
