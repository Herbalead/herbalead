-- Script SIMPLIFICADO para corrigir upload de PDFs
-- Execute este código no Supabase SQL Editor

-- 1. Adicionar coluna pdf_files na tabela course_modules
ALTER TABLE course_modules 
ADD COLUMN IF NOT EXISTS pdf_files TEXT[] DEFAULT '{}';

-- 2. Adicionar coluna pdf_materials na tabela course_modules
ALTER TABLE course_modules 
ADD COLUMN IF NOT EXISTS pdf_materials TEXT;

-- 3. Verificar se o bucket course-materials existe (sem políticas RLS)
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-materials', 'course-materials', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Verificar estrutura atual da tabela course_modules
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'course_modules' 
ORDER BY ordinal_position;

-- 5. Verificar se o bucket foi criado
SELECT id, name, public, created_at 
FROM storage.buckets 
WHERE id = 'course-materials';
