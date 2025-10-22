-- Script para limpar e corrigir completamente a situação da Stephanie
-- Problema: ainda há referências ao user_id antigo

-- 1. Verificar se a foreign key foi corrigida
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
    AND tc.table_name = 'links'
    AND kcu.column_name = 'user_id';

-- 2. Verificar todos os links da Stephanie (tanto corretos quanto incorretos)
SELECT 
    l.id,
    l.name,
    l.user_id,
    l.status,
    l.created_at,
    CASE 
        WHEN l.user_id = '8d0ccf34-e8a7-4baa-b25a-39158918a11b' THEN 'CORRETO (professional.id)'
        WHEN l.user_id = 'd689279a-2ecd-4a58-a84d-f5eb78cd9e71' THEN 'INCORRETO (auth.users.id)'
        ELSE 'OUTRO'
    END as status_id
FROM links l
WHERE l.name IN ('proteina', 'minhaproteina', 'Proteina')
ORDER BY l.created_at DESC;

-- 3. Deletar TODOS os links incorretos da Stephanie
DELETE FROM links 
WHERE user_id = 'd689279a-2ecd-4a58-a84d-f5eb78cd9e71';

-- 4. Deletar também o link "Proteina" se existir com ID incorreto
DELETE FROM links 
WHERE name = 'Proteina' 
  AND user_id != '8d0ccf34-e8a7-4baa-b25a-39158918a11b';

-- 5. Verificar se a foreign key aponta para professionals
-- Se não apontar, vamos corrigir
DO $$
BEGIN
    -- Verificar se a foreign key existe e aponta para professionals
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'links'
          AND kcu.column_name = 'user_id'
          AND ccu.table_name = 'professionals'
    ) THEN
        -- Remover foreign key existente se houver
        ALTER TABLE links DROP CONSTRAINT IF EXISTS links_user_id_fkey;
        
        -- Criar nova foreign key apontando para professionals
        ALTER TABLE links 
        ADD CONSTRAINT links_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES professionals(id);
        
        RAISE NOTICE 'Foreign key corrigida para apontar para professionals';
    ELSE
        RAISE NOTICE 'Foreign key já está correta';
    END IF;
END $$;

-- 6. Criar os links corretos da Stephanie
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

-- 7. Verificar resultado final
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
