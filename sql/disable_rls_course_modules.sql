-- SOLUÇÃO RÁPIDA: Desabilitar RLS temporariamente para course_modules
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar status atual do RLS
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'course_modules';

-- 2. Desabilitar RLS temporariamente (para teste)
ALTER TABLE course_modules DISABLE ROW LEVEL SECURITY;

-- 3. Verificar se foi desabilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'course_modules';

-- 4. Teste de inserção (opcional - descomente para testar)
-- INSERT INTO course_modules (course_id, title, description, duration, order_index, is_active)
-- VALUES ('test-course-id', 'Teste RLS', 'Descrição teste', '5min', 1, true);

SELECT 'RLS desabilitado temporariamente para course_modules!' as status;