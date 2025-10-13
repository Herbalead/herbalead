-- Script SIMPLES para limpar tudo do Claudinei Leite
-- Execute este script no Supabase SQL Editor

-- 1. DELETAR da tabela professionals
DELETE FROM professionals 
WHERE email = 'claubemestar@gmail.com';

-- 2. DELETAR da tabela auth.users
DELETE FROM auth.users 
WHERE email = 'claubemestar@gmail.com';

-- 3. VERIFICAR se foi limpo
SELECT 'auth.users' as tabela, COUNT(*) as registros
FROM auth.users 
WHERE email = 'claubemestar@gmail.com'

UNION ALL

SELECT 'professionals' as tabela, COUNT(*) as registros
FROM professionals 
WHERE email = 'claubemestar@gmail.com';

-- 4. MENSAGEM DE SUCESSO
SELECT 'LIMPEZA CONCLUÍDA!' as status;
SELECT 'O Claudinei pode se cadastrar novamente.' as resultado;
