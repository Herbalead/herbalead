-- =====================================================
-- HERBALEAD - CRIAÇÃO DA TABELA PROFILES
-- =====================================================
-- Execute este código no SQL Editor do Supabase Dashboard
-- Link: https://supabase.com/dashboard/project/rjwuedzmapeozijjrcik/sql

-- Tabela de Perfis de Usuários (compatível com Supabase Auth)
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

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política para usuários poderem ver apenas seu próprio perfil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Política para usuários poderem inserir seu próprio perfil
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Política para usuários poderem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE profiles IS 'Perfis de usuários do sistema Herbalead';
COMMENT ON COLUMN profiles.id IS 'ID do usuário (referência para auth.users)';
COMMENT ON COLUMN profiles.full_name IS 'Nome completo do usuário';
COMMENT ON COLUMN profiles.phone IS 'Telefone/WhatsApp (formato: +5511999999999)';
COMMENT ON COLUMN profiles.specialty IS 'Especialidade profissional';
COMMENT ON COLUMN profiles.company IS 'Empresa/Organização';
COMMENT ON COLUMN profiles.website IS 'Site/URL pessoal';
COMMENT ON COLUMN profiles.bio IS 'Biografia/descrição';
COMMENT ON COLUMN profiles.profile_image IS 'URL da imagem de perfil';
COMMENT ON COLUMN profiles.is_active IS 'Status ativo/inativo';
COMMENT ON COLUMN profiles.created_at IS 'Data de criação';
COMMENT ON COLUMN profiles.updated_at IS 'Data da última atualização';
