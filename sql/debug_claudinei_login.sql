-- Script para verificar e corrigir o login do Claudinei Leite
-- Execute este script no Supabase SQL Editor

-- 1. VERIFICAR se existe na tabela auth.users
SELECT 
    au.id,
    au.email,
    au.created_at,
    au.email_confirmed_at,
    au.last_sign_in_at
FROM auth.users au
WHERE au.email = 'claubemestar@gmail.com';

-- 2. VERIFICAR se existe na tabela professionals
SELECT 
    p.id,
    p.name,
    p.email,
    p.phone,
    p.specialty,
    p.company,
    p.created_at
FROM professionals p
WHERE p.email = 'claubemestar@gmail.com';

-- 3. Se NÃO existir na auth.users, precisamos criar
-- NOTA: Isso precisa ser feito via Supabase Dashboard ou API
-- Vá em Authentication > Users > Add User

-- 4. Se existir na auth.users mas não na professionals, criar o registro
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

-- 5. VERIFICAR resultado final
SELECT 
    'auth.users' as tabela,
    au.id::text,
    au.email,
    au.created_at
FROM auth.users au
WHERE au.email = 'claubemestar@gmail.com'

UNION ALL

SELECT 
    'professionals' as tabela,
    p.id::text,
    p.email,
    p.created_at
FROM professionals p
WHERE p.email = 'claubemestar@gmail.com';
