-- Script para sincronizar PDFs do Supabase Storage com módulos
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar arquivos disponíveis no Supabase Storage
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

-- 2. Verificar módulos atuais e seus PDFs
SELECT 
    id,
    title,
    pdf_files,
    pdf_materials,
    order_index
FROM course_modules 
ORDER BY order_index;

-- 3. Atualizar módulo "Como criar links" com PDF correto
UPDATE course_modules 
SET pdf_files = ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/1760287870763-COMO-CRIAR-SEU-LINK-HERBALEAD.pdf']
WHERE title = 'Como criar links';

-- 4. Atualizar módulo "Como criar Quiz personalizado" com PDF correto
UPDATE course_modules 
SET pdf_files = ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/1760287544729-COMO-CRIAR-QUIZ-QUE-FUNCIONA-HERBALEAD.pdf']
WHERE title = 'Como criar Quiz personalizado';

-- 5. Atualizar módulo "Como usar o Herbalead" com PDF correto
UPDATE course_modules 
SET pdf_files = ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/1760288300878-COMO-CRIAR-SEU-LINK-HERBALEAD.pdf']
WHERE title = 'Como usar o Herbalead';

-- 6. Reordenar módulos conforme solicitado
UPDATE course_modules 
SET order_index = 1
WHERE title = 'Como usar o Herbalead';

UPDATE course_modules 
SET order_index = 2
WHERE title = 'Como criar links';

UPDATE course_modules 
SET order_index = 3
WHERE title = 'Como criar Quiz personalizado';

-- 7. Verificar resultado final
SELECT 
    id,
    title,
    order_index,
    pdf_files,
    array_length(pdf_files, 1) as quantidade_pdfs
FROM course_modules 
WHERE title IN ('Como criar links', 'Como criar Quiz personalizado', 'Como usar o Herbalead')
ORDER BY order_index;

-- 8. Testar URLs dos PDFs (opcional - para verificar se estão acessíveis)
-- Você pode testar estas URLs no navegador:
-- https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/1760287870763-COMO-CRIAR-SEU-LINK-HERBALEAD.pdf
-- https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/1760287544729-COMO-CRIAR-QUIZ-QUE-FUNCIONA-HERBALEAD.pdf
-- https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/1760288300878-COMO-CRIAR-SEU-LINK-HERBALEAD.pdf
