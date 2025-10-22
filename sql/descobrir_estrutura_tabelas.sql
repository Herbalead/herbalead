-- Script para descobrir a estrutura correta das tabelas
-- Problema: tabela "users" não existe

-- 1. Listar todas as tabelas do schema público
SELECT 
    table_name,
    table_schema
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Listar todas as tabelas do schema auth
SELECT 
    table_name,
    table_schema
FROM information_schema.tables 
WHERE table_schema = 'auth'
ORDER BY table_name;

-- 3. Verificar a estrutura da tabela links para ver qual tabela ela referencia
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'links';

-- 4. Verificar se existe tabela auth.users
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'auth' 
    AND table_name = 'users'
ORDER BY ordinal_position;

-- 5. Buscar Stephanie em auth.users (se existir)
SELECT 
    id,
    email,
    created_at
FROM auth.users
WHERE email ILIKE '%stephanie%'
ORDER BY created_at DESC;

-- 6. Verificar se existe alguma tabela que contenha usuários
SELECT 
    table_name,
    table_schema
FROM information_schema.tables 
WHERE table_name ILIKE '%user%'
ORDER BY table_schema, table_name;
