-- CORREÇÃO ULTRA SIMPLES DA JULIANA
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

-- 2. Atualizar dados básicos do profissional
UPDATE professionals 
SET 
    subscription_status = 'active',
    subscription_plan = 'monthly',
    stripe_customer_id = COALESCE(stripe_customer_id, 'cus_juliana_' || EXTRACT(EPOCH FROM NOW())::text)
WHERE email = 'julianazr94@gmail.com';

-- 3. Criar assinatura (se não existir)
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

-- 4. Criar pagamento (se não existir)
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

-- 5. Verificar resultado
SELECT 
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

-- 6. INSTRUÇÕES PARA CRIAR USUÁRIO NA AUTH:
-- Vá em Authentication > Users no Supabase Dashboard
-- Clique em "Add user"
-- Email: julianazr94@gmail.com
-- Password: temp-password-2025
-- Marque "Email confirmed"
-- Clique "Create user"
-- Copie o ID gerado e execute o comando abaixo:

-- 7. ATUALIZAR ID (execute após criar usuário na auth):
-- UPDATE professionals 
-- SET id = 'ID_COPIADO_AQUI'
-- WHERE email = 'julianazr94@gmail.com';
