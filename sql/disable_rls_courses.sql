-- SOLUÇÃO RÁPIDA: Desabilitar RLS temporariamente para courses
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar status atual do RLS
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('courses', 'course_modules');

-- 2. Desabilitar RLS temporariamente (para teste)
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules DISABLE ROW LEVEL SECURITY;

-- 3. Verificar se foi desabilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('courses', 'course_modules');

-- 4. Teste de inserção (opcional - descomente para testar)
-- INSERT INTO courses (title, description, is_active)
-- VALUES ('Teste RLS Desabilitado', 'Descrição teste', true);

SELECT 'RLS desabilitado temporariamente para courses e course_modules!' as status;
