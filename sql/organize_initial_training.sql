-- Script para organizar curso como "Treinamento Inicial"
-- Execute este código no Supabase SQL Editor

-- 1. Atualizar título do curso para "Treinamento Inicial"
UPDATE courses 
SET title = 'Treinamento Inicial - HerbaLead',
    description = 'Curso completo para dominar a plataforma HerbaLead e transformar seu negócio em uma máquina de resultados. Comece aqui sua jornada de sucesso!'
WHERE title = 'HerbaLead Master Course';

-- 2. Adicionar módulo "Visão Geral" como primeiro módulo
INSERT INTO course_modules (course_id, title, description, duration, order_index) VALUES
  ((SELECT id FROM courses WHERE title = 'Treinamento Inicial - HerbaLead' LIMIT 1), 
   'Visão Geral da Plataforma', 
   'Entenda o que é o HerbaLead, como funciona e como pode transformar seu negócio', 
   '10 min', 0);

-- 3. Atualizar ordem dos módulos existentes (adicionar +1 ao order_index)
UPDATE course_modules 
SET order_index = order_index + 1
WHERE course_id = (SELECT id FROM courses WHERE title = 'Treinamento Inicial - HerbaLead' LIMIT 1)
AND title != 'Visão Geral da Plataforma';

-- 4. Verificar resultado
SELECT 
  cm.title,
  cm.duration,
  cm.order_index,
  c.title as course_title
FROM course_modules cm
JOIN courses c ON cm.course_id = c.id
WHERE c.title = 'Treinamento Inicial - HerbaLead'
ORDER BY cm.order_index;


















