-- =====================================================
-- HERBALEAD - CRIAÇÃO DA TABELA LINKS
-- =====================================================
-- Execute este código no SQL Editor do Supabase Dashboard
-- Link: https://supabase.com/dashboard/project/rjwuedzmapeozijjrcik/sql

-- Tabela de Links do Dashboard (simplificada)
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

-- Habilitar RLS (Row Level Security)
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Política para usuários poderem ver apenas seus próprios links
CREATE POLICY "Users can view own links" ON links
  FOR SELECT USING (auth.uid() = user_id);

-- Política para usuários poderem inserir seus próprios links
CREATE POLICY "Users can insert own links" ON links
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para usuários poderem atualizar seus próprios links
CREATE POLICY "Users can update own links" ON links
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para usuários poderem deletar seus próprios links
CREATE POLICY "Users can delete own links" ON links
  FOR DELETE USING (auth.uid() = user_id);

-- Política para visualização pública de links ativos (para redirecionamento)
CREATE POLICY "Anyone can view active links" ON links
  FOR SELECT USING (status = 'active');

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_links_updated_at
  BEFORE UPDATE ON links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_custom_url ON links(custom_url);
CREATE INDEX IF NOT EXISTS idx_links_status ON links(status);
CREATE INDEX IF NOT EXISTS idx_links_created_at ON links(created_at);

-- Comentários para documentação
COMMENT ON TABLE links IS 'Links personalizados do dashboard do usuário';
COMMENT ON COLUMN links.id IS 'ID único do link';
COMMENT ON COLUMN links.user_id IS 'ID do usuário proprietário do link';
COMMENT ON COLUMN links.name IS 'Nome do projeto/link';
COMMENT ON COLUMN links.tool_name IS 'Nome da ferramenta (bmi, protein, etc.)';
COMMENT ON COLUMN links.cta_text IS 'Texto do botão de call-to-action';
COMMENT ON COLUMN links.redirect_url IS 'URL de redirecionamento (WhatsApp, site, etc.)';
COMMENT ON COLUMN links.custom_url IS 'URL personalizada do link';
COMMENT ON COLUMN links.custom_message IS 'Mensagem personalizada';
COMMENT ON COLUMN links.status IS 'Status do link (active/inactive)';
COMMENT ON COLUMN links.clicks IS 'Número de cliques no link';
COMMENT ON COLUMN links.leads IS 'Número de leads gerados';
COMMENT ON COLUMN links.created_at IS 'Data de criação';
COMMENT ON COLUMN links.updated_at IS 'Data da última atualização';
