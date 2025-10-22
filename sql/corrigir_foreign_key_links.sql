-- Script para verificar e corrigir a foreign key da tabela links
-- Problema: links.user_id referencia tabela "users" que não existe

-- 1. Verificar todas as foreign keys da tabela links
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'links';

-- 2. Verificar se existe tabela "users" no schema público
SELECT 
    table_name,
    table_schema
FROM information_schema.tables 
WHERE table_name = 'users'
ORDER BY table_schema;

-- 3. Verificar se existe tabela "users" no schema auth
SELECT 
    table_name,
    table_schema
FROM information_schema.tables 
WHERE table_name = 'users'
    AND table_schema = 'auth';

-- 4. SOLUÇÃO: Remover a foreign key incorreta e criar a correta
-- Primeiro, vamos remover a foreign key existente
ALTER TABLE links DROP CONSTRAINT IF EXISTS links_user_id_fkey;

-- 5. Criar nova foreign key apontando para professionals
ALTER TABLE links 
ADD CONSTRAINT links_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES professionals(id);

-- 6. Agora criar os links da Stephanie
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

-- 7. Verificar se os links foram criados corretamente
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
