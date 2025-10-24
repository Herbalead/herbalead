-- Script para verificar estrutura das tabelas de cursos
-- Execute este código no Supabase SQL Editor

-- 1. Verificar se as tabelas existem
SELECT 
    'Verificando tabelas:' as status,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('courses', 'course_modules', 'course_materials', 'course_enrollments', 'user_course_progress', 'professionals')
ORDER BY table_name;

-- 2. Verificar estrutura da tabela courses
SELECT 
    'Estrutura da tabela courses:' as status,
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
    'Dados na tabela courses:' as status,
    id,
    title,
    description,
    is_active,
    created_at
FROM courses 
ORDER BY created_at DESC;

-- 4. Verificar estrutura da tabela course_modules
SELECT 
    'Estrutura da tabela course_modules:' as status,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'course_modules' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Verificar dados na tabela course_modules
SELECT 
    'Dados na tabela course_modules:' as status,
    id,
    course_id,
    title,
    description,
    duration,
    order_index,
    is_active
FROM course_modules 
ORDER BY course_id, order_index;

-- 6. Verificar estrutura da tabela course_materials
SELECT 
    'Estrutura da tabela course_materials:' as status,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'course_materials' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 7. Verificar dados na tabela course_materials
SELECT 
    'Dados na tabela course_materials:' as status,
    id,
    module_id,
    title,
    file_path,
    file_type,
    is_active
FROM course_materials 
ORDER BY created_at DESC;

-- 8. Verificar estrutura da tabela course_enrollments
SELECT 
    'Estrutura da tabela course_enrollments:' as status,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'course_enrollments' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 9. Verificar dados na tabela course_enrollments
SELECT 
    'Dados na tabela course_enrollments:' as status,
    id,
    user_id,
    course_id,
    enrolled_at,
    progress_percentage,
    is_active
FROM course_enrollments 
ORDER BY enrolled_at DESC;

-- 10. Verificar estrutura da tabela user_course_progress
SELECT 
    'Estrutura da tabela user_course_progress:' as status,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_course_progress' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 11. Verificar dados na tabela user_course_progress
SELECT 
    'Dados na tabela user_course_progress:' as status,
    id,
    user_id,
    course_id,
    progress_type,
    created_at
FROM user_course_progress 
ORDER BY created_at DESC;

-- 12. Verificar profissionais com acesso
SELECT 
    'Profissionais com acesso:' as status,
    id,
    name,
    email,
    is_active,
    is_admin,
    created_at
FROM professionals 
WHERE is_active = true
ORDER BY created_at DESC;
























