-- 🔍 VERIFICAR E CORRIGIR ROSANA ELISA (ÚNICA ANUAL REAL)

BEGIN;

-- 1. VERIFICAR SITUAÇÃO ATUAL DA ROSANA ELISA
SELECT 
    '🔍 SITUAÇÃO ATUAL - ROSANA ELISA' as info,
    p.id as professional_id,
    p.name,
    p.email,
    p.subscription_status,
    p.is_active,
    s.id as subscription_id,
    s.plan_type,
    s.status as subscription_status,
    s.payment_source,
    s.current_period_start::date as inicio,
    s.current_period_end::date as fim,
    (s.current_period_end::date - s.current_period_start::date) as dias_duracao,
    s.created_at::date as criado_em
FROM professionals p
LEFT JOIN subscriptions s ON p.id = s.user_id AND s.status = 'active'
WHERE p.email = 'sperandio.rosanaelisa@gmail.com';

-- 2. VERIFICAR SE EXISTE SUBSCRIPTION PARA ROSANA ELISA
DO $$
DECLARE
    rosana_id UUID;
    subscription_exists BOOLEAN;
BEGIN
    -- Buscar ID da Rosana Elisa
    SELECT id INTO rosana_id
    FROM professionals
    WHERE email = 'sperandio.rosanaelisa@gmail.com'
    LIMIT 1;

    IF rosana_id IS NULL THEN
        RAISE EXCEPTION '❌ Rosana Elisa não encontrada na tabela professionals';
    END IF;

    -- Verificar se existe subscription ativa
    SELECT EXISTS(
        SELECT 1 FROM subscriptions 
        WHERE user_id = rosana_id 
        AND status = 'active'
    ) INTO subscription_exists;

    IF NOT subscription_exists THEN
        RAISE NOTICE '⚠️ Subscription não encontrada para Rosana Elisa. Criando...';
        
        -- Criar subscription anual para Rosana Elisa
        INSERT INTO subscriptions (
            user_id,
            status,
            plan_type,
            payment_source,
            stripe_customer_id,
            stripe_subscription_id,
            stripe_price_id,
            current_period_start,
            current_period_end,
            cancel_at_period_end,
            created_at,
            updated_at
        )
        VALUES (
            rosana_id,
            'active',
            'yearly',
            'mercadopago',
            'mp_rosana_elisa',
            'mp_sub_rosana_elisa',
            'mp_price_yearly',
            NOW(),
            (NOW() + INTERVAL '1 year')::timestamp,
            false,
            NOW(),
            NOW()
        );
        
        RAISE NOTICE '✅ Subscription anual criada para Rosana Elisa';
    ELSE
        RAISE NOTICE '✅ Subscription já existe. Verificando se está correta...';
        
        -- Garantir que está como anual com 365 dias
        UPDATE subscriptions
        SET 
            plan_type = 'yearly',
            current_period_end = (current_period_start::date + INTERVAL '1 year')::timestamp,
            status = 'active',
            updated_at = NOW()
        WHERE user_id = rosana_id
        AND status = 'active';
        
        RAISE NOTICE '✅ Subscription atualizada para anual (365 dias)';
    END IF;
END $$;

-- 3. GARANTIR QUE PROFESSIONAL ESTÁ ATIVO
UPDATE professionals
SET 
    subscription_status = 'active',
    is_active = true,
    updated_at = NOW()
WHERE email = 'sperandio.rosanaelisa@gmail.com';

-- 4. VERIFICAÇÃO FINAL
SELECT 
    '✅ APÓS CORREÇÃO - ROSANA ELISA' as info,
    p.id as professional_id,
    p.name,
    p.email,
    p.subscription_status,
    p.is_active,
    s.id as subscription_id,
    s.plan_type,
    s.status as subscription_status,
    s.payment_source,
    s.current_period_start::date as inicio,
    s.current_period_end::date as fim,
    (s.current_period_end::date - s.current_period_start::date) as dias_duracao,
    CASE 
        WHEN s.plan_type = 'yearly' AND (s.current_period_end::date - s.current_period_start::date) >= 300 THEN '✅ ANUAL CORRETO'
        WHEN s.plan_type = 'yearly' AND (s.current_period_end::date - s.current_period_start::date) < 300 THEN '❌ ANUAL COM PROBLEMA'
        WHEN s.id IS NULL THEN '❌ SEM SUBSCRIPTION'
        ELSE '⚠️ VERIFICAR'
    END as status_final
FROM professionals p
LEFT JOIN subscriptions s ON p.id = s.user_id AND s.status = 'active'
WHERE p.email = 'sperandio.rosanaelisa@gmail.com';

COMMIT;

