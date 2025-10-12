-- Script para desabilitar RLS temporariamente no bucket herbalead-media
-- Execute este código no Supabase SQL Editor

-- 1. Verificar bucket atual
SELECT id, name, public, created_at 
FROM storage.buckets 
WHERE id = 'herbalead-media';

-- 2. Tentar desabilitar RLS para objetos do bucket herbalead-media
-- (Isso pode não funcionar dependendo das permissões)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- 3. Se não funcionar, vamos tentar criar políticas mais permissivas
-- Primeiro, vamos ver as políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- 4. Tentar remover todas as políticas existentes
DO $$
BEGIN
    -- Tentar remover políticas existentes
    DROP POLICY IF EXISTS "Public read access" ON storage.objects;
    DROP POLICY IF EXISTS "Public upload access" ON storage.objects;
    DROP POLICY IF EXISTS "Public update access" ON storage.objects;
    DROP POLICY IF EXISTS "Public delete access" ON storage.objects;
    DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON storage.objects;
    DROP POLICY IF EXISTS "Enable read access for all users" ON storage.objects;
    DROP POLICY IF EXISTS "Enable update for users based on user_id" ON storage.objects;
    DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON storage.objects;
EXCEPTION
    WHEN insufficient_privilege THEN
        RAISE NOTICE 'Sem permissão para remover políticas RLS';
END $$;

-- 5. Verificar se RLS foi desabilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';
