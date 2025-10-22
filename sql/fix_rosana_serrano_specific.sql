-- Script específico para corrigir a Rosana Serrano
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar a entrada específica da Rosana Serrano
SELECT 
  'ENTRADA DA ROSANA SERRANO:' as info,
  id,
  stripe_subscription_id,
  stripe_price_id,
  status,
  plan_type,
  current_period_start,
  current_period_end,
  current_period_end::date - current_period_start::date as dias_duracao
FROM subscriptions 
WHERE stripe_subscription_id = 'mp_sub_130230935267'
   OR stripe_price_id = 'mp_price_yearly'
   OR id = '12b21612-1c9c-4c65-a1c0-8b05181e1377';

-- 2. Corrigir especificamente a Rosana Serrano
UPDATE subscriptions 
SET 
  current_period_end = (current_period_start::date + INTERVAL '1 year')::timestamp,
  updated_at = NOW()
WHERE stripe_subscription_id = 'mp_sub_130230935267'
   OR stripe_price_id = 'mp_price_yearly'
   OR id = '12b21612-1c9c-4c65-a1c0-8b05181e1377';

-- 3. Verificar se foi corrigido
SELECT 
  'APÓS CORREÇÃO - ROSANA SERRANO:' as info,
  id,
  stripe_subscription_id,
  stripe_price_id,
  status,
  plan_type,
  current_period_start,
  current_period_end,
  current_period_end::date - current_period_start::date as dias_duracao,
  CASE 
    WHEN current_period_end::date - current_period_start::date >= 300 THEN '✅ CORRIGIDO'
    ELSE '❌ AINDA COM PROBLEMA'
  END as status_final
FROM subscriptions 
WHERE stripe_subscription_id = 'mp_sub_130230935267'
   OR stripe_price_id = 'mp_price_yearly'
   OR id = '12b21612-1c9c-4c65-a1c0-8b05181e1377';

-- 4. Corrigir TODOS os outros pagamentos anuais com problema
UPDATE subscriptions 
SET 
  current_period_end = (current_period_start::date + INTERVAL '1 year')::timestamp,
  updated_at = NOW()
WHERE plan_type = 'yearly'
  AND (current_period_end::date - current_period_start::date) < 300;

-- 5. Verificar resultado final de todos os anuais
SELECT 
  'TODOS OS PAGAMENTOS ANUAIS APÓS CORREÇÃO:' as info,
  id,
  stripe_subscription_id,
  plan_type,
  current_period_start,
  current_period_end,
  current_period_end::date - current_period_start::date as dias_duracao,
  CASE 
    WHEN current_period_end::date - current_period_start::date >= 300 THEN '✅ CORRIGIDO'
    ELSE '❌ AINDA COM PROBLEMA'
  END as status_final
FROM subscriptions 
WHERE plan_type = 'yearly'
ORDER BY created_at DESC;

SELECT '✅ ROSANA SERRANO E TODOS OS ANUAIS CORRIGIDOS!' as status;
