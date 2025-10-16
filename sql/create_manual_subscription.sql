-- Script para criar assinatura manual para suportebebidasfuncionais@gmail.com
-- Execute este script no Supabase SQL Editor

-- 1. Primeiro, vamos criar uma assinatura "fake" para teste
-- (Você pode substituir pelos dados reais do Stripe depois)

INSERT INTO public.subscriptions (
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
  (SELECT id FROM public.professionals WHERE email = 'suportebebidasfuncionais@gmail.com'),
  'cus_test_' || extract(epoch from now()), -- Customer ID temporário
  'sub_test_' || extract(epoch from now()), -- Subscription ID temporário
  'price_test_monthly', -- Price ID temporário
  'active',
  'monthly',
  now(),
  now() + interval '1 month',
  false,
  now(),
  now()
);

-- 2. Atualizar status do profissional
UPDATE public.professionals 
SET 
  subscription_status = 'active',
  stripe_customer_id = 'cus_test_' || extract(epoch from now()),
  updated_at = now()
WHERE email = 'suportebebidasfuncionais@gmail.com';

-- 3. Verificar resultado
SELECT 
  p.email,
  p.name,
  p.subscription_status,
  p.stripe_customer_id,
  s.stripe_subscription_id,
  s.status as stripe_status,
  s.plan_type
FROM public.professionals p
LEFT JOIN public.subscriptions s ON p.id = s.user_id
WHERE p.email = 'suportebebidasfuncionais@gmail.com';
