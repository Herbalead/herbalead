-- Script para adicionar o PDF que foi enviado mas não salvo
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar módulos atuais
SELECT 
    id,
    title,
    pdf_files,
    pdf_materials
FROM course_modules 
WHERE title LIKE '%Como usar%' OR title LIKE '%Como criar%'
ORDER BY order_index;

-- 2. Adicionar o novo PDF ao módulo correto
-- Substitua 'MODULE_ID' pelo ID do módulo que você estava editando
UPDATE course_modules 
SET pdf_files = array_append(
    COALESCE(pdf_files, ARRAY[]::text[]), 
    'https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/1760290474940-VSL_BELLA_ROTEIRO_COMPLETO.pdf'
)
WHERE id = 'MODULE_ID'; -- Substitua pelo ID correto

-- 3. Verificar resultado
SELECT 
    id,
    title,
    pdf_files,
    array_length(pdf_files, 1) as quantidade_pdfs
FROM course_modules 
WHERE id = 'MODULE_ID'; -- Substitua pelo ID correto
