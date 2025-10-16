-- Script para corrigir campos obrigatórios na tabela subscriptions
-- Execute este script no Supabase SQL Editor

-- Tornar campos opcionais para permitir assinaturas órfãs
ALTER TABLE public.subscriptions ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.subscriptions ALTER COLUMN stripe_customer_id DROP NOT NULL;
ALTER TABLE public.subscriptions ALTER COLUMN stripe_subscription_id DROP NOT NULL;
ALTER TABLE public.subscriptions ALTER COLUMN stripe_price_id DROP NOT NULL;
ALTER TABLE public.subscriptions ALTER COLUMN status DROP NOT NULL;
ALTER TABLE public.subscriptions ALTER COLUMN plan_type DROP NOT NULL;
ALTER TABLE public.subscriptions ALTER COLUMN current_period_start DROP NOT NULL;
ALTER TABLE public.subscriptions ALTER COLUMN current_period_end DROP NOT NULL;

-- Verificar se as alterações foram aplicadas
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM 
  information_schema.columns 
WHERE 
  table_schema = 'public' AND table_name = 'subscriptions'
  AND column_name IN ('user_id', 'stripe_customer_id', 'stripe_subscription_id', 'stripe_price_id', 'status', 'plan_type', 'current_period_start', 'current_period_end')
ORDER BY 
  column_name;
