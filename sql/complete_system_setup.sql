-- Script SQL Consolidado - Sistema Completo de Cursos e Administração
-- Execute este código no Supabase SQL Editor na ordem apresentada

-- ========================================
-- PARTE 1: CRIAR TABELAS DO SISTEMA DE CURSOS
-- ========================================

-- 1. Criar tabela de cursos
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  modules JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  enrollment_required BOOLEAN DEFAULT true,
  max_enrollments INTEGER,
  course_image_url TEXT,
  difficulty_level VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_hours INTEGER DEFAULT 0,
  prerequisites TEXT[],
  learning_objectives TEXT[],
  course_tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar tabela de módulos dos cursos
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration VARCHAR(50),
  video_url TEXT,
  order_index INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  is_required BOOLEAN DEFAULT true,
  completion_criteria TEXT,
  module_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar tabela de materiais dos cursos
CREATE TABLE IF NOT EXISTS course_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_category VARCHAR(50) DEFAULT 'document',
  file_size BIGINT DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  is_active BOOLEAN DEFAULT true,
  is_required BOOLEAN DEFAULT true,
  download_limit INTEGER DEFAULT -1, -- -1 = ilimitado
  access_level VARCHAR(20) DEFAULT 'enrolled' CHECK (access_level IN ('public', 'enrolled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Criar tabela de progresso do usuário nos cursos
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

-- 5. Criar tabela de inscrições em cursos
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

-- 6. Criar tabela de certificados
CREATE TABLE IF NOT EXISTS course_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_url TEXT,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_valid BOOLEAN DEFAULT true,
  UNIQUE(user_id, course_id)
);

-- 7. Criar tabela para categorias de materiais
CREATE TABLE IF NOT EXISTS material_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- PARTE 2: ADICIONAR COLUNAS NECESSÁRIAS
-- ========================================

-- 8. Adicionar coluna is_admin na tabela professionals
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'professionals' 
        AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE professionals ADD COLUMN is_admin BOOLEAN DEFAULT false;
        RAISE NOTICE 'Coluna is_admin adicionada à tabela professionals';
    ELSE
        RAISE NOTICE 'Coluna is_admin já existe na tabela professionals';
    END IF;
END $$;

-- ========================================
-- PARTE 3: CRIAR ÍNDICES PARA PERFORMANCE
-- ========================================

-- 9. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_user_course_progress_user_id ON user_course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_course_id ON user_course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_certificates_user_id ON course_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_materials_module_id ON course_materials(module_id);

-- ========================================
-- PARTE 4: CONFIGURAR STORAGE
-- ========================================

-- 10. Configurar bucket de storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-materials', 
  'course-materials', 
  true, 
  104857600, -- 100MB
  ARRAY['application/pdf', 'video/mp4', 'video/webm', 'audio/mp3', 'audio/wav', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 104857600,
  allowed_mime_types = ARRAY['application/pdf', 'video/mp4', 'video/webm', 'audio/mp3', 'audio/wav', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown'];

-- ========================================
-- PARTE 5: CRIAR POLÍTICAS RLS
-- ========================================

-- 11. Habilitar RLS nas tabelas
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_categories ENABLE ROW LEVEL SECURITY;

-- 12. Políticas para courses
DROP POLICY IF EXISTS "courses_select_active" ON courses;
CREATE POLICY "courses_select_active" ON courses
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "courses_admin_all" ON courses;
CREATE POLICY "courses_admin_all" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM professionals p 
      WHERE p.id = auth.uid() 
      AND p.is_admin = true
    )
  );

-- 13. Políticas para course_modules
DROP POLICY IF EXISTS "course_modules_select_active" ON course_modules;
CREATE POLICY "course_modules_select_active" ON course_modules
  FOR SELECT USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM courses c 
      WHERE c.id = course_modules.course_id 
      AND c.is_active = true
    )
  );

DROP POLICY IF EXISTS "course_modules_admin_all" ON course_modules;
CREATE POLICY "course_modules_admin_all" ON course_modules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM professionals p 
      WHERE p.id = auth.uid() 
      AND p.is_admin = true
    )
  );

-- 14. Políticas para course_materials
DROP POLICY IF EXISTS "course_materials_select_active" ON course_materials;
CREATE POLICY "course_materials_select_active" ON course_materials
  FOR SELECT USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM course_modules cm 
      JOIN courses c ON cm.course_id = c.id
      WHERE cm.id = course_materials.module_id 
      AND cm.is_active = true 
      AND c.is_active = true
    )
  );

DROP POLICY IF EXISTS "course_materials_admin_all" ON course_materials;
CREATE POLICY "course_materials_admin_all" ON course_materials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM professionals p 
      WHERE p.id = auth.uid() 
      AND p.is_admin = true
    )
  );

-- 15. Políticas para user_course_progress
DROP POLICY IF EXISTS "user_course_progress_select_own" ON user_course_progress;
CREATE POLICY "user_course_progress_select_own" ON user_course_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_course_progress_insert_own" ON user_course_progress;
CREATE POLICY "user_course_progress_insert_own" ON user_course_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_course_progress_update_own" ON user_course_progress;
CREATE POLICY "user_course_progress_update_own" ON user_course_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- 16. Políticas para course_enrollments
DROP POLICY IF EXISTS "course_enrollments_select_own" ON course_enrollments;
CREATE POLICY "course_enrollments_select_own" ON course_enrollments
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "course_enrollments_insert_own" ON course_enrollments;
CREATE POLICY "course_enrollments_insert_own" ON course_enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "course_enrollments_update_own" ON course_enrollments;
CREATE POLICY "course_enrollments_update_own" ON course_enrollments
  FOR UPDATE USING (auth.uid() = user_id);

