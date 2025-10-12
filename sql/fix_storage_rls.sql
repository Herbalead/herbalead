-- Script para corrigir políticas RLS do bucket course-materials
-- Execute este código no Supabase SQL Editor

-- 1. Verificar se o bucket existe
SELECT id, name, public, created_at 
FROM storage.buckets 
WHERE id = 'course-materials';

-- 2. Remover políticas RLS existentes (se houver)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;

-- 3. Criar políticas RLS para permitir acesso público e upload autenticado
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

-- 4. Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
