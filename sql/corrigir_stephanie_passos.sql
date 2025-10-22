-- Script passo a passo para corrigir a Stephanie Izidio

-- PASSO 1: Encontrar o professional.id da Stephanie
SELECT 
    id,
    name,
    email
FROM professionals
WHERE name ILIKE '%stephanie%izidio%'
   OR email = 'stephanieizidio@hotmail.com';

-- PASSO 2: Verificar os links atuais da Stephanie
SELECT 
    l.id,
    l.name,
    l.user_id,
    l.status,
    u.email as user_email,
    p.name as professional_name,
    p.id as professional_id
FROM links l
JOIN auth.users u ON l.user_id = u.id
LEFT JOIN professionals p ON u.email = p.email
WHERE u.email = 'stephanieizidio@hotmail.com';

-- PASSO 3: Deletar os links incorretos
DELETE FROM links 
WHERE user_id = 'd689279a-2ecd-4a58-a84d-f5eb78cd9e71'
  AND name IN ('proteina', 'minhaproteina');

-- PASSO 4: Aguardar resultado do PASSO 1 para obter o professional.id
-- Depois execute o script abaixo substituindo PROFESSIONAL_ID_AQUI pelo ID real

-- EXEMPLO: Se o professional.id for '8d0ccf34-e8a7-4baa-b25a-39158918a11b'
-- Substitua PROFESSIONAL_ID_AQUI por esse ID nos INSERTs abaixo

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
) VALUES 
-- Link "proteina"
(
    gen_random_uuid(),
    'PROFESSIONAL_ID_AQUI', -- Substitua pelo ID real do PASSO 1
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
),
-- Link "minhaproteina"
(
    gen_random_uuid(),
    'PROFESSIONAL_ID_AQUI', -- Substitua pelo ID real do PASSO 1
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

-- PASSO 5: Verificar se os links foram criados corretamente
SELECT 
    l.id,
    l.name,
    l.user_id,
    l.status,
    l.custom_url,
    p.name as professional_name,
    p.email as professional_email
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.name ILIKE '%stephanie%izidio%'
ORDER BY l.created_at DESC;
