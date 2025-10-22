-- Script AUTOMÁTICO para criar módulos com PDFs já carregados
-- Execute este script no SQL Editor do Supabase

-- 1. Primeiro, vamos ver se existe um curso para adicionar os módulos
SELECT id, title FROM courses LIMIT 1;

-- 2. Vamos criar um curso se não existir
INSERT INTO courses (title, description, is_active, enrollment_required)
VALUES ('HerbaLead Master Course', 'Curso completo com todas as ferramentas e quizzes do HerbaLead', true, true)
ON CONFLICT DO NOTHING;

-- 3. Agora vamos inserir os módulos automaticamente
-- (Substitua 'SEU_PROJECT_ID' pela URL do seu projeto Supabase)

INSERT INTO course_modules (course_id, title, description, duration, order_index, pdf_materials, pdf_files) VALUES

-- Módulo 1: Calculadora de Hidratação
((SELECT id FROM courses WHERE title = 'HerbaLead Master Course' LIMIT 1), 
'Calculadora de Hidratação', 
'Ferramenta interativa para calcular a necessidade diária de hidratação baseada em peso, nível de atividade física e condições climáticas. Aprenda a manter o equilíbrio hídrico ideal para sua saúde e bem-estar.',
'15 min', 1,
'Calculadora de Hidratação - Ferramenta essencial para profissionais da saúde calcular a necessidade diária de água dos clientes.',
'["https://SEU_PROJECT_ID.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Calculadora-de-Hidratacao.pdf"]'),

-- Módulo 2: Calculadora de IMC
((SELECT id FROM courses WHERE title = 'HerbaLead Master Course' LIMIT 1), 
'Calculadora de IMC', 
'Ferramenta para calcular o Índice de Massa Corporal (IMC) com interpretação dos resultados e orientações nutricionais. Ideal para avaliação inicial e acompanhamento de clientes.',
'12 min', 2,
'Calculadora de IMC - Ferramenta fundamental para avaliação nutricional e acompanhamento de peso corporal.',
'["https://SEU_PROJECT_ID.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/CALCULADORA-DE-IMC.pdf"]'),

-- Módulo 3: Calculadora de Proteína
((SELECT id FROM courses WHERE title = 'HerbaLead Master Course' LIMIT 1), 
'Calculadora de Proteína', 
'Ferramenta para calcular a necessidade diária de proteína baseada em objetivos (manutenção, ganho de massa muscular, perda de peso). Inclui fontes proteicas e estratégias de distribuição.',
'18 min', 3,
'Calculadora de Proteína - Essencial para prescrição nutricional adequada e otimização de resultados.',
'["https://SEU_PROJECT_ID.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/CALCULADORA-DE-PROTEINA.pdf"]'),

-- Módulo 4: Como Se Comportar Antes de Enviar uma Ferramenta
((SELECT id FROM courses WHERE title = 'HerbaLead Master Course' LIMIT 1), 
'Como Se Comportar Antes de Enviar uma Ferramenta', 
'Guia essencial sobre etiqueta profissional e boas práticas antes de compartilhar ferramentas com clientes. Aprenda a preparar adequadamente o ambiente e a comunicação.',
'20 min', 4,
'Como Se Comportar Antes de Enviar uma Ferramenta - Preparação profissional para compartilhamento de ferramentas.',
'["https://SEU_PROJECT_ID.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Como-Se-Comportar-Antes-de-Enviar-uma-Ferramenta.pdf"]'),

-- Módulo 5: Composição Corporal
((SELECT id FROM courses WHERE title = 'HerbaLead Master Course' LIMIT 1), 
'Composição Corporal', 
'Entenda os diferentes componentes do corpo humano (massa muscular, gordura, água, ossos) e como avaliar a composição corporal para prescrições mais precisas.',
'25 min', 5,
'Composição Corporal - Fundamentos para avaliação completa e prescrição personalizada.',
'["https://SEU_PROJECT_ID.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Composicao-Corporal.pdf"]'),

-- Módulo 6: Planejador de Refeições
((SELECT id FROM courses WHERE title = 'HerbaLead Master Course' LIMIT 1), 
'Planejador de Refeições', 
'Ferramenta para criar planos alimentares personalizados, incluindo cardápios, listas de compras e estratégias de preparo. Ideal para nutricionistas e coaches.',
'30 min', 6,
'Planejador de Refeições - Sistema completo para criação de planos alimentares eficazes.',
'["https://SEU_PROJECT_ID.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Planejador-de-Refeicoes.pdf"]'),

