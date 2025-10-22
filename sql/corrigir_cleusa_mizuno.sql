-- Script para testar e corrigir problema da Cleusa Mizuno
-- ID: 5f0b7493-32d4-43f8-a84d-3cbcad90c6dd

-- 1. Testar criação de link para a Cleusa
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
    '5f0b7493-32d4-43f8-a84d-3cbcad90c6dd', -- ID da Cleusa
    'teste',
    'bmi',
    'Teste de criação de link',
    'https://wa.me/5511999999999?text=Teste',
    'cleuza-mizuno/teste',
    'Teste de funcionamento',
    'active',
    0,
    0,
    NOW(),
    NOW(),
    'whatsapp',
    'Teste',
    'Teste de criação de link',
    'Teste - Cleusa Mizuno',
    'Olá! Este é um teste.',
    'Testar'
);

-- 2. Verificar se o link foi criado
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.custom_url,
    l.created_at,
    p.name as professional_name,
    p.email as professional_email
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.id = '5f0b7493-32d4-43f8-a84d-3cbcad90c6dd'
ORDER BY l.created_at DESC;

-- 3. Criar links úteis para a Cleusa
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
) VALUES 
-- Link "imc"
(
    gen_random_uuid(),
    '5f0b7493-32d4-43f8-a84d-3cbcad90c6dd',
    'imc',
    'bmi',
    'Calcule seu IMC',
    'https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre IMC.',
    'cleuza-mizuno/imc',
    'Descubra seu Índice de Massa Corporal!',
    'active',
    0,
    0,
    NOW(),
    NOW(),
    'whatsapp',
    'Calculadora IMC',
    'Ferramenta para calcular o Índice de Massa Corporal',
    'Calculadora IMC - Cleusa Mizuno',
    'Olá! Vamos calcular seu IMC.',
    'Calcular IMC'
),
-- Link "proteina"
(
    gen_random_uuid(),
    '5f0b7493-32d4-43f8-a84d-3cbcad90c6dd',
    'proteina',
    'protein',
    'Calcule sua proteína',
    'https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre proteína.',
    'cleuza-mizuno/proteina',
    'Descubra suas necessidades de proteína!',
    'active',
    0,
    0,
    NOW(),
    NOW(),
    'whatsapp',
    'Calculadora de Proteína',
    'Ferramenta para calcular necessidades de proteína',
    'Calculadora de Proteína - Cleusa Mizuno',
    'Olá! Vamos calcular sua proteína.',
    'Calcular Proteína'
);

-- 4. Verificar todos os links da Cleusa
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.custom_url,
    l.created_at,
    p.name as professional_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.id = '5f0b7493-32d4-43f8-a84d-3cbcad90c6dd'
ORDER BY l.created_at DESC;

-- 5. Testar URLs após criação
-- https://www.herbalead.com/cleuza-mizuno/teste
-- https://www.herbalead.com/cleuza-mizuno/imc
-- https://www.herbalead.com/cleuza-mizuno/proteina

