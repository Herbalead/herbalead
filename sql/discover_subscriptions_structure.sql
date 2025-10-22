-- Script para descobrir estrutura real da tabela subscriptions
-- Execute este script no SQL Editor do Supabase

-- 1. Descobrir TODAS as colunas da tabela subscriptions
SELECT 
  'ESTRUTURA COMPLETA DA TABELA SUBSCRIPTIONS:' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'subscriptions'
ORDER BY ordinal_position;

-- 2. Verificar alguns registros para entender os dados
SELECT 
  'PRIMEIROS 3 REGISTROS DE SUBSCRIPTIONS:' as info,
  *
FROM subscriptions 
LIMIT 3;

-- 3. Verificar se existem pagamentos anuais
SELECT 
  'TODOS OS REGISTROS DE SUBSCRIPTIONS:' as info,
  *
FROM subscriptions 
ORDER BY created_at DESC;

-- 4. Verificar se há colunas relacionadas a datas
SELECT 
  'COLUNAS COM DATA:' as info,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name = 'subscriptions'
  AND (column_name ILIKE '%date%' OR column_name ILIKE '%time%' OR data_type ILIKE '%timestamp%')
ORDER BY ordinal_position;

SELECT '✅ ESTRUTURA DESCOBERTA!' as status;
