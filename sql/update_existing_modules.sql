-- Script para atualizar módulos existentes com suas edições
-- Execute este código no Supabase SQL Editor

-- 1. Primeiro, vamos ver o que existe atualmente
SELECT 
    c.title as curso,
    cm.title as modulo,
    cm.video_url,
    cm.pdf_files,
    cm.pdf_materials
FROM course_modules cm
JOIN courses c ON cm.course_id = c.id
ORDER BY c.title, cm.order_index;

-- 2. Atualizar módulos com os novos materiais HTML
-- (Execute apenas se você quiser substituir os materiais existentes)

-- Exemplo de atualização para módulo "Como Começar"
UPDATE course_modules 
SET 
    pdf_files = ARRAY['https://herbalead.com/course/materials/01-como-comecar.html'],
    pdf_materials = 'Aprenda os 10 passos essenciais para começar a usar o Herbalead e gerar seu primeiro lead em 24 horas.',
    updated_at = NOW()
WHERE title = 'Como Começar';

-- Exemplo de atualização para módulo "Como Criar Links"
UPDATE course_modules 
SET 
    pdf_files = ARRAY['https://herbalead.com/course/materials/02-como-criar-links.html'],
    pdf_materials = 'Domine a criação de links personalizados, calculadoras e ferramentas de engajamento.',
    updated_at = NOW()
WHERE title = 'Como Criar Links';

-- Exemplo de atualização para módulo "Como Fazer Quiz"
UPDATE course_modules 
SET 
    pdf_files = ARRAY['https://herbalead.com/course/materials/03-como-fazer-quiz.html'],
    pdf_materials = 'Aprenda a criar quizzes eficazes que identificam o perfil dos seus leads e aumentam conversões.',
    updated_at = NOW()
WHERE title = 'Como Fazer Quiz';

-- 3. Se você tiver um módulo de vendas separado
UPDATE course_modules 
SET 
    pdf_files = ARRAY['https://herbalead.com/course/materials/04-manual-vendas.html'],
    pdf_materials = 'Aprenda a identificar tipos de clientes (frio, morno, quente) e como abordar cada um para maximizar suas vendas.',
    updated_at = NOW()
WHERE title = 'Estratégias de Vendas' OR title = 'Manual de Vendas';

-- 4. Verificar as atualizações
SELECT 
    c.title as curso,
    cm.title as modulo,
    cm.pdf_files,
    cm.pdf_materials,
    cm.updated_at
FROM course_modules cm
JOIN courses c ON cm.course_id = c.id
ORDER BY c.title, cm.order_index;

-- 5. Instruções para upload dos arquivos HTML
-- 
-- IMPORTANTE: Para que os links funcionem, você precisa:
-- 1. Converter os arquivos HTML para PDF
-- 2. Fazer upload dos PDFs no Supabase Storage
-- 3. Atualizar as URLs no banco de dados
--
-- Exemplo de como atualizar após o upload:
-- UPDATE course_modules 
-- SET pdf_files = ARRAY['https://herbalead.supabase.co/storage/v1/object/public/herbalead-public/course-materials/01-como-comecar.pdf']
-- WHERE title = 'Como Começar';
