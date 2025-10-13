-- Script SUPER SIMPLES para criar o Claudinei Leite
-- Execute este script no Supabase SQL Editor

-- 1. Limpar registros existentes
DELETE FROM professionals WHERE email = 'claubemestar@gmail.com';

-- 2. Criar usuário com senha hash
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'claubemestar@gmail.com',
    crypt('12345678', gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    NOW(),
    NOW()
);

-- 3. Criar perfil profissional
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

-- 4. Verificar criação
SELECT 'SUCESSO: Usuário criado!' as status;
SELECT 'Email: claubemestar@gmail.com' as credenciais;
SELECT 'Senha: 12345678' as credenciais;
