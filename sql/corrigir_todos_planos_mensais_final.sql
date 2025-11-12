-- 🔧 CORREÇÃO FINAL: Corrigir TODOS os planos mensais marcados como anuais
-- Este script identifica e corrige subscriptions mensais que foram incorretamente marcadas como anuais

BEGIN;

-- 1. DIAGNÓSTICO: Identificar todos os casos problemáticos
SELECT 
    '🔍 DIAGNÓSTICO ANTES DA CORREÇÃO' as info,
    s.id,
    p.name as profissional,
    p.email,
    s.plan_type as tipo_atual,
    s.payment_source,
    s.stripe_price_id,
    s.current_period_start::date as inicio,
    s.current_period_end::date as fim,
    (s.current_period_end::date - s.current_period_start::date) as dias_duracao,
    CASE 
        WHEN s.plan_type = 'yearly' AND (s.current_period_end::date - s.current_period_start::date) < 300 THEN '❌ ANUAL COM MENOS DE 300 DIAS'
        WHEN s.plan_type = 'yearly' AND s.stripe_price_id LIKE '%monthly%' THEN '❌ ANUAL MAS PRICE_ID É MONTHLY'
        WHEN s.plan_type = 'yearly' AND s.stripe_price_id LIKE '%mp_price_monthly%' THEN '❌ ANUAL MAS PRICE_ID É MONTHLY'
        ELSE '✅ OK'
    END as problema_identificado
FROM subscriptions s
LEFT JOIN professionals p ON s.user_id = p.id
WHERE s.status = 'active'
  AND (
    (s.plan_type = 'yearly' AND (s.current_period_end::date - s.current_period_start::date) < 300)
    OR (s.plan_type = 'yearly' AND s.stripe_price_id LIKE '%monthly%')
    OR (s.plan_type = 'yearly' AND s.stripe_price_id LIKE '%mp_price_monthly%')
  )
  AND p.email != 'sperandio.rosanaelisa@gmail.com' -- Excluir Rosana Elisa (única anual real)
ORDER BY s.created_at DESC;

-- 2. CORRIGIR: Alterar plan_type de 'yearly' para 'monthly' e ajustar current_period_end
UPDATE subscriptions s
SET 
    plan_type = 'monthly',
    current_period_end = (s.current_period_start::date + INTERVAL '1 month')::timestamp,
    updated_at = NOW()
WHERE s.status = 'active'
  AND s.plan_type = 'yearly'
  AND (
    (s.current_period_end::date - s.current_period_start::date) < 300
    OR s.stripe_price_id LIKE '%monthly%'
    OR s.stripe_price_id LIKE '%mp_price_monthly%'
  )
  AND s.user_id NOT IN (
      SELECT id FROM professionals 
      WHERE email = 'sperandio.rosanaelisa@gmail.com'
  );

-- 3. GARANTIR QUE ROSANA ELISA ESTÁ CORRETA (ANUAL)
UPDATE subscriptions s
SET 
    plan_type = 'yearly',
    current_period_end = (s.current_period_start::date + INTERVAL '1 year')::timestamp,
    updated_at = NOW()
WHERE s.user_id IN (
    SELECT id FROM professionals 
    WHERE email = 'sperandio.rosanaelisa@gmail.com'
)
AND s.status = 'active'
AND (
    s.plan_type != 'yearly' 
    OR (s.current_period_end::date - s.current_period_start::date) < 300
);

-- 4. CORRIGIR current_period_end DE TODAS AS MENSALAIS
-- Garantir que todas as mensais tenham exatamente 30 dias
UPDATE subscriptions s
SET 
    current_period_end = (s.current_period_start::date + INTERVAL '1 month')::timestamp,
    updated_at = NOW()
WHERE s.plan_type = 'monthly'
  AND s.status = 'active'
  AND (s.current_period_end::date - s.current_period_start::date) != 30
  AND (s.current_period_end::date - s.current_period_start::date) < 35;

-- 5. VERIFICAÇÃO FINAL: Mostrar todas as subscriptions após correção
SELECT 
    '✅ APÓS CORREÇÃO - TODAS AS SUBSCRIPTIONS' as info,
    s.id,
    p.name as profissional,
    p.email,
    s.plan_type,
    s.payment_source,
    s.current_period_start::date as inicio,
    s.current_period_end::date as fim,
    (s.current_period_end::date - s.current_period_start::date) as dias_duracao,
    CASE 
        WHEN s.plan_type = 'yearly' AND (s.current_period_end::date - s.current_period_start::date) >= 300 THEN '✅ ANUAL CORRETO'
        WHEN s.plan_type = 'monthly' AND (s.current_period_end::date - s.current_period_start::date) <= 35 THEN '✅ MENSAL CORRETO'
        ELSE '❌ AINDA COM PROBLEMA'
    END as status_final
FROM subscriptions s
LEFT JOIN professionals p ON s.user_id = p.id
WHERE s.status = 'active'
ORDER BY s.plan_type DESC, s.created_at DESC;

-- 6. RESUMO FINAL
SELECT 
    '📊 RESUMO FINAL' as info,
    s.plan_type,
    COUNT(*) as total,
    COUNT(CASE WHEN (s.current_period_end::date - s.current_period_start::date) >= 300 AND s.plan_type = 'yearly' THEN 1 END) as anuais_corretos,
    COUNT(CASE WHEN (s.current_period_end::date - s.current_period_start::date) <= 35 AND s.plan_type = 'monthly' THEN 1 END) as mensais_corretos,
    COUNT(CASE WHEN (s.current_period_end::date - s.current_period_start::date) < 300 AND s.plan_type = 'yearly' THEN 1 END) as anuais_com_problema,
    COUNT(CASE WHEN (s.current_period_end::date - s.current_period_start::date) > 35 AND s.plan_type = 'monthly' THEN 1 END) as mensais_com_problema
FROM subscriptions s
WHERE s.status = 'active'
GROUP BY s.plan_type
ORDER BY s.plan_type;

COMMIT;

