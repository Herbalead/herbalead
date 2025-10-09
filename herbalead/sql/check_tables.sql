-- =====================================================
-- HERBALEAD - VERIFICAÇÃO DE TABELAS EXISTENTES
-- =====================================================
-- Execute este código no SQL Editor do Supabase Dashboard
-- Link: https://supabase.com/dashboard/project/rjwuedzmapeozijjrcik/sql

-- Verificar todas as tabelas existentes no schema public
SELECT 
  table_name,
  table_type,
  table_schema
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar estrutura da tabela professionals
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'professionals'
ORDER BY ordinal_position;

-- Verificar estrutura da tabela links
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'links'
ORDER BY ordinal_position;

-- Verificar dados na tabela professionals
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
LIMIT 10;

-- Verificar dados na tabela links
SELECT 
  id,
  user_id,
  name,
  tool_name,
  custom_url,
  status,
  created_at
FROM links
ORDER BY created_at DESC
LIMIT 10;

-- Verificar políticas RLS ativas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
