-- SOLUÇÃO RÁPIDA: Corrigir RLS para course_modules
-- Execute este script no SQL Editor do Supabase

-- 1. Remover todas as políticas existentes
DROP POLICY IF EXISTS "course_modules_select_policy" ON course_modules;
DROP POLICY IF EXISTS "course_modules_insert_policy" ON course_modules;
DROP POLICY IF EXISTS "course_modules_update_policy" ON course_modules;
DROP POLICY IF EXISTS "course_modules_delete_policy" ON course_modules;

-- 2. Criar políticas permissivas (todos podem fazer tudo)
CREATE POLICY "course_modules_all_access" ON course_modules
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 3. Verificar se funcionou
SELECT 'Políticas criadas com sucesso!' as status;
