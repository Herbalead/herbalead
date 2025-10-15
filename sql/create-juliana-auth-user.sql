-- Script para criar usuário na auth.users via SQL
-- ATENÇÃO: Este script cria o usuário diretamente na tabela auth.users
-- Use apenas se não conseguir criar via interface do Supabase

-- 1. Gerar UUID para o usuário
-- (Execute primeiro para obter o UUID)
SELECT gen_random_uuid() as new_user_id;

-- 2. Inserir usuário na auth.users
-- (Substitua 'USER_UUID_AQUI' pelo UUID gerado acima)
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    'USER_UUID_AQUI', -- Substitua pelo UUID gerado
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'julianazr94@gmail.com',
    crypt('temp-password-2025', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- 3. Inserir identidade do usuário
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'USER_UUID_AQUI', -- Mesmo UUID do passo 2
    '{"sub": "USER_UUID_AQUI", "email": "julianazr94@gmail.com"}',
    'email',
    NOW(),
    NOW(),
    NOW()
);

-- 4. Atualizar ID na tabela professionals
UPDATE professionals 
SET id = 'USER_UUID_AQUI' -- Mesmo UUID
WHERE email = 'julianazr94@gmail.com';

-- 5. Verificar se funcionou
SELECT 
    p.id,
    p.name,
    p.email,
    p.subscription_status,
    au.email_confirmed_at,
    au.created_at
FROM professionals p
LEFT JOIN auth.users au ON au.id = p.id
WHERE p.email = 'julianazr94@gmail.com';
