-- Script para adicionar coluna phone na tabela professionals
-- Execute este script no Supabase SQL Editor

-- 1. Adicionar coluna phone na tabela professionals
ALTER TABLE public.professionals 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- 2. Adicionar comentário para documentar a coluna
COMMENT ON COLUMN public.professionals.phone IS 'Número de telefone do profissional com código do país';

-- 3. Verificar se a coluna foi criada corretamente
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'professionals' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Exemplo de como a tabela deve ficar:
-- professionals:
-- - id (uuid) - ID único
-- - name (text) - Nome do profissional  
-- - email (text) - Email único
-- - phone (text) - Telefone com código do país (+5511999999999)
-- - is_active (boolean) - Se está ativo
-- - is_admin (boolean) - Se é administrador
-- - admin_password (text) - Senha administrativa
-- - created_at (timestamp) - Data de criação
-- - updated_at (timestamp) - Data de atualização
