-- LOCALIZAR ARACY: Email 'vida saudável Aracy'
-- ==================================================

-- 1. BUSCAR POR EMAIL EXATO
SELECT 
    'PROFESSIONALS' as tabela,
    id,
    name,
    email,
    is_active,
    subscription_status,
    created_at
FROM professionals 
WHERE email = 'vida saudável Aracy'
ORDER BY created_at DESC;

-- 2. BUSCAR POR NOME ARACY
SELECT 
    'PROFESSIONALS' as tabela,
    id,
    name,
    email,
    is_active,
    subscription_status,
    created_at
FROM professionals 
WHERE name ILIKE '%aracy%' 
   OR name ILIKE '%Aracy%'
   OR name ILIKE '%ARACY%'
ORDER BY created_at DESC;

-- 3. BUSCAR POR EMAIL QUE CONTENHA 'vida' OU 'aracy'
SELECT 
    'PROFESSIONALS' as tabela,
    id,
    name,
    email,
    is_active,
    subscription_status,
    created_at
FROM professionals 
WHERE email ILIKE '%vida%' 
   OR email ILIKE '%aracy%'
   OR email ILIKE '%saudavel%'
   OR email ILIKE '%saudável%'
ORDER BY created_at DESC;

-- 4. BUSCAR EM AUTH.USERS
SELECT 
    'AUTH.USERS' as tabela,
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users 
WHERE email = 'vida saudável Aracy'
   OR email ILIKE '%vida%'
   OR email ILIKE '%aracy%'
ORDER BY created_at DESC;

-- 5. BUSCAR EM SUBSCRIPTIONS
SELECT 
    'SUBSCRIPTIONS' as tabela,
    id,
    user_id,
    status,
    created_at
FROM subscriptions 
WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email = 'vida saudável Aracy'
       OR email ILIKE '%vida%'
       OR email ILIKE '%aracy%'
)
ORDER BY created_at DESC;
