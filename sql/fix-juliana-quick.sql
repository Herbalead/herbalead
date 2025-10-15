-- CORREÇÃO RÁPIDA DA JULIANA BORTOLAZZO
-- Execute no Supabase SQL Editor

-- 1. Atualizar dados do profissional
UPDATE professionals 
SET 
    subscription_status = 'active',
    subscription_plan = 'monthly',
    stripe_customer_id = COALESCE(stripe_customer_id, 'cus_juliana_' || EXTRACT(EPOCH FROM NOW())::text)
WHERE email = 'julianazr94@gmail.com';

-- 2. Criar assinatura
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

-- 3. Criar pagamento
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

-- 4. Verificar resultado
SELECT 
    p.name,
    p.email,
    p.subscription_status,
    p.subscription_plan,
    s.plan_type,
    s.current_period_end,
    pay.amount,
    pay.status
FROM professionals p
LEFT JOIN subscriptions s ON s.user_id = p.id
LEFT JOIN payments pay ON pay.subscription_id = s.id
WHERE p.email = 'julianazr94@gmail.com';
