-- =====================================================
-- CORREÇÃO DAS POLÍTICAS RLS - TABELA PROFESSIONALS
-- =====================================================
-- Execute este código no SQL Editor do Supabase Dashboard

-- 1. REMOVER POLÍTICAS EXISTENTES (se houver)
DROP POLICY IF EXISTS "Users can view their own profile" ON professionals;
DROP POLICY IF EXISTS "Users can update their own profile" ON professionals;
DROP POLICY IF EXISTS "Users can insert their own profile" ON professionals;
DROP POLICY IF EXISTS "Users can view own professionals" ON professionals;
DROP POLICY IF EXISTS "Users can update own professionals" ON professionals;
DROP POLICY IF EXISTS "Users can insert own professionals" ON professionals;

-- 2. CRIAR POLÍTICAS CORRETAS
-- Permitir que usuários vejam seus próprios dados
CREATE POLICY "Users can view own professionals" ON professionals
  FOR SELECT USING (auth.uid()::text = id::text);

-- Permitir que usuários atualizem seus próprios dados
CREATE POLICY "Users can update own professionals" ON professionals
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Permitir que usuários insiram seus próprios dados
CREATE POLICY "Users can insert own professionals" ON professionals
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- 3. VERIFICAR SE A TABELA TEM RLS HABILITADO
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;

-- 4. VERIFICAR POLÍTICAS CRIADAS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'professionals'
ORDER BY policyname;
