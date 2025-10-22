-- Script para adicionar vídeos aos módulos existentes
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar módulos existentes
SELECT 
  id,
  title,
  video_url,
  pdf_files,
  course_id
FROM course_modules 
WHERE course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1)
ORDER BY order_index;

-- 2. Adicionar vídeos aos módulos (substitua as URLs pelos seus vídeos)
-- Exemplo: se você tem um vídeo no YouTube ou Supabase Storage

-- Módulo 1: Calculadora de Hidratação
UPDATE course_modules 
SET video_url = 'https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-videos/calculadora-hidratacao.mp4'
WHERE title = 'Calculadora de Hidratação' 
AND course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1);

-- Módulo 2: Calculadora de IMC
UPDATE course_modules 
SET video_url = 'https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-videos/calculadora-imc.mp4'
WHERE title = 'Calculadora de IMC' 
AND course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1);

-- Módulo 3: Calculadora de Proteína
UPDATE course_modules 
SET video_url = 'https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-videos/calculadora-proteina.mp4'
WHERE title = 'Calculadora de Proteína' 
AND course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1);

-- Módulo 4: Como Se Comportar Antes de Enviar uma Ferramenta
UPDATE course_modules 
SET video_url = 'https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-videos/como-se-comportar.mp4'
WHERE title = 'Como Se Comportar Antes de Enviar uma Ferramenta' 
AND course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1);

-- Módulo 5: Composição Corporal
UPDATE course_modules 
SET video_url = 'https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-videos/composicao-corporal.mp4'
WHERE title = 'Composição Corporal' 
AND course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1);

-- Módulo 6: Planejador de Refeições
UPDATE course_modules 
SET video_url = 'https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-videos/planejador-refeicoes.mp4'
WHERE title = 'Planejador de Refeições' 
AND course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1);

-- Módulo 7: Quiz de Alimentação Saudável
UPDATE course_modules 
SET video_url = 'https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-videos/quiz-alimentacao-saudavel.mp4'
WHERE title = 'Quiz de Alimentação Saudável' 
AND course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1);

-- Módulo 8: Quiz de Bem-Estar Diário
UPDATE course_modules 
SET video_url = 'https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-videos/quiz-bem-estar-diario.mp4'
WHERE title = 'Quiz de Bem-Estar Diário' 
AND course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1);

-- Módulo 9: Quiz Ganhos e Prosperidade
UPDATE course_modules 
SET video_url = 'https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-videos/quiz-ganhos-prosperidade.mp4'
WHERE title = 'Quiz Ganhos e Prosperidade' 
AND course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1);

-- Módulo 10: Quiz Perfil de Bem-Estar
UPDATE course_modules 
SET video_url = 'https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-videos/quiz-perfil-bem-estar.mp4'
WHERE title = 'Quiz Perfil de Bem-Estar' 
AND course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1);

-- Módulo 11: Quiz Potencial e Crescimento
UPDATE course_modules 
SET video_url = 'https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-videos/quiz-potencial-crescimento.mp4'
WHERE title = 'Quiz Potencial e Crescimento' 
AND course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1);

-- Módulo 12: Quiz Propósito e Equilíbrio
UPDATE course_modules 
SET video_url = 'https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-videos/quiz-proposito-equilibrio.mp4'
WHERE title = 'Quiz Propósito e Equilíbrio' 
AND course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1);

-- 3. Verificar se os vídeos foram adicionados
SELECT 
  title,
  video_url,
  CASE 
    WHEN video_url LIKE '%youtube%' THEN 'YouTube'
    WHEN video_url LIKE '%supabase%' THEN 'Supabase Storage'
    WHEN video_url LIKE '%http%' THEN 'Externo'
    ELSE 'Não definido'
  END as tipo_video
FROM course_modules 
WHERE course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1)
ORDER BY order_index;

SELECT '✅ Vídeos adicionados aos módulos!' as status;
