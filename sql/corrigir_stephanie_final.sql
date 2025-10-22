-- Script final para corrigir os links da Stephanie Izidio
-- professional.id: 8d0ccf34-e8a7-4baa-b25a-39158918a11b

-- 1. Deletar os links incorretos (que usam auth.users.id)
DELETE FROM links 
WHERE user_id = 'd689279a-2ecd-4a58-a84d-f5eb78cd9e71'
  AND name IN ('proteina', 'minhaproteina');

-- 2. Criar os links corretos usando professional.id
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
    '8d0ccf34-e8a7-4baa-b25a-39158918a11b', -- professional.id da Stephanie
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
    '8d0ccf34-e8a7-4baa-b25a-39158918a11b', -- professional.id da Stephanie
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

-- 3. Verificar se os links foram criados corretamente
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
WHERE p.id = '8d0ccf34-e8a7-4baa-b25a-39158918a11b'
ORDER BY l.created_at DESC;

-- 4. Testar as URLs após a correção
-- https://www.herbalead.com/stephanie-izidio/proteina
-- https://www.herbalead.com/stephanie-izidio/minhaproteina
