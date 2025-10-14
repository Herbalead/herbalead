-- Script para criar tabela quizzes se não existir
-- Execute este script no Supabase SQL Editor

-- Verificar se a tabela quizzes existe
DO $$ 
BEGIN
    -- Verificar se a tabela quizzes existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'quizzes'
    ) THEN
        -- Criar tabela quizzes
        CREATE TABLE quizzes (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            project_name VARCHAR(255) NOT NULL,
            colors JSONB NOT NULL DEFAULT '{}'::jsonb,
            settings JSONB NOT NULL DEFAULT '{}'::jsonb,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        RAISE NOTICE '✅ Tabela quizzes criada com sucesso';
    ELSE
        RAISE NOTICE 'ℹ️ Tabela quizzes já existe';
    END IF;
END $$;

-- Verificar se a tabela questions existe
DO $$ 
BEGIN
    -- Verificar se a tabela questions existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'questions'
    ) THEN
        -- Criar tabela questions
        CREATE TABLE questions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
            question_text TEXT NOT NULL,
            question_type VARCHAR(50) NOT NULL CHECK (question_type IN ('multiple', 'essay', 'multiple_select')),
            order_number INTEGER NOT NULL DEFAULT 1,
            options JSONB DEFAULT '[]'::jsonb,
            correct_answer JSONB,
            points INTEGER DEFAULT 1,
            button_text VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        RAISE NOTICE '✅ Tabela questions criada com sucesso';
    ELSE
        RAISE NOTICE 'ℹ️ Tabela questions já existe';
    END IF;
END $$;

-- Verificar estrutura da tabela quizzes
SELECT 
    'quizzes' as table_name,
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'quizzes' 
ORDER BY ordinal_position;

-- Verificar estrutura da tabela questions
SELECT 
    'questions' as table_name,
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'questions' 
ORDER BY ordinal_position;
