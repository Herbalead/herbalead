-- Script para verificar estrutura da tabela professionals
-- Execute este script no Supabase SQL Editor

-- 1. Verificar estrutura atual da tabela professionals
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'professionals' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar se existem constraints ou índices
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'professionals' 
AND tc.table_schema = 'public';

-- 3. Verificar dados existentes na tabela
SELECT COUNT(*) as total_professionals FROM public.professionals;

-- 4. Verificar se há usuários na auth.users sem correspondência em professionals
SELECT 
    au.id as auth_user_id,
    au.email as auth_email,
    au.created_at as auth_created,
    p.id as professional_id,
    p.name as professional_name
FROM auth.users au
LEFT JOIN public.professionals p ON au.id = p.id
WHERE p.id IS NULL
ORDER BY au.created_at DESC;