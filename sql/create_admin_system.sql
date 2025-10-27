-- Sistema de Administração de Cursos - Tabelas
-- Execute este script no Supabase para criar as tabelas administrativas

-- 1. Tabela de módulos (se não existir)
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

-- 2. Adicionar campo is_admin na tabela professionals (se não existir)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'professionals' AND column_name = 'is_admin') THEN
        ALTER TABLE professionals ADD COLUMN is_admin BOOLEAN DEFAULT false;
    END IF;
END $$;

-- 3. Criar bucket para armazenar materiais do curso
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-materials', 'course-materials', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Políticas RLS para course_modules
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "course_modules_select_all" ON course_modules
  FOR SELECT USING (true);

CREATE POLICY "course_modules_admin_all" ON course_modules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM professionals p 
      WHERE p.id = auth.uid() 
      AND p.is_admin = true
    )
  );

-- 5. Políticas RLS para course_materials (atualizar)
DROP POLICY IF EXISTS "Active users can view course materials" ON course_materials;

CREATE POLICY "course_materials_select_active" ON course_materials
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM professionals p 
      WHERE p.id = auth.uid() 
      AND p.is_active = true
    )
  );

CREATE POLICY "course_materials_admin_all" ON course_materials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM professionals p 
      WHERE p.id = auth.uid() 
      AND p.is_admin = true
    )
  );

-- 6. Políticas RLS para courses (atualizar)
DROP POLICY IF EXISTS "Courses are viewable by everyone" ON courses;

CREATE POLICY "courses_select_active" ON courses
  FOR SELECT USING (is_active = true);

CREATE POLICY "courses_admin_all" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM professionals p 
      WHERE p.id = auth.uid() 
      AND p.is_admin = true
    )
  );

-- 7. Políticas para storage (materiais do curso)
CREATE POLICY "course_materials_storage_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'course-materials');

CREATE POLICY "course_materials_storage_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'course-materials' AND
    EXISTS (
      SELECT 1 FROM professionals p 
      WHERE p.id = auth.uid() 
      AND p.is_admin = true
    )
  );

CREATE POLICY "course_materials_storage_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'course-materials' AND
    EXISTS (
      SELECT 1 FROM professionals p 
      WHERE p.id = auth.uid() 
      AND p.is_admin = true
    )
  );

CREATE POLICY "course_materials_storage_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'course-materials' AND
    EXISTS (
      SELECT 1 FROM professionals p 
      WHERE p.id = auth.uid() 
      AND p.is_admin = true
    )
  );

-- 8. Índices para performance
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_order ON course_modules(order_index);
CREATE INDEX IF NOT EXISTS idx_professionals_is_admin ON professionals(is_admin);

-- 9. Triggers para updated_at
CREATE TRIGGER update_course_modules_updated_at BEFORE UPDATE ON course_modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. Inserir módulos para o curso existente
INSERT INTO course_modules (course_id, title, description, duration, order_index) VALUES
  ('herbalead-master-course', 'Introdução à Plataforma', 'Aprenda os primeiros passos no HerbaLead', '15 min', 1),
  ('herbalead-master-course', 'Criação de Links', 'Como criar e personalizar seus materiais', '20 min', 2),
  ('herbalead-master-course', 'Quiz Builder', 'Criando avaliações interativas', '25 min', 3),
  ('herbalead-master-course', 'Estratégias de Vendas', 'Técnicas de captura e conversão', '30 min', 4),
  ('herbalead-master-course', 'Recursos Avançados', 'Integrações e otimizações', '35 min', 5),
  ('herbalead-master-course', 'Certificação', 'Conclusão e próximos passos', '5 min', 6)
ON CONFLICT DO NOTHING;

-- 11. Tornar o primeiro usuário admin (substitua pelo seu email)
-- UPDATE professionals SET is_admin = true WHERE email = 'seu-email@exemplo.com';

-- 12. Verificar estrutura criada
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('courses', 'course_modules', 'course_materials', 'professionals')
ORDER BY table_name;



























