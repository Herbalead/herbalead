-- Script FINAL para reconectar PDF ao módulo "Como criar quiz personalizado"
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar estado atual do módulo
SELECT 
  'Estado atual do módulo:' as status,
  id,
  title,
  description,
  pdf_files,
  pdf_materials,
  updated_at
FROM course_modules 
WHERE title ILIKE '%quiz%personalizado%' 
   OR title ILIKE '%criar%quiz%'
   OR title ILIKE '%quiz%builder%';

-- 2. Reconectar o PDF correto
UPDATE course_modules 
SET 
  pdf_files = ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/1760287544729-COMO-CRIAR-QUIZ-QUE-FUNCIONA-HERBALEAD.pdf'],
  pdf_materials = 'Como Criar Quiz Personalizado - Guia completo para criar quizzes interativos e personalizados.',
  updated_at = NOW()
WHERE title ILIKE '%quiz%personalizado%' 
   OR title ILIKE '%criar%quiz%'
   OR title ILIKE '%quiz%builder%';

-- 3. Verificar se foi reconectado
SELECT 
  'Módulo após reconexão:' as status,
  id,
  title,
  description,
  pdf_files,
  pdf_materials,
  updated_at
FROM course_modules 
WHERE title ILIKE '%quiz%personalizado%' 
   OR title ILIKE '%criar%quiz%'
   OR title ILIKE '%quiz%builder%';

-- 4. Verificar todos os módulos do curso
SELECT 
  'Todos os módulos do curso:' as status,
  order_index,
  title,
  CASE 
    WHEN pdf_files IS NULL OR pdf_files = '{}' THEN '❌ Sem PDF'
    WHEN array_length(pdf_files, 1) > 0 THEN '✅ Com PDF'
    ELSE '⚠️ Status desconhecido'
  END as status_pdf,
  CASE 
    WHEN video_url IS NULL OR video_url = '' THEN '❌ Sem vídeo'
    ELSE '✅ Com vídeo'
  END as status_video
FROM course_modules 
WHERE course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1)
ORDER BY order_index;

SELECT '✅ PDF reconectado com sucesso!' as status;
