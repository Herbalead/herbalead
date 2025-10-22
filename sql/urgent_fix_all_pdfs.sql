-- Script URGENTE para corrigir PDFs dos módulos
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar estado atual de TODOS os módulos
SELECT 
  'ESTADO ATUAL DOS MÓDULOS:' as status,
  order_index,
  title,
  CASE 
    WHEN pdf_files IS NULL THEN '❌ NULL'
    WHEN pdf_files = '{}' THEN '❌ Array vazio'
    WHEN array_length(pdf_files, 1) = 0 THEN '❌ Sem elementos'
    WHEN array_length(pdf_files, 1) > 0 THEN '✅ Com PDFs'
    ELSE '⚠️ Status desconhecido'
  END as status_pdf,
  pdf_files,
  pdf_materials
FROM course_modules 
WHERE course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1)
ORDER BY order_index;

-- 2. CORRIGIR TODOS OS MÓDULOS DE UMA VEZ
UPDATE course_modules 
SET 
  pdf_files = CASE 
    WHEN title = 'Calculadora de Hidratação' THEN ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Calculadora-de-Hidratacao.pdf']
    WHEN title = 'Calculadora de IMC' THEN ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/CALCULADORA-DE-IMC.pdf']
    WHEN title = 'Calculadora de Proteína' THEN ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/CALCULADORA-DE-PROTEINA.pdf']
    WHEN title = 'Como Se Comportar Antes de Enviar uma Ferramenta' THEN ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Como-Se-Comportar-Antes-de-Enviar-uma-Ferramenta.pdf']
    WHEN title = 'Composição Corporal' THEN ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Composicao-Corporal.pdf']
    WHEN title = 'Planejador de Refeições' THEN ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Planejador-de-Refeicoes.pdf']
    WHEN title = 'Quiz de Alimentação Saudável' THEN ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Quiz-de-Alimentacao-Saudavel.pdf']
    WHEN title = 'Quiz de Bem-Estar Diário' THEN ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Quiz-de-Bem-Estar-Diario.pdf']
    WHEN title = 'Quiz Ganhos e Prosperidade' THEN ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/QUIZ-GANHOS-E-PROSPERIDADE.pdf']
    WHEN title = 'Quiz Perfil de Bem-Estar' THEN ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Quiz-Perfil-de-Bem-Estar.pdf']
    WHEN title = 'Quiz Potencial e Crescimento' THEN ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Quiz-Potencial-e-Crescimento.pdf']
    WHEN title = 'Quiz Propósito e Equilíbrio' THEN ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Quiz-Proposito-e-Equilibrio.pdf']
    WHEN title ILIKE '%quiz%personalizado%' OR title ILIKE '%criar%quiz%' THEN ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/1760287544729-COMO-CRIAR-QUIZ-QUE-FUNCIONA-HERBALEAD.pdf']
    ELSE pdf_files
  END,
  pdf_materials = CASE 
    WHEN title = 'Calculadora de Hidratação' THEN 'Como usar a Calculadora de Hidratação - Guia completo da ferramenta.'
    WHEN title = 'Calculadora de IMC' THEN 'Como usar a Calculadora de IMC - Ferramenta fundamental para avaliação nutricional.'
    WHEN title = 'Calculadora de Proteína' THEN 'Como usar a Calculadora de Proteína - Prescrição nutricional adequada.'
    WHEN title = 'Como Se Comportar Antes de Enviar uma Ferramenta' THEN 'Como se comportar antes de enviar uma ferramenta - Preparação profissional.'
    WHEN title = 'Composição Corporal' THEN 'Como usar a análise de Composição Corporal - Avaliação completa.'
    WHEN title = 'Planejador de Refeições' THEN 'Como usar o Planejador de Refeições - Criação de planos alimentares.'
    WHEN title = 'Quiz de Alimentação Saudável' THEN 'Como usar o Quiz de Alimentação Saudável - Ferramenta de engajamento.'
    WHEN title = 'Quiz de Bem-Estar Diário' THEN 'Como usar o Quiz de Bem-Estar Diário - Avaliação de estilo de vida.'
    WHEN title = 'Quiz Ganhos e Prosperidade' THEN 'Como usar o Quiz Ganhos e Prosperidade - Desenvolvimento financeiro.'
    WHEN title = 'Quiz Perfil de Bem-Estar' THEN 'Como usar o Quiz Perfil de Bem-Estar - Diagnóstico personalizado.'
    WHEN title = 'Quiz Potencial e Crescimento' THEN 'Como usar o Quiz Potencial e Crescimento - Desenvolvimento pessoal.'
    WHEN title = 'Quiz Propósito e Equilíbrio' THEN 'Como usar o Quiz Propósito e Equilíbrio - Desenvolvimento de propósito.'
    WHEN title ILIKE '%quiz%personalizado%' OR title ILIKE '%criar%quiz%' THEN 'Como Criar Quiz Personalizado - Guia completo para criar quizzes interativos e personalizados.'
    ELSE pdf_materials
  END,
  updated_at = NOW()
WHERE course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1);

-- 3. Verificar resultado final
SELECT 
  'RESULTADO FINAL:' as status,
  order_index,
  title,
  CASE 
    WHEN pdf_files IS NULL THEN '❌ NULL'
    WHEN pdf_files = '{}' THEN '❌ Array vazio'
    WHEN array_length(pdf_files, 1) = 0 THEN '❌ Sem elementos'
    WHEN array_length(pdf_files, 1) > 0 THEN '✅ Com PDFs'
    ELSE '⚠️ Status desconhecido'
  END as status_pdf,
  pdf_files
FROM course_modules 
WHERE course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1)
ORDER BY order_index;

SELECT '✅ TODOS OS PDFs CORRIGIDOS!' as status;
