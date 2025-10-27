-- Adicionar coluna payment_source para rastrear gateway de pagamento

-- 1. Adicionar coluna payment_source na tabela subscriptions
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS payment_source TEXT CHECK (payment_source IN ('stripe', 'mercadopago'));

-- 2. Adicionar coluna payment_source na tabela payments
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS payment_source TEXT CHECK (payment_source IN ('stripe', 'mercadopago'));

-- 3. Atualizar registros existentes baseado no stripe_customer_id
UPDATE subscriptions 
SET payment_source = CASE 
  WHEN stripe_customer_id LIKE 'mp_%' THEN 'mercadopago'
  ELSE 'stripe'
END
WHERE payment_source IS NULL;

UPDATE payments 
SET payment_source = 'stripe'
WHERE payment_source IS NULL;

-- 4. Verificar estrutura
SELECT 
  'subscriptions' as tabela,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name = 'subscriptions' 
  AND column_name = 'payment_source';

SELECT 
  'payments' as tabela,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name = 'payments' 
  AND column_name = 'payment_source';

-- 5. Ver alguns exemplos
SELECT 
  id,
  user_id,
  payment_source,
  status,
  plan_type
FROM subscriptions 
ORDER BY created_at DESC 
LIMIT 5;

