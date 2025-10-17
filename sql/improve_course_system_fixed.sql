-- Script corrigido para melhorar sistema de cursos e módulos
-- Execute este código no Supabase SQL Editor

-- 1. Atualizar tabela course_materials para suportar mais tipos de arquivo
ALTER TABLE course_materials 
ADD COLUMN IF NOT EXISTS file_category VARCHAR(50) DEFAULT 'document',
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS duration_seconds INTEGER;

-- 2. Atualizar constraint para aceitar mais tipos de arquivo
ALTER TABLE course_materials 
DROP CONSTRAINT IF EXISTS course_materials_file_type_check;

ALTER TABLE course_materials 
ADD CONSTRAINT course_materials_file_type_check 
CHECK (file_type IN ('pdf', 'video', 'audio', 'image', 'document', 'template', 'checklist'));

-- 3. Criar tabela para categorias de materiais
CREATE TABLE IF NOT EXISTS material_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Inserir categorias padrão (sem ON CONFLICT)
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

-- 5. Atualizar bucket de storage para aceitar mais tipos
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

-- 6. Atualizar políticas de storage para novos tipos
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

-- 7. Verificar estrutura atualizada
SELECT 'Sistema atualizado com sucesso!' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('courses', 'course_modules', 'course_materials', 'material_categories') 
ORDER BY table_name;












