-- Adicionar campo customer_email na tabela subscriptions se não existir
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS customer_email TEXT;

-- Comentário para documentar o campo
COMMENT ON COLUMN subscriptions.customer_email IS 'Email do cliente que fez o pagamento no Stripe';
