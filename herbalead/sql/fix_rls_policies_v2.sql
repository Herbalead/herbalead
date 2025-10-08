-- =====================================================
-- CORREÇÃO DAS POLÍTICAS RLS - VERSÃO CORRIGIDA
-- =====================================================
-- Execute este código no SQL Editor do Supabase para corrigir o erro de cadastro

-- =====================================================
-- 1. REMOVER TODAS AS POLÍTICAS EXISTENTES
-- =====================================================

-- Remover políticas dos profissionais
DROP POLICY IF EXISTS "Professionals can manage their own data" ON professionals;
DROP POLICY IF EXISTS "Anyone can create professional profile" ON professionals;
DROP POLICY IF EXISTS "Professionals can view their own data" ON professionals;
DROP POLICY IF EXISTS "Professionals can update their own data" ON professionals;
DROP POLICY IF EXISTS "Professionals can delete their own data" ON professionals;

-- Remover políticas dos leads
DROP POLICY IF EXISTS "Professionals can manage their own leads" ON leads;
DROP POLICY IF EXISTS "Anyone can create leads" ON leads;
DROP POLICY IF EXISTS "Professionals can view their own leads" ON leads;
DROP POLICY IF EXISTS "Professionals can update their own leads" ON leads;
DROP POLICY IF EXISTS "Professionals can delete their own leads" ON leads;

-- Remover políticas dos links
DROP POLICY IF EXISTS "Professionals can manage their own links" ON professional_links;
DROP POLICY IF EXISTS "Anyone can view professional links" ON professional_links;
DROP POLICY IF EXISTS "Professionals can create their own links" ON professional_links;
DROP POLICY IF EXISTS "Professionals can update their own links" ON professional_links;
DROP POLICY IF EXISTS "Professionals can delete their own links" ON professional_links;

-- Remover políticas das notas
DROP POLICY IF EXISTS "Professionals can manage lead notes" ON lead_notes;
DROP POLICY IF EXISTS "Professionals can create lead notes" ON lead_notes;
DROP POLICY IF EXISTS "Professionals can view lead notes" ON lead_notes;
DROP POLICY IF EXISTS "Professionals can update lead notes" ON lead_notes;
DROP POLICY IF EXISTS "Professionals can delete lead notes" ON lead_notes;

-- =====================================================
-- 2. CRIAR POLÍTICAS CORRETAS PARA CADASTRO
-- =====================================================

-- Políticas para PROFESSIONALS
CREATE POLICY "professionals_insert_public" ON professionals
  FOR INSERT WITH CHECK (true);

CREATE POLICY "professionals_select_own" ON professionals
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "professionals_update_own" ON professionals
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "professionals_delete_own" ON professionals
  FOR DELETE USING (auth.uid()::text = id::text);

-- Políticas para LEADS
CREATE POLICY "leads_insert_public" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "leads_select_own" ON leads
  FOR SELECT USING (auth.uid()::text = professional_id::text);

CREATE POLICY "leads_update_own" ON leads
  FOR UPDATE USING (auth.uid()::text = professional_id::text);

CREATE POLICY "leads_delete_own" ON leads
  FOR DELETE USING (auth.uid()::text = professional_id::text);

-- Políticas para PROFESSIONAL_LINKS
CREATE POLICY "professional_links_select_public" ON professional_links
  FOR SELECT USING (true);

CREATE POLICY "professional_links_insert_own" ON professional_links
  FOR INSERT WITH CHECK (auth.uid()::text = professional_id::text);

CREATE POLICY "professional_links_update_own" ON professional_links
  FOR UPDATE USING (auth.uid()::text = professional_id::text);

CREATE POLICY "professional_links_delete_own" ON professional_links
  FOR DELETE USING (auth.uid()::text = professional_id::text);

-- Políticas para LEAD_NOTES
CREATE POLICY "lead_notes_insert_own" ON lead_notes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads 
      WHERE leads.id = lead_notes.lead_id 
      AND leads.professional_id::text = auth.uid()::text
    )
  );

CREATE POLICY "lead_notes_select_own" ON lead_notes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM leads 
      WHERE leads.id = lead_notes.lead_id 
      AND leads.professional_id::text = auth.uid()::text
    )
  );

CREATE POLICY "lead_notes_update_own" ON lead_notes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM leads 
      WHERE leads.id = lead_notes.lead_id 
      AND leads.professional_id::text = auth.uid()::text
    )
  );

CREATE POLICY "lead_notes_delete_own" ON lead_notes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM leads 
      WHERE leads.id = lead_notes.lead_id 
      AND leads.professional_id::text = auth.uid()::text
    )
  );

-- =====================================================
-- 3. VERIFICAR POLÍTICAS CRIADAS
-- =====================================================

-- Listar todas as políticas para verificação
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN ('professionals', 'leads', 'professional_links', 'lead_notes')
ORDER BY tablename, policyname;

-- =====================================================
-- 4. VERIFICAR SE RLS ESTÁ HABILITADO
-- =====================================================

SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
  AND table_name IN ('professionals', 'leads', 'professional_links', 'lead_notes')
ORDER BY tablename;

