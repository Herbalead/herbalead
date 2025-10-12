-- Script para criar bucket público sem restrições
-- Execute este código no Supabase SQL Editor

-- 1. Criar bucket público sem restrições de tipo de arquivo
INSERT INTO storage.buckets (id, name, public)
VALUES ('herbalead-public', 'herbalead-public', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Verificar se o bucket foi criado
SELECT id, name, public, file_size_limit, allowed_mime_types, created_at 
FROM storage.buckets 
WHERE id = 'herbalead-public';

-- 3. Verificar buckets existentes
SELECT id, name, public, created_at 
FROM storage.buckets 
ORDER BY created_at DESC;
