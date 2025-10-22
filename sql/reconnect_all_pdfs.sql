-- Script para verificar e reconectar todos os PDFs perdidos
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar módulos sem PDFs
SELECT 
  'Módulos sem PDFs:' as status,
  id,
  title,
  description,
  pdf_files,
  pdf_materials
FROM course_modules 
WHERE course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1)
  AND (pdf_files IS NULL OR pdf_files = '{}' OR array_length(pdf_files, 1) = 0)
ORDER BY order_index;

-- 2. Reconectar PDFs baseado nos nomes dos arquivos no Storage
UPDATE course_modules 
SET 
  pdf_files = ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/1760287544729-COMO-CRIAR-QUIZ-QUE-FUNCIONA-HERBALEAD.pdf'],
  pdf_materials = 'Como Criar Quiz Personalizado - Guia completo para criar quizzes interativos e personalizados.',
  updated_at = NOW()
WHERE title ILIKE '%quiz%personalizado%' 
   OR title ILIKE '%criar%quiz%'
   OR title ILIKE '%quiz%builder%';

-- 3. Verificar se há outros PDFs que precisam ser reconectados
-- Baseado nos nomes dos arquivos que vimos na imagem
UPDATE course_modules 
SET 
  pdf_files = ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Calculadora-de-Hidratacao.pdf'],
  updated_at = NOW()
WHERE title ILIKE '%hidratação%' 
   OR title ILIKE '%hidratacao%'
   AND (pdf_files IS NULL OR pdf_files = '{}' OR array_length(pdf_files, 1) = 0);

UPDATE course_modules 
SET 
  pdf_files = ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/CALCULADORA-DE-IMC.pdf'],
  updated_at = NOW()
WHERE title ILIKE '%imc%' 
   AND (pdf_files IS NULL OR pdf_files = '{}' OR array_length(pdf_files, 1) = 0);

UPDATE course_modules 
SET 
  pdf_files = ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/CALCULADORA-DE-PROTEINA.pdf'],
  updated_at = NOW()
WHERE title ILIKE '%proteína%' 
   OR title ILIKE '%proteina%'
   AND (pdf_files IS NULL OR pdf_files = '{}' OR array_length(pdf_files, 1) = 0);

-- 4. Verificar resultado final
SELECT 
  'Estado final dos módulos:' as status,
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

SELECT '✅ Reconexão de PDFs concluída!' as status;
