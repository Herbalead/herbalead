-- Script corrigido para acesso aos cursos
-- Execute este código no Supabase SQL Editor

-- 1. Verificar se as tabelas necessárias existem
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
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Tabela course_modules criada';
    ELSE
        RAISE NOTICE 'Tabela course_modules já existe';
    END IF;

    -- Criar tabela course_materials se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'course_materials') THEN
        CREATE TABLE course_materials (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            file_path TEXT NOT NULL,
            file_type TEXT DEFAULT 'document',
            file_size BIGINT DEFAULT 0,
            download_count INTEGER DEFAULT 0,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Tabela course_materials criada';
    ELSE
        RAISE NOTICE 'Tabela course_materials já existe';
    END IF;

    -- Criar tabela course_enrollments se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'course_enrollments') THEN
        CREATE TABLE course_enrollments (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
            course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
            enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            progress_percentage INTEGER DEFAULT 0,
            is_active BOOLEAN DEFAULT true,
            UNIQUE(user_id, course_id)
        );
        RAISE NOTICE 'Tabela course_enrollments criada';
    ELSE
        RAISE NOTICE 'Tabela course_enrollments já existe';
    END IF;

    -- Criar tabela user_course_progress se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_course_progress') THEN
        CREATE TABLE user_course_progress (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
            course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
            module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
            progress_type TEXT NOT NULL,
            progress_data JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Tabela user_course_progress criada';
    ELSE
        RAISE NOTICE 'Tabela user_course_progress já existe';
    END IF;
END $$;

-- 2. Habilitar RLS nas tabelas
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;

-- 3. Criar políticas RLS para usuários ativos
-- Políticas para courses
DROP POLICY IF EXISTS "courses_select_active_users" ON courses;
CREATE POLICY "courses_select_active_users" ON courses
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM professionals 
    WHERE professionals.id = auth.uid() 
    AND professionals.is_active = true
  )
);

-- Políticas para course_modules
DROP POLICY IF EXISTS "course_modules_select_active_users" ON course_modules;
CREATE POLICY "course_modules_select_active_users" ON course_modules
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM professionals 
    WHERE professionals.id = auth.uid() 
    AND professionals.is_active = true
  )
);

-- Políticas para course_materials
DROP POLICY IF EXISTS "course_materials_select_active_users" ON course_materials;
CREATE POLICY "course_materials_select_active_users" ON course_materials
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM professionals 
    WHERE professionals.id = auth.uid() 
    AND professionals.is_active = true
  )
);

-- Políticas para course_enrollments
DROP POLICY IF EXISTS "course_enrollments_select_own" ON course_enrollments;
CREATE POLICY "course_enrollments_select_own" ON course_enrollments
FOR SELECT TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "course_enrollments_insert_own" ON course_enrollments;
CREATE POLICY "course_enrollments_insert_own" ON course_enrollments
FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM professionals 
    WHERE professionals.id = auth.uid() 
    AND professionals.is_active = true
  )
);

DROP POLICY IF EXISTS "course_enrollments_update_own" ON course_enrollments;
CREATE POLICY "course_enrollments_update_own" ON course_enrollments
FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Políticas para user_course_progress
DROP POLICY IF EXISTS "user_course_progress_select_own" ON user_course_progress;
CREATE POLICY "user_course_progress_select_own" ON user_course_progress
FOR SELECT TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "user_course_progress_insert_own" ON user_course_progress;
CREATE POLICY "user_course_progress_insert_own" ON user_course_progress
FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM professionals 
    WHERE professionals.id = auth.uid() 
    AND professionals.is_active = true
  )
);

-- 4. Inserir curso de exemplo se não existir
INSERT INTO courses (title, description, difficulty_level, estimated_hours, learning_objectives, is_active)
SELECT 
    'HerbaLead Master Course',
    'Curso completo para dominar a plataforma HerbaLead e transformar seu negócio em uma máquina de resultados',
    'beginner',
    10,
    ARRAY[
        'Dominar o cadastro e configuração inicial',
        'Criar links personalizados efetivos',
        'Utilizar o Quiz Builder para capturar leads',
        'Implementar estratégias de vendas',
        'Analisar resultados e otimizar campanhas'
    ],
    true
WHERE NOT EXISTS (
    SELECT 1 FROM courses WHERE title = 'HerbaLead Master Course'
);

-- 5. Inserir módulos de exemplo se não existirem
INSERT INTO course_modules (course_id, title, description, duration, order_index, is_active)
SELECT 
    c.id,
    'Visão Geral da Plataforma',
    'Introdução completa à plataforma HerbaLead e suas funcionalidades principais',
    '15 min',
    1,
    true
FROM courses c
WHERE c.title = 'HerbaLead Master Course'
AND NOT EXISTS (
    SELECT 1 FROM course_modules 
    WHERE course_id = c.id AND title = 'Visão Geral da Plataforma'
);

INSERT INTO course_modules (course_id, title, description, duration, order_index, is_active)
SELECT 
    c.id,
    'Guia de Cadastro',
    'Como fazer o cadastro completo e configurar seu perfil profissional',
    '20 min',
    2,
    true
FROM courses c
WHERE c.title = 'HerbaLead Master Course'
AND NOT EXISTS (
    SELECT 1 FROM course_modules 
    WHERE course_id = c.id AND title = 'Guia de Cadastro'
);

INSERT INTO course_modules (course_id, title, description, duration, order_index, is_active)
SELECT 
    c.id,
    'Tutorial de Criação de Links',
    'Passo a passo para criar links personalizados que convertem',
    '25 min',
    3,
    true
