-- Script para criar sistema completo de assinaturas
-- Execute este script no Supabase SQL Editor

-- 1. Adicionar stripe_customer_id na tabela professionals
ALTER TABLE public.professionals 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'canceled', 'past_due', 'unpaid')),
ADD COLUMN IF NOT EXISTS subscription_plan TEXT CHECK (subscription_plan IN ('monthly', 'yearly'));

-- Adicionar constraint única no email para evitar duplicatas
-- (Execute apenas se a constraint não existir)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_email' 
        AND table_name = 'professionals'
    ) THEN
        ALTER TABLE public.professionals ADD CONSTRAINT unique_email UNIQUE (email);
    END IF;
END $$;

-- 2. Criar tabela de assinaturas
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
    stripe_customer_id TEXT NOT NULL,
    stripe_subscription_id TEXT NOT NULL UNIQUE,
    stripe_price_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid')),
    plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'yearly')),
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar tabela de pagamentos
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT NOT NULL UNIQUE,
    stripe_invoice_id TEXT,
    amount INTEGER NOT NULL, -- em centavos
    currency TEXT NOT NULL DEFAULT 'brl',
    status TEXT NOT NULL CHECK (status IN ('succeeded', 'pending', 'failed', 'canceled')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON public.payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON public.payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_professionals_stripe_customer_id ON public.professionals(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_professionals_subscription_status ON public.professionals(subscription_status);

-- 5. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Criar trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Criar função para sincronizar status da assinatura com professionals
CREATE OR REPLACE FUNCTION sync_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar status na tabela professionals quando subscription muda
    UPDATE public.professionals 
    SET 
        subscription_status = NEW.status,
        subscription_plan = NEW.plan_type,
        stripe_customer_id = NEW.stripe_customer_id
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Criar trigger para sincronizar status
DROP TRIGGER IF EXISTS sync_subscription_status_trigger ON public.subscriptions;
CREATE TRIGGER sync_subscription_status_trigger
    AFTER INSERT OR UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION sync_subscription_status();

-- 9. Ativar RLS nas novas tabelas
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 10. Criar políticas RLS para subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions
    FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);

CREATE POLICY "Users can update own subscriptions" ON public.subscriptions
    FOR UPDATE USING (user_id = auth.uid()::uuid);

-- 11. Criar políticas RLS para payments
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (
        subscription_id IN (
            SELECT id FROM public.subscriptions WHERE user_id = auth.uid()::uuid
        )
    );

-- 12. Criar função para verificar se usuário tem assinatura ativa
CREATE OR REPLACE FUNCTION user_has_active_subscription(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.subscriptions 
        WHERE user_id = user_uuid 
        AND status = 'active' 
        AND current_period_end > NOW()
    );
END;
$$ language 'plpgsql';

-- 13. Criar função para obter dados da assinatura do usuário
CREATE OR REPLACE FUNCTION get_user_subscription(user_uuid UUID)
RETURNS TABLE (
    subscription_id UUID,
    stripe_subscription_id TEXT,
    status TEXT,
    plan_type TEXT,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN,
    canceled_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.stripe_subscription_id,
        s.status,
        s.plan_type,
        s.current_period_start,
        s.current_period_end,
        s.cancel_at_period_end,
        s.canceled_at
    FROM public.subscriptions s
    WHERE s.user_id = user_uuid
    AND s.status IN ('active', 'trialing', 'past_due')
    ORDER BY s.created_at DESC
    LIMIT 1;
END;
$$ language 'plpgsql';

-- 14. Criar função para obter histórico de pagamentos
CREATE OR REPLACE FUNCTION get_user_payment_history(user_uuid UUID)
RETURNS TABLE (
    payment_id UUID,
    amount INTEGER,
    currency TEXT,
    status TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.amount,
        p.currency,
        p.status,
        p.description,
        p.created_at
    FROM public.payments p
    JOIN public.subscriptions s ON p.subscription_id = s.id
    WHERE s.user_id = user_uuid
    ORDER BY p.created_at DESC;
END;
$$ language 'plpgsql';

-- 15. Comentários para documentação
COMMENT ON TABLE public.subscriptions IS 'Armazena informações das assinaturas do Stripe';
COMMENT ON TABLE public.payments IS 'Armazena histórico de pagamentos das assinaturas';
COMMENT ON COLUMN public.professionals.stripe_customer_id IS 'ID do cliente no Stripe';
COMMENT ON COLUMN public.professionals.subscription_status IS 'Status atual da assinatura do usuário';
COMMENT ON COLUMN public.professionals.subscription_plan IS 'Tipo do plano (monthly/yearly)';

-- 16. Verificar se tudo foi criado corretamente
SELECT 
    'Tabelas criadas:' as status,
    COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('subscriptions', 'payments');

SELECT 
    'Colunas adicionadas em professionals:' as status,
    COUNT(*) as count
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'professionals'
AND column_name IN ('stripe_customer_id', 'subscription_status', 'subscription_plan');

SELECT 
    'Funções criadas:' as status,
    COUNT(*) as count
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('user_has_active_subscription', 'get_user_subscription', 'get_user_payment_history', 'sync_subscription_status');
