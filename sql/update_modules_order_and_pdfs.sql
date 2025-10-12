-- Script para atualizar módulos com PDFs do Supabase Storage
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar módulos que precisam ser atualizados
SELECT 
    id,
    title,
    pdf_files,
    pdf_materials,
    order_index
FROM course_modules 
WHERE title IN ('Como criar Quiz personalizado', 'Como usar o Herbalead')
ORDER BY title;

-- 2. Atualizar módulo "Como criar Quiz personalizado" com PDF do Supabase
UPDATE course_modules 
SET pdf_files = ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/1760287544729-COMO-CRIAR-QUIZ-QUE-FUNCIONA-HERBALEAD.pdf']
WHERE title = 'Como criar Quiz personalizado';

-- 3. Atualizar módulo "Como usar o Herbalead" com PDF do Supabase
-- (Assumindo que existe um PDF para este módulo - você pode ajustar a URL)
UPDATE course_modules 
SET pdf_files = ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/1760288300878-COMO-CRIAR-SEU-LINK-HERBALEAD.pdf']
WHERE title = 'Como usar o Herbalead';

-- 4. Verificar resultado das atualizações
SELECT 
    id,
    title,
    pdf_files,
    array_length(pdf_files, 1) as quantidade_pdfs,
    order_index
FROM course_modules 
WHERE title IN ('Como criar links', 'Como criar Quiz personalizado', 'Como usar o Herbalead')
ORDER BY order_index;

-- 5. Reordenar módulos conforme solicitado pelo usuário:
-- "Como usar o Herbalead" em primeiro lugar
-- "Como criar links" em segundo lugar  
-- "Como criar Quiz personalizado" em terceiro lugar

UPDATE course_modules 
SET order_index = 1
WHERE title = 'Como usar o Herbalead';

UPDATE course_modules 
SET order_index = 2
WHERE title = 'Como criar links';

UPDATE course_modules 
SET order_index = 3
WHERE title = 'Como criar Quiz personalizado';

-- 6. Verificar ordem final
SELECT 
    id,
    title,
    order_index,
    pdf_files,
    array_length(pdf_files, 1) as quantidade_pdfs
FROM course_modules 
WHERE title IN ('Como criar links', 'Como criar Quiz personalizado', 'Como usar o Herbalead')
ORDER BY order_index;
