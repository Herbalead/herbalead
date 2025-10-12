-- SOLUÇÃO MAIS SIMPLES: Desabilitar RLS temporariamente
-- Execute este script no SQL Editor do Supabase

-- Desabilitar Row Level Security para course_modules
ALTER TABLE course_modules DISABLE ROW LEVEL SECURITY;

-- Verificar se funcionou
SELECT 'RLS desabilitado com sucesso!' as status;
