-- Script SQL para corrigir Juliana Bortolazzo
-- Execute este script no Supabase SQL Editor

-- 1. Primeiro, vamos verificar os dados atuais da Juliana
SELECT 
    id,
    name,
    email,
    subscription_status,
    subscription_plan,
    stripe_customer_id,
    grace_period_end,
    created_at
FROM professionals 
WHERE email ILIKE '%julianazr94%';

-- 2. Verificar se existe assinatura para ela
SELECT 
    s.*,
    p.name,
    p.email
FROM subscriptions s
JOIN professionals p ON s.user_id = p.id
WHERE p.email ILIKE '%julianazr94%';

-- 3. Verificar pagamentos
SELECT 
    pay.*,
    s.plan_type,
    p.name,
    p.email
FROM payments pay
JOIN subscriptions s ON pay.subscription_id = s.id
JOIN professionals p ON s.user_id = p.id
WHERE p.email ILIKE '%julianazr94%';

-- 4. CORREÇÃO: Atualizar dados do profissional
-- (Execute apenas se a Juliana existir)
UPDATE professionals 
SET 
    subscription_status = 'active',
    subscription_plan = 'monthly',
    stripe_customer_id = COALESCE(stripe_customer_id, 'cus_juliana_' || EXTRACT(EPOCH FROM NOW())::text),
    grace_period_end = NULL  -- Remove período de graça se existir
WHERE email ILIKE '%julianazr94%'
RETURNING id, name, email, subscription_status, subscription_plan;

-- 5. CORREÇÃO: Criar assinatura se não existir
-- (Execute apenas se não houver assinatura)
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
    p.id,
    COALESCE(p.stripe_customer_id, 'cus_juliana_' || EXTRACT(EPOCH FROM NOW())::text),
    'sub_juliana_' || EXTRACT(EPOCH FROM NOW())::text,
    'price_1SI7BEEVE42ibKnXR2Y5XAuW', -- ID do plano mensal
    'active',
    'monthly',
    NOW(),
    NOW() + INTERVAL '1 month',
    false
FROM professionals p
WHERE p.email ILIKE '%julianazr94%'
AND NOT EXISTS (
    SELECT 1 FROM subscriptions s 
    WHERE s.user_id = p.id
)
RETURNING *;

-- 6. CORREÇÃO: Criar pagamento se não existir
-- (Execute apenas se não houver pagamentos)
INSERT INTO payments (
    subscription_id,
    stripe_payment_intent_id,
    amount,
    currency,
    status,
    description,
    created_at
)
SELECT 
    s.id,
    'pi_juliana_' || EXTRACT(EPOCH FROM NOW())::text,
    6000, -- R$ 60,00 em centavos
    'brl',
    'succeeded',
    'Pagamento mensal - Juliana Bortolazzo',
    NOW()
FROM subscriptions s
JOIN professionals p ON s.user_id = p.id
WHERE p.email ILIKE '%julianazr94%'
AND NOT EXISTS (
    SELECT 1 FROM payments pay 
    WHERE pay.subscription_id = s.id
)
RETURNING *;

-- 7. VERIFICAÇÃO FINAL: Ver todos os dados corrigidos
SELECT 
    p.id,
    p.name,
    p.email,
    p.subscription_status,
    p.subscription_plan,
    p.stripe_customer_id,
    p.grace_period_end,
    s.id as subscription_id,
    s.status as subscription_status_stripe,
    s.plan_type,
    s.current_period_start,
    s.current_period_end,
    pay.amount,
    pay.status as payment_status,
    pay.created_at as payment_date
FROM professionals p
LEFT JOIN subscriptions s ON s.user_id = p.id
LEFT JOIN payments pay ON pay.subscription_id = s.id
WHERE p.email ILIKE '%julianazr94%';

-- 8. INSTRUÇÕES PARA CRIAR USUÁRIO NA AUTH.USERS
-- Execute este comando no Supabase Auth Admin ou use a API:

/*
-- Via API (substitua YOUR_PROJECT_URL e YOUR_SERVICE_ROLE_KEY):
curl -X POST 'https://YOUR_PROJECT_URL.supabase.co/auth/v1/admin/users' \
-H "apikey: YOUR_SERVICE_ROLE_KEY" \
-H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
-H "Content-Type: application/json" \
-d '{
  "email": "julianazr94@gmail.com",
  "password": "temp-password-2025",
  "email_confirm": true,
  "user_metadata": {
    "name": "Juliana Bortolazzo"
  }
}'
*/

-- 9. ATUALIZAR ID DO PROFESSIONAL (após criar na auth.users)
-- Substitua 'NEW_AUTH_USER_ID' pelo ID retornado da criação do usuário
/*
UPDATE professionals 
SET id = 'NEW_AUTH_USER_ID'
WHERE email = 'julianazr94@gmail.com';
*/
