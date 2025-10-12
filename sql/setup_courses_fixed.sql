-- Script CORRIGIDO para configurar cursos automaticamente
-- Execute este código no Supabase SQL Editor

-- 1. Primeiro, vamos verificar e criar as tabelas se necessário
DO $$
BEGIN
    -- Criar tabela courses se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'courses') THEN
        CREATE TABLE courses (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            difficulty_level TEXT DEFAULT 'beginner',
            estimated_hours INTEGER DEFAULT 0,
            course_image_url TEXT,
            course_tags TEXT[],
            learning_objectives TEXT[],
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Tabela courses criada';
    ELSE
        RAISE NOTICE 'Tabela courses já existe';
    END IF;

    -- Criar tabela course_modules se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'course_modules') THEN
        CREATE TABLE course_modules (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            description TEXT,
            duration TEXT,
            video_url TEXT,
            order_index INTEGER DEFAULT 0,
            is_active BOOLEAN DEFAULT true,
            pdf_materials TEXT,
            pdf_files TEXT[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Tabela course_modules criada';
    ELSE
        -- Adicionar colunas se não existirem
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course_modules' AND column_name = 'pdf_materials') THEN
            ALTER TABLE course_modules ADD COLUMN pdf_materials TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course_modules' AND column_name = 'pdf_files') THEN
            ALTER TABLE course_modules ADD COLUMN pdf_files TEXT[] DEFAULT '{}';
        END IF;
        RAISE NOTICE 'Tabela course_modules verificada/atualizada';
    END IF;
END $$;

-- 2. Limpar dados existentes dos cursos que vamos recriar
DELETE FROM course_modules WHERE course_id IN (
    SELECT id FROM courses WHERE title IN ('Treinamento Herbalead', 'Manual de Vendas')
);
DELETE FROM courses WHERE title IN ('Treinamento Herbalead', 'Manual de Vendas');

-- 3. Criar curso principal "Treinamento Herbalead"
INSERT INTO courses (
    id,
    title,
    description,
    difficulty_level,
    estimated_hours,
    course_tags,
    learning_objectives,
    is_active,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Treinamento Herbalead',
    'Curso completo para dominar a plataforma Herbalead e gerar mais leads',
    'beginner',
    2,
    ARRAY['herbalead', 'leads', 'marketing', 'iniciante'],
    ARRAY['Aprender a usar a plataforma', 'Criar links personalizados', 'Fazer quizzes eficazes', 'Gerar leads qualificados'],
    true,
    now(),
    now()
);

-- 4. Criar curso "Manual de Vendas" (separado)
INSERT INTO courses (
    id,
    title,
    description,
    difficulty_level,
    estimated_hours,
    course_tags,
    learning_objectives,
    is_active,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Manual de Vendas',
    'Estratégias avançadas de vendas para distribuidores',
    'intermediate',
    1,
    ARRAY['vendas', 'distribuidores', 'conversao', 'follow-up'],
    ARRAY['Identificar tipos de clientes', 'Fazer follow-up eficaz', 'Fechar vendas', 'Lidar com objeções'],
    true,
    now(),
    now()
);

-- 5. Criar módulos para "Treinamento Herbalead"
WITH herbalead_course AS (
    SELECT id FROM courses WHERE title = 'Treinamento Herbalead' LIMIT 1
)
INSERT INTO course_modules (
    id,
    course_id,
    title,
    description,
    duration,
    order_index,
    is_active,
    video_url,
    pdf_materials,
    pdf_files,
    created_at,
    updated_at
) 
SELECT 
    gen_random_uuid(),
    herbalead_course.id,
    'Como Começar',
    'Guia completo para iniciar na plataforma Herbalead',
    '15 min',
    1,
    true,
    null,
    'Aprenda os 10 passos essenciais para começar a usar o Herbalead e gerar seu primeiro lead em 24 horas.',
    ARRAY['https://herbalead.com/course/materials/01-como-comecar.html'],
    now(),
    now()
FROM herbalead_course

UNION ALL

SELECT 
    gen_random_uuid(),
    herbalead_course.id,
    'Como Criar Links',
    'Tutorial completo para criar links personalizados',
    '20 min',
    2,
    true,
    null,
    'Domine a criação de links personalizados, calculadoras e ferramentas de engajamento.',
    ARRAY['https://herbalead.com/course/materials/02-como-criar-links.html'],
    now(),
    now()
FROM herbalead_course

UNION ALL

SELECT 
    gen_random_uuid(),
    herbalead_course.id,
    'Como Fazer Quiz',
    'Guia para criar quizzes que convertem',
    '25 min',
    3,
    true,
    null,
    'Aprenda a criar quizzes eficazes que identificam o perfil dos seus leads e aumentam conversões.',
    ARRAY['https://herbalead.com/course/materials/03-como-fazer-quiz.html'],
    now(),
    now()
FROM herbalead_course;

-- 6. Criar módulo para "Manual de Vendas"
WITH sales_course AS (
    SELECT id FROM courses WHERE title = 'Manual de Vendas' LIMIT 1
)
INSERT INTO course_modules (
    id,
    course_id,
    title,
    description,
    duration,
    order_index,
    is_active,
    video_url,
    pdf_materials,
    pdf_files,
    created_at,
    updated_at
) 
SELECT 
    gen_random_uuid(),
    sales_course.id,
    'Estratégias de Vendas',
    'Como identificar leads e fechar vendas',
    '60 min',
    1,
    true,
    null,
    'Aprenda a identificar tipos de clientes (frio, morno, quente) e como abordar cada um para maximizar suas vendas.',
    ARRAY['https://herbalead.com/course/materials/04-manual-vendas.html'],
    now(),
    now()
FROM sales_course;

-- 7. Verificar se tudo foi criado corretamente
SELECT 
    c.title as curso,
    c.description as descricao,
    c.difficulty_level as nivel,
    c.estimated_hours as duracao_horas,
    c.is_active as ativo,
    COUNT(cm.id) as total_modulos
FROM courses c
LEFT JOIN course_modules cm ON c.id = cm.course_id
WHERE c.title IN ('Treinamento Herbalead', 'Manual de Vendas')
GROUP BY c.id, c.title, c.description, c.difficulty_level, c.estimated_hours, c.is_active
ORDER BY c.title;

-- 8. Verificar módulos criados
SELECT 
    c.title as curso,
    cm.title as modulo,
    cm.order_index as ordem,
    cm.duration as duracao,
    cm.pdf_files as materiais_pdf,
    cm.is_active as ativo
FROM courses c
JOIN course_modules cm ON c.id = cm.course_id
WHERE c.title IN ('Treinamento Herbalead', 'Manual de Vendas')
ORDER BY c.title, cm.order_index;

-- 9. Instruções para upload manual dos arquivos HTML
-- 
-- Para fazer upload dos arquivos HTML para o Supabase Storage:
-- 1. Acesse o Supabase Dashboard
-- 2. Vá em Storage > herbalead-public
-- 3. Crie a pasta "course-materials" se não existir
-- 4. Faça upload dos arquivos:
--    - 01-como-comecar.html
--    - 02-como-criar-links.html  
--    - 03-como-fazer-quiz.html
--    - 04-manual-vendas.html
-- 5. Copie as URLs públicas e atualize o campo pdf_files na tabela course_modules
--
-- Exemplo de atualização:
-- UPDATE course_modules 
-- SET pdf_files = ARRAY['https://herbalead.supabase.co/storage/v1/object/public/herbalead-public/course-materials/01-como-comecar.html']
-- WHERE title = 'Como Começar';
