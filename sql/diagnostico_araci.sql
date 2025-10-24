-- DIAGNÓSTICO ARACI: Problema de Cadastro Incompleto
-- ========================================================

-- 1. VERIFICAR DADOS DA ARACI
SELECT 
    'AUTH.USERS' as tabela,
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users 
WHERE email ILIKE '%araci%' OR email ILIKE '%araci%'
ORDER BY created_at DESC;

-- 2. VERIFICAR SUBSCRIPTIONS
SELECT 
    'SUBSCRIPTIONS' as tabela,
    id,
    user_id,
    status,
    created_at
FROM subscriptions 
WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email ILIKE '%araci%'
)
ORDER BY created_at DESC;

-- 3. VERIFICAR PROFESSIONALS
SELECT 
    'PROFESSIONALS' as tabela,
    id,
    name,
    email,
    is_active,
    subscription_status,
    created_at
FROM professionals 
WHERE email ILIKE '%araci%' OR name ILIKE '%araci%'
ORDER BY created_at DESC;

-- 4. VERIFICAR INCOMPATIBILIDADE DE IDs
SELECT 
    a.id as auth_id,
    a.email as auth_email,
    a.created_at as auth_created,
    p.id as professional_id,
    p.name as professional_name,
    p.email as professional_email,
    p.is_active,
    p.subscription_status,
    CASE 
        WHEN p.id IS NULL THEN '❌ NÃO EXISTE EM PROFESSIONALS'
        WHEN a.id = p.id THEN '✅ IDs COMPATÍVEIS'
        ELSE '❌ IDs INCOMPATÍVEIS'
    END as status_problema
FROM auth.users a
LEFT JOIN professionals p ON a.email = p.email
WHERE a.email ILIKE '%araci%'
ORDER BY a.created_at DESC;
