-- Script para diagnosticar e corrigir problemas de sincronização
-- Execute este código no Supabase SQL Editor

-- 1. Verificar se as tabelas existem
SELECT 
    'Tabelas encontradas:' as status,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('courses', 'course_modules', 'course_materials', 'professionals')
ORDER BY table_name;

-- 2. Verificar políticas RLS atuais
SELECT 
    'Políticas RLS atuais:' as status,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('courses', 'course_modules', 'course_materials', 'professionals')
ORDER BY tablename, policyname;

-- 3. Verificar dados atuais
SELECT 
    'Cursos atuais:' as status,
    id,
    title,
    description,
    is_active,
    created_at
FROM courses 
ORDER BY created_at DESC;

-- 4. Verificar módulos atuais
SELECT 
    'Módulos atuais:' as status,
    id,
    course_id,
    title,
    description,
    is_active
FROM course_modules 
ORDER BY created_at DESC;

-- 5. Verificar materiais atuais
SELECT 
    'Materiais atuais:' as status,
    id,
    module_id,
    title,
    file_type,
    is_active
FROM course_materials 
ORDER BY created_at DESC;

-- 6. Verificar profissionais administradores
SELECT 
    'Administradores:' as status,
    id,
    name,
    email,
    is_active,
    is_admin,
    admin_password IS NOT NULL as has_admin_password
FROM professionals 
WHERE is_admin = true
ORDER BY created_at DESC;

-- 7. Recriar políticas RLS para administradores (se necessário)
-- Descomente as linhas abaixo se as políticas não existirem ou estiverem incorretas

/*
-- Políticas para tabela courses
DROP POLICY IF EXISTS "courses_admin_all" ON courses;
CREATE POLICY "courses_admin_all" ON courses
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM professionals 
    WHERE professionals.id = auth.uid() 
    AND professionals.is_admin = true
    AND professionals.is_active = true
  )
);

-- Políticas para tabela course_modules
DROP POLICY IF EXISTS "course_modules_admin_all" ON course_modules;
CREATE POLICY "course_modules_admin_all" ON course_modules
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM professionals 
    WHERE professionals.id = auth.uid() 
    AND professionals.is_admin = true
    AND professionals.is_active = true
  )
);

-- Políticas para tabela course_materials
DROP POLICY IF EXISTS "course_materials_admin_all" ON course_materials;
CREATE POLICY "course_materials_admin_all" ON course_materials
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM professionals 
    WHERE professionals.id = auth.uid() 
    AND professionals.is_admin = true
    AND professionals.is_active = true
  )
);

-- Políticas para tabela professionals
DROP POLICY IF EXISTS "professionals_admin_all" ON professionals;
CREATE POLICY "professionals_admin_all" ON professionals
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM professionals p
    WHERE p.id = auth.uid() 
    AND p.is_admin = true
    AND p.is_active = true
  )
);
*/

-- 8. Verificar se RLS está habilitado
SELECT 
    'RLS Status:' as status,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('courses', 'course_modules', 'course_materials', 'professionals')
ORDER BY tablename;

-- 9. Habilitar RLS se necessário (descomente se RLS não estiver habilitado)
/*
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
*/

-- 10. Teste de exclusão manual (substitua 'ID_DO_CURSO' pelo ID real)
-- Descomente e execute apenas para testar
/*
-- Primeiro, encontrar o ID do curso "Treinamento Inicial"
SELECT id, title FROM courses WHERE title ILIKE '%treinamento%' OR title ILIKE '%inicial%';

-- Depois, testar exclusão manual (substitua 'ID_AQUI' pelo ID encontrado)
-- DELETE FROM course_materials WHERE module_id IN (
--   SELECT id FROM course_modules WHERE course_id = 'ID_AQUI'
-- );
-- DELETE FROM course_modules WHERE course_id = 'ID_AQUI';
-- DELETE FROM courses WHERE id = 'ID_AQUI';
*/

-- 11. Verificar logs de erro (se disponível)
SELECT 
    'Últimas operações:' as status,
    'Execute este script e verifique os resultados acima' as instrucao;



