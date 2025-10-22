-- SCRIPT SUPER SIMPLES - SÓ EXECUTAR!
-- Execute este script no SQL Editor do Supabase

-- IMPORTANTE: Script atualizado com o código do Supabase: rjwuedzmapeozijjrcik

-- 1. Criar curso se não existir
INSERT INTO courses (title, description, is_active, enrollment_required)
VALUES ('Como Usar as Ferramentas', 'Curso completo ensinando como usar todas as ferramentas do HerbaLead', true, true)
ON CONFLICT DO NOTHING;

-- 2. Inserir todos os módulos de uma vez
INSERT INTO course_modules (course_id, title, description, duration, order_index, pdf_materials, pdf_files) VALUES

((SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1), 'Calculadora de Hidratação', 'Aprenda como usar a Calculadora de Hidratação para calcular a necessidade diária de água dos seus clientes baseada em peso, atividade física e clima.', '15 min', 1, 'Como usar a Calculadora de Hidratação - Guia completo da ferramenta.', ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Calculadora-de-Hidratacao.pdf']),

((SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1), 'Calculadora de IMC', 'Domine a Calculadora de IMC para avaliar o Índice de Massa Corporal dos clientes e fornecer orientações nutricionais precisas.', '12 min', 2, 'Como usar a Calculadora de IMC - Ferramenta fundamental para avaliação nutricional.', ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/CALCULADORA-DE-IMC.pdf']),

((SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1), 'Calculadora de Proteína', 'Saiba como usar a Calculadora de Proteína para prescrever a quantidade ideal de proteína baseada nos objetivos do cliente.', '18 min', 3, 'Como usar a Calculadora de Proteína - Prescrição nutricional adequada.', ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/CALCULADORA-DE-PROTEINA.pdf']),

((SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1), 'Como Se Comportar Antes de Enviar uma Ferramenta', 'Aprenda as melhores práticas profissionais antes de compartilhar ferramentas com clientes para maximizar o engajamento.', '20 min', 4, 'Como se comportar antes de enviar uma ferramenta - Preparação profissional.', ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Como-Se-Comportar-Antes-de-Enviar-uma-Ferramenta.pdf']),

((SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1), 'Composição Corporal', 'Entenda como avaliar e interpretar a composição corporal dos clientes para prescrições mais precisas e personalizadas.', '25 min', 5, 'Como usar a análise de Composição Corporal - Avaliação completa.', ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Composicao-Corporal.pdf']),

((SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1), 'Planejador de Refeições', 'Domine o Planejador de Refeições para criar planos alimentares personalizados com cardápios e listas de compras.', '30 min', 6, 'Como usar o Planejador de Refeições - Criação de planos alimentares.', ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Planejador-de-Refeicoes.pdf']),

((SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1), 'Quiz de Alimentação Saudável', 'Aprenda como usar o Quiz de Alimentação Saudável para engajar clientes e avaliar seus hábitos alimentares.', '15 min', 7, 'Como usar o Quiz de Alimentação Saudável - Ferramenta de engajamento.', ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Quiz-de-Alimentacao-Saudavel.pdf']),

((SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1), 'Quiz de Bem-Estar Diário', 'Saiba como aplicar o Quiz de Bem-Estar Diário para avaliar o estilo de vida e bem-estar dos clientes.', '12 min', 8, 'Como usar o Quiz de Bem-Estar Diário - Avaliação de estilo de vida.', ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Quiz-de-Bem-Estar-Diario.pdf']),

((SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1), 'Quiz Ganhos e Prosperidade', 'Aprenda como usar o Quiz Ganhos e Prosperidade para desenvolver a mentalidade financeira dos clientes.', '18 min', 9, 'Como usar o Quiz Ganhos e Prosperidade - Desenvolvimento financeiro.', ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/QUIZ-GANHOS-E-PROSPERIDADE.pdf']),

((SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1), 'Quiz Perfil de Bem-Estar', 'Domine o Quiz Perfil de Bem-Estar para criar diagnósticos personalizados e identificar áreas de melhoria.', '20 min', 10, 'Como usar o Quiz Perfil de Bem-Estar - Diagnóstico personalizado.', ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Quiz-Perfil-de-Bem-Estar.pdf']),

((SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1), 'Quiz Potencial e Crescimento', 'Aprenda como usar o Quiz Potencial e Crescimento para identificar oportunidades de desenvolvimento pessoal.', '22 min', 11, 'Como usar o Quiz Potencial e Crescimento - Desenvolvimento pessoal.', ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Quiz-Potencial-e-Crescimento.pdf']),

((SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1), 'Quiz Propósito e Equilíbrio', 'Saiba como aplicar o Quiz Propósito e Equilíbrio para ajudar clientes a encontrar alinhamento na vida.', '16 min', 12, 'Como usar o Quiz Propósito e Equilíbrio - Desenvolvimento de propósito.', ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Quiz-Proposito-e-Equilibrio.pdf']);

-- 3. Verificar se funcionou
SELECT '✅ Módulos criados com sucesso!' as status;
SELECT COUNT(*) as total_modulos FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1);
