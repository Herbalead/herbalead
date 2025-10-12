-- Script para criar bucket com autenticação
-- Execute este código no Supabase SQL Editor

-- 1. Criar bucket privado que funciona com autenticação
INSERT INTO storage.buckets (id, name, public)
VALUES ('herbalead-private', 'herbalead-private', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Verificar se o bucket foi criado
SELECT id, name, public, created_at 
FROM storage.buckets 
WHERE id = 'herbalead-private';

-- 3. Verificar buckets existentes
SELECT id, name, public, created_at 
FROM storage.buckets 
ORDER BY created_at DESC;
