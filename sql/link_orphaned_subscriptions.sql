-- Script para vincular assinaturas órfãs aos usuários
-- Execute este script no Supabase SQL Editor

-- 1. Verificar assinaturas sem usuário vinculado
SELECT 
  s.id as subscription_id,
  s.stripe_customer_id,
  s.stripe_subscription_id,
  s.status,
  s.created_at
FROM public.subscriptions s
LEFT JOIN public.professionals p ON s.user_id = p.id
WHERE p.id IS NULL
ORDER BY s.created_at DESC;

-- 2. Verificar usuários sem assinatura ativa
SELECT 
  p.id,
  p.email,
  p.name,
  p.stripe_customer_id,
  p.subscription_status,
  s.id as subscription_id,
  s.status as subscription_status_stripe
FROM public.professionals p
LEFT JOIN public.subscriptions s ON p.id = s.user_id
WHERE p.subscription_status != 'active' 
   OR s.status != 'active'
ORDER BY p.created_at DESC;

-- 3. Vincular assinaturas órfãs aos usuários pelo email do Stripe
-- NOTA: Este script precisa ser executado manualmente para cada caso
-- Exemplo para andrefaula.ia@gmail.com:

-- Primeiro, encontrar o customer_id do Stripe para este email
-- (Você precisa verificar no Stripe Dashboard)

-- Depois executar:
-- UPDATE public.subscriptions 
-- SET user_id = (
--   SELECT id FROM public.professionals 
--   WHERE email = 'andrefaula.ia@gmail.com'
-- )
-- WHERE stripe_customer_id = 'cus_XXXXXXXXXXXXX';

-- 4. Atualizar status do profissional para ativo
-- UPDATE public.professionals 
-- SET subscription_status = 'active'
-- WHERE email = 'andrefaula.ia@gmail.com';

-- 5. Verificar resultado
SELECT 
  p.email,
  p.name,
  p.subscription_status,
  s.status as stripe_status,
  s.stripe_subscription_id
FROM public.professionals p
LEFT JOIN public.subscriptions s ON p.id = s.user_id
WHERE p.email = 'andrefaula.ia@gmail.com';
