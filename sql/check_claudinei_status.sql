-- Script SIMPLES para resolver o login do Claudinei Leite
-- Execute este script no Supabase SQL Editor

-- 1. VERIFICAR se existe na tabela auth.users
SELECT 
    'auth.users' as status,
    au.id,
    au.email,
    au.created_at
FROM auth.users au
WHERE au.email = 'claubemestar@gmail.com';

-- 2. VERIFICAR se existe na tabela professionals  
SELECT 
    'professionals' as status,
    p.id,
    p.name,
    p.email,
    p.phone,
    p.specialty,
    p.company
FROM professionals p
WHERE p.email = 'claubemestar@gmail.com';

-- 3. Se não existir na professionals, criar
INSERT INTO professionals (
    id,
    name,
    email,
    phone,
    specialty,
    company,
    created_at,
    updated_at
) 
SELECT 
    gen_random_uuid(),
    'Claudinei Leite',
    'claubemestar@gmail.com',
    '5511940013832',
    'Mentor',
    'CLAU',
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM professionals 
    WHERE email = 'claubemestar@gmail.com'
);
