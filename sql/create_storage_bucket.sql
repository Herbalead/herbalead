-- Script para criar o bucket course-materials no Supabase Storage
-- Execute este código no Supabase SQL Editor

-- 1. Criar o bucket course-materials
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-materials',
  'course-materials', 
  true,
  104857600, -- 100MB em bytes
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Verificar se o bucket foi criado
SELECT id, name, public, file_size_limit, allowed_mime_types, created_at 
FROM storage.buckets 
WHERE id = 'course-materials';

-- 3. Criar políticas RLS para o bucket (opcional - bucket público)
-- Primeiro remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;

-- Política para permitir leitura pública
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'course-materials');

-- Política para permitir upload para usuários autenticados
CREATE POLICY "Authenticated Upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'course-materials' 
  AND auth.role() = 'authenticated'
);

-- Política para permitir atualização para usuários autenticados
CREATE POLICY "Authenticated Update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'course-materials' 
  AND auth.role() = 'authenticated'
);

-- Política para permitir exclusão para usuários autenticados
CREATE POLICY "Authenticated Delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'course-materials' 
  AND auth.role() = 'authenticated'
);
