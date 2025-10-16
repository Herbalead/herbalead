-- Script para verificar e corrigir a estrutura da tabela subscriptions
-- Execute este script no Supabase SQL Editor

-- 1. Verificar a estrutura atual da tabela subscriptions
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default,
  character_maximum_length
FROM 
  information_schema.columns 
WHERE 
  table_schema = 'public' AND table_name = 'subscriptions'
ORDER BY 
  ordinal_position;

-- 2. Verificar constraints da tabela
SELECT 
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  tc.is_deferrable,
  tc.initially_deferred
FROM 
  information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE 
  tc.table_schema = 'public' 
  AND tc.table_name = 'subscriptions'
ORDER BY 
  tc.constraint_type, kcu.ordinal_position;

-- 3. Se necessário, tornar campos opcionais (descomente as linhas abaixo se precisar)
-- ALTER TABLE public.subscriptions ALTER COLUMN stripe_customer_id DROP NOT NULL;
-- ALTER TABLE public.subscriptions ALTER COLUMN stripe_subscription_id DROP NOT NULL;
-- ALTER TABLE public.subscriptions ALTER COLUMN stripe_price_id DROP NOT NULL;
-- ALTER TABLE public.subscriptions ALTER COLUMN status DROP NOT NULL;
-- ALTER TABLE public.subscriptions ALTER COLUMN plan_type DROP NOT NULL;
