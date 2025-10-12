-- Script para limpar buckets desnecessários
-- Execute este código no Supabase SQL Editor

-- 1. Verificar buckets existentes
SELECT id, name, public, created_at 
FROM storage.buckets 
ORDER BY created_at DESC;

-- 2. Remover buckets desnecessários (manter apenas herbalead-public)
-- ATENÇÃO: Isso vai deletar todos os arquivos dentro dos buckets!

-- Remover course-materials (não usado)
DELETE FROM storage.buckets WHERE id = 'course-materials';

-- Remover herbalead-media (não usado)
DELETE FROM storage.buckets WHERE id = 'herbalead-media';

-- Remover herbalead-private (não usado)
DELETE FROM storage.buckets WHERE id = 'herbalead-private';

-- 3. Verificar buckets restantes
SELECT id, name, public, created_at 
FROM storage.buckets 
ORDER BY created_at DESC;

-- 4. Verificar se herbalead-public ainda existe
SELECT id, name, public, created_at 
FROM storage.buckets 
WHERE id = 'herbalead-public';
