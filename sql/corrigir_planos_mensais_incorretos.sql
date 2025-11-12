-- 🔧 CORRIGIR PLANOS MENSALAIS MARCADOS COMO ANUAIS
-- Este script corrige subscriptions que foram marcadas como 'yearly' 
-- mas têm current_period_end de apenas 30 dias (mensal)

BEGIN;

-- 1. IDENTIFICAR E CORRIGIR SUBSCRIPTIONS MENSALAIS MARCADAS COMO ANUAIS
-- (exceto Rosana Elisa que realmente pagou anual)
UPDATE subscriptions s
SET 
    plan_type = 'monthly',
    updated_at = NOW()
WHERE s.plan_type = 'yearly'
  AND (s.current_period_end::date - s.current_period_start::date) < 300
  AND s.status = 'active'
  AND s.user_id NOT IN (
      SELECT id FROM professionals 
      WHERE email = 'sperandio.rosanaelisa@gmail.com'
  );

-- 2. GARANTIR QUE ROSANA ELISA ESTÁ CORRETA (ANUAL)
UPDATE subscriptions s
SET 
    plan_type = 'yearly',
    current_period_end = (current_period_start::date + INTERVAL '1 year')::timestamp,
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

-- 3. CORRIGIR current_period_end DE SUBSCRIPTIONS MENSALAIS
-- (garantir que todas as mensais tenham exatamente 30 dias)
UPDATE subscriptions s
SET 
    current_period_end = (current_period_start::date + INTERVAL '1 month')::timestamp,
    updated_at = NOW()
WHERE s.plan_type = 'monthly'
  AND s.status = 'active'
  AND (s.current_period_end::date - s.current_period_start::date) != 30
  AND (s.current_period_end::date - s.current_period_start::date) < 35;

-- 4. VERIFICAÇÃO FINAL
SELECT 
    '✅ APÓS CORREÇÃO' as info,
    s.id,
    p.name as profissional,
    p.email,
    s.plan_type,
    s.current_period_start::date as inicio,
    s.current_period_end::date as fim,
    (s.current_period_end::date - s.current_period_start::date) as dias_duracao,
    CASE 
        WHEN s.plan_type = 'yearly' AND (s.current_period_end::date - s.current_period_start::date) >= 300 THEN '✅ ANUAL CORRETO'
        WHEN s.plan_type = 'monthly' AND (s.current_period_end::date - s.current_period_start::date) <= 35 THEN '✅ MENSAL CORRETO'
        ELSE '❌ AINDA COM PROBLEMA'
    END as status
FROM subscriptions s
LEFT JOIN professionals p ON s.user_id = p.id
WHERE s.status = 'active'
ORDER BY s.plan_type, s.created_at DESC;

COMMIT;

