-- Script SIMPLES para resolver problema da Jessica
-- Execute uma query por vez no Supabase SQL Editor

-- 1. PRIMEIRO: Verificar se existe Jessica na tabela professionals
SELECT * FROM professionals 
WHERE name ILIKE '%jessica%' 
   OR email ILIKE '%jessica%' 
   OR email ILIKE '%jess%';

-- 2. SEGUNDO: Se encontrou registros acima, deletar eles
-- ⚠️ DESCOMENTE APENAS SE ENCONTROU REGISTROS NA QUERY ANTERIOR ⚠️
/*
DELETE FROM professionals 
WHERE name ILIKE '%jessica%' 
   OR email ILIKE '%jessica%' 
   OR email ILIKE '%jess%';
*/

-- 3. TERCEIRO: Verificar se existe Jessica no auth.users
SELECT * FROM auth.users 
WHERE email ILIKE '%jessica%' 
   OR email ILIKE '%jess%';

-- 4. QUARTO: Se encontrou registros no auth.users, você precisa deletar manualmente
-- Vá em: Supabase Dashboard > Authentication > Users
-- Procure pela Jessica e delete o usuário lá

-- 5. QUINTO: Testar se funcionou
-- Peça para a Jessica tentar se cadastrar novamente
