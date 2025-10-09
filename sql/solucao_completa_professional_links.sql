-- SOLUÇÃO COMPLETA PARA TABELA PROFESSIONAL_LINKS
-- Execute este código DIRETAMENTE no SQL Editor do Supabase

-- 1. Verificar se a tabela existe
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'professional_links'
) as tabela_existe;

-- 2. Se a tabela não existir, criar
CREATE TABLE IF NOT EXISTS professional_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
    tool_name VARCHAR(100) NOT NULL,
    cta_text VARCHAR(200) DEFAULT 'Saiba Mais',
    redirect_url TEXT NOT NULL,
    custom_url TEXT NOT NULL,
    project_name VARCHAR(255),
    custom_message TEXT,
    custom_slug VARCHAR(255),
    secure_id VARCHAR(255),
    redirect_type VARCHAR(50) DEFAULT 'whatsapp',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Adicionar colunas que podem estar faltando
DO $$ 
BEGIN
    -- Adicionar project_name se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'professional_links' AND column_name = 'project_name') THEN
        ALTER TABLE professional_links ADD COLUMN project_name VARCHAR(255);
    END IF;
    
    -- Adicionar custom_message se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'professional_links' AND column_name = 'custom_message') THEN
        ALTER TABLE professional_links ADD COLUMN custom_message TEXT;
    END IF;
    
    -- Adicionar custom_slug se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'professional_links' AND column_name = 'custom_slug') THEN
        ALTER TABLE professional_links ADD COLUMN custom_slug VARCHAR(255);
    END IF;
    
    -- Adicionar secure_id se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'professional_links' AND column_name = 'secure_id') THEN
        ALTER TABLE professional_links ADD COLUMN secure_id VARCHAR(255);
    END IF;
    
    -- Adicionar redirect_type se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'professional_links' AND column_name = 'redirect_type') THEN
        ALTER TABLE professional_links ADD COLUMN redirect_type VARCHAR(50) DEFAULT 'whatsapp';
    END IF;
    
    -- Adicionar is_active se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'professional_links' AND column_name = 'is_active') THEN
        ALTER TABLE professional_links ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- 4. Habilitar RLS
ALTER TABLE professional_links ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas RLS
DROP POLICY IF EXISTS "professional_links_select_public" ON professional_links;
DROP POLICY IF EXISTS "professional_links_manage_own" ON professional_links;

CREATE POLICY "professional_links_select_public" ON professional_links
    FOR SELECT USING (true);

CREATE POLICY "professional_links_manage_own" ON professional_links
    FOR ALL USING (auth.uid()::text = professional_id::text);

-- 6. Criar índices
CREATE INDEX IF NOT EXISTS idx_professional_links_professional_id ON professional_links(professional_id);
CREATE INDEX IF NOT EXISTS idx_professional_links_custom_slug ON professional_links(custom_slug);
CREATE INDEX IF NOT EXISTS idx_professional_links_secure_id ON professional_links(secure_id);

-- 7. Verificar resultado
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'professional_links' 
ORDER BY ordinal_position;

SELECT 'Tabela professional_links configurada com sucesso!' as resultado;




