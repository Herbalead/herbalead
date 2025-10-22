-- Script para restaurar módulo "Como criar quiz personalizado"
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se o módulo existe
SELECT 
  id,
  title,
  description,
  pdf_files,
  pdf_materials
FROM course_modules 
WHERE title ILIKE '%quiz%personalizado%' 
   OR title ILIKE '%criar%quiz%'
   OR title ILIKE '%quiz%builder%';

-- 2. Se não existir, criar o módulo "Como criar quiz personalizado"
INSERT INTO course_modules (course_id, title, description, duration, order_index, pdf_materials, pdf_files, is_active)
SELECT 
  (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1),
  'Como Criar Quiz Personalizado',
  'Aprenda a criar quizzes personalizados e interativos para engajar seus clientes. Domine todas as funcionalidades do Quiz Builder do HerbaLead.',
  '25 min',
  13, -- Próximo número na sequência
  'Como Criar Quiz Personalizado - Guia completo para criar quizzes interativos e personalizados.',
  ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Como-Criar-Quiz-Personalizado.pdf'],
  true
WHERE NOT EXISTS (
  SELECT 1 FROM course_modules 
  WHERE title ILIKE '%quiz%personalizado%' 
     OR title ILIKE '%criar%quiz%'
     OR title ILIKE '%quiz%builder%'
);

-- 3. Verificar se foi criado
SELECT 
  id,
  title,
  description,
  pdf_files,
  pdf_materials,
  order_index
FROM course_modules 
WHERE title = 'Como Criar Quiz Personalizado';

-- 4. Listar todos os módulos do curso para verificar ordem
SELECT 
  order_index,
  title,
  CASE 
    WHEN pdf_files IS NULL OR pdf_files = '{}' THEN '❌ Sem PDF'
    ELSE '✅ Com PDF'
  END as status_pdf
FROM course_modules 
WHERE course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1)
ORDER BY order_index;

SELECT 'Módulo restaurado com sucesso!' as status;
