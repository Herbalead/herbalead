-- Script para corrigir políticas RLS da tabela courses
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a tabela courses existe
SELECT 
  table_name,
  table_schema
FROM information_schema.tables 
WHERE table_name = 'courses';

-- 2. Verificar políticas existentes na tabela courses
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
WHERE tablename = 'courses';

-- 3. Verificar se RLS está habilitado na tabela courses
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'courses';

-- 4. Remover todas as políticas existentes da tabela courses
DROP POLICY IF EXISTS "courses_select_active" ON courses;
DROP POLICY IF EXISTS "courses_admin_all" ON courses;
DROP POLICY IF EXISTS "courses_select_policy" ON courses;
DROP POLICY IF EXISTS "courses_insert_policy" ON courses;
DROP POLICY IF EXISTS "courses_update_policy" ON courses;
DROP POLICY IF EXISTS "courses_delete_policy" ON courses;

-- 5. Criar políticas permissivas para administradores
-- Política para SELECT (todos podem ler cursos ativos)
CREATE POLICY "courses_select_policy" ON courses
  FOR SELECT
  USING (is_active = true);

-- Política para INSERT (apenas admins podem inserir)
CREATE POLICY "courses_insert_policy" ON courses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM professionals p 
      WHERE p.id = auth.uid() 
      AND p.is_admin = true
    )
  );

-- Política para UPDATE (apenas admins podem atualizar)
CREATE POLICY "courses_update_policy" ON courses
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
CREATE POLICY "courses_delete_policy" ON courses
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM professionals p 
      WHERE p.id = auth.uid() 
      AND p.is_admin = true
    )
  );

-- 6. Verificar se RLS está habilitado
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

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
WHERE tablename = 'courses';

-- 8. Verificar se o usuário atual é admin
SELECT 
  p.id,
  p.email,
  p.is_admin,
  p.is_active,
  auth.uid() as current_user_id
FROM professionals p
WHERE p.id = auth.uid();

-- 9. Teste de inserção (opcional - descomente para testar)
-- INSERT INTO courses (title, description, is_active)
-- VALUES ('Teste RLS', 'Descrição teste', true);

-- 10. SOLUÇÃO ALTERNATIVA: Desabilitar RLS temporariamente (se ainda der erro)
-- ALTER TABLE courses DISABLE ROW LEVEL SECURITY;

SELECT 'Políticas RLS da tabela courses corrigidas com sucesso!' as status;
