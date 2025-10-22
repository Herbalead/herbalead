-- Script para verificar e corrigir problemas estruturais do sistema
-- Prevenção para próximos usuários do Mercado Pago

-- 1. Verificar se a foreign key está correta
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'links'
    AND kcu.column_name = 'user_id';

-- 2. Verificar se existem links com tool_name incorretos
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    p.name as professional_name,
    p.email as professional_email,
    CASE 
        WHEN l.tool_name IN ('bmi', 'protein', 'hydration', 'body-composition', 'meal-planner', 'nutrition-assessment', 'wellness-profile', 'daily-wellness', 'healthy-eating', 'recruitment-potencial', 'recruitment-ganhos', 'recruitment-proposito') 
        THEN 'CORRETO'
        ELSE 'INCORRETO'
    END as tool_status
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE l.tool_name NOT IN ('bmi', 'protein', 'hydration', 'body-composition', 'meal-planner', 'nutrition-assessment', 'wellness-profile', 'daily-wellness', 'healthy-eating', 'recruitment-potencial', 'recruitment-ganhos', 'recruitment-proposito')
ORDER BY l.created_at DESC;

-- 3. Verificar se existem links com user_id incorreto (referenciando auth.users)
SELECT 
    l.id,
    l.name,
    l.user_id,
    l.status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM professionals p WHERE p.id = l.user_id) THEN 'CORRETO'
        ELSE 'INCORRETO - Referencia auth.users'
    END as user_id_status
FROM links l
WHERE NOT EXISTS (SELECT 1 FROM professionals p WHERE p.id = l.user_id);

-- 4. CORREÇÃO AUTOMÁTICA: Corrigir tool_name incorretos
UPDATE links 
SET tool_name = CASE 
    WHEN tool_name = 'protein-calculator' THEN 'protein'
    WHEN tool_name = 'bmi-calculator' THEN 'bmi'
    WHEN tool_name = 'hydration-calculator' THEN 'hydration'
    WHEN tool_name = 'body-fat-calculator' THEN 'body-composition'
    WHEN tool_name = 'meal-planning' THEN 'meal-planner'
    WHEN tool_name = 'nutrition-evaluation' THEN 'nutrition-assessment'
    WHEN tool_name = 'wellness-quiz' THEN 'wellness-profile'
    WHEN tool_name = 'daily-wellness-tracker' THEN 'daily-wellness'
    WHEN tool_name = 'healthy-eating-quiz' THEN 'healthy-eating'
    ELSE tool_name
END
WHERE tool_name IN ('protein-calculator', 'bmi-calculator', 'hydration-calculator', 'body-fat-calculator', 'meal-planning', 'nutrition-evaluation', 'wellness-quiz', 'daily-wellness-tracker', 'healthy-eating-quiz');

-- 5. Verificar se a correção funcionou
SELECT 
    COUNT(*) as total_links,
    COUNT(CASE WHEN tool_name IN ('bmi', 'protein', 'hydration', 'body-composition', 'meal-planner', 'nutrition-assessment', 'wellness-profile', 'daily-wellness', 'healthy-eating', 'recruitment-potencial', 'recruitment-ganhos', 'recruitment-proposito') THEN 1 END) as links_corretos,
    COUNT(CASE WHEN tool_name NOT IN ('bmi', 'protein', 'hydration', 'body-composition', 'meal-planner', 'nutrition-assessment', 'wellness-profile', 'daily-wellness', 'healthy-eating', 'recruitment-potencial', 'recruitment-ganhos', 'recruitment-proposito') THEN 1 END) as links_incorretos
FROM links;

-- 6. Verificar usuários recentes (últimos 7 dias) para identificar possíveis problemas
SELECT 
    p.id,
    p.name,
    p.email,
    p.created_at,
    COUNT(l.id) as total_links,
    COUNT(CASE WHEN l.status = 'active' THEN 1 END) as links_ativos,
    COUNT(CASE WHEN l.tool_name NOT IN ('bmi', 'protein', 'hydration', 'body-composition', 'meal-planner', 'nutrition-assessment', 'wellness-profile', 'daily-wellness', 'healthy-eating', 'recruitment-potencial', 'recruitment-ganhos', 'recruitment-proposito') THEN 1 END) as links_com_problema
FROM professionals p
LEFT JOIN links l ON p.id = l.user_id
WHERE p.created_at >= NOW() - INTERVAL '7 days'
GROUP BY p.id, p.name, p.email, p.created_at
ORDER BY p.created_at DESC;
