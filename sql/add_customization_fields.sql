-- Adicionar novos campos à tabela links para personalização
-- Execute este script no Supabase SQL Editor

ALTER TABLE links 
ADD COLUMN IF NOT EXISTS page_title TEXT DEFAULT 'Quer uma análise mais completa?',
ADD COLUMN IF NOT EXISTS page_greeting TEXT DEFAULT 'Olá!',
ADD COLUMN IF NOT EXISTS button_text TEXT DEFAULT 'Consultar Especialista';

-- Atualizar registros existentes com valores padrão
UPDATE links 
SET 
  page_title = COALESCE(page_title, 'Quer uma análise mais completa?'),
  page_greeting = COALESCE(page_greeting, 'Olá!'),
  button_text = COALESCE(button_text, 'Consultar Especialista')
WHERE 
  page_title IS NULL 
  OR page_greeting IS NULL 
  OR button_text IS NULL;

-- Verificar se os campos foram adicionados
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'links' 
AND column_name IN ('page_title', 'page_greeting', 'button_text');