-- 17. Políticas para course_certificates
DROP POLICY IF EXISTS "course_certificates_select_own" ON course_certificates;
CREATE POLICY "course_certificates_select_own" ON course_certificates
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "course_certificates_insert_own" ON course_certificates;
CREATE POLICY "course_certificates_insert_own" ON course_certificates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 18. Políticas para storage
DROP POLICY IF EXISTS "course_materials_storage_insert" ON storage.objects;
CREATE POLICY "course_materials_storage_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'course-materials' AND
    EXISTS (
      SELECT 1 FROM professionals p 
      WHERE p.id = auth.uid() 
      AND p.is_admin = true
    )
  );

DROP POLICY IF EXISTS "course_materials_storage_select" ON storage.objects;
CREATE POLICY "course_materials_storage_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'course-materials');

-- ========================================
-- PARTE 6: INSERIR DADOS INICIAIS
-- ========================================

-- 19. Inserir categorias de materiais
INSERT INTO material_categories (name, description, icon, color) 
SELECT 'Documentos', 'PDFs, DOC, TXT e outros documentos', 'file-text', 'blue'
WHERE NOT EXISTS (SELECT 1 FROM material_categories WHERE name = 'Documentos');

INSERT INTO material_categories (name, description, icon, color) 
SELECT 'Vídeos', 'Vídeos educativos e tutoriais', 'video', 'red'
WHERE NOT EXISTS (SELECT 1 FROM material_categories WHERE name = 'Vídeos');

INSERT INTO material_categories (name, description, icon, color) 
SELECT 'Áudios', 'Podcasts e áudios explicativos', 'headphones', 'purple'
WHERE NOT EXISTS (SELECT 1 FROM material_categories WHERE name = 'Áudios');

INSERT INTO material_categories (name, description, icon, color) 
SELECT 'Imagens', 'Infográficos e imagens explicativas', 'image', 'green'
WHERE NOT EXISTS (SELECT 1 FROM material_categories WHERE name = 'Imagens');

INSERT INTO material_categories (name, description, icon, color) 
SELECT 'Templates', 'Modelos e templates prontos', 'layout', 'orange'
WHERE NOT EXISTS (SELECT 1 FROM material_categories WHERE name = 'Templates');

INSERT INTO material_categories (name, description, icon, color) 
SELECT 'Checklists', 'Listas de verificação e guias', 'check-square', 'emerald'
WHERE NOT EXISTS (SELECT 1 FROM material_categories WHERE name = 'Checklists');

-- 20. Criar curso inicial se não existir
INSERT INTO courses (title, description, enrollment_required, difficulty_level, estimated_hours, learning_objectives, course_tags)
SELECT 
  'Treinamento Inicial - HerbaLead',
  'Curso completo para dominar a plataforma HerbaLead e transformar seu negócio em uma máquina de resultados',
  true,
  'beginner',
  2,
  ARRAY[
    'Dominar o cadastro na plataforma',
    'Criar links personalizados',
    'Construir quizzes eficazes',
    'Implementar estratégias de captura de leads'
  ],
  ARRAY['iniciante', 'captura-leads', 'automação', 'vendas']
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Treinamento Inicial - HerbaLead');

-- ========================================
-- PARTE 7: CRIAR FUNÇÕES DE GERENCIAMENTO
-- ========================================

-- 21. Criar função para tornar usuário administrador
CREATE OR REPLACE FUNCTION make_user_admin(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
    user_id UUID;
    result TEXT;
BEGIN
    -- Buscar ID do usuário pelo email
    SELECT id INTO user_id 
    FROM professionals 
    WHERE email = user_email;
    
    IF user_id IS NULL THEN
        RETURN 'Usuário não encontrado com o email: ' || user_email;
    END IF;
    
    -- Tornar usuário administrador
    UPDATE professionals 
    SET is_admin = true, is_active = true
    WHERE id = user_id;
    
    result := 'Usuário ' || user_email || ' foi promovido a administrador com sucesso!';
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 22. Criar função para listar administradores
CREATE OR REPLACE FUNCTION list_admins()
RETURNS TABLE(
    id UUID,
    name VARCHAR(255),
    email VARCHAR(255),
    is_active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.name, p.email, p.is_active, p.created_at
    FROM professionals p
    WHERE p.is_admin = true
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- PARTE 8: VERIFICAÇÃO FINAL
-- ========================================

-- 23. Verificar estrutura criada
SELECT 'Sistema completo de cursos e administração criado com sucesso!' as status;

-- 24. Mostrar tabelas criadas
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('courses', 'course_modules', 'course_materials', 'user_course_progress', 'course_enrollments', 'course_certificates', 'material_categories')
ORDER BY table_name, ordinal_position;

-- 25. Instruções de uso
/*
INSTRUÇÕES PARA USAR O SISTEMA:

1. Para tornar um usuário administrador:
   SELECT make_user_admin('email@exemplo.com');

2. Para listar administradores:
   SELECT * FROM list_admins();

3. Para ver todos os usuários:
   SELECT id, name, email, is_active, is_admin, created_at 
   FROM professionals 
   ORDER BY created_at DESC;

4. Para acessar a área administrativa:
   - URL: /admin/login
   - Login com email/senha de administrador
   - Dashboard completo em /admin

5. Para usuários acessarem cursos:
   - URL: /course
   - Sistema de inscrição automática
   - Download de materiais em HTML
*/
