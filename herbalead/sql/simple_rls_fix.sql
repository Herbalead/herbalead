-- CORREÇÃO SIMPLES DAS POLÍTICAS RLS
-- Execute este código diretamente no SQL Editor do Supabase

-- 1. Remover políticas problemáticas dos profissionais
DROP POLICY IF EXISTS "Professionals can manage their own data" ON professionals;
DROP POLICY IF EXISTS "Anyone can create professional profile" ON professionals;

-- 2. Criar política para permitir cadastro público de profissionais
CREATE POLICY "professionals_public_insert" ON professionals
  FOR INSERT WITH CHECK (true);

-- 3. Criar política para profissionais verem apenas seus dados
CREATE POLICY "professionals_own_select" ON professionals
  FOR SELECT USING (auth.uid()::text = id::text);

-- 4. Criar política para profissionais editarem apenas seus dados
CREATE POLICY "professionals_own_update" ON professionals
  FOR UPDATE USING (auth.uid()::text = id::text);

-- 5. Verificar se funcionou
SELECT 'Políticas criadas com sucesso!' as status;


