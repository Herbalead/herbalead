-- Script FINAL para corrigir políticas RLS
-- Execute este código no Supabase SQL Editor

-- 1. Verificar bucket atual
SELECT id, name, public, created_at 
FROM storage.buckets 
WHERE id = 'course-materials';

-- 2. Desabilitar RLS temporariamente para testar
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- 3. Recriar políticas RLS corretas
-- Primeiro remover todas as políticas existentes
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON storage.objects;
DROP POLICY IF EXISTS "Enable read access for all users" ON storage.objects;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON storage.objects;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON storage.objects;

-- 4. Criar políticas mais permissivas
-- Política para leitura pública de todos os arquivos
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (true);

-- Política para upload público (sem autenticação)
CREATE POLICY "Public upload access" ON storage.objects
FOR INSERT WITH CHECK (true);

-- Política para atualização pública
CREATE POLICY "Public update access" ON storage.objects
FOR UPDATE USING (true);

-- Política para exclusão pública
CREATE POLICY "Public delete access" ON storage.objects
FOR DELETE USING (true);

-- 5. Reabilitar RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 6. Verificar políticas criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
