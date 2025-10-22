-- Script para descobrir estrutura e corrigir pagamentos anuais
-- Execute este script no SQL Editor do Supabase

-- 1. Descobrir estrutura da tabela subscriptions
SELECT 
  'ESTRUTURA DA TABELA SUBSCRIPTIONS:' as info,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name = 'subscriptions'
ORDER BY ordinal_position;

-- 2. Verificar alguns registros para entender a estrutura
SELECT 
  'PRIMEIROS REGISTROS DE SUBSCRIPTIONS:' as info,
  *
FROM subscriptions 
LIMIT 3;

-- 3. Verificar todos os pagamentos anuais
SELECT 
  'TODOS OS PAGAMENTOS ANUAIS:' as info,
  id,
  plan_type,
  start_date,
  end_date,
  next_billing_date,
  CASE 
    WHEN end_date - start_date < 300 THEN '❌ PROBLEMA: Menos de 300 dias'
    WHEN end_date - start_date >= 300 THEN '✅ OK: Mais de 300 dias'
    ELSE '⚠️ Status desconhecido'
  END as status_duracao,
  end_date - start_date as dias_duracao
FROM subscriptions 
WHERE plan_type = 'annual'
ORDER BY created_at DESC;

-- 4. Corrigir TODOS os pagamentos anuais com problema
UPDATE subscriptions 
SET 
  end_date = start_date + INTERVAL '1 year',
  next_billing_date = start_date + INTERVAL '1 year',
  updated_at = NOW()
WHERE plan_type = 'annual'
  AND (end_date - start_date) < 300;

-- 5. Verificar resultado final
SELECT 
  'RESULTADO FINAL - TODOS OS ANUAIS:' as info,
  id,
  plan_type,
  start_date,
  end_date,
  end_date - start_date as dias_duracao,
  CASE 
    WHEN end_date - start_date >= 300 THEN '✅ CORRIGIDO'
    ELSE '❌ AINDA COM PROBLEMA'
  END as status_final
FROM subscriptions 
WHERE plan_type = 'annual'
ORDER BY created_at DESC;

SELECT '✅ CORREÇÃO CONCLUÍDA!' as status;
