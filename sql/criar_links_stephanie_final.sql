-- Script final para criar links da Stephanie Izidio
-- ID correto: d689279a-2ecd-4a58-a84d-f5eb78cd9e71
-- Email: stephanieizidio@hotmail.com

-- 1. Verificar se já existem links da Stephanie
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.created_at,
    u.email as user_email
FROM links l
JOIN auth.users u ON l.user_id = u.id
WHERE l.user_id = 'd689279a-2ecd-4a58-a84d-f5eb78cd9e71'
ORDER BY l.created_at DESC;

-- 2. Criar link "proteina" (uma palavra só)
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
    'd689279a-2ecd-4a58-a84d-f5eb78cd9e71', -- ID correto da Stephanie
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

-- 3. Criar link "minhaproteina" (uma palavra só)
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
    'd689279a-2ecd-4a58-a84d-f5eb78cd9e71', -- ID correto da Stephanie
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

-- 4. Verificar se os links foram criados com sucesso
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.custom_url,
    l.created_at,
    u.email as user_email
FROM links l
JOIN auth.users u ON l.user_id = u.id
WHERE l.user_id = 'd689279a-2ecd-4a58-a84d-f5eb78cd9e71'
ORDER BY l.created_at DESC;

-- 5. Testar se as URLs funcionam
-- Após executar, teste estas URLs:
-- https://www.herbalead.com/stephanie-izidio/proteina
-- https://www.herbalead.com/stephanie-izidio/minhaproteina
