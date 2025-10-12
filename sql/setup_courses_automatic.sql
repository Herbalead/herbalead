-- Script para configurar cursos automaticamente no Herbalead
-- Execute este código no Supabase SQL Editor

-- 1. Criar curso principal "Treinamento Herbalead"
INSERT INTO courses (
  id,
  title,
  description,
  instructor_name,
  duration_hours,
  price,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Treinamento Herbalead',
  'Curso completo para dominar a plataforma Herbalead e gerar mais leads',
  'Equipe Herbalead',
  2,
  0,
  true,
  now(),
  now()
) ON CONFLICT DO NOTHING;

-- 2. Buscar o ID do curso criado
WITH course_id AS (
  SELECT id FROM courses WHERE title = 'Treinamento Herbalead' LIMIT 1
)

-- 3. Criar módulos do curso
INSERT INTO course_modules (
  id,
  course_id,
  title,
  description,
  duration,
  order_index,
  is_active,
  video_url,
  pdf_materials,
  created_at,
  updated_at
) 
SELECT 
  gen_random_uuid(),
  course_id.id,
  'Como Começar',
  'Guia completo para iniciar na plataforma Herbalead',
  '15 min',
  1,
  true,
  null,
  'Aprenda os 10 passos essenciais para começar a usar o Herbalead e gerar seu primeiro lead em 24 horas.',
  now(),
  now()
FROM course_id

UNION ALL

SELECT 
  gen_random_uuid(),
  course_id.id,
  'Como Criar Links',
  'Tutorial completo para criar links personalizados',
  '20 min',
  2,
  true,
  null,
  'Domine a criação de links personalizados, calculadoras e ferramentas de engajamento.',
  now(),
  now()
FROM course_id

UNION ALL

SELECT 
  gen_random_uuid(),
  course_id.id,
  'Como Fazer Quiz',
  'Guia para criar quizzes que convertem',
  '25 min',
  3,
  true,
  null,
  'Aprenda a criar quizzes eficazes que identificam o perfil dos seus leads e aumentam conversões.',
  now(),
  now()
FROM course_id;

-- 4. Adicionar materiais PDF aos módulos
WITH course_modules_data AS (
  SELECT 
    cm.id as module_id,
    cm.title as module_title
  FROM course_modules cm
  JOIN courses c ON cm.course_id = c.id
  WHERE c.title = 'Treinamento Herbalead'
)

UPDATE course_modules 
SET pdf_files = CASE 
  WHEN title = 'Como Começar' THEN ARRAY['https://herbalead.com/course/materials/01-como-comecar.html']
  WHEN title = 'Como Criar Links' THEN ARRAY['https://herbalead.com/course/materials/02-como-criar-links.html']
  WHEN title = 'Como Fazer Quiz' THEN ARRAY['https://herbalead.com/course/materials/03-como-fazer-quiz.html']
  ELSE pdf_files
END
WHERE course_id IN (
  SELECT id FROM courses WHERE title = 'Treinamento Herbalead'
);

-- 5. Verificar se tudo foi criado corretamente
SELECT 
  c.title as curso,
  cm.title as modulo,
  cm.order_index as ordem,
  cm.duration as duracao,
  cm.pdf_files as materiais_pdf
FROM courses c
JOIN course_modules cm ON c.id = cm.course_id
WHERE c.title = 'Treinamento Herbalead'
ORDER BY cm.order_index;

-- 6. Criar curso adicional "Manual de Vendas" (separado)
INSERT INTO courses (
  id,
  title,
  description,
  instructor_name,
  duration_hours,
  price,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Manual de Vendas',
  'Estratégias avançadas de vendas para distribuidores',
  'Equipe Herbalead',
  1,
  0,
  true,
  now(),
  now()
) ON CONFLICT DO NOTHING;

-- 7. Criar módulo para Manual de Vendas
WITH sales_course_id AS (
  SELECT id FROM courses WHERE title = 'Manual de Vendas' LIMIT 1
)

INSERT INTO course_modules (
  id,
  course_id,
  title,
  description,
  duration,
  order_index,
  is_active,
  video_url,
  pdf_materials,
  pdf_files,
  created_at,
  updated_at
) 
SELECT 
  gen_random_uuid(),
  sales_course_id.id,
  'Estratégias de Vendas',
  'Como identificar leads e fechar vendas',
  '60 min',
  1,
  true,
  null,
  'Aprenda a identificar tipos de clientes (frio, morno, quente) e como abordar cada um para maximizar suas vendas.',
  ARRAY['https://herbalead.com/course/materials/04-manual-vendas.html'],
  now(),
  now()
FROM sales_course_id;

-- 8. Verificar todos os cursos criados
SELECT 
  c.title as curso,
  c.description as descricao,
  COUNT(cm.id) as total_modulos,
  c.is_active as ativo
FROM courses c
LEFT JOIN course_modules cm ON c.id = cm.course_id
WHERE c.title IN ('Treinamento Herbalead', 'Manual de Vendas')
GROUP BY c.id, c.title, c.description, c.is_active
ORDER BY c.title;
