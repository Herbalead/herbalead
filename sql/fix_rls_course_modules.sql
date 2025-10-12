-- Script para corrigir políticas RLS da tabela course_modules
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar políticas existentes
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
WHERE tablename = 'course_modules';

-- 2. Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "course_modules_select_policy" ON course_modules;
DROP POLICY IF EXISTS "course_modules_insert_policy" ON course_modules;
DROP POLICY IF EXISTS "course_modules_update_policy" ON course_modules;
DROP POLICY IF EXISTS "course_modules_delete_policy" ON course_modules;

-- 3. Criar políticas permissivas para course_modules
-- Política para SELECT (todos podem ler)
CREATE POLICY "course_modules_select_policy" ON course_modules
  FOR SELECT
  USING (true);

-- Política para INSERT (todos podem inserir)
CREATE POLICY "course_modules_insert_policy" ON course_modules
  FOR INSERT
  WITH CHECK (true);

-- Política para UPDATE (todos podem atualizar)
CREATE POLICY "course_modules_update_policy" ON course_modules
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Política para DELETE (todos podem deletar)
CREATE POLICY "course_modules_delete_policy" ON course_modules
  FOR DELETE
  USING (true);

-- 4. Verificar se RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'course_modules';

-- 5. Se necessário, habilitar RLS
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;

-- 6. Verificar políticas criadas
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
WHERE tablename = 'course_modules';

-- 7. Teste de inserção (opcional - descomente para testar)
-- INSERT INTO course_modules (course_id, title, description, duration, order_index, is_active)
-- VALUES ('test-course-id', 'Teste', 'Descrição teste', '5min', 1, true);
