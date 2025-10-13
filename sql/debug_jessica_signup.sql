-- Script para investigar e resolver problema de cadastro da Jessica
-- Usuário deletado mas ainda bloqueado no Supabase

-- 1. VERIFICAR USUÁRIOS NA TABELA DE AUTENTICAÇÃO
-- Esta query mostra todos os usuários ativos no sistema de auth do Supabase
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    last_sign_in_at,
    deleted_at,
    is_anonymous,
    aud
FROM auth.users 
WHERE email ILIKE '%jessica%' 
   OR email ILIKE '%jess%'
ORDER BY created_at DESC;

-- 2. VERIFICAR REGISTROS ÓRFÃOS NA TABELA PROFESSIONALS
-- Usuários que podem ter sido deletados do auth mas ficaram na tabela professionals
SELECT 
    p.id,
    p.name,
    p.email,
    p.phone,
    p.created_at,
    'ÓRFÃO - Não existe em auth.users' as status
FROM professionals p
LEFT JOIN auth.users u ON p.email = u.email
WHERE u.id IS NULL
  AND (p.name ILIKE '%jessica%' OR p.email ILIKE '%jessica%' OR p.email ILIKE '%jess%')
ORDER BY p.created_at DESC;

-- 3. VERIFICAR TODOS OS REGISTROS DA JESSICA (QUALQUER VARIAÇÃO DO NOME)
SELECT 
    'AUTH USERS' as tabela,
    id,
    email,
    created_at::text,
    deleted_at::text
FROM auth.users 
WHERE email ILIKE '%jessica%' 
   OR email ILIKE '%jess%'
   OR email ILIKE '%jéssica%'

UNION ALL

SELECT 
    'PROFESSIONALS' as tabela,
    id::text,
    email,
    created_at::text,
    NULL as deleted_at
FROM professionals 
WHERE name ILIKE '%jessica%' 
   OR name ILIKE '%jess%'
   OR name ILIKE '%jéssica%'
   OR email ILIKE '%jessica%'
   OR email ILIKE '%jess%'
   OR email ILIKE '%jéssica%'

ORDER BY tabela, created_at DESC;

-- 4. CONTAR REGISTROS ÓRFÃOS GERAL
SELECT 
    COUNT(*) as total_orphans,
    'Registros órfãos (professionals sem auth.users)' as description
FROM professionals p
LEFT JOIN auth.users u ON p.email = u.email
WHERE u.id IS NULL;

-- 5. SOLUÇÃO: DELETAR REGISTROS ÓRFÃOS DA JESSICA
-- ⚠️ EXECUTAR APENAS APÓS CONFIRMAR QUE SÃO ÓRFÃOS ⚠️
/*
DELETE FROM professionals 
WHERE email ILIKE '%jessica%' 
   OR email ILIKE '%jess%'
   OR email ILIKE '%jéssica%'
   AND id NOT IN (
       SELECT p.id 
       FROM professionals p
       JOIN auth.users u ON p.email = u.email
   );
*/

-- 6. VERIFICAR SE EXISTE USUÁRIO SOFT DELETED
-- Alguns usuários podem estar marcados como deletados mas ainda existem
SELECT 
    id,
    email,
    created_at,
    deleted_at,
    CASE 
        WHEN deleted_at IS NOT NULL THEN 'SOFT DELETED'
        ELSE 'ATIVO'
    END as status
FROM auth.users 
WHERE email ILIKE '%jessica%' 
   OR email ILIKE '%jess%'
   OR email ILIKE '%jéssica%'
ORDER BY created_at DESC;

-- 7. SOLUÇÃO ALTERNATIVA: FORÇAR LIMPEZA COMPLETA
-- ⚠️ CUIDADO: Isso deleta TODOS os registros da Jessica ⚠️
/*
-- Deletar da tabela professionals primeiro
DELETE FROM professionals 
WHERE email ILIKE '%jessica%' 
   OR email ILIKE '%jess%'
   OR email ILIKE '%jéssica%';

-- Depois deletar do auth.users (se necessário)
-- Isso deve ser feito via Supabase Dashboard ou API
*/
