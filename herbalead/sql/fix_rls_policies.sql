-- =====================================================
-- CORREÇÃO DAS POLÍTICAS RLS PARA CADASTRO PÚBLICO
-- =====================================================
-- Execute este código no SQL Editor do Supabase para corrigir o erro de cadastro

-- =====================================================
-- 1. REMOVER POLÍTICAS EXISTENTES PROBLEMÁTICAS
-- =====================================================

-- Remover política restritiva dos profissionais
DROP POLICY IF EXISTS "Professionals can manage their own data" ON professionals;

-- =====================================================
-- 2. CRIAR POLÍTICAS CORRETAS PARA CADASTRO
-- =====================================================

-- Política para permitir inserção pública de profissionais (cadastro)
CREATE POLICY "Anyone can create professional profile" ON professionals
  FOR INSERT WITH CHECK (true);

-- Política para profissionais verem apenas seus próprios dados
CREATE POLICY "Professionals can view their own data" ON professionals
  FOR SELECT USING (auth.uid()::text = id::text);

-- Política para profissionais editarem apenas seus próprios dados
CREATE POLICY "Professionals can update their own data" ON professionals
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Política para profissionais deletarem apenas seus próprios dados
CREATE POLICY "Professionals can delete their own data" ON professionals
  FOR DELETE USING (auth.uid()::text = id::text);

-- =====================================================
-- 3. CORRIGIR POLÍTICAS DOS LEADS
-- =====================================================

-- Remover política restritiva dos leads
DROP POLICY IF EXISTS "Professionals can manage their own leads" ON leads;

-- Criar políticas corretas para leads
CREATE POLICY "Anyone can create leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Professionals can view their own leads" ON leads
  FOR SELECT USING (auth.uid()::text = professional_id::text);

CREATE POLICY "Professionals can update their own leads" ON leads
  FOR UPDATE USING (auth.uid()::text = professional_id::text);

CREATE POLICY "Professionals can delete their own leads" ON leads
  FOR DELETE USING (auth.uid()::text = professional_id::text);

-- =====================================================
-- 4. CORRIGIR POLÍTICAS DOS LINKS
-- =====================================================

-- Remover política restritiva dos links
DROP POLICY IF EXISTS "Professionals can manage their own links" ON professional_links;

-- Criar políticas corretas para links
CREATE POLICY "Anyone can view professional links" ON professional_links
  FOR SELECT USING (true);

CREATE POLICY "Professionals can create their own links" ON professional_links
  FOR INSERT WITH CHECK (auth.uid()::text = professional_id::text);

CREATE POLICY "Professionals can update their own links" ON professional_links
  FOR UPDATE USING (auth.uid()::text = professional_id::text);

CREATE POLICY "Professionals can delete their own links" ON professional_links
  FOR DELETE USING (auth.uid()::text = professional_id::text);

-- =====================================================
-- 5. CORRIGIR POLÍTICAS DAS NOTAS
-- =====================================================

-- Remover política restritiva das notas
DROP POLICY IF EXISTS "Professionals can manage lead notes" ON lead_notes;

-- Criar políticas corretas para notas
CREATE POLICY "Professionals can create lead notes" ON lead_notes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads 
      WHERE leads.id = lead_notes.lead_id 
      AND leads.professional_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Professionals can view lead notes" ON lead_notes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM leads 
      WHERE leads.id = lead_notes.lead_id 
      AND leads.professional_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Professionals can update lead notes" ON lead_notes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM leads 
      WHERE leads.id = lead_notes.lead_id 
      AND leads.professional_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Professionals can delete lead notes" ON lead_notes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM leads 
      WHERE leads.id = lead_notes.lead_id 
      AND leads.professional_id::text = auth.uid()::text
    )
  );

-- =====================================================
-- 6. VERIFICAR POLÍTICAS CRIADAS
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
-- 7. TESTE DE VERIFICAÇÃO
-- =====================================================

-- Verificar se RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN ('professionals', 'leads', 'professional_links', 'lead_notes')
ORDER BY tablename;