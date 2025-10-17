-- Script para verificar conexão e estado das tabelas
-- Execute este código no Supabase SQL Editor

-- 1. Verificar se as tabelas existem
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('courses', 'course_modules', 'course_materials', 'professionals')
ORDER BY table_name;

-- 2. Verificar estrutura da tabela courses
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'courses' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Verificar dados na tabela courses
SELECT 
    id,
    title,
    description,
    is_active,
    created_at,
    updated_at
FROM courses 
ORDER BY created_at DESC;

-- 4. Verificar estrutura da tabela course_modules
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'course_modules' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Verificar dados na tabela course_modules
SELECT 
    id,
    course_id,
    title,
    description,
    duration,
    order_index,
    is_active,
    created_at
FROM course_modules 
ORDER BY course_id, order_index;

-- 6. Verificar estrutura da tabela course_materials
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'course_materials' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 7. Verificar dados na tabela course_materials
SELECT 
    id,
    module_id,
    title,
    file_path,
    file_type,
    file_size,
    download_count,
    is_active,
    created_at
FROM course_materials 
ORDER BY created_at DESC;

-- 8. Verificar estrutura da tabela professionals
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'professionals' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 9. Verificar dados na tabela professionals
SELECT 
    id,
    name,
    email,
    is_active,
    is_admin,
    admin_password IS NOT NULL as has_admin_password,
    created_at
FROM professionals 
ORDER BY created_at DESC;

-- 10. Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('courses', 'course_modules', 'course_materials', 'professionals')
ORDER BY tablename, policyname;












