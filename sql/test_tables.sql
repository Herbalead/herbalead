-- Script de teste para verificar se as tabelas existem
-- Execute este script no Supabase SQL Editor

-- Verificar se a tabela quizzes existe
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = 'quizzes'
        ) THEN '✅ Tabela quizzes existe'
        ELSE '❌ Tabela quizzes NÃO existe'
    END as status_quizzes;

-- Verificar se a tabela questions existe
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = 'questions'
        ) THEN '✅ Tabela questions existe'
        ELSE '❌ Tabela questions NÃO existe'
    END as status_questions;

-- Verificar se a tabela professionals existe
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = 'professionals'
        ) THEN '✅ Tabela professionals existe'
        ELSE '❌ Tabela professionals NÃO existe'
    END as status_professionals;

-- Listar todas as tabelas do banco
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