FROM courses c
WHERE c.title = 'HerbaLead Master Course'
AND NOT EXISTS (
    SELECT 1 FROM course_modules 
    WHERE course_id = c.id AND title = 'Tutorial de Criação de Links'
);

INSERT INTO course_modules (course_id, title, description, duration, order_index, is_active)
SELECT 
    c.id,
    'Guia do Quiz Builder',
    'Como criar quizzes eficazes para capturar e qualificar leads',
    '30 min',
    4,
    true
FROM courses c
WHERE c.title = 'HerbaLead Master Course'
AND NOT EXISTS (
    SELECT 1 FROM course_modules 
    WHERE course_id = c.id AND title = 'Guia do Quiz Builder'
);

INSERT INTO course_modules (course_id, title, description, duration, order_index, is_active)
SELECT 
    c.id,
    'Manual de Vendas',
    'Estratégias avançadas de vendas e conversão de leads',
    '35 min',
    5,
    true
FROM courses c
WHERE c.title = 'HerbaLead Master Course'
AND NOT EXISTS (
    SELECT 1 FROM course_modules 
    WHERE course_id = c.id AND title = 'Manual de Vendas'
);

INSERT INTO course_modules (course_id, title, description, duration, order_index, is_active)
SELECT 
    c.id,
    'Guia Avançado',
    'Técnicas avançadas e otimizações para maximizar resultados',
    '40 min',
    6,
    true
FROM courses c
WHERE c.title = 'HerbaLead Master Course'
AND NOT EXISTS (
    SELECT 1 FROM course_modules 
    WHERE course_id = c.id AND title = 'Guia Avançado'
);

-- 6. Inserir materiais de exemplo se não existirem
INSERT INTO course_materials (module_id, title, file_path, file_type, is_active)
SELECT 
    cm.id,
    'Guia de Cadastro - Material Completo',
    '/course/materials/01-guia-cadastro.md',
    'document',
    true
FROM course_modules cm
JOIN courses c ON cm.course_id = c.id
WHERE c.title = 'HerbaLead Master Course' 
AND cm.title = 'Guia de Cadastro'
AND NOT EXISTS (
    SELECT 1 FROM course_materials 
    WHERE module_id = cm.id AND title = 'Guia de Cadastro - Material Completo'
);

INSERT INTO course_materials (module_id, title, file_path, file_type, is_active)
SELECT 
    cm.id,
    'Tutorial de Links - Material Completo',
    '/course/materials/02-tutorial-links.md',
    'document',
    true
FROM course_modules cm
JOIN courses c ON cm.course_id = c.id
WHERE c.title = 'HerbaLead Master Course' 
AND cm.title = 'Tutorial de Criação de Links'
AND NOT EXISTS (
    SELECT 1 FROM course_materials 
    WHERE module_id = cm.id AND title = 'Tutorial de Links - Material Completo'
);

INSERT INTO course_materials (module_id, title, file_path, file_type, is_active)
SELECT 
    cm.id,
    'Quiz Builder - Material Completo',
    '/course/materials/03-guia-quiz-builder.md',
    'document',
    true
FROM course_modules cm
JOIN courses c ON cm.course_id = c.id
WHERE c.title = 'HerbaLead Master Course' 
AND cm.title = 'Guia do Quiz Builder'
AND NOT EXISTS (
    SELECT 1 FROM course_materials 
    WHERE module_id = cm.id AND title = 'Quiz Builder - Material Completo'
);

INSERT INTO course_materials (module_id, title, file_path, file_type, is_active)
SELECT 
    cm.id,
    'Manual de Vendas - Material Completo',
    '/course/materials/04-manual-vendas.md',
    'document',
    true
FROM course_modules cm
JOIN courses c ON cm.course_id = c.id
WHERE c.title = 'HerbaLead Master Course' 
AND cm.title = 'Manual de Vendas'
AND NOT EXISTS (
    SELECT 1 FROM course_materials 
    WHERE module_id = cm.id AND title = 'Manual de Vendas - Material Completo'
);

INSERT INTO course_materials (module_id, title, file_path, file_type, is_active)
SELECT 
    cm.id,
    'Guia Avançado - Material Completo',
    '/course/materials/05-guia-avancado.md',
    'document',
    true
FROM course_modules cm
JOIN courses c ON cm.course_id = c.id
WHERE c.title = 'HerbaLead Master Course' 
AND cm.title = 'Guia Avançado'
AND NOT EXISTS (
    SELECT 1 FROM course_materials 
    WHERE module_id = cm.id AND title = 'Guia Avançado - Material Completo'
);

-- 7. Verificar se tudo foi criado corretamente
SELECT 
    'Verificação final:' as status,
    'Tabelas criadas e políticas configuradas com sucesso!' as resultado;

-- 8. Mostrar dados finais
SELECT 
    'Cursos disponíveis:' as status,
    id,
    title,
    description,
    is_active
FROM courses 
WHERE is_active = true;

SELECT 
    'Módulos criados:' as status,
    cm.id,
    c.title as curso,
    cm.title as modulo,
    cm.duration,
    cm.order_index
FROM course_modules cm
JOIN courses c ON cm.course_id = c.id
WHERE cm.is_active = true
ORDER BY c.title, cm.order_index;

SELECT 
    'Materiais criados:' as status,
    cm2.id,
    c.title as curso,
    cm.title as modulo,
    cm2.title as material,
    cm2.file_path
FROM course_materials cm2
JOIN course_modules cm ON cm2.module_id = cm.id
JOIN courses c ON cm.course_id = c.id
WHERE cm2.is_active = true
ORDER BY c.title, cm.order_index;






















