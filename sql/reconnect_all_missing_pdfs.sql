-- Script para reconectar TODOS os PDFs perdidos
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

-- 2. Reconectar PDF da Calculadora de Hidratação
UPDATE course_modules 
SET 
  pdf_files = ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Calculadora-de-Hidratacao.pdf'],
  pdf_materials = 'Como usar a Calculadora de Hidratação - Guia completo da ferramenta.',
  updated_at = NOW()
WHERE title ILIKE '%hidratação%' 
   OR title ILIKE '%hidratacao%'
   OR title = 'Calculadora de Hidratação';

-- 3. Reconectar PDF da Calculadora de IMC
UPDATE course_modules 
SET 
  pdf_files = ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/CALCULADORA-DE-IMC.pdf'],
  pdf_materials = 'Como usar a Calculadora de IMC - Ferramenta fundamental para avaliação nutricional.',
  updated_at = NOW()
WHERE title ILIKE '%imc%' 
   OR title = 'Calculadora de IMC';

-- 4. Reconectar PDF da Calculadora de Proteína (caso tenha perdido)
UPDATE course_modules 
SET 
  pdf_files = ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/CALCULADORA-DE-PROTEINA.pdf'],
  pdf_materials = 'Como usar a Calculadora de Proteína - Prescrição nutricional adequada.',
  updated_at = NOW()
WHERE title ILIKE '%proteína%' 
   OR title ILIKE '%proteina%'
   OR title = 'Calculadora de Proteína';

-- 5. Reconectar PDF do Quiz Personalizado
UPDATE course_modules 
SET 
  pdf_files = ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/1760287544729-COMO-CRIAR-QUIZ-QUE-FUNCIONA-HERBALEAD.pdf'],
  pdf_materials = 'Como Criar Quiz Personalizado - Guia completo para criar quizzes interativos e personalizados.',
  updated_at = NOW()
WHERE title ILIKE '%quiz%personalizado%' 
   OR title ILIKE '%criar%quiz%'
   OR title ILIKE '%quiz%builder%';

-- 6. Reconectar outros PDFs importantes
UPDATE course_modules 
SET 
  pdf_files = ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Como-Se-Comportar-Antes-de-Enviar-uma-Ferramenta.pdf'],
  pdf_materials = 'Como se comportar antes de enviar uma ferramenta - Preparação profissional.',
  updated_at = NOW()
WHERE title ILIKE '%comportar%' 
   OR title ILIKE '%antes%enviar%';

UPDATE course_modules 
SET 
  pdf_files = ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Composicao-Corporal.pdf'],
  pdf_materials = 'Como usar a análise de Composição Corporal - Avaliação completa.',
  updated_at = NOW()
WHERE title ILIKE '%composição%' 
   OR title ILIKE '%composicao%'
   OR title ILIKE '%corporal%';

UPDATE course_modules 
SET 
  pdf_files = ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Planejador-de-Refeicoes.pdf'],
  pdf_materials = 'Como usar o Planejador de Refeições - Criação de planos alimentares.',
  updated_at = NOW()
WHERE title ILIKE '%planejador%' 
   OR title ILIKE '%refeições%'
   OR title ILIKE '%refeicoes%';

-- 7. Verificar resultado final
SELECT 
  'Estado final de todos os módulos:' as status,
  order_index,
  title,
  CASE 
    WHEN pdf_files IS NULL OR pdf_files = '{}' THEN '❌ Sem PDF'
    WHEN array_length(pdf_files, 1) > 0 THEN '✅ Com PDF'
    ELSE '⚠️ Status desconhecido'
  END as status_pdf,
  pdf_files
FROM course_modules 
WHERE course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1)
ORDER BY order_index;

SELECT '✅ Todos os PDFs reconectados!' as status;
