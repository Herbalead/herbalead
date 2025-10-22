-- Script para investigar e corrigir pagamentos anuais
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar dados da Rosana Elisa
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
LEFT JOIN subscriptions s ON p.id = s.professional_id
WHERE p.email ILIKE '%rosana%' 
   OR p.email ILIKE '%sperandio%'
   OR p.name ILIKE '%rosana%';

-- 2. Verificar todos os pagamentos anuais com problema
SELECT 
  'PAGAMENTOS ANUAIS COM PROBLEMA:' as status,
  p.name,
  p.email,
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
FROM professionals p
JOIN subscriptions s ON p.id = s.professional_id
WHERE s.plan_type = 'annual'
ORDER BY s.created_at DESC;

-- 3. Corrigir Rosana Elisa especificamente
UPDATE subscriptions 
SET 
  end_date = start_date + INTERVAL '1 year',
  next_billing_date = start_date + INTERVAL '1 year',
  updated_at = NOW()
WHERE professional_id = (
  SELECT id FROM professionals 
  WHERE email ILIKE '%rosana%' 
     OR email ILIKE '%sperandio%'
     OR name ILIKE '%rosana%'
  LIMIT 1
)
AND plan_type = 'annual';

-- 4. Corrigir TODOS os pagamentos anuais com problema
UPDATE subscriptions 
SET 
  end_date = start_date + INTERVAL '1 year',
  next_billing_date = start_date + INTERVAL '1 year',
  updated_at = NOW()
WHERE plan_type = 'annual'
  AND (end_date - start_date) < 300;

-- 5. Verificar resultado da correção
SELECT 
  'APÓS CORREÇÃO - ROSANA ELISA:' as status,
  p.name,
  p.email,
  s.plan_type,
  s.start_date,
  s.end_date,
  s.next_billing_date,
  s.end_date - s.start_date as dias_duracao,
  CASE 
    WHEN s.end_date - s.start_date >= 300 THEN '✅ CORRIGIDO'
    ELSE '❌ AINDA COM PROBLEMA'
  END as status_final
FROM professionals p
JOIN subscriptions s ON p.id = s.professional_id
WHERE p.email ILIKE '%rosana%' 
   OR p.email ILIKE '%sperandio%'
   OR p.name ILIKE '%rosana%';

-- 6. Verificar todos os anuais após correção
SELECT 
  'TODOS OS ANUAIS APÓS CORREÇÃO:' as status,
  p.name,
  p.email,
  s.plan_type,
  s.start_date,
  s.end_date,
  s.end_date - s.start_date as dias_duracao,
  CASE 
    WHEN s.end_date - s.start_date >= 300 THEN '✅ OK'
    ELSE '❌ PROBLEMA'
  END as status_final
FROM professionals p
JOIN subscriptions s ON p.id = s.professional_id
WHERE s.plan_type = 'annual'
ORDER BY s.created_at DESC;

SELECT '✅ CORREÇÃO DOS PAGAMENTOS ANUAIS CONCLUÍDA!' as status;
