-- Script para verificar se há assinatura órfã para bellaesteticaguru@gmail.com
-- Execute este script no Supabase SQL Editor

-- 1. Verificar usuário na professionals
SELECT 
  'PROFESSIONALS' as tabela,
  id::text,
  email,
  name,
  subscription_status,
  stripe_customer_id,
  created_at
FROM public.professionals 
WHERE email = 'bellaesteticaguru@gmail.com';

-- 2. Verificar assinaturas órfãs (sem usuário)
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

-- 3. Verificar TODAS as assinaturas
SELECT 
  'ALL_SUBSCRIPTIONS' as tipo,
  s.id,
  s.user_id,
  s.stripe_customer_id,
  s.stripe_subscription_id,
  s.status,
  s.created_at
FROM public.subscriptions s
ORDER BY s.created_at DESC;
