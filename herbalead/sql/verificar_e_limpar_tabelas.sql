-- =====================================================
-- VERIFICAÇÃO E LIMPEZA DAS TABELAS SUPABASE
-- =====================================================
-- Execute este código no SQL Editor do Supabase Dashboard

-- 1. LISTAR TODAS AS TABELAS EXISTENTES
SELECT 
  table_name,
  table_type,
  table_schema
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. VERIFICAR ESTRUTURA DAS TABELAS PRINCIPAIS
-- Tabela professionals
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'professionals'
ORDER BY ordinal_position;

-- Tabela links
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'links'
ORDER BY ordinal_position;

-- Tabela professional_links (para verificar se ainda existe)
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'professional_links'
ORDER BY ordinal_position;

-- 3. VERIFICAR DADOS NAS TABELAS
-- Dados em professionals
SELECT COUNT(*) as total_professionals FROM professionals;

-- Dados em links
SELECT COUNT(*) as total_links FROM links;

-- Dados em professional_links (se existir)
SELECT COUNT(*) as total_professional_links FROM professional_links;

-- 4. VERIFICAR RELACIONAMENTOS
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

-- 5. VERIFICAR POLÍTICAS RLS
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

-- 6. SCRIPT PARA REMOVER TABELAS DESNECESSÁRIAS (EXECUTE APENAS SE CONFIRMADO)
-- DROP TABLE IF EXISTS professional_links CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;
-- DROP TABLE IF EXISTS projects CASCADE;
-- DROP TABLE IF EXISTS leads CASCADE;
-- DROP TABLE IF EXISTS lead_notes CASCADE;
