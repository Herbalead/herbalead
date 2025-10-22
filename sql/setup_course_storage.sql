-- Script para configurar Supabase Storage para PDFs de cursos
-- Execute este script no SQL Editor do Supabase

-- 1. Criar bucket para materiais de curso
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-materials', 'course-materials', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Verificar se o bucket foi criado
SELECT * FROM storage.buckets WHERE id = 'course-materials';

-- 3. Criar políticas RLS para o bucket (permitir acesso público)
CREATE POLICY "course_materials_public_read" ON storage.objects
FOR SELECT USING (bucket_id = 'course-materials');

CREATE POLICY "course_materials_admin_write" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'course-materials' AND
  EXISTS (
    SELECT 1 FROM professionals p 
    WHERE p.id = auth.uid() 
    AND p.is_admin = true
  )
);

CREATE POLICY "course_materials_admin_update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'course-materials' AND
  EXISTS (
    SELECT 1 FROM professionals p 
    WHERE p.id = auth.uid() 
    AND p.is_admin = true
  )
);

CREATE POLICY "course_materials_admin_delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'course-materials' AND
  EXISTS (
    SELECT 1 FROM professionals p 
    WHERE p.id = auth.uid() 
    AND p.is_admin = true
  )
);

-- 4. Verificar políticas criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

SELECT 'Storage configurado com sucesso para materiais de curso!' as status;
