-- Script para encontrar a Stephanie Izidio na tabela correta
-- Tabelas encontradas: auth.users e public.auth_users

-- 1. Verificar estrutura da tabela auth.users
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'auth' 
    AND table_name = 'users'
ORDER BY ordinal_position;

-- 2. Verificar estrutura da tabela public.auth_users
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'auth_users'
ORDER BY ordinal_position;

-- 3. Buscar Stephanie em auth.users
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users
WHERE email ILIKE '%stephanie%'
ORDER BY created_at DESC;

-- 4. Buscar Stephanie em public.auth_users
SELECT 
    id,
    email,
    created_at
FROM public.auth_users
WHERE email ILIKE '%stephanie%'
ORDER BY created_at DESC;

-- 5. Verificar foreign key da tabela links
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
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
    AND tc.table_name = 'links'
    AND kcu.column_name = 'user_id';

-- 6. Verificar se existe algum link da Stephanie usando ambos os IDs
-- (Execute primeiro as consultas acima para encontrar os IDs)

-- Exemplo para auth.users (substitua pelo ID real):
/*
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.created_at,
    u.email as user_email
FROM links l
JOIN auth.users u ON l.user_id = u.id
WHERE l.user_id = 'ID_DA_STEPHANIE_AQUI'
ORDER BY l.created_at DESC;
*/

-- Exemplo para public.auth_users (substitua pelo ID real):
/*
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.created_at,
    u.email as user_email
FROM links l
JOIN public.auth_users u ON l.user_id = u.id
WHERE l.user_id = 'ID_DA_STEPHANIE_AQUI'
ORDER BY l.created_at DESC;
*/
