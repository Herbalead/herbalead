-- HerbaLead Master Course - Tabelas do Sistema de Curso (CORRIGIDO)
-- Execute este script no Supabase para criar as tabelas necessárias

-- 1. Tabela de cursos
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  modules JSONB DEFAULT '[]'::jsonb, -- Array de módulos com suas configurações
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de progresso do usuário no curso
CREATE TABLE IF NOT EXISTS user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_id VARCHAR(50) NOT NULL,
  lesson_id VARCHAR(50),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id, module_id, lesson_id)
);

-- 3. Tabela de materiais do curso
CREATE TABLE IF NOT EXISTS course_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_id VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('pdf', 'video', 'template', 'checklist')),
  file_size INTEGER, -- em bytes
  download_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de certificados
CREATE TABLE IF NOT EXISTS course_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_code VARCHAR(50) UNIQUE NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_valid BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela de analytics do curso
CREATE TABLE IF NOT EXISTS course_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL CHECK (action IN ('started', 'completed_module', 'downloaded_material', 'watched_video', 'completed_course')),
  module_id VARCHAR(50),
  material_id UUID REFERENCES course_materials(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_course_progress_user_id ON user_course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_course_id ON user_course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_course_materials_course_id ON course_materials(course_id);
CREATE INDEX IF NOT EXISTS idx_course_certificates_user_id ON course_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_course_analytics_user_id ON course_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_course_analytics_course_id ON course_analytics(course_id);

-- RLS (Row Level Security) Policies
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_analytics ENABLE ROW LEVEL SECURITY;

-- Políticas para courses (todos podem ler cursos ativos)
CREATE POLICY "Courses are viewable by everyone" ON courses
  FOR SELECT USING (is_active = true);

-- Políticas para user_course_progress (usuário só vê seu próprio progresso)
CREATE POLICY "Users can view their own course progress" ON user_course_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own course progress" ON user_course_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own course progress" ON user_course_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para course_materials (usuários ativos podem ver materiais)
CREATE POLICY "Active users can view course materials" ON course_materials
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM professionals p 
      WHERE p.id = auth.uid() 
      AND p.is_active = true
    )
  );

-- Políticas para course_certificates (usuário só vê seus próprios certificados)
CREATE POLICY "Users can view their own certificates" ON course_certificates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own certificates" ON course_certificates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para course_analytics (usuário só vê seus próprios analytics)
CREATE POLICY "Users can view their own analytics" ON course_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics" ON course_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Inserir o curso HerbaLead Master
INSERT INTO courses (id, title, description, modules) VALUES (
  'herbalead-master-course',
  'HerbaLead Master Course',
  'Curso completo para dominar a plataforma HerbaLead e transformar seu negócio em uma máquina de resultados',
  '[
    {
      "id": "1",
      "title": "Introdução à Plataforma",
      "description": "Aprenda os primeiros passos no HerbaLead",
      "duration": "15 min",
      "videoUrl": "https://youtube.com/watch?v=exemplo1",
      "materials": ["01-guia-cadastro.md"]
    },
    {
      "id": "2", 
      "title": "Criação de Links",
      "description": "Como criar e personalizar seus materiais",
      "duration": "20 min",
      "videoUrl": "https://youtube.com/watch?v=exemplo2",
      "materials": ["02-tutorial-links.md"]
    },
    {
      "id": "3",
      "title": "Quiz Builder", 
      "description": "Criando avaliações interativas",
      "duration": "25 min",
      "videoUrl": "https://youtube.com/watch?v=exemplo3",
      "materials": ["03-guia-quiz-builder.md"]
    },
    {
      "id": "4",
      "title": "Estratégias de Vendas",
      "description": "Técnicas de captura e conversão", 
      "duration": "30 min",
      "videoUrl": "https://youtube.com/watch?v=exemplo4",
      "materials": ["04-manual-vendas.md"]
    },
    {
      "id": "5",
      "title": "Recursos Avançados",
      "description": "Integrações e otimizações",
      "duration": "35 min", 
      "videoUrl": "https://youtube.com/watch?v=exemplo5",
      "materials": ["05-guia-avancado.md"]
    },
    {
      "id": "6",
      "title": "Certificação",
      "description": "Conclusão e próximos passos",
      "duration": "5 min",
      "videoUrl": "https://youtube.com/watch?v=exemplo6", 
      "materials": ["06-certificado-template.md"]
    }
  ]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Inserir materiais do curso
INSERT INTO course_materials (course_id, module_id, title, file_path, file_type) VALUES
  ('herbalead-master-course', '1', 'Guia de Cadastro', '/course/materials/01-guia-cadastro.md', 'pdf'),
  ('herbalead-master-course', '2', 'Tutorial de Links', '/course/materials/02-tutorial-links.md', 'pdf'),
  ('herbalead-master-course', '3', 'Guia Quiz Builder', '/course/materials/03-guia-quiz-builder.md', 'pdf'),
  ('herbalead-master-course', '4', 'Manual de Vendas', '/course/materials/04-manual-vendas.md', 'pdf'),
  ('herbalead-master-course', '5', 'Guia Avançado', '/course/materials/05-guia-avancado.md', 'pdf'),
  ('herbalead-master-course', '6', 'Template Certificado', '/course/materials/06-certificado-template.md', 'pdf');

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_course_progress_updated_at BEFORE UPDATE ON user_course_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_materials_updated_at BEFORE UPDATE ON course_materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para gerar código único de certificado
CREATE OR REPLACE FUNCTION generate_certificate_code()
RETURNS TEXT AS $$
BEGIN
    RETURN 'HLM-' || TO_CHAR(NOW(), 'YYYY') || '-' || 
           LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Comentários nas tabelas
COMMENT ON TABLE courses IS 'Tabela de cursos disponíveis na plataforma';
COMMENT ON TABLE user_course_progress IS 'Progresso dos usuários nos cursos';
COMMENT ON TABLE course_materials IS 'Materiais disponíveis para download';
COMMENT ON TABLE course_certificates IS 'Certificados emitidos para usuários';
COMMENT ON TABLE course_analytics IS 'Analytics de engajamento dos usuários';

-- Verificar se as tabelas foram criadas
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('courses', 'user_course_progress', 'course_materials', 'course_certificates', 'course_analytics')
ORDER BY table_name;
