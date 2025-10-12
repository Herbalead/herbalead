-- Script SIMPLES para corrigir bucket sem alterar RLS
-- Execute este código no Supabase SQL Editor

-- 1. Verificar bucket atual
SELECT id, name, public, file_size_limit, allowed_mime_types, created_at 
FROM storage.buckets 
WHERE id = 'course-materials';

-- 2. Atualizar bucket para ser mais permissivo (se possível)
UPDATE storage.buckets 
SET 
  public = true,
  file_size_limit = 104857600, -- 100MB
  allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'application/pdf']
WHERE id = 'course-materials';

-- 3. Verificar se o bucket foi atualizado
SELECT id, name, public, file_size_limit, allowed_mime_types, created_at 
FROM storage.buckets 
WHERE id = 'course-materials';

-- 4. Verificar políticas RLS existentes (apenas visualização)
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
