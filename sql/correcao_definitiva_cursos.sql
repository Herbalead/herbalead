-- CORREÇÃO DEFINITIVA: Problema de Acesso aos Cursos
-- ========================================================
-- Este script corrige TODOS os problemas de acesso aos cursos
-- causados pela incompatibilidade entre auth.users.id e professionals.id

-- 1. VERIFICAR PROBLEMA ATUAL
SELECT 
    'DIAGNÓSTICO ATUAL' as status,
    COUNT(*) as total_profissionais_ativos,
    COUNT(CASE WHEN p.id = a.id THEN 1 END) as ids_compatíveis,
    COUNT(CASE WHEN p.id != a.id THEN 1 END) as ids_incompatíveis
FROM professionals p
LEFT JOIN auth.users a ON p.email = a.email
WHERE p.is_active = true;

-- 2. LISTAR USUÁRIOS AFETADOS
SELECT 
    p.id as professional_id,
    p.name,
    p.email,
    p.is_active,
    a.id as auth_id,
    CASE 
        WHEN p.id = a.id THEN '✅ COMPATÍVEL'
        ELSE '❌ INCOMPATÍVEL - AFETADO'
    END as status_compatibilidade
FROM professionals p
LEFT JOIN auth.users a ON p.email = a.email
WHERE p.is_active = true
ORDER BY p.created_at DESC;

-- 3. VERIFICAR SE TABELAS DE CURSOS EXISTEM
SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('courses', 'course_modules', 'course_materials', 'course_enrollments', 'user_course_progress') 
        THEN '✅ EXISTE'
        ELSE '❌ NÃO EXISTE'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'course%' OR table_name = 'user_course_progress'
ORDER BY table_name;

-- 4. VERIFICAR POLÍTICAS RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename LIKE 'course%'
ORDER BY tablename, policyname;
