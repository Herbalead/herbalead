-- SOLUÇÃO DIRETA - COLE ESTE CÓDIGO NO SQL EDITOR
-- NÃO USE SNIPPETS - COLE DIRETAMENTE

-- 1. Verificar estrutura atual
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'professional_links' 
ORDER BY ordinal_position;

-- 2. Criar tabela completa do zero
DROP TABLE IF EXISTS professional_links CASCADE;

CREATE TABLE professional_links (
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

-- 3. Habilitar RLS
ALTER TABLE professional_links ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas simples
CREATE POLICY "professional_links_public_select" ON professional_links
    FOR SELECT USING (true);

CREATE POLICY "professional_links_own_all" ON professional_links
    FOR ALL USING (auth.uid()::text = professional_id::text);

-- 5. Criar índices
CREATE INDEX idx_professional_links_professional_id ON professional_links(professional_id);
CREATE INDEX idx_professional_links_custom_slug ON professional_links(custom_slug);

-- 6. Verificar resultado
SELECT 'Tabela professional_links criada com sucesso!' as resultado;

































