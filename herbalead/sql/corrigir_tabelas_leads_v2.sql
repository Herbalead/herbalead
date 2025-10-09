-- =====================================================
-- CORREÇÃO DAS TABELAS LEADS E MATERIALS - HERBALEAD V2
-- =====================================================
-- Execute este código no SQL Editor do Supabase Dashboard
-- Link: https://supabase.com/dashboard/project/rjwuedzmapeozijjrcik/sql

-- =====================================================
-- 1. VERIFICAR ESTRUTURA ATUAL DAS TABELAS
-- =====================================================

-- Verificar se a tabela leads existe e sua estrutura
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

-- Verificar se a tabela materials existe e sua estrutura
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

-- =====================================================
-- 2. REMOVER TABELAS EXISTENTES (SE HOUVER PROBLEMAS)
-- =====================================================

-- Remover tabelas se existirem com problemas
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS materials CASCADE;

-- =====================================================
-- 3. CRIAR TABELA LEADS CORRETAMENTE
-- =====================================================

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  link_id UUID,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  tool_name VARCHAR(100) NOT NULL,
  lead_type VARCHAR(50) DEFAULT 'capture',
  status VARCHAR(50) DEFAULT 'new',
  material_sent BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. CRIAR TABELA MATERIALS CORRETAMENTE
-- =====================================================

CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. ADICIONAR FOREIGN KEYS
-- =====================================================

-- FK para user_id na tabela leads
ALTER TABLE leads ADD CONSTRAINT leads_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES professionals(id) ON DELETE CASCADE;

-- FK para link_id na tabela leads (opcional)
ALTER TABLE leads ADD CONSTRAINT leads_link_id_fkey 
FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE SET NULL;

-- FK para user_id na tabela materials
ALTER TABLE materials ADD CONSTRAINT materials_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES professionals(id) ON DELETE CASCADE;

-- =====================================================
-- 6. ADICIONAR CAMPOS NA TABELA LINKS
-- =====================================================

-- Verificar se os campos existem antes de adicionar
DO $$
BEGIN
  -- Adicionar capture_type se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'links' 
    AND column_name = 'capture_type'
  ) THEN
    ALTER TABLE links ADD COLUMN capture_type VARCHAR(50) DEFAULT 'direct';
  END IF;

  -- Adicionar material_title se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'links' 
    AND column_name = 'material_title'
  ) THEN
    ALTER TABLE links ADD COLUMN material_title VARCHAR(255);
  END IF;

  -- Adicionar material_description se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'links' 
    AND column_name = 'material_description'
  ) THEN
    ALTER TABLE links ADD COLUMN material_description TEXT;
  END IF;
END $$;

-- =====================================================
-- 7. HABILITAR ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 8. CRIAR POLÍTICAS RLS
-- =====================================================

-- Políticas para leads
CREATE POLICY "Users can view their own leads" ON leads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own leads" ON leads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leads" ON leads
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para materials
CREATE POLICY "Users can view their own materials" ON materials
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own materials" ON materials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own materials" ON materials
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own materials" ON materials
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 9. CRIAR TRIGGERS
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para leads
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para materials
CREATE TRIGGER update_materials_updated_at
  BEFORE UPDATE ON materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 10. INSERIR DADOS DE EXEMPLO
-- =====================================================

-- Inserir alguns materiais de exemplo
INSERT INTO materials (user_id, title, description, file_type, is_active)
SELECT 
  id,
  'E-book Guia Completo de Nutrição',
  'Guia completo com dicas de nutrição e alimentação saudável',
  'pdf',
  true
FROM professionals
LIMIT 1;

INSERT INTO materials (user_id, title, description, file_type, is_active)
SELECT 
  id,
  'Checklist de Hábitos Saudáveis',
  'Lista de verificação para manter hábitos saudáveis',
  'pdf',
  true
FROM professionals
LIMIT 1;

-- =====================================================
-- 11. VERIFICAR SE TUDO FOI CRIADO CORRETAMENTE
-- =====================================================

-- Verificar tabelas criadas
SELECT 
  table_name,
  'CRIADA COM SUCESSO' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('leads', 'materials')
ORDER BY table_name;

-- Verificar estrutura da tabela leads
SELECT 
  'LEADS' as tabela,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'leads'
ORDER BY ordinal_position;

-- Verificar estrutura da tabela materials
SELECT 
  'MATERIALS' as tabela,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'materials'
ORDER BY ordinal_position;

-- Verificar campos adicionados na tabela links
SELECT 
  'LINKS (NOVOS CAMPOS)' as tabela,
  column_name,
  data_type,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'links'
  AND column_name IN ('capture_type', 'material_title', 'material_description')
ORDER BY column_name;

-- Verificar políticas RLS
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('leads', 'materials')
ORDER BY tablename, policyname;

-- Verificar triggers
SELECT 
  event_object_table AS tabela,
  trigger_name
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN ('leads', 'materials')
ORDER BY event_object_table, trigger_name;

-- Verificar foreign keys
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
