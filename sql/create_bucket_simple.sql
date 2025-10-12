-- Script SIMPLES para criar bucket course-materials
-- Execute este código no Supabase SQL Editor

-- 1. Criar o bucket course-materials (sem políticas RLS)
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-materials', 'course-materials', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Verificar se o bucket foi criado
SELECT id, name, public, created_at 
FROM storage.buckets 
WHERE id = 'course-materials';
