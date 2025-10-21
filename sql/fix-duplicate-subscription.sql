-- Script para verificar e corrigir assinatura duplicada
-- Baseado no erro: duplicate key value violates unique constraint

-- PASSO 1: Verificar se a assinatura já existe
SELECT 
    s.id,
    s.user_id,
    s.stripe_customer_id,
    s.stripe_subscription_id,
    s.status,
    s.plan_type,
    s.current_period_start,
    s.current_period_end,
    p.name,
    p.email
FROM subscriptions s
JOIN professionals p ON s.user_id = p.id
WHERE s.stripe_subscription_id = 'sub_1SIdfDEVE42ibKnXyBFWVdZR';

-- PASSO 2: Verificar o profissional
SELECT 
    id,
    name,
    email,
    stripe_customer_id,
    subscription_status,
    subscription_plan
FROM professionals 
WHERE stripe_customer_id = 'cus_TF7vEQ6Sesl1eV';

-- PASSO 3: Atualizar a assinatura existente (se necessário)
UPDATE subscriptions
SET 
    status = 'active',
    plan_type = 'monthly',
    current_period_start = '2025-10-15T19:59:23.000Z',
    current_period_end = '2025-11-15T19:59:23.000Z',
    cancel_at_period_end = false,
    updated_at = NOW()
WHERE stripe_subscription_id = 'sub_1SIdfDEVE42ibKnXyBFWVdZR';

-- PASSO 4: Atualizar o profissional
UPDATE professionals
SET 
    subscription_status = 'active',
    subscription_plan = 'monthly',
    stripe_customer_id = 'cus_TF7vEQ6Sesl1eV',
    grace_period_end = NULL,
    updated_at = NOW()
WHERE stripe_customer_id = 'cus_TF7vEQ6Sesl1eV';

-- PASSO 5: Verificar se foi corrigido
SELECT 
    s.id,
    s.stripe_subscription_id,
    s.status,
    s.plan_type,
    p.name,
    p.email,
    p.subscription_status
FROM subscriptions s
JOIN professionals p ON s.user_id = p.id
WHERE s.stripe_subscription_id = 'sub_1SIdfDEVE42ibKnXyBFWVdZR';









