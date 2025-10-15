-- Script para corrigir assinatura faltante na tabela subscriptions
-- Baseado nos dados do evento Stripe fornecido:
-- Customer ID: cus_TF7vEQ6Sesl1eV
-- Subscription ID: sub_1SIdfDEVE42ibKnXyBFWVdZR
-- Price ID: price_1SI7BEEVE42ibKnXR2Y5XAuW
-- current_period_start: 1760569163 (Unix timestamp)
-- current_period_end: 1763247563 (Unix timestamp)

-- PASSO 1: Identificar o usuário pelo stripe_customer_id
SELECT 
    id as user_id,
    email,
    stripe_customer_id,
    subscription_status,
    subscription_plan
FROM professionals 
WHERE stripe_customer_id = 'cus_TF7vEQ6Sesl1eV';

-- PASSO 2: Inserir a assinatura na tabela subscriptions
-- (Execute após obter o user_id do PASSO 1)
INSERT INTO subscriptions (
    user_id,
    stripe_customer_id,
    stripe_subscription_id,
    stripe_price_id,
    status,
    plan_type,
    current_period_start,
    current_period_end,
    cancel_at_period_end,
    created_at,
    updated_at
) VALUES (
    '43cdd900-c343-4ae2-9195-893053e735bd', -- USER_ID do profissional ANDRE OLIVEIRA
    'cus_TF7vEQ6Sesl1eV',
    'sub_1SIdfDEVE42ibKnXyBFWVdZR',
    'price_1SI7BEEVE42ibKnXR2Y5XAuW',
    'active',
    'monthly',
    '2025-10-15T19:59:23.000Z', -- current_period_start (Unix 1760569163)
    '2025-11-15T19:59:23.000Z', -- current_period_end (Unix 1763247563)
    false,
    '2025-10-15T19:59:23.000Z', -- created (Unix 1760569163)
    NOW()
);

-- PASSO 3: Atualizar o status do profissional
UPDATE professionals
SET 
    subscription_status = 'active',
    subscription_plan = 'monthly',
    stripe_customer_id = 'cus_TF7vEQ6Sesl1eV',
    grace_period_end = NULL, -- Remover período de graça se houver
    updated_at = NOW()
WHERE id = '43cdd900-c343-4ae2-9195-893053e735bd';

-- PASSO 4: Verificar se foi corrigido
SELECT * FROM professionals WHERE stripe_customer_id = 'cus_TF7vEQ6Sesl1eV';
SELECT * FROM subscriptions WHERE stripe_customer_id = 'cus_TF7vEQ6Sesl1eV';
