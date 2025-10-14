-- Script para diagnosticar problemas com quizzes
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se há quizzes "duplicados" ou com mesmo project_name
SELECT 
    professional_id,
    project_name,
    title,
    COUNT(*) as quantidade,
    array_agg(id) as ids
FROM quizzes 
GROUP BY professional_id, project_name, title
HAVING COUNT(*) > 1
ORDER BY quantidade DESC;

-- 2. Verificar se há perguntas órfãs (sem quiz)
SELECT 
    q.id as question_id,
    q.quiz_id,
    q.question_text,
    qu.title as quiz_title
FROM questions q
LEFT JOIN quizzes qu ON q.quiz_id = qu.id
WHERE qu.id IS NULL;

-- 3. Verificar se há quizzes sem perguntas
SELECT 
    qu.id as quiz_id,
    qu.title,
    qu.project_name,
    COUNT(q.id) as questions_count
FROM quizzes qu
LEFT JOIN questions q ON qu.id = q.quiz_id
GROUP BY qu.id, qu.title, qu.project_name
HAVING COUNT(q.id) = 0;

-- 4. Verificar estrutura das tabelas
SELECT 
    'quizzes' as tabela,
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'quizzes' 
ORDER BY ordinal_position;

SELECT 
    'questions' as tabela,
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'questions' 
ORDER BY ordinal_position;

-- 5. Verificar constraints e foreign keys
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.table_name IN ('quizzes', 'questions')
ORDER BY tc.table_name, tc.constraint_type;
