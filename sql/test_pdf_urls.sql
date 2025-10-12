-- Script simples para testar URLs de PDFs
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se os arquivos existem no storage
SELECT 
    name,
    bucket_id,
    created_at,
    metadata->>'size' as file_size
FROM storage.objects 
WHERE bucket_id = 'herbalead-public'
  AND name IN (
    'course-pdfs/1760287870763-COMO-CRIAR-SEU-LINK-HERBALEAD.pdf',
    'course-pdfs/1760287544729-COMO-CRIAR-QUIZ-QUE-FUNCIONA-HERBALEAD.pdf',
    'course-pdfs/1760288300878-COMO-CRIAR-SEU-LINK-HERBALEAD.pdf'
  );

-- 2. Verificar todos os arquivos na pasta course-pdfs
SELECT 
    name,
    created_at,
    metadata->>'size' as file_size
FROM storage.objects 
WHERE bucket_id = 'herbalead-public'
  AND name LIKE 'course-pdfs/%'
ORDER BY created_at DESC;

-- 3. Atualizar módulos com URLs corretas
UPDATE course_modules 
SET pdf_files = ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/1760287870763-COMO-CRIAR-SEU-LINK-HERBALEAD.pdf']
WHERE title = 'Como criar links';

UPDATE course_modules 
SET pdf_files = ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/1760287544729-COMO-CRIAR-QUIZ-QUE-FUNCIONA-HERBALEAD.pdf']
WHERE title = 'Como criar Quiz personalizado';

UPDATE course_modules 
SET pdf_files = ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/1760288300878-COMO-CRIAR-SEU-LINK-HERBALEAD.pdf']
WHERE title = 'Como usar o Herbalead';

-- 4. Verificar resultado
SELECT 
    title,
    pdf_files,
    array_length(pdf_files, 1) as quantidade_pdfs
FROM course_modules 
WHERE pdf_files IS NOT NULL AND pdf_files != '{}'
ORDER BY order_index;
