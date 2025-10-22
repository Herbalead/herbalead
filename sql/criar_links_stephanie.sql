-- Script para corrigir o problema da Stephanie Izidio
-- Solução: Criar links com nomes de uma palavra só

-- 1. Primeiro, vamos ver se existe algum link da Stephanie
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.created_at,
    p.name as user_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.id = '8d0ccf34-e8a7-4baa-b25a-39158918a11b'
ORDER BY l.created_at DESC;

-- 2. Se não existir nenhum link, vamos criar um para teste
-- Link para "calculadora-proteina" -> vamos criar como "proteina" (uma palavra só)

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
    '8d0ccf34-e8a7-4baa-b25a-39158918a11b', -- ID da Stephanie Izidio
    'proteina', -- Nome simples, uma palavra só
    'protein-calculator', -- Ferramenta de calculadora de proteína
    'Calcule sua necessidade de proteína diária',
    'https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre cálculo de proteína.',
    'stephanie-izidio/proteina', -- URL personalizada
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

-- 3. Verificar se o link foi criado
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.custom_url,
    p.name as user_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.id = '8d0ccf34-e8a7-4baa-b25a-39158918a11b'
  AND l.name = 'proteina';

-- 4. Criar também um link para "minhaproteina" (uma palavra só)
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
    '8d0ccf34-e8a7-4baa-b25a-39158918a11b', -- ID da Stephanie Izidio
    'minhaproteina', -- Nome simples, uma palavra só
    'protein-calculator', -- Ferramenta de calculadora de proteína
    'Minha Proteína - Calcule suas necessidades',
    'https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre minha proteína diária.',
    'stephanie-izidio/minhaproteina', -- URL personalizada
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

-- 5. Verificar todos os links da Stephanie após a criação
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.custom_url,
    l.created_at,
    p.name as user_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.id = '8d0ccf34-e8a7-4baa-b25a-39158918a11b'
ORDER BY l.created_at DESC;
