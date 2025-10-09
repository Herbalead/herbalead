-- SOLUÇÃO DIRETA PARA POLÍTICAS RLS
-- Cole este código em uma NOVA QUERY no Supabase SQL Editor

-- Remover política problemática
DROP POLICY IF EXISTS "Professionals can manage their own data" ON professionals;

-- Criar política para cadastro público
CREATE POLICY "professionals_insert_policy" ON professionals
  FOR INSERT WITH CHECK (true);

-- Criar política para visualização própria
CREATE POLICY "professionals_select_policy" ON professionals
  FOR SELECT USING (auth.uid()::text = id::text);

-- Criar política para edição própria
CREATE POLICY "professionals_update_policy" ON professionals
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Verificar resultado
SELECT 'Políticas RLS corrigidas!' as resultado;




