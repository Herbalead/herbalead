-- Verificar estrutura da tabela professionals
-- Execute este código no SQL Editor do Supabase

-- 1. Verificar colunas existentes na tabela professionals
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'professionals' 
ORDER BY ordinal_position;

-- 2. Verificar se existem colunas relacionadas a subscription
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'professionals' 
AND column_name LIKE '%subscription%' 
OR column_name LIKE '%trial%' 
OR column_name LIKE '%plan%'
OR column_name LIKE '%status%';







