-- Script para verificar estrutura atual das tabelas de cursos
-- Execute este código no Supabase SQL Editor

-- 1. Verificar se as tabelas existem
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('courses', 'course_modules', 'course_materials')
ORDER BY table_name;

-- 2. Verificar estrutura da tabela courses (se existir)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'courses' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Verificar estrutura da tabela course_modules (se existir)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'course_modules' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Verificar estrutura da tabela course_materials (se existir)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'course_materials' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Verificar dados existentes
SELECT COUNT(*) as total_courses FROM courses;
SELECT COUNT(*) as total_modules FROM course_modules;
SELECT COUNT(*) as total_materials FROM course_materials;
