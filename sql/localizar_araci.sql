-- LOCALIZAR ARACI: Busca Completa
-- ======================================

-- 1. BUSCAR POR NOME (todas as variações)
SELECT 
    'PROFESSIONALS' as tabela,
    id,
    name,
    email,
    is_active,
    subscription_status,
    created_at
FROM professionals 
WHERE name ILIKE '%araci%' 
   OR name ILIKE '%Araci%'
   OR name ILIKE '%ARACI%'
ORDER BY created_at DESC;

-- 2. BUSCAR POR EMAIL (todas as variações)
SELECT 
    'PROFESSIONALS' as tabela,
    id,
    name,
    email,
    is_active,
    subscription_status,
    created_at
FROM professionals 
WHERE email ILIKE '%araci%' 
   OR email ILIKE '%Araci%'
   OR email ILIKE '%ARACI%'
ORDER BY created_at DESC;

-- 3. BUSCAR EM SUBSCRIPTIONS
SELECT 
    'SUBSCRIPTIONS' as tabela,
    id,
    user_id,
    status,
    created_at
FROM subscriptions 
WHERE user_id::text ILIKE '%araci%'
ORDER BY created_at DESC;

-- 4. BUSCAR USUÁRIOS CRIADOS ONTEM
SELECT 
    'PROFESSIONALS' as tabela,
    id,
    name,
    email,
    is_active,
    subscription_status,
    created_at
FROM professionals 
WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day'
ORDER BY created_at DESC;

-- 5. BUSCAR EM AUTH.USERS (caso tenha nome diferente)
SELECT 
    'AUTH.USERS' as tabela,
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users 
WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day'
ORDER BY created_at DESC;
