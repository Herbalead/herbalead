-- Script para testar se webhook está funcionando
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se há eventos recentes no Stripe que não foram processados
-- (Você precisa verificar no Stripe Dashboard se há eventos recentes)

-- 2. Verificar se há assinaturas órfãs criadas recentemente
SELECT 
  'RECENT_ORPHANED_SUBSCRIPTIONS' as tipo,
  s.id,
  s.stripe_customer_id,
  s.stripe_subscription_id,
  s.status,
  s.created_at
FROM public.subscriptions s
LEFT JOIN public.professionals p ON s.user_id = p.id
WHERE p.id IS NULL
  AND s.created_at > NOW() - INTERVAL '1 hour'
ORDER BY s.created_at DESC;

-- 3. Verificar usuários criados recentemente sem assinatura
SELECT 
  'RECENT_USERS_WITHOUT_SUBSCRIPTION' as tipo,
  p.id,
  p.email,
  p.name,
  p.subscription_status,
  p.created_at,
  s.id as subscription_id
FROM public.professionals p
LEFT JOIN public.subscriptions s ON p.id = s.user_id
WHERE p.created_at > NOW() - INTERVAL '1 hour'
  AND s.id IS NULL
ORDER BY p.created_at DESC;

-- 4. Verificar se há pagamentos recentes sem assinatura vinculada
SELECT 
  'RECENT_PAYMENTS_WITHOUT_SUBSCRIPTION' as tipo,
  pay.id,
  pay.stripe_invoice_id,
  pay.amount,
  pay.status,
  pay.created_at,
  s.id as subscription_id
FROM public.payments pay
LEFT JOIN public.subscriptions s ON pay.subscription_id = s.id
WHERE pay.created_at > NOW() - INTERVAL '1 hour'
  AND s.id IS NULL
ORDER BY pay.created_at DESC;
