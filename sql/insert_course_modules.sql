-- Script para inserir módulos do curso
-- Execute APENAS este código no Supabase SQL Editor

-- 1. Verificar se o curso foi criado
SELECT id, title FROM courses WHERE title = 'HerbaLead Master Course';

-- 2. Inserir módulos (substitua o UUID pelo ID do curso acima)
INSERT INTO course_modules (course_id, title, description, duration, order_index) VALUES
  ((SELECT id FROM courses WHERE title = 'HerbaLead Master Course' LIMIT 1), 'Introdução à Plataforma', 'Aprenda os primeiros passos no HerbaLead', '15 min', 1),
  ((SELECT id FROM courses WHERE title = 'HerbaLead Master Course' LIMIT 1), 'Criação de Links', 'Como criar e personalizar seus materiais', '20 min', 2),
  ((SELECT id FROM courses WHERE title = 'HerbaLead Master Course' LIMIT 1), 'Quiz Builder', 'Criando avaliações interativas', '25 min', 3),
  ((SELECT id FROM courses WHERE title = 'HerbaLead Master Course' LIMIT 1), 'Estratégias de Vendas', 'Técnicas de captura e conversão', '30 min', 4),
  ((SELECT id FROM courses WHERE title = 'HerbaLead Master Course' LIMIT 1), 'Recursos Avançados', 'Integrações e otimizações', '35 min', 5),
  ((SELECT id FROM courses WHERE title = 'HerbaLead Master Course' LIMIT 1), 'Certificação', 'Conclusão e próximos passos', '5 min', 6);

-- 3. Verificar se os módulos foram inseridos
SELECT 
  cm.title,
  cm.duration,
  cm.order_index,
  c.title as course_title
FROM course_modules cm
JOIN courses c ON cm.course_id = c.id
WHERE c.title = 'HerbaLead Master Course'
ORDER BY cm.order_index;





