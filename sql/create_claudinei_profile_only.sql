-- Script para criar APENAS o perfil do Claudinei Leite
-- O usuário já existe na auth.users, só falta o perfil

-- 1. DELETAR qualquer registro órfão na professionals
DELETE FROM professionals 
WHERE email = 'claubemestar@gmail.com';

-- 2. CRIAR o perfil profissional
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
    'SUCESSO!' as status,
    p.id,
    p.name,
    p.email,
    p.phone,
    p.specialty,
    p.company,
    p.created_at
FROM professionals p
WHERE p.email = 'claubemestar@gmail.com';

-- 4. VERIFICAR se o usuário existe na auth.users
SELECT 
    'Usuário existe na auth.users' as status,
    au.id,
    au.email,
    au.email_confirmed_at
FROM auth.users au
WHERE au.email = 'claubemestar@gmail.com';
