-- Script para adicionar o PDF que foi enviado mas não salvo
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar módulos atuais e seus IDs
SELECT 
    id,
    title,
    order_index,
    pdf_files,
    array_length(pdf_files, 1) as quantidade_pdfs
FROM course_modules 
WHERE title LIKE '%Como usar%' OR title LIKE '%Como criar%'
ORDER BY order_index;

-- 2. Adicionar o novo PDF ao módulo "Como usar o Herbalead" (order_index = 1)
UPDATE course_modules 
SET pdf_files = array_append(
    COALESCE(pdf_files, ARRAY[]::text[]), 
    'https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/1760290474940-VSL_BELLA_ROTEIRO_COMPLETO.pdf'
)
WHERE title = 'Como usar o Herbalead';

-- 3. Verificar resultado
SELECT 
    id,
    title,
    order_index,
    pdf_files,
    array_length(pdf_files, 1) as quantidade_pdfs
FROM course_modules 
WHERE title = 'Como usar o Herbalead';

-- 4. Verificar todos os módulos atualizados
SELECT 
    id,
    title,
    order_index,
    pdf_files,
    array_length(pdf_files, 1) as quantidade_pdfs
FROM course_modules 
WHERE title LIKE '%Como usar%' OR title LIKE '%Como criar%'
ORDER BY order_index;
