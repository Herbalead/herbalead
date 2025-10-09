-- =====================================================
-- HERBALEAD - SETUP SEGURO DE TABELAS (SEM CONFLITOS)
-- =====================================================
-- Execute este código no SQL Editor do Supabase Dashboard
-- Link: https://supabase.com/dashboard/project/rjwuedzmapeozijjrcik/sql

-- =====================================================
-- 1. TABELA PROFILES (Perfis de Usuários)
-- =====================================================

-- Criar tabela profiles se não existir
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  specialty VARCHAR(100),
  company VARCHAR(255),
  website VARCHAR(500),
  bio TEXT,
  profile_image TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS se não estiver habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Criar políticas apenas se não existirem
DO $$
BEGIN
  -- Política para visualização
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile" ON profiles
      FOR SELECT USING (auth.uid() = id);
  END IF;

  -- Política para inserção
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile" ON profiles
      FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;

  -- Política para atualização
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile" ON profiles
      FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

-- =====================================================
-- 2. TABELA LINKS (Links Personalizados)
-- =====================================================

-- Criar tabela links se não existir
CREATE TABLE IF NOT EXISTS links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  tool_name VARCHAR(100) NOT NULL,
  cta_text VARCHAR(200) DEFAULT 'Falar com Especialista',
  redirect_url TEXT NOT NULL,
  custom_url TEXT NOT NULL,
  custom_message TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  clicks INTEGER DEFAULT 0,
  leads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS se não estiver habilitado
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Criar políticas apenas se não existirem
DO $$
BEGIN
  -- Política para visualização própria
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'links' 
    AND policyname = 'Users can view own links'
  ) THEN
    CREATE POLICY "Users can view own links" ON links
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  -- Política para inserção
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'links' 
    AND policyname = 'Users can insert own links'
  ) THEN
    CREATE POLICY "Users can insert own links" ON links
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Política para atualização
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'links' 
    AND policyname = 'Users can update own links'
  ) THEN
    CREATE POLICY "Users can update own links" ON links
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  -- Política para exclusão
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'links' 
    AND policyname = 'Users can delete own links'
  ) THEN
    CREATE POLICY "Users can delete own links" ON links
      FOR DELETE USING (auth.uid() = user_id);
  END IF;

  -- Política para visualização pública de links ativos
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'links' 
    AND policyname = 'Anyone can view active links'
  ) THEN
    CREATE POLICY "Anyone can view active links" ON links
      FOR SELECT USING (status = 'active');
  END IF;
END $$;

-- =====================================================
-- 3. FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers apenas se não existirem
DO $$
BEGIN
  -- Trigger para profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_profiles_updated_at
      BEFORE UPDATE ON profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  -- Trigger para links
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_links_updated_at'
  ) THEN
    CREATE TRIGGER update_links_updated_at
      BEFORE UPDATE ON links
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- =====================================================
-- 4. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para profiles
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);

-- Índices para links
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_custom_url ON links(custom_url);
CREATE INDEX IF NOT EXISTS idx_links_status ON links(status);
CREATE INDEX IF NOT EXISTS idx_links_created_at ON links(created_at);

-- =====================================================
-- 5. VERIFICAÇÃO DE TABELAS CRIADAS
-- =====================================================

-- Verificar se as tabelas foram criadas
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'links')
ORDER BY table_name;

-- Verificar políticas RLS criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('profiles', 'links')
ORDER BY tablename, policyname;
