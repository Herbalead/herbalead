-- Script para vincular assinatura do suportebebidasfuncionais@gmail.com
-- Execute este script no Supabase SQL Editor

-- 1. Verificar situação atual do usuário
SELECT 
  p.id,
  p.email,
  p.name,
  p.stripe_customer_id,
  p.subscription_status,
  s.id as subscription_id,
  s.stripe_customer_id as subscription_customer_id,
  s.status as subscription_status_stripe
FROM public.professionals p
LEFT JOIN public.subscriptions s ON p.id = s.user_id
WHERE p.email = 'suportebebidasfuncionais@gmail.com';

-- 2. Verificar assinaturas órfãs (sem usuário vinculado)
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

-- 3. INSTRUÇÕES PARA VINCULAR:
-- 
-- Passo 1: No Stripe Dashboard, encontre o customer_id para suportebebidasfuncionais@gmail.com
-- Passo 2: Execute o comando abaixo substituindo 'cus_XXXXXXXXXXXXX' pelo customer_id real:
--
-- UPDATE public.subscriptions 
-- SET user_id = (
--   SELECT id FROM public.professionals 
--   WHERE email = 'suportebebidasfuncionais@gmail.com'
-- )
-- WHERE stripe_customer_id = 'cus_XXXXXXXXXXXXX';
--
-- Passo 3: Atualizar status do profissional:
--
-- UPDATE public.professionals 
-- SET subscription_status = 'active'
-- WHERE email = 'suportebebidasfuncionais@gmail.com';
--
-- Passo 4: Verificar se funcionou:
--
-- SELECT 
--   p.email,
--   p.name,
--   p.subscription_status,
--   s.status as stripe_status,
--   s.stripe_subscription_id
-- FROM public.professionals p
-- LEFT JOIN public.subscriptions s ON p.id = s.user_id
-- WHERE p.email = 'suportebebidasfuncionais@gmail.com';
