-- Script corrigido para investigar e corrigir pagamentos anuais
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar estrutura da tabela subscriptions
SELECT 
  'ESTRUTURA DA TABELA SUBSCRIPTIONS:' as status,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'subscriptions'
ORDER BY ordinal_position;

-- 2. Verificar dados da Rosana Elisa (usando campo correto)
SELECT 
  'DADOS DA ROSANA ELISA:' as status,
  p.id,
  p.name,
  p.email,
  p.is_active,
  p.created_at,
  s.id as subscription_id,
  s.plan_type,
  s.status as subscription_status,
  s.start_date,
  s.end_date,
  s.next_billing_date,
  s.created_at as subscription_created_at
FROM professionals p
LEFT JOIN subscriptions s ON p.id = s.user_id  -- Tentar user_id
WHERE p.email ILIKE '%rosana%' 
   OR p.email ILIKE '%sperandio%'
   OR p.name ILIKE '%rosana%';

-- 3. Se user_id não funcionar, tentar auth_user_id
SELECT 
  'TENTATIVA COM AUTH_USER_ID:' as status,
  p.id,
  p.name,
  p.email,
  s.id as subscription_id,
  s.plan_type,
  s.start_date,
  s.end_date
FROM professionals p
LEFT JOIN subscriptions s ON p.id = s.auth_user_id  -- Tentar auth_user_id
WHERE p.email ILIKE '%rosana%' 
   OR p.email ILIKE '%sperandio%'
   OR p.name ILIKE '%rosana%';

-- 4. Verificar todos os pagamentos anuais com problema
SELECT 
  'PAGAMENTOS ANUAIS COM PROBLEMA:' as status,
  s.id,
  s.plan_type,
  s.start_date,
  s.end_date,
  s.next_billing_date,
  CASE 
    WHEN s.plan_type = 'annual' AND s.end_date - s.start_date < 300 THEN '❌ PROBLEMA: Menos de 300 dias'
    WHEN s.plan_type = 'annual' AND s.end_date - s.start_date >= 300 THEN '✅ OK: Mais de 300 dias'
    ELSE '⚠️ Não é anual'
  END as status_duracao,
  s.end_date - s.start_date as dias_duracao
FROM subscriptions s
WHERE s.plan_type = 'annual'
ORDER BY s.created_at DESC;

-- 5. Corrigir TODOS os pagamentos anuais com problema
UPDATE subscriptions 
SET 
  end_date = start_date + INTERVAL '1 year',
  next_billing_date = start_date + INTERVAL '1 year',
  updated_at = NOW()
WHERE plan_type = 'annual'
  AND (end_date - start_date) < 300;

-- 6. Verificar resultado da correção
SELECT 
  'APÓS CORREÇÃO - TODOS OS ANUAIS:' as status,
  s.id,
  s.plan_type,
  s.start_date,
  s.end_date,
  s.next_billing_date,
  s.end_date - s.start_date as dias_duracao,
  CASE 
    WHEN s.end_date - s.start_date >= 300 THEN '✅ CORRIGIDO'
    ELSE '❌ AINDA COM PROBLEMA'
  END as status_final
FROM subscriptions s
WHERE s.plan_type = 'annual'
ORDER BY s.created_at DESC;

SELECT '✅ CORREÇÃO DOS PAGAMENTOS ANUAIS CONCLUÍDA!' as status;
