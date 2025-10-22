-- Script para investigar módulos perdidos
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar todos os módulos existentes
SELECT 
  id,
  title,
  description,
  video_url,
  pdf_files,
  pdf_materials,
  order_index,
  is_active,
  created_at,
  updated_at,
  course_id
FROM course_modules 
ORDER BY created_at DESC;

-- 2. Verificar se existe módulo sobre quiz personalizado
SELECT 
  id,
  title,
  description,
  pdf_files,
  pdf_materials
FROM course_modules 
WHERE title ILIKE '%quiz%' 
   OR title ILIKE '%personalizado%'
   OR description ILIKE '%quiz%'
   OR description ILIKE '%personalizado%';

-- 3. Verificar módulos do curso "Como Usar as Ferramentas"
SELECT 
  id,
  title,
  description,
  pdf_files,
  pdf_materials,
  order_index
FROM course_modules 
WHERE course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1)
ORDER BY order_index;

-- 4. Verificar se há módulos deletados recentemente (últimas 24h)
SELECT 
  'Módulos criados nas últimas 24h' as tipo,
  COUNT(*) as quantidade
FROM course_modules 
WHERE created_at > NOW() - INTERVAL '24 hours'

UNION ALL

SELECT 
  'Módulos atualizados nas últimas 24h' as tipo,
  COUNT(*) as quantidade
FROM course_modules 
WHERE updated_at > NOW() - INTERVAL '24 hours';

-- 5. Verificar se há problemas com PDFs
SELECT 
  id,
  title,
  pdf_files,
  pdf_materials,
  CASE 
    WHEN pdf_files IS NULL THEN 'Sem PDFs'
    WHEN pdf_files = '{}' THEN 'Array vazio'
    WHEN array_length(pdf_files, 1) = 0 THEN 'Array sem elementos'
    ELSE 'Com PDFs'
  END as status_pdf
FROM course_modules 
WHERE course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1);

SELECT 'Investigação concluída!' as status;
