-- =====================================================
-- CORREÇÃO DAS TABELAS LEADS E MATERIALS - HERBALEAD
-- =====================================================
-- Execute este código no SQL Editor do Supabase Dashboard
-- Link: https://supabase.com/dashboard/project/rjwuedzmapeozijjrcik/sql

-- =====================================================
-- 1. VERIFICAR SE AS TABELAS EXISTEM
-- =====================================================

-- Verificar se a tabela leads existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'leads'
) as leads_exists;

-- Verificar se a tabela materials existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'materials'
) as materials_exists;

-- =====================================================
-- 2. CRIAR TABELA LEADS (SE NÃO EXISTIR)
-- =====================================================

CREATE TABLE IF NOT EXISTS leads (
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
-- 3. CRIAR TABELA MATERIALS (SE NÃO EXISTIR)
-- =====================================================

CREATE TABLE IF NOT EXISTS materials (
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
-- 4. ADICIONAR CAMPOS NA TABELA LINKS (SE NÃO EXISTIREM)
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
-- 5. ADICIONAR FOREIGN KEYS (SE NÃO EXISTIREM)
-- =====================================================

-- Adicionar FK para user_id na tabela leads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'leads_user_id_fkey'
  ) THEN
    ALTER TABLE leads ADD CONSTRAINT leads_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES professionals(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Adicionar FK para link_id na tabela leads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'leads_link_id_fkey'
  ) THEN
    ALTER TABLE leads ADD CONSTRAINT leads_link_id_fkey 
    FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Adicionar FK para user_id na tabela materials
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'materials_user_id_fkey'
  ) THEN
    ALTER TABLE materials ADD CONSTRAINT materials_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES professionals(id) ON DELETE CASCADE;
  END IF;
END $$;

-- =====================================================
-- 6. HABILITAR ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. CRIAR POLÍTICAS RLS (SE NÃO EXISTIREM)
-- =====================================================

-- Políticas para leads
DO $$
BEGIN
  -- Política de SELECT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leads' 
    AND policyname = 'Users can view their own leads'
  ) THEN
    CREATE POLICY "Users can view their own leads" ON leads
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  -- Política de INSERT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leads' 
    AND policyname = 'Anyone can insert leads'
  ) THEN
    CREATE POLICY "Anyone can insert leads" ON leads
      FOR INSERT WITH CHECK (true);
  END IF;

  -- Política de UPDATE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leads' 
    AND policyname = 'Users can update their own leads'
  ) THEN
    CREATE POLICY "Users can update their own leads" ON leads
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  -- Política de DELETE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leads' 
    AND policyname = 'Users can delete their own leads'
  ) THEN
    CREATE POLICY "Users can delete their own leads" ON leads
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Políticas para materials
DO $$
BEGIN
  -- Política de SELECT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'materials' 
    AND policyname = 'Users can view their own materials'
  ) THEN
    CREATE POLICY "Users can view their own materials" ON materials
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  -- Política de INSERT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'materials' 
    AND policyname = 'Users can insert their own materials'
  ) THEN
    CREATE POLICY "Users can insert their own materials" ON materials
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Política de UPDATE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'materials' 
    AND policyname = 'Users can update their own materials'
  ) THEN
    CREATE POLICY "Users can update their own materials" ON materials
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  -- Política de DELETE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'materials' 
    AND policyname = 'Users can delete their own materials'
  ) THEN
    CREATE POLICY "Users can delete their own materials" ON materials
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- =====================================================
-- 8. CRIAR TRIGGERS (SE NÃO EXISTIREM)
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
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_leads_updated_at'
  ) THEN
    CREATE TRIGGER update_leads_updated_at
      BEFORE UPDATE ON leads
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Trigger para materials
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_materials_updated_at'
  ) THEN
    CREATE TRIGGER update_materials_updated_at
      BEFORE UPDATE ON materials
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- =====================================================
-- 9. VERIFICAR SE TUDO FOI CRIADO
-- =====================================================

-- Verificar tabelas
SELECT 
  table_name,
  'CRIADA' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('leads', 'materials')
ORDER BY table_name;

-- Verificar campos na tabela links
SELECT 
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
