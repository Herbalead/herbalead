-- Script para limpar arquivos órfãos no Supabase Storage
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar arquivos no Supabase Storage
SELECT 
    name,
    bucket_id,
    created_at,
    metadata->>'size' as file_size
FROM storage.objects 
WHERE bucket_id = 'herbalead-public'
  AND (name LIKE 'course-pdfs/%' OR name LIKE 'course-videos/%')
ORDER BY created_at DESC;

-- 2. Verificar URLs de arquivos que estão sendo usados nos módulos
SELECT 
    id,
    title,
    video_url,
    pdf_files,
    array_length(pdf_files, 1) as quantidade_pdfs
FROM course_modules 
WHERE video_url IS NOT NULL OR pdf_files IS NOT NULL
ORDER BY order_index;

-- 3. Identificar arquivos órfãos (não referenciados em nenhum módulo)
-- Este script mostra arquivos que existem no storage mas não estão sendo usados

-- Para PDFs órfãos:
WITH used_pdf_files AS (
  SELECT unnest(pdf_files) as pdf_url
  FROM course_modules 
  WHERE pdf_files IS NOT NULL
),
pdf_file_names AS (
  SELECT split_part(pdf_url, '/', array_length(string_to_array(pdf_url, '/'), 1)) as file_name
  FROM used_pdf_files
)
SELECT 
    s.name as storage_file,
    s.created_at,
    s.metadata->>'size' as file_size,
    'ORFÃO - PDF não usado' as status
FROM storage.objects s
LEFT JOIN pdf_file_names p ON s.name = 'course-pdfs/' || p.file_name
WHERE s.bucket_id = 'herbalead-public'
  AND s.name LIKE 'course-pdfs/%'
  AND p.file_name IS NULL;

-- Para vídeos órfãos:
WITH used_video_files AS (
  SELECT video_url
  FROM course_modules 
  WHERE video_url IS NOT NULL 
    AND video_url LIKE '%supabase%'
),
video_file_names AS (
  SELECT split_part(video_url, '/', array_length(string_to_array(video_url, '/'), 1)) as file_name
  FROM used_video_files
)
SELECT 
    s.name as storage_file,
    s.created_at,
    s.metadata->>'size' as file_size,
    'ORFÃO - Vídeo não usado' as status
FROM storage.objects s
LEFT JOIN video_file_names v ON s.name = 'course-videos/' || v.file_name
WHERE s.bucket_id = 'herbalead-public'
  AND s.name LIKE 'course-videos/%'
  AND v.file_name IS NULL;

-- 4. ATENÇÃO: Para deletar arquivos órfãos, você precisa usar a API do Supabase Storage
-- Não é possível deletar arquivos diretamente via SQL
-- Use o dashboard do Supabase Storage ou a API para deletar os arquivos identificados acima
