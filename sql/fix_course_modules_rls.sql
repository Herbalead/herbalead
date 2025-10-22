-- Script para corrigir políticas RLS da tabela course_modules
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a tabela existe
SELECT 
  table_name,
  table_schema
FROM information_schema.tables 
WHERE table_name = 'course_modules';

-- 2. Verificar políticas existentes
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

-- 3. Remover todas as políticas existentes (se houver)
DROP POLICY IF EXISTS "course_modules_select_all" ON course_modules;
DROP POLICY IF EXISTS "course_modules_admin_all" ON course_modules;
DROP POLICY IF EXISTS "course_modules_select_active" ON course_modules;
DROP POLICY IF EXISTS "course_modules_insert_policy" ON course_modules;
DROP POLICY IF EXISTS "course_modules_update_policy" ON course_modules;
DROP POLICY IF EXISTS "course_modules_delete_policy" ON course_modules;
DROP POLICY IF EXISTS "course_modules_all_access" ON course_modules;

-- 4. Criar políticas permissivas para administradores
-- Política para SELECT (todos podem ler)
CREATE POLICY "course_modules_select_policy" ON course_modules
  FOR SELECT
  USING (true);

-- Política para INSERT (apenas admins podem inserir)
CREATE POLICY "course_modules_insert_policy" ON course_modules
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM professionals p 
      WHERE p.id = auth.uid() 
      AND p.is_admin = true
    )
  );

-- Política para UPDATE (apenas admins podem atualizar)
CREATE POLICY "course_modules_update_policy" ON course_modules
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM professionals p 
      WHERE p.id = auth.uid() 
      AND p.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM professionals p 
      WHERE p.id = auth.uid() 
      AND p.is_admin = true
    )
  );

-- Política para DELETE (apenas admins podem deletar)
CREATE POLICY "course_modules_delete_policy" ON course_modules
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM professionals p 
      WHERE p.id = auth.uid() 
      AND p.is_admin = true
    )
  );

-- 5. Verificar se RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'course_modules';

-- 6. Se necessário, habilitar RLS
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;

-- 7. Verificar políticas criadas
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

-- 8. Verificar se o usuário atual é admin
SELECT 
  p.id,
  p.email,
  p.is_admin,
  p.is_active
FROM professionals p
WHERE p.id = auth.uid();

-- 9. Teste de inserção (opcional - descomente para testar)
-- INSERT INTO course_modules (course_id, title, description, duration, order_index, is_active)
-- VALUES ('test-course-id', 'Teste', 'Descrição teste', '5min', 1, true);

SELECT 'Políticas RLS corrigidas com sucesso!' as status;
