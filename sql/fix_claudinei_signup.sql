-- Script SIMPLES para resolver o problema do Claudinei Leite
-- Execute este script no Supabase SQL Editor

-- 1. DELETAR qualquer registro órfão existente
DELETE FROM professionals 
WHERE email = 'claubemestar@gmail.com';

-- 2. CRIAR o novo registro
INSERT INTO professionals (
    id,
    name,
    email,
    phone,
    specialty,
    company,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Claudinei Leite',
    'claubemestar@gmail.com',
    '5511940013832',
    'Mentor',
    'CLAU',
    NOW(),
    NOW()
);

-- 3. VERIFICAR se foi criado
SELECT 
    id,
    name,
    email,
    phone,
    specialty,
    company,
    created_at
FROM professionals 
WHERE email = 'claubemestar@gmail.com';
