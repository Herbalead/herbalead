-- Adicionar coluna whatsapp_message na tabela links
-- Esta coluna armazenará a mensagem específica do WhatsApp para cada link

-- Verificar se a coluna já existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'links' 
        AND column_name = 'whatsapp_message'
    ) THEN
        -- Adicionar a coluna
        ALTER TABLE links 
        ADD COLUMN whatsapp_message TEXT DEFAULT '';
        
        RAISE NOTICE 'Coluna whatsapp_message adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna whatsapp_message já existe.';
    END IF;
END $$;

-- Verificar a estrutura da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'links' 
ORDER BY ordinal_position;
