-- DIAGNÓSTICO COMPLETO: Problema de Acesso aos Cursos
-- ========================================================

-- 1. VERIFICAR TODOS OS USUÁRIOS COM PROBLEMA
SELECT 
    'PROFESSIONALS' as tabela,
    id,
    name,
    email,
    is_active,
    subscription_status,
    created_at
FROM professionals 
WHERE is_active = true
ORDER BY created_at DESC;

-- 2. VERIFICAR AUTH.USERS CORRESPONDENTES
SELECT 
    'AUTH.USERS' as tabela,
    id,
    email,
    created_at
FROM auth.users 
ORDER BY created_at DESC;

-- 3. VERIFICAR INCOMPATIBILIDADE DE IDs
SELECT 
    p.id as professional_id,
    p.name,
    p.email,
    p.is_active,
    a.id as auth_id,
    CASE 
        WHEN p.id = a.id THEN '✅ COMPATÍVEL'
        ELSE '❌ INCOMPATÍVEL'
    END as status_compatibilidade
FROM professionals p
LEFT JOIN auth.users a ON p.email = a.email
WHERE p.is_active = true
ORDER BY p.created_at DESC;

-- 4. CONTAR USUÁRIOS AFETADOS
SELECT 
    COUNT(*) as total_profissionais_ativos,
    COUNT(CASE WHEN p.id = a.id THEN 1 END) as ids_compatíveis,
    COUNT(CASE WHEN p.id != a.id THEN 1 END) as ids_incompatíveis
FROM professionals p
LEFT JOIN auth.users a ON p.email = a.email
WHERE p.is_active = true;