-- Módulo 7: Quiz de Alimentação Saudável
((SELECT id FROM courses WHERE title = 'HerbaLead Master Course' LIMIT 1), 
'Quiz de Alimentação Saudável', 
'Questionário interativo para avaliar hábitos alimentares e fornecer insights personalizados. Ferramenta de engajamento para clientes.',
'15 min', 7,
'Quiz de Alimentação Saudável - Ferramenta de avaliação e engajamento para clientes.',
'["https://SEU_PROJECT_ID.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Quiz-de-Alimentacao-Saudavel.pdf"]'),

-- Módulo 8: Quiz de Bem-Estar Diário
((SELECT id FROM courses WHERE title = 'HerbaLead Master Course' LIMIT 1), 
'Quiz de Bem-Estar Diário', 
'Avaliação holística do bem-estar incluindo sono, estresse, energia e humor. Ferramenta para identificar áreas de melhoria no estilo de vida.',
'12 min', 8,
'Quiz de Bem-Estar Diário - Avaliação completa do estilo de vida e bem-estar.',
'["https://SEU_PROJECT_ID.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Quiz-de-Bem-Estar-Diario.pdf"]'),

-- Módulo 9: Quiz Ganhos e Prosperidade
((SELECT id FROM courses WHERE title = 'HerbaLead Master Course' LIMIT 1), 
'Quiz Ganhos e Prosperidade', 
'Questionário sobre mentalidade financeira e estratégias para prosperidade. Ideal para profissionais que querem crescer financeiramente.',
'18 min', 9,
'Quiz Ganhos e Prosperidade - Desenvolvimento de mentalidade financeira e estratégias de crescimento.',
'["https://SEU_PROJECT_ID.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/QUIZ-GANHOS-E-PROSPERIDADE.pdf"]'),

-- Módulo 10: Quiz Perfil de Bem-Estar
((SELECT id FROM courses WHERE title = 'HerbaLead Master Course' LIMIT 1), 
'Quiz Perfil de Bem-Estar', 
'Avaliação detalhada do perfil de bem-estar do cliente, identificando pontos fortes e áreas de desenvolvimento. Ferramenta de diagnóstico personalizado.',
'20 min', 10,
'Quiz Perfil de Bem-Estar - Diagnóstico personalizado para prescrição de bem-estar.',
'["https://SEU_PROJECT_ID.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Quiz-Perfil-de-Bem-Estar.pdf"]'),

-- Módulo 11: Quiz Potencial e Crescimento
((SELECT id FROM courses WHERE title = 'HerbaLead Master Course' LIMIT 1), 
'Quiz Potencial e Crescimento', 
'Ferramenta para identificar potencial inexplorado e traçar caminhos de crescimento pessoal e profissional. Ideal para desenvolvimento de carreira.',
'22 min', 11,
'Quiz Potencial e Crescimento - Identificação de potencial e estratégias de desenvolvimento.',
'["https://SEU_PROJECT_ID.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Quiz-Potencial-e-Crescimento.pdf"]'),

-- Módulo 12: Quiz Propósito e Equilíbrio
((SELECT id FROM courses WHERE title = 'HerbaLead Master Course' LIMIT 1), 
'Quiz Propósito e Equilíbrio', 
'Avaliação do senso de propósito e equilíbrio na vida. Ferramenta para ajudar clientes a encontrar alinhamento entre valores e ações.',
'16 min', 12,
'Quiz Propósito e Equilíbrio - Desenvolvimento de propósito e busca por equilíbrio na vida.',
'["https://SEU_PROJECT_ID.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Quiz-Proposito-e-Equilibrio.pdf"]');

-- 4. Verificar se tudo foi criado
SELECT 
  cm.title as modulo,
  cm.duration,
  cm.order_index,
  cm.pdf_files,
  c.title as curso
FROM course_modules cm
JOIN courses c ON cm.course_id = c.id
WHERE c.title = 'HerbaLead Master Course'
ORDER BY cm.order_index;

SELECT '✅ Módulos criados automaticamente com sucesso!' as status;
