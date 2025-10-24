-- VERIFICAR LOGIN DA ARACY: herbalead.com/login
-- ================================================

-- 1. VERIFICAR SE EXISTE EM AUTH.USERS
SELECT 
    'AUTH.USERS' as tabela,
    id,
    email,
    created_at,
    email_confirmed_at,
    last_sign_in_at
FROM auth.users 
WHERE email = 'vidasaudavelaracy@gmail.com';

-- 2. VERIFICAR PROFESSIONAL DA ARACY
SELECT 
    'PROFESSIONALS' as tabela,
    id,
    name,
    email,
    is_active,
    subscription_status,
    created_at
FROM professionals 
WHERE email = 'vidasaudavelaracy@gmail.com';

-- 3. VERIFICAR SE OS IDs SÃO COMPATÍVEIS
SELECT 
    'COMPATIBILIDADE IDs' as status,
    a.id as auth_id,
    a.email as auth_email,
    p.id as professional_id,
    p.name as professional_name,
    p.email as professional_email,
    CASE 
        WHEN a.id IS NULL THEN '❌ NÃO EXISTE EM AUTH.USERS'
        WHEN p.id IS NULL THEN '❌ NÃO EXISTE EM PROFESSIONALS'
        WHEN a.id = p.id THEN '✅ IDs COMPATÍVEIS'
        ELSE '❌ IDs INCOMPATÍVEIS'
    END as status_problema
FROM auth.users a
FULL OUTER JOIN professionals p ON a.email = p.email
WHERE a.email = 'vidasaudavelaracy@gmail.com' 
   OR p.email = 'vidasaudavelaracy@gmail.com';

-- 4. VERIFICAR SUBSCRIPTION
SELECT 
    'SUBSCRIPTIONS' as tabela,
    id,
    user_id,
    status,
    created_at
FROM subscriptions 
WHERE user_id = '2565faa4-8dd1-47f2-beba-074ed84c563c';
