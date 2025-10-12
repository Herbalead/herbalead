-- Script para corrigir módulos existentes que têm PDFs em pdf_materials mas não em pdf_files
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar módulos que têm PDFs em pdf_materials mas não em pdf_files
SELECT 
    id,
    title,
    pdf_materials,
    pdf_files,
    CASE 
        WHEN pdf_materials IS NOT NULL AND pdf_materials != '' THEN 'Tem pdf_materials'
        ELSE 'Sem pdf_materials'
    END as status_materials,
    CASE 
        WHEN pdf_files IS NOT NULL AND pdf_files != '{}' THEN 'Tem pdf_files'
        ELSE 'Sem pdf_files'
    END as status_files
FROM course_modules 
WHERE pdf_materials IS NOT NULL AND pdf_materials != ''
ORDER BY created_at DESC;

-- 2. Atualizar módulos que têm PDFs em pdf_materials mas não em pdf_files
-- Este UPDATE extrai URLs do campo pdf_materials e coloca no pdf_files
UPDATE course_modules 
SET pdf_files = (
    SELECT array_agg(
        CASE 
            WHEN line ~ 'https?://[^\s]+' THEN 
                regexp_replace(line, '.*(https?://[^\s]+).*', '\1')
            ELSE NULL
        END
    )
    FROM unnest(string_to_array(pdf_materials, E'\n')) AS line
    WHERE line ~ 'https?://[^\s]+'
)
WHERE pdf_materials IS NOT NULL 
  AND pdf_materials != '' 
  AND (pdf_files IS NULL OR pdf_files = '{}');

-- 3. Verificar resultado da atualização
SELECT 
    id,
    title,
    pdf_materials,
    pdf_files,
    array_length(pdf_files, 1) as quantidade_pdfs
FROM course_modules 
WHERE pdf_files IS NOT NULL AND pdf_files != '{}'
ORDER BY created_at DESC;

-- 4. Verificar se ainda há módulos com problema
SELECT 
    'Módulos com pdf_materials mas sem pdf_files' as problema,
    COUNT(*) as quantidade
FROM course_modules 
WHERE pdf_materials IS NOT NULL 
  AND pdf_materials != '' 
  AND (pdf_files IS NULL OR pdf_files = '{}');
