-- CORREÇÃO SIMPLES DA JULIANA BORTOLAZZO (SEM IDENTITIES)
-- Execute este script no Supabase SQL Editor

-- 1. Primeiro, vamos ver o que temos
SELECT 
    id,
    name,
    email,
    subscription_status,
    subscription_plan,
    stripe_customer_id
FROM professionals 
WHERE email = 'julianazr94@gmail.com';

-- 2. Criar usuário na auth.users (sem identities)
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
    '550e8400-e29b-41d4-a716-446655440000',
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
) ON CONFLICT (email) DO NOTHING;

-- 3. Atualizar ID na tabela professionals
UPDATE professionals 
SET id = '550e8400-e29b-41d4-a716-446655440000'
WHERE email = 'julianazr94@gmail.com';

-- 4. Atualizar dados do profissional
UPDATE professionals 
SET 
    subscription_status = 'active',
    subscription_plan = 'monthly',
    stripe_customer_id = COALESCE(stripe_customer_id, 'cus_juliana_' || EXTRACT(EPOCH FROM NOW())::text)
WHERE email = 'julianazr94@gmail.com';

-- 5. Criar assinatura
INSERT INTO subscriptions (
    user_id,
    stripe_customer_id,
    stripe_subscription_id,
    stripe_price_id,
    status,
    plan_type,
    current_period_start,
    current_period_end,
    cancel_at_period_end
)
SELECT 
    id,
    'cus_juliana_' || EXTRACT(EPOCH FROM NOW())::text,
    'sub_juliana_' || EXTRACT(EPOCH FROM NOW())::text,
    'price_1SI7BEEVE42ibKnXR2Y5XAuW',
    'active',
    'monthly',
    NOW(),
    NOW() + INTERVAL '1 month',
    false
FROM professionals 
WHERE email = 'julianazr94@gmail.com'
AND NOT EXISTS (SELECT 1 FROM subscriptions WHERE user_id = professionals.id);

-- 6. Criar pagamento
INSERT INTO payments (
    subscription_id,
    stripe_payment_intent_id,
    amount,
    currency,
    status,
    description
)
SELECT 
    s.id,
    'pi_juliana_' || EXTRACT(EPOCH FROM NOW())::text,
    6000,
    'brl',
    'succeeded',
    'Pagamento mensal - Juliana Bortolazzo'
FROM subscriptions s
JOIN professionals p ON s.user_id = p.id
WHERE p.email = 'julianazr94@gmail.com'
AND NOT EXISTS (SELECT 1 FROM payments WHERE subscription_id = s.id);

-- 7. Verificar resultado final
SELECT 
    p.id,
    p.name,
    p.email,
    p.subscription_status,
    p.subscription_plan,
    s.plan_type,
    s.current_period_end,
    pay.amount,
    pay.status as payment_status,
    au.email_confirmed_at,
    au.created_at as auth_created_at
FROM professionals p
LEFT JOIN subscriptions s ON s.user_id = p.id
LEFT JOIN payments pay ON pay.subscription_id = s.id
LEFT JOIN auth.users au ON au.id = p.id
WHERE p.email = 'julianazr94@gmail.com';

-- 8. Verificar se usuário pode fazer login
SELECT 
    'Usuário criado na auth.users: ' || 
    CASE WHEN EXISTS(SELECT 1 FROM auth.users WHERE email = 'julianazr94@gmail.com') 
         THEN 'SIM' 
         ELSE 'NÃO' 
    END as status_auth;

-- 9. Verificar dados completos
SELECT 
    'DADOS DA JULIANA CORRIGIDOS:' as status,
    p.name,
    p.email,
    p.subscription_status,
    p.subscription_plan,
    s.plan_type,
    s.current_period_end,
    pay.amount,
    pay.status as payment_status
FROM professionals p
LEFT JOIN subscriptions s ON s.user_id = p.id
LEFT JOIN payments pay ON pay.subscription_id = s.id
WHERE p.email = 'julianazr94@gmail.com';
