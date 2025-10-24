-- CORREÇÃO ARACY: Criar conta de autenticação
-- ================================================

-- 1. VERIFICAR SE EXISTE EM AUTH.USERS
SELECT 
    'AUTH.USERS' as tabela,
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users 
WHERE email = 'vidasaudavelaracy@gmail.com';

-- 2. VERIFICAR SUBSCRIPTION DA ARACY
SELECT 
    'SUBSCRIPTIONS' as tabela,
    id,
    user_id,
    status,
    created_at
FROM subscriptions 
WHERE user_id = '2565faa4-8dd1-47f2-beba-074ed84c563c';

-- 3. CRIAR CONTA DE AUTENTICAÇÃO PARA ARACY
-- (Execute este comando usando Supabase Admin)
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
    '2565faa4-8dd1-47f2-beba-074ed84c563c', -- Mesmo ID do professional
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'vidasaudavelaracy@gmail.com',
    crypt('123456', gen_salt('bf')), -- Senha temporária
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- 4. VERIFICAR SE FOI CRIADO
SELECT 
    'AUTH.USERS APÓS CRIAÇÃO' as tabela,
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users 
WHERE email = 'vidasaudavelaracy@gmail.com';

-- 5. ATUALIZAR PROFESSIONAL COM DADOS CORRETOS
UPDATE professionals 
SET 
    name = 'Aracy',
    phone = '', -- Ela pode atualizar depois
    specialty = '',
    company = ''
WHERE id = '2565faa4-8dd1-47f2-beba-074ed84c563c';

-- 6. VERIFICAR RESULTADO FINAL
SELECT 
    'PROFESSIONAL ATUALIZADO' as tabela,
    id,
    name,
    email,
    is_active,
    subscription_status,
    created_at
FROM professionals 
WHERE id = '2565faa4-8dd1-47f2-beba-074ed84c563c';
