-- CORREÇÃO DA JULIANA COM FOREIGN KEY CONSTRAINT
-- Execute este script no Supabase SQL Editor

-- 1. Primeiro, vamos ver o que temos
SELECT 
    id,
    name,
    email,
    subscription_status,
    subscription_plan
FROM professionals 
WHERE email = 'julianazr94@gmail.com';

-- 2. Verificar assinaturas existentes
SELECT 
    s.*,
    p.name,
    p.email
FROM subscriptions s
JOIN professionals p ON s.user_id = p.id
WHERE p.email = 'julianazr94@gmail.com';

-- 3. ATUALIZAR ASSINATURA PRIMEIRO (para evitar foreign key constraint)
UPDATE subscriptions 
SET user_id = 'af6ba68f-8e46-4c60-8e9d-3d3d56652c59'
WHERE user_id = 'f83d995a-c9c5-4988-90ad-2396afc1a099';

-- 4. ATUALIZAR PAGAMENTOS (se existirem)
UPDATE payments 
SET subscription_id = (SELECT id FROM subscriptions WHERE user_id = 'af6ba68f-8e46-4c60-8e9d-3d3d56652c59')
WHERE subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = 'af6ba68f-8e46-4c60-8e9d-3d3d56652c59'
);

-- 5. AGORA ATUALIZAR O PROFISSIONAL (sem foreign key constraint)
UPDATE professionals 
SET id = 'af6ba68f-8e46-4c60-8e9d-3d3d56652c59'
WHERE id = 'f83d995a-c9c5-4988-90ad-2396afc1a099';

-- 6. Atualizar dados do profissional
UPDATE professionals 
SET 
    subscription_status = 'active',
    subscription_plan = 'monthly',
    stripe_customer_id = COALESCE(stripe_customer_id, 'cus_juliana_' || EXTRACT(EPOCH FROM NOW())::text)
WHERE email = 'julianazr94@gmail.com';

-- 7. Atualizar dados da assinatura
UPDATE subscriptions 
SET 
    stripe_customer_id = COALESCE(stripe_customer_id, 'cus_juliana_' || EXTRACT(EPOCH FROM NOW())::text),
    stripe_subscription_id = COALESCE(stripe_subscription_id, 'sub_juliana_' || EXTRACT(EPOCH FROM NOW())::text),
    stripe_price_id = 'price_1SI7BEEVE42ibKnXR2Y5XAuW',
    status = 'active',
    plan_type = 'monthly',
    current_period_start = NOW(),
    current_period_end = NOW() + INTERVAL '1 month',
    cancel_at_period_end = false
WHERE user_id = 'af6ba68f-8e46-4c60-8e9d-3d3d56652c59';

-- 8. Criar pagamento se não existir
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
WHERE s.user_id = 'af6ba68f-8e46-4c60-8e9d-3d3d56652c59'
AND NOT EXISTS (
    SELECT 1 FROM payments 
    WHERE subscription_id = s.id
);

-- 9. Verificar resultado final
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
    au.email_confirmed_at
FROM professionals p
LEFT JOIN subscriptions s ON s.user_id = p.id
LEFT JOIN payments pay ON pay.subscription_id = s.id
LEFT JOIN auth.users au ON au.id = p.id
WHERE p.email = 'julianazr94@gmail.com';

-- 10. Verificar se tudo está sincronizado
SELECT 
    'VERIFICAÇÃO FINAL:' as status,
    CASE 
        WHEN EXISTS(SELECT 1 FROM professionals WHERE id = 'af6ba68f-8e46-4c60-8e9d-3d3d56652c59') 
        THEN '✅ Profissional existe'
        ELSE '❌ Profissional não existe'
    END as profissional_status,
    CASE 
        WHEN EXISTS(SELECT 1 FROM subscriptions WHERE user_id = 'af6ba68f-8e46-4c60-8e9d-3d3d56652c59') 
        THEN '✅ Assinatura existe'
        ELSE '❌ Assinatura não existe'
    END as assinatura_status,
    CASE 
        WHEN EXISTS(SELECT 1 FROM auth.users WHERE id = 'af6ba68f-8e46-4c60-8e9d-3d3d56652c59') 
        THEN '✅ Usuário auth existe'
        ELSE '❌ Usuário auth não existe'
    END as auth_status;
