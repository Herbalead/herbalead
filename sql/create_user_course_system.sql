-- Script para criar sistema completo de cursos e usuários
-- Execute este código no Supabase SQL Editor

-- 1. Criar tabela de progresso do usuário nos cursos
CREATE TABLE IF NOT EXISTS user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  material_id UUID REFERENCES course_materials(id) ON DELETE CASCADE,
  progress_type VARCHAR(50) NOT NULL CHECK (progress_type IN ('course_started', 'module_completed', 'material_downloaded', 'course_completed')),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id, module_id, material_id, progress_type)
);

-- 2. Criar tabela de inscrições em cursos
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, course_id)
);

-- 3. Criar tabela de certificados
CREATE TABLE IF NOT EXISTS course_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_url TEXT,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_valid BOOLEAN DEFAULT true,
  UNIQUE(user_id, course_id)
);

-- 4. Adicionar colunas necessárias na tabela courses
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS enrollment_required BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS max_enrollments INTEGER,
ADD COLUMN IF NOT EXISTS course_image_url TEXT,
ADD COLUMN IF NOT EXISTS difficulty_level VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
ADD COLUMN IF NOT EXISTS estimated_hours INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS prerequisites TEXT[],
ADD COLUMN IF NOT EXISTS learning_objectives TEXT[],
ADD COLUMN IF NOT EXISTS course_tags TEXT[];

-- 5. Adicionar colunas na tabela course_modules
ALTER TABLE course_modules 
ADD COLUMN IF NOT EXISTS is_required BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS completion_criteria TEXT,
ADD COLUMN IF NOT EXISTS module_image_url TEXT;

-- 6. Adicionar colunas na tabela course_materials
ALTER TABLE course_materials 
ADD COLUMN IF NOT EXISTS is_required BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS download_limit INTEGER DEFAULT -1, -- -1 = ilimitado
ADD COLUMN IF NOT EXISTS access_level VARCHAR(20) DEFAULT 'enrolled' CHECK (access_level IN ('public', 'enrolled', 'completed'));

-- 7. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_user_course_progress_user_id ON user_course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_course_id ON user_course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_certificates_user_id ON course_certificates(user_id);

-- 8. Criar políticas RLS
-- Políticas para user_course_progress
DROP POLICY IF EXISTS "user_course_progress_select_own" ON user_course_progress;
CREATE POLICY "user_course_progress_select_own" ON user_course_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_course_progress_insert_own" ON user_course_progress;
CREATE POLICY "user_course_progress_insert_own" ON user_course_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_course_progress_update_own" ON user_course_progress;
CREATE POLICY "user_course_progress_update_own" ON user_course_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para course_enrollments
DROP POLICY IF EXISTS "course_enrollments_select_own" ON course_enrollments;
CREATE POLICY "course_enrollments_select_own" ON course_enrollments
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "course_enrollments_insert_own" ON course_enrollments;
CREATE POLICY "course_enrollments_insert_own" ON course_enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "course_enrollments_update_own" ON course_enrollments;
CREATE POLICY "course_enrollments_update_own" ON course_enrollments
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para course_certificates
DROP POLICY IF EXISTS "course_certificates_select_own" ON course_certificates;
CREATE POLICY "course_certificates_select_own" ON course_certificates
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "course_certificates_insert_own" ON course_certificates;
CREATE POLICY "course_certificates_insert_own" ON course_certificates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 9. Habilitar RLS nas novas tabelas
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_certificates ENABLE ROW LEVEL SECURITY;

-- 10. Inserir dados de exemplo para o curso existente
DO $$
DECLARE
    initial_course_id UUID;
BEGIN
    -- Buscar o curso "Treinamento Inicial - HerbaLead"
    SELECT id INTO initial_course_id FROM courses WHERE title = 'Treinamento Inicial - HerbaLead';
    
    IF initial_course_id IS NOT NULL THEN
        -- Atualizar informações do curso
        UPDATE courses SET
            enrollment_required = true,
            max_enrollments = 1000,
            difficulty_level = 'beginner',
            estimated_hours = 2,
            prerequisites = ARRAY['Conta ativa no HerbaLead'],
            learning_objectives = ARRAY[
                'Dominar o cadastro na plataforma',
                'Criar links personalizados',
                'Construir quizzes eficazes',
                'Implementar estratégias de captura de leads'
            ],
            course_tags = ARRAY['iniciante', 'captura-leads', 'automação', 'vendas']
        WHERE id = initial_course_id;
        
        RAISE NOTICE 'Curso "Treinamento Inicial - HerbaLead" atualizado com informações completas.';
    ELSE
        RAISE NOTICE 'Curso "Treinamento Inicial - HerbaLead" não encontrado.';
    END IF;
END $$;

-- 11. Verificar estrutura criada
SELECT 'Sistema de cursos e usuários criado com sucesso!' as status;

-- Mostrar tabelas criadas
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('user_course_progress', 'course_enrollments', 'course_certificates')
ORDER BY table_name, ordinal_position;


















