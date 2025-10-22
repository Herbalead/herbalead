-- Script corrigido para pagamentos anuais usando campos corretos
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar estrutura real da tabela subscriptions
SELECT 
  'ESTRUTURA DA TABELA SUBSCRIPTIONS:' as info,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name = 'subscriptions'
ORDER BY ordinal_position;

-- 2. Verificar pagamentos anuais com campos corretos
SELECT 
  'PAGAMENTOS ANUAIS:' as info,
  id,
  user_id,
  plan_type,
  current_period_start,
  current_period_end,
  status,
  CASE 
    WHEN plan_type = 'annual' AND current_period_end::date - current_period_start::date < 300 THEN '❌ PROBLEMA: Menos de 300 dias'
    WHEN plan_type = 'annual' AND current_period_end::date - current_period_start::date >= 300 THEN '✅ OK: Mais de 300 dias'
    ELSE '⚠️ Não é anual'
  END as status_duracao,
  current_period_end::date - current_period_start::date as dias_duracao
FROM subscriptions 
WHERE plan_type = 'annual'
ORDER BY created_at DESC;

-- 3. Corrigir TODOS os pagamentos anuais com problema
UPDATE subscriptions 
SET 
  current_period_end = (current_period_start::date + INTERVAL '1 year')::timestamp,
  updated_at = NOW()
WHERE plan_type = 'annual'
  AND (current_period_end::date - current_period_start::date) < 300;

-- 4. Verificar resultado da correção
SELECT 
  'APÓS CORREÇÃO - TODOS OS ANUAIS:' as info,
  id,
  user_id,
  plan_type,
  current_period_start,
  current_period_end,
  current_period_end::date - current_period_start::date as dias_duracao,
  CASE 
    WHEN current_period_end::date - current_period_start::date >= 300 THEN '✅ CORRIGIDO'
    ELSE '❌ AINDA COM PROBLEMA'
  END as status_final
FROM subscriptions 
WHERE plan_type = 'annual'
ORDER BY created_at DESC;

-- 5. Verificar especificamente a Rosana Elisa
SELECT 
  'ROSANA ELISA - VERIFICAÇÃO:' as info,
  p.name,
  p.email,
  s.plan_type,
  s.current_period_start,
  s.current_period_end,
  s.current_period_end::date - s.current_period_start::date as dias_duracao
FROM professionals p
JOIN subscriptions s ON p.id = s.user_id
WHERE p.email ILIKE '%rosana%' 
   OR p.email ILIKE '%sperandio%'
   OR p.name ILIKE '%rosana%';

SELECT '✅ CORREÇÃO DOS PAGAMENTOS ANUAIS CONCLUÍDA!' as status;
