-- Script para verificar e corrigir situação do suportebebidasfuncionais@gmail.com
-- Execute este script no Supabase SQL Editor

-- 1. Verificar situação atual - PROFESSIONALS
SELECT 
  'PROFESSIONALS' as tabela,
  id::text,
  email,
  name,
  subscription_status,
  stripe_customer_id,
  created_at
FROM public.professionals 
WHERE email = 'suportebebidasfuncionais@gmail.com';

-- 1b. Verificar situação atual - SUBSCRIPTIONS
SELECT 
  'SUBSCRIPTIONS' as tabela,
  s.id::text,
  p.email,
  s.stripe_subscription_id as name,
  s.status as subscription_status,
  s.stripe_customer_id,
  s.created_at
FROM public.subscriptions s
JOIN public.professionals p ON s.user_id = p.id
WHERE p.email = 'suportebebidasfuncionais@gmail.com';

-- 2. Verificar se há assinaturas órfãs (sem usuário)
SELECT 
  'ORPHANED_SUBSCRIPTIONS' as tipo,
  s.id,
  s.stripe_customer_id,
  s.stripe_subscription_id,
  s.status,
  s.created_at
FROM public.subscriptions s
LEFT JOIN public.professionals p ON s.user_id = p.id
WHERE p.id IS NULL
ORDER BY s.created_at DESC;

-- 3. Verificar pagamentos relacionados
SELECT 
  'PAYMENTS' as tabela,
  p.id,
  p.stripe_invoice_id,
  p.amount,
  p.status,
  p.created_at
FROM public.payments p
JOIN public.subscriptions s ON p.subscription_id = s.id
JOIN public.professionals pr ON s.user_id = pr.id
WHERE pr.email = 'suportebebidasfuncionais@gmail.com';

-- 4. INSTRUÇÕES PARA CORRIGIR:
-- 
-- Se não há assinatura vinculada ao usuário, você precisa:
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
-- Passo 4: Verificar resultado:
--
-- SELECT 
--   p.email,
--   p.subscription_status,
--   s.status as stripe_status
-- FROM public.professionals p
-- LEFT JOIN public.subscriptions s ON p.id = s.user_id
-- WHERE p.email = 'suportebebidasfuncionais@gmail.com';
