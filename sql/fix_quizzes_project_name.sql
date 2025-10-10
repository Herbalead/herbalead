-- Script seguro para adicionar coluna project_name à tabela quizzes
-- Verifica se a coluna existe antes de tentar adicioná-la

DO $$ 
BEGIN
    -- Verificar se a tabela quizzes existe
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'quizzes'
    ) THEN
        -- Verificar se a coluna project_name existe
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'quizzes' 
            AND column_name = 'project_name'
        ) THEN
            -- Adicionar a coluna project_name
            ALTER TABLE quizzes ADD COLUMN project_name VARCHAR(255);
            RAISE NOTICE '✅ Coluna project_name adicionada à tabela quizzes';
        ELSE
            RAISE NOTICE 'ℹ️ Coluna project_name já existe na tabela quizzes';
        END IF;
    ELSE
        RAISE NOTICE '⚠️ Tabela quizzes não encontrada';
    END IF;
END $$;

-- Verificar estrutura atual da tabela quizzes
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'quizzes' 
ORDER BY ordinal_position;
