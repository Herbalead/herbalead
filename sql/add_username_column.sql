-- Adicionar coluna username na tabela professionals
-- Este script resolve o erro: "Could not find the 'username' column of 'professionals' in the schema cache"

-- Verificar se a coluna já existe
DO $$
BEGIN
    -- Tentar adicionar a coluna username se ela não existir
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'professionals' 
        AND column_name = 'username'
    ) THEN
        -- Adicionar coluna username
        ALTER TABLE professionals 
        ADD COLUMN username VARCHAR(50) UNIQUE;
        
        -- Criar índice para melhor performance
        CREATE INDEX idx_professionals_username ON professionals(username);
        
        RAISE NOTICE 'Coluna username adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna username já existe!';
    END IF;
END $$;

-- Verificar estrutura atual da tabela professionals
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'professionals' 
ORDER BY ordinal_position;

-- Mostrar alguns registros para verificar
SELECT 
    id, 
    name, 
    email, 
    username,
    is_active,
    subscription_status
FROM professionals 
LIMIT 5;
