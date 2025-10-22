-- Script simplificado para inserir módulos após upload dos PDFs
-- Execute este script no SQL Editor do Supabase após fazer upload dos PDFs

-- IMPORTANTE: Substitua "your-supabase-url" pela URL real do seu Supabase
-- Exemplo: https://abcdefghijklmnop.supabase.co

-- 1. Primeiro, verifique se existe um curso
SELECT id, title FROM courses LIMIT 1;

-- 2. Inserir módulos (substitua o course_id pelo ID do curso acima)
INSERT INTO course_modules (course_id, title, description, duration, order_index, pdf_materials, pdf_files) VALUES

-- Módulo 1: Calculadora de Hidratação
('SUBSTITUA_PELO_COURSE_ID', 
'Calculadora de Hidratação', 
'Ferramenta interativa para calcular a necessidade diária de hidratação baseada em peso, nível de atividade física e condições climáticas.',
'15 min', 1,
'Calculadora de Hidratação - Ferramenta essencial para profissionais da saúde.',
'["https://your-supabase-url.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Calculadora-de-Hidratacao.pdf"]'),

-- Módulo 2: Calculadora de IMC
('SUBSTITUA_PELO_COURSE_ID', 
'Calculadora de IMC', 
'Ferramenta para calcular o Índice de Massa Corporal (IMC) com interpretação dos resultados e orientações nutricionais.',
'12 min', 2,
'Calculadora de IMC - Ferramenta fundamental para avaliação nutricional.',
'["https://your-supabase-url.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/CALCULADORA-DE-IMC.pdf"]'),

-- Módulo 3: Calculadora de Proteína
('SUBSTITUA_PELO_COURSE_ID', 
'Calculadora de Proteína', 
'Ferramenta para calcular a necessidade diária de proteína baseada em objetivos (manutenção, ganho de massa muscular, perda de peso).',
'18 min', 3,
'Calculadora de Proteína - Essencial para prescrição nutricional adequada.',
'["https://your-supabase-url.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/CALCULADORA-DE-PROTEINA.pdf"]'),

-- Módulo 4: Como Se Comportar Antes de Enviar uma Ferramenta
('SUBSTITUA_PELO_COURSE_ID', 
'Como Se Comportar Antes de Enviar uma Ferramenta', 
'Guia essencial sobre etiqueta profissional e boas práticas antes de compartilhar ferramentas com clientes.',
'20 min', 4,
'Como Se Comportar Antes de Enviar uma Ferramenta - Preparação profissional.',
'["https://your-supabase-url.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Como-Se-Comportar-Antes-de-Enviar-uma-Ferramenta.pdf"]'),

-- Módulo 5: Composição Corporal
('SUBSTITUA_PELO_COURSE_ID', 
'Composição Corporal', 
'Entenda os diferentes componentes do corpo humano e como avaliar a composição corporal para prescrições mais precisas.',
'25 min', 5,
'Composição Corporal - Fundamentos para avaliação completa.',
'["https://your-supabase-url.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Composicao-Corporal.pdf"]'),

-- Módulo 6: Planejador de Refeições
('SUBSTITUA_PELO_COURSE_ID', 
'Planejador de Refeições', 
'Ferramenta para criar planos alimentares personalizados, incluindo cardápios, listas de compras e estratégias de preparo.',
'30 min', 6,
'Planejador de Refeições - Sistema completo para criação de planos alimentares.',
'["https://your-supabase-url.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Planejador-de-Refeicoes.pdf"]'),

-- Módulo 7: Quiz de Alimentação Saudável
('SUBSTITUA_PELO_COURSE_ID', 
'Quiz de Alimentação Saudável', 
'Questionário interativo para avaliar hábitos alimentares e fornecer insights personalizados.',
'15 min', 7,
'Quiz de Alimentação Saudável - Ferramenta de avaliação e engajamento.',
'["https://your-supabase-url.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Quiz-de-Alimentacao-Saudavel.pdf"]'),

-- Módulo 8: Quiz de Bem-Estar Diário
('SUBSTITUA_PELO_COURSE_ID', 
'Quiz de Bem-Estar Diário', 
'Avaliação holística do bem-estar incluindo sono, estresse, energia e humor.',
'12 min', 8,
'Quiz de Bem-Estar Diário - Avaliação completa do estilo de vida.',
'["https://your-supabase-url.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Quiz-de-Bem-Estar-Diario.pdf"]'),

-- Módulo 9: Quiz Ganhos e Prosperidade
('SUBSTITUA_PELO_COURSE_ID', 
'Quiz Ganhos e Prosperidade', 
'Questionário sobre mentalidade financeira e estratégias para prosperidade.',
'18 min', 9,
'Quiz Ganhos e Prosperidade - Desenvolvimento de mentalidade financeira.',
'["https://your-supabase-url.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/QUIZ-GANHOS-E-PROSPERIDADE.pdf"]'),

-- Módulo 10: Quiz Perfil de Bem-Estar
('SUBSTITUA_PELO_COURSE_ID', 
'Quiz Perfil de Bem-Estar', 
'Avaliação detalhada do perfil de bem-estar do cliente, identificando pontos fortes e áreas de desenvolvimento.',
'20 min', 10,
'Quiz Perfil de Bem-Estar - Diagnóstico personalizado para prescrição.',
'["https://your-supabase-url.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Quiz-Perfil-de-Bem-Estar.pdf"]'),

-- Módulo 11: Quiz Potencial e Crescimento
('SUBSTITUA_PELO_COURSE_ID', 
'Quiz Potencial e Crescimento', 
'Ferramenta para identificar potencial inexplorado e traçar caminhos de crescimento pessoal e profissional.',
'22 min', 11,
'Quiz Potencial e Crescimento - Identificação de potencial e estratégias.',
'["https://your-supabase-url.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Quiz-Potencial-e-Crescimento.pdf"]'),

-- Módulo 12: Quiz Propósito e Equilíbrio
('SUBSTITUA_PELO_COURSE_ID', 
'Quiz Propósito e Equilíbrio', 
'Avaliação do senso de propósito e equilíbrio na vida. Ferramenta para ajudar clientes a encontrar alinhamento.',
'16 min', 12,
'Quiz Propósito e Equilíbrio - Desenvolvimento de propósito e equilíbrio.',
'["https://your-supabase-url.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Quiz-Proposito-e-Equilibrio.pdf"]');

-- 3. Verificar se os módulos foram inseridos
SELECT 
  cm.title,
  cm.duration,
  cm.order_index,
  c.title as course_title
FROM course_modules cm
JOIN courses c ON cm.course_id = c.id
ORDER BY cm.order_index;

SELECT 'Módulos inseridos com sucesso!' as status;
