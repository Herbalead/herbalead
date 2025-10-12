-- Script para verificar arquivos no Supabase Storage
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar arquivos no bucket herbalead-public
SELECT 
    name,
    bucket_id,
    owner,
    created_at,
    updated_at,
    last_accessed_at,
    metadata
FROM storage.objects 
WHERE bucket_id = 'herbalead-public'
ORDER BY created_at DESC;

-- 2. Verificar especificamente arquivos PDF
SELECT 
    name,
    bucket_id,
    created_at,
    metadata->>'size' as file_size,
    metadata->>'mimetype' as mime_type
FROM storage.objects 
WHERE bucket_id = 'herbalead-public'
  AND name LIKE '%.pdf'
ORDER BY created_at DESC;

-- 3. Verificar arquivos na pasta course-pdfs
SELECT 
    name,
    bucket_id,
    created_at,
    metadata->>'size' as file_size,
    metadata->>'mimetype' as mime_type
FROM storage.objects 
WHERE bucket_id = 'herbalead-public'
  AND name LIKE 'course-pdfs/%'
ORDER BY created_at DESC;

-- 4. Verificar URLs dos módulos
SELECT 
    id,
    title,
    pdf_files,
    array_length(pdf_files, 1) as quantidade_pdfs
FROM course_modules 
WHERE pdf_files IS NOT NULL AND pdf_files != '{}'
ORDER BY created_at DESC;
