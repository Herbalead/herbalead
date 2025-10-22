-- Script para listar todos os PDFs disponíveis no Storage
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar todos os módulos e seus PDFs atuais
SELECT 
  'Módulos e seus PDFs atuais:' as status,
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

-- 2. Verificar especificamente os módulos problemáticos
SELECT 
  'Módulos específicos:' as status,
  id,
  title,
  pdf_files,
  pdf_materials
FROM course_modules 
WHERE title IN ('Calculadora de Hidratação', 'Calculadora de IMC', 'Calculadora de Proteína')
ORDER BY title;

-- 3. Tentar reconectar com nomes exatos dos arquivos
UPDATE course_modules 
SET 
  pdf_files = ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Calculadora-de-Hidratacao.pdf'],
  pdf_materials = 'Como usar a Calculadora de Hidratação - Guia completo da ferramenta.',
  updated_at = NOW()
WHERE title = 'Calculadora de Hidratação';

UPDATE course_modules 
SET 
  pdf_files = ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/CALCULADORA-DE-IMC.pdf'],
  pdf_materials = 'Como usar a Calculadora de IMC - Ferramenta fundamental para avaliação nutricional.',
  updated_at = NOW()
WHERE title = 'Calculadora de IMC';

UPDATE course_modules 
SET 
  pdf_files = ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/CALCULADORA-DE-PROTEINA.pdf'],
  pdf_materials = 'Como usar a Calculadora de Proteína - Prescrição nutricional adequada.',
  updated_at = NOW()
WHERE title = 'Calculadora de Proteína';

-- 4. Verificar se foi atualizado
SELECT 
  'Após atualização:' as status,
  order_index,
  title,
  CASE 
    WHEN pdf_files IS NULL OR pdf_files = '{}' THEN '❌ Sem PDF'
    WHEN array_length(pdf_files, 1) > 0 THEN '✅ Com PDF'
    ELSE '⚠️ Status desconhecido'
  END as status_pdf,
  pdf_files
FROM course_modules 
WHERE title IN ('Calculadora de Hidratação', 'Calculadora de IMC', 'Calculadora de Proteína')
ORDER BY order_index;

SELECT '✅ Verificação e reconexão concluídas!' as status;
