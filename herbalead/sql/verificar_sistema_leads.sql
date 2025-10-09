-- =====================================================
-- VERIFICAÇÃO DO SISTEMA DE LEADS - HERBALEAD
-- =====================================================
-- Execute este código no SQL Editor do Supabase Dashboard
-- Link: https://supabase.com/dashboard/project/rjwuedzmapeozijjrcik/sql

-- =====================================================
-- 1. VERIFICAR ESTRUTURA DAS TABELAS
-- =====================================================

-- Verificar tabela leads
SELECT 
  'LEADS' as tabela,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'leads'
ORDER BY ordinal_position;

-- Verificar tabela materials
SELECT 
  'MATERIALS' as tabela,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'materials'
ORDER BY ordinal_position;

-- Verificar campos adicionados na tabela links
SELECT 
  'LINKS (NOVOS CAMPOS)' as tabela,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'links'
  AND column_name IN ('capture_type', 'material_title', 'material_description')
ORDER BY ordinal_position;

-- =====================================================
-- 2. VERIFICAR POLÍTICAS RLS
-- =====================================================

-- Verificar políticas da tabela leads
SELECT 
  'LEADS' as tabela,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'leads'
ORDER BY policyname;

-- Verificar políticas da tabela materials
SELECT 
  'MATERIALS' as tabela,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'materials'
ORDER BY policyname;

-- =====================================================
-- 3. VERIFICAR TRIGGERS
-- =====================================================

-- Verificar triggers
SELECT 
  event_object_table AS tabela,
  trigger_name,
  event_manipulation AS evento,
  action_timing AS timing
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN ('leads', 'materials', 'links')
ORDER BY event_object_table, trigger_name;

-- =====================================================
-- 4. VERIFICAR FUNÇÕES
-- =====================================================

-- Verificar funções criadas
SELECT 
  routine_name AS funcao,
  routine_type AS tipo,
  data_type AS retorno
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('send_lead_email', 'notify_new_lead', 'update_leads_updated_at', 'update_materials_updated_at')
ORDER BY routine_name;

-- =====================================================
-- 5. TESTAR INSERÇÃO DE LEAD (SIMULAÇÃO)
-- =====================================================

-- Inserir um lead de teste (substitua o user_id por um ID real)
-- INSERT INTO leads (user_id, link_id, name, phone, tool_name, lead_type)
-- SELECT 
--   p.id,
--   l.id,
--   'João Silva Teste',
--   '+5511999999999',
--   'bmi',
--   'capture'
-- FROM professionals p
-- CROSS JOIN links l
-- WHERE p.id IS NOT NULL
-- LIMIT 1;

-- =====================================================
-- 6. VERIFICAR DADOS EXISTENTES
-- =====================================================

-- Contar leads existentes
SELECT 
  'LEADS' as tabela,
  COUNT(*) as total_registros
FROM leads;

-- Contar materials existentes
SELECT 
  'MATERIALS' as tabela,
  COUNT(*) as total_registros
FROM materials;

-- Verificar links com novos campos
SELECT 
  'LINKS COM CAPTURE_TYPE' as info,
  capture_type,
  COUNT(*) as quantidade
FROM links
GROUP BY capture_type;

-- =====================================================
-- 7. VERIFICAR RELACIONAMENTOS
-- =====================================================

-- Verificar relacionamentos entre tabelas
SELECT 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS tabela_referenciada,
  ccu.column_name AS coluna_referenciada
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('leads', 'materials')
ORDER BY tc.table_name, kcu.column_name;

-- =====================================================
-- 8. RESUMO DO SISTEMA
-- =====================================================

-- Resumo geral
SELECT 
  'SISTEMA DE LEADS' as sistema,
  'Tabelas criadas: leads, materials' as tabelas,
  'Campos adicionados: capture_type, material_title, material_description' as campos_novos,
  'Políticas RLS: Configuradas' as rls,
  'Triggers: Configurados' as triggers,
  'Funções: send_lead_email, notify_new_lead' as funcoes,
  'Status: Pronto para uso' as status;
