-- 🔍 DIAGNOSTICAR PLANOS INCORRETOS
-- Verificar quais subscriptions mensais estão marcadas como anuais
-- e quais têm current_period_end incorreto

-- 1. VERIFICAR TODAS AS SUBSCRIPTIONS COM PLAN_TYPE
SELECT 
    '📊 TODAS AS SUBSCRIPTIONS' as info,
    s.id,
    p.name as profissional,
    p.email,
    s.plan_type,
    s.payment_source,
    s.current_period_start::date as inicio,
    s.current_period_end::date as fim,
    (s.current_period_end::date - s.current_period_start::date) as dias_duracao,
    CASE 
        WHEN s.plan_type = 'yearly' AND (s.current_period_end::date - s.current_period_start::date) < 300 THEN '❌ ANUAL COM MENOS DE 300 DIAS'
        WHEN s.plan_type = 'monthly' AND (s.current_period_end::date - s.current_period_start::date) > 35 THEN '❌ MENSAL COM MAIS DE 35 DIAS'
        WHEN s.plan_type = 'yearly' AND (s.current_period_end::date - s.current_period_start::date) >= 300 THEN '✅ ANUAL CORRETO'
        WHEN s.plan_type = 'monthly' AND (s.current_period_end::date - s.current_period_start::date) <= 35 THEN '✅ MENSAL CORRETO'
        ELSE '⚠️ VERIFICAR'
    END as status,
    s.created_at::date as criado_em
FROM subscriptions s
LEFT JOIN professionals p ON s.user_id = p.id
WHERE s.status = 'active'
ORDER BY s.created_at DESC;

-- 2. IDENTIFICAR SUBSCRIPTIONS MENSALAIS MARCADAS COMO ANUAIS
SELECT 
    '❌ PROBLEMA: MENSAL MARCADO COMO ANUAL' as info,
    s.id,
    p.name as profissional,
    p.email,
    s.plan_type,
    s.payment_source,
    s.current_period_start::date as inicio,
    s.current_period_end::date as fim,
    (s.current_period_end::date - s.current_period_start::date) as dias_duracao,
    s.stripe_price_id,
    s.created_at::date as criado_em
FROM subscriptions s
LEFT JOIN professionals p ON s.user_id = p.id
WHERE s.plan_type = 'yearly'
  AND (s.current_period_end::date - s.current_period_start::date) < 300
  AND s.status = 'active'
ORDER BY s.created_at DESC;

-- 3. VERIFICAR ROSANA ELISA (ÚNICA QUE PAGOU ANUAL)
SELECT 
    '✅ ROSANA ELISA - VERIFICAÇÃO ANUAL' as info,
    s.id,
    p.name as profissional,
    p.email,
    s.plan_type,
    s.payment_source,
    s.current_period_start::date as inicio,
    s.current_period_end::date as fim,
    (s.current_period_end::date - s.current_period_start::date) as dias_duracao,
    CASE 
        WHEN (s.current_period_end::date - s.current_period_start::date) >= 300 THEN '✅ ANUAL CORRETO'
        ELSE '❌ ANUAL COM PROBLEMA'
    END as status
FROM subscriptions s
LEFT JOIN professionals p ON s.user_id = p.id
WHERE p.email = 'sperandio.rosanaelisa@gmail.com'
  AND s.status = 'active'
ORDER BY s.created_at DESC;

-- 4. CONTAR SUBSCRIPTIONS POR TIPO E STATUS
SELECT 
    '📊 RESUMO POR TIPO' as info,
    s.plan_type,
    s.payment_source,
    COUNT(*) as total,
    COUNT(CASE WHEN (s.current_period_end::date - s.current_period_start::date) < 300 AND s.plan_type = 'yearly' THEN 1 END) as anuais_com_problema,
    COUNT(CASE WHEN (s.current_period_end::date - s.current_period_start::date) > 35 AND s.plan_type = 'monthly' THEN 1 END) as mensais_com_problema
FROM subscriptions s
WHERE s.status = 'active'
GROUP BY s.plan_type, s.payment_source
ORDER BY s.plan_type, s.payment_source;

