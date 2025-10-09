-- =====================================================
-- HERBALEAD - VERIFICAÇÃO COMPLETA DA ESTRUTURA
-- =====================================================
-- Execute este código no SQL Editor do Supabase Dashboard
-- Link: https://supabase.com/dashboard/project/rjwuedzmapeozijjrcik/sql

-- 1. VERIFICAR TODAS AS TABELAS EXISTENTES
SELECT 
  table_name,
  table_type,
  table_schema
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. VERIFICAR ESTRUTURA DA TABELA PROFESSIONALS
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'professionals'
ORDER BY ordinal_position;

-- 3. VERIFICAR ESTRUTURA DA TABELA LINKS
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'links'
ORDER BY ordinal_position;

-- 4. VERIFICAR ESTRUTURA DA TABELA PROFESSIONAL_LINKS
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'professional_links'
ORDER BY ordinal_position;

-- 5. VERIFICAR DADOS NA TABELA PROFESSIONALS
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

-- 6. VERIFICAR DADOS NA TABELA LINKS
SELECT 
  id,
  user_id,
  name,
  tool_name,
  cta_text,
  redirect_url,
  custom_url,
  status,
  created_at
FROM links
ORDER BY created_at DESC
LIMIT 5;

-- 7. VERIFICAR DADOS NA TABELA PROFESSIONAL_LINKS
SELECT 
  id,
  professional_id,
  tool_name,
  cta_text,
  redirect_url,
  custom_slug,
  created_at
FROM professional_links
ORDER BY created_at DESC
LIMIT 5;

-- 8. VERIFICAR RELACIONAMENTOS
SELECT 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- 9. VERIFICAR POLÍTICAS RLS
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
