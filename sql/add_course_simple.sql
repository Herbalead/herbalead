-- Script SUPER SIMPLES para adicionar cursos
-- Execute este código no Supabase SQL Editor

-- 1. Adicionar apenas o curso principal
INSERT INTO courses (
    title,
    description,
    difficulty_level,
    estimated_hours,
    is_active
) VALUES (
    'Treinamento Herbalead',
    'Curso completo para dominar a plataforma Herbalead',
    'beginner',
    2,
    true
);

-- 2. Adicionar módulos do curso
INSERT INTO course_modules (
    course_id,
    title,
    description,
    duration,
    order_index,
    is_active,
    pdf_materials
) 
SELECT 
    c.id,
    'Como Começar',
    'Guia completo para iniciar na plataforma',
    '15 min',
    1,
    true,
    'Aprenda os 10 passos essenciais para começar a usar o Herbalead'
FROM courses c WHERE c.title = 'Treinamento Herbalead'

UNION ALL

SELECT 
    c.id,
    'Como Criar Links',
    'Tutorial para criar links personalizados',
    '20 min',
    2,
    true,
    'Domine a criação de links personalizados e calculadoras'
FROM courses c WHERE c.title = 'Treinamento Herbalead'

UNION ALL

SELECT 
    c.id,
    'Como Fazer Quiz',
    'Guia para criar quizzes que convertem',
    '25 min',
    3,
    true,
    'Aprenda a criar quizzes eficazes que identificam perfis'
FROM courses c WHERE c.title = 'Treinamento Herbalead';

-- 3. Verificar se foi criado
SELECT 
    c.title as curso,
    COUNT(cm.id) as modulos
FROM courses c
LEFT JOIN course_modules cm ON c.id = cm.course_id
WHERE c.title = 'Treinamento Herbalead'
GROUP BY c.id, c.title;
