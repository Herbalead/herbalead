-- Adicionar campo phone na tabela professionals se não existir
ALTER TABLE professionals 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Comentário para documentar o campo
COMMENT ON COLUMN professionals.phone IS 'Telefone do profissional com código do país (ex: +5511999999999)';

-- Verificar se o campo foi criado
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'professionals' 
AND column_name = 'phone';
