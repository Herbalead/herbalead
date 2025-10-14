-- Script ULTRA SIMPLES para criar sistema administrativo
-- Execute este código no Supabase SQL Editor

-- PASSO 1: Criar tabela courses
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  modules JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASSO 2: Criar tabela course_modules
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration VARCHAR(50),
  video_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASSO 3: Criar tabela course_materials
CREATE TABLE IF NOT EXISTS course_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INTEGER,
  download_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASSO 4: Adicionar campo is_admin
ALTER TABLE professionals ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- PASSO 5: Criar bucket para materiais
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-materials', 'course-materials', true)
ON CONFLICT (id) DO NOTHING;

-- PASSO 6: Habilitar RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;

-- PASSO 7: Criar políticas (sem IF NOT EXISTS)
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

DROP POLICY IF EXISTS "course_modules_select_all" ON course_modules;
CREATE POLICY "course_modules_select_all" ON course_modules
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "course_modules_admin_all" ON course_modules;
CREATE POLICY "course_modules_admin_all" ON course_modules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM professionals p 
      WHERE p.id = auth.uid() 
      AND p.is_admin = true
    )
  );

DROP POLICY IF EXISTS "course_materials_select_active" ON course_materials;
CREATE POLICY "course_materials_select_active" ON course_materials
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM professionals p 
      WHERE p.id = auth.uid() 
      AND p.is_active = true
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

-- PASSO 8: Criar índices
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_order ON course_modules(order_index);
CREATE INDEX IF NOT EXISTS idx_professionals_is_admin ON professionals(is_admin);

-- PASSO 9: Inserir curso inicial (com UUID válido)
INSERT INTO courses (title, description, modules) VALUES (
  'HerbaLead Master Course',
  'Curso completo para dominar a plataforma HerbaLead e transformar seu negócio em uma máquina de resultados',
  '[]'::jsonb
);

-- PASSO 10: Verificar se tudo foi criado
SELECT 'Tabelas criadas com sucesso!' as status;





