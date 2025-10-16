-- Script para adicionar a coluna customer_email na tabela subscriptions
-- Execute este script no Supabase SQL Editor

-- 1. Adicionar a coluna customer_email
ALTER TABLE public.subscriptions
ADD COLUMN customer_email character varying(255);

-- 2. Verificar a estrutura da tabela subscriptions
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default 
FROM 
  information_schema.columns 
WHERE 
  table_schema = 'public' AND table_name = 'subscriptions'
ORDER BY 
  ordinal_position;

-- 3. Verificar se a coluna foi adicionada corretamente
SELECT 
  'customer_email' as coluna,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'subscriptions' 
        AND column_name = 'customer_email'
    ) THEN 'EXISTE' 
    ELSE 'NÃO EXISTE' 
  END as status;
