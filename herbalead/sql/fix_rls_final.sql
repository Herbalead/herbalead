-- =====================================================
-- CORREÇÃO FINAL DAS POLÍTICAS RLS
-- =====================================================
-- Execute este código no SQL Editor do Supabase Dashboard

-- 1. REMOVER TODAS AS POLÍTICAS EXISTENTES
DROP POLICY IF EXISTS "Users can view their own profile" ON professionals;
DROP POLICY IF EXISTS "Users can update their own profile" ON professionals;
DROP POLICY IF EXISTS "Users can insert their own profile" ON professionals;
DROP POLICY IF EXISTS "Users can view own professionals" ON professionals;
DROP POLICY IF EXISTS "Users can update own professionals" ON professionals;
DROP POLICY IF EXISTS "Users can insert own professionals" ON professionals;

-- 2. DESABILITAR RLS TEMPORARIAMENTE PARA TESTE
ALTER TABLE professionals DISABLE ROW LEVEL SECURITY;

-- 3. VERIFICAR ESTRUTURA DA TABELA
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'professionals'
ORDER BY ordinal_position;

-- 4. VERIFICAR DADOS EXISTENTES
SELECT 
  id,
  name,
  email,
  phone,
  specialty,
  company,
  created_at
FROM professionals
ORDER BY created_at DESC
LIMIT 5;

-- 5. HABILITAR RLS NOVAMENTE
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;

-- 6. CRIAR POLÍTICAS SIMPLES E FUNCIONAIS
-- Permitir que qualquer usuário autenticado veja todos os profissionais
CREATE POLICY "Anyone can view professionals" ON professionals
  FOR SELECT USING (true);

-- Permitir que usuários autenticados insiram dados
CREATE POLICY "Authenticated users can insert" ON professionals
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Permitir que usuários autenticados atualizem dados
CREATE POLICY "Authenticated users can update" ON professionals
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 7. VERIFICAR POLÍTICAS CRIADAS
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
