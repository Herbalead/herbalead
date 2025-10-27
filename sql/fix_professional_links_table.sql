-- CORREÇÃO DA TABELA professional_links
-- Execute este código no SQL Editor do Supabase

-- 1. Verificar estrutura atual da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'professional_links' 
ORDER BY ordinal_position;

-- 2. Adicionar colunas que estão faltando
ALTER TABLE professional_links 
ADD COLUMN IF NOT EXISTS custom_message TEXT,
ADD COLUMN IF NOT EXISTS project_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS custom_slug VARCHAR(255),
ADD COLUMN IF NOT EXISTS secure_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS redirect_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 3. Verificar se as colunas foram adicionadas
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'professional_links' 
ORDER BY ordinal_position;

-- 4. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_professional_links_custom_slug ON professional_links(custom_slug);
CREATE INDEX IF NOT EXISTS idx_professional_links_secure_id ON professional_links(secure_id);
CREATE INDEX IF NOT EXISTS idx_professional_links_project_name ON professional_links(project_name);

SELECT 'Tabela professional_links corrigida com sucesso!' as resultado;




































