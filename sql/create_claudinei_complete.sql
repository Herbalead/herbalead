-- Script COMPLETO para criar o usuário Claudinei Leite
-- Execute este script no Supabase SQL Editor

-- 1. DELETAR qualquer registro órfão existente
DELETE FROM professionals 
WHERE email = 'claubemestar@gmail.com';

-- 2. CRIAR usuário na tabela auth.users
-- NOTA: Esta função cria o usuário com senha hash automática
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'claubemestar@gmail.com',
    crypt('12345678', gen_salt('bf')), -- Senha: 12345678
    NOW(),
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- 3. CRIAR registro na tabela professionals
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

-- 4. VERIFICAR se foi criado corretamente
SELECT 
    'auth.users' as tabela,
    au.id,
    au.email,
    au.email_confirmed_at,
    au.created_at
FROM auth.users au
WHERE au.email = 'claubemestar@gmail.com'

UNION ALL

SELECT 
    'professionals' as tabela,
    p.id,
    p.email,
    p.created_at,
    p.created_at
FROM professionals p
WHERE p.email = 'claubemestar@gmail.com';
