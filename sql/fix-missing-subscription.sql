-- Script para corrigir assinatura faltante na tabela subscriptions
-- Execute este script após identificar o usuário com problema

-- 1. Primeiro, vamos identificar o usuário pelo email
-- Substitua 'EMAIL_DO_USUARIO' pelo email real
SELECT 
    p.id as user_id,
    p.email,
    p.stripe_customer_id,
    p.subscription_status,
    p.subscription_plan
FROM professionals p 
WHERE p.email = 'EMAIL_DO_USUARIO';

-- 2. Depois, inserir a assinatura na tabela subscriptions
-- Substitua os valores pelos dados reais do Stripe
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
    'USER_ID_AQUI', -- ID do usuário da tabela professionals
    'cus_CUSTOMER_ID_AQUI', -- Customer ID do Stripe
    'sub_SUBSCRIPTION_ID_AQUI', -- Subscription ID do Stripe
    'price_1SI7BEEVE42ibKnXR2Y5XAuW', -- Price ID (mensal) ou 'price_1SI7CSEVE42ibKnXA0pA9OYX' (anual)
    'active',
    'monthly', -- ou 'yearly' dependendo do plano
    '2025-01-15T00:00:00Z', -- Data de início do período atual
    '2025-02-15T00:00:00Z', -- Data de fim do período atual
    false,
    NOW(),
    NOW()
);

-- 3. Verificar se foi inserido corretamente
SELECT * FROM subscriptions WHERE user_id = 'USER_ID_AQUI';
