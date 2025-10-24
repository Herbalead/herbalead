-- INVESTIGAÇÃO COMPLETA DO OLÍVIO
-- Link: https://www.herbalead.com/olivioortola/calculoimc
-- Execute este script no Supabase SQL Editor

-- 1. VERIFICAR CADASTRO COMPLETO DO OLÍVIO
SELECT 
    id,
    name,
    email,
    phone,
    username,
    is_active,
    subscription_status,
    created_at,
    updated_at
FROM professionals 
WHERE name ILIKE '%olivio%ortola%'
   OR name ILIKE '%olivio ortola%'
   OR name ILIKE '%olivio.ortola%'
   OR email ILIKE '%olivio%'
ORDER BY created_at DESC;

-- 2. VERIFICAR SE EXISTE USERNAME 'olivioortola'
SELECT 
    id,
    name,
    email,
    phone,
    username,
    is_active,
    subscription_status
FROM professionals 
WHERE username = 'olivioortola'
ORDER BY created_at DESC;

-- 3. VERIFICAR TODOS OS LINKS DO OLÍVIO
SELECT 
    l.id,
    l.name as projeto,
    l.tool_name as ferramenta,
    l.status,
    l.page_title,
    l.page_greeting,
    l.button_text,
    l.created_at,
    l.updated_at,
    p.name as usuario,
    p.username,
    p.phone as telefone_usuario
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.name ILIKE '%olivio%'
   OR p.email ILIKE '%olivio%'
ORDER BY l.created_at DESC;

-- 4. VERIFICAR ESPECIFICAMENTE LINK 'calculoimc' COM FERRAMENTA 'bmi'
SELECT 
    l.id,
    l.name as projeto,
    l.tool_name as ferramenta,
    l.status,
    l.page_title,
    l.page_greeting,
    l.button_text,
    l.created_at,
    p.name as usuario,
    p.username,
    p.phone as telefone_usuario
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE (p.name ILIKE '%olivio%' OR p.email ILIKE '%olivio%')
  AND l.name = 'calculoimc'
  AND l.tool_name = 'bmi'
ORDER BY l.created_at DESC;

-- 5. VERIFICAR SE HÁ LINKS COM NOME SIMILAR
SELECT 
    l.id,
    l.name as projeto,
    l.tool_name as ferramenta,
    l.status,
    p.name as usuario,
    p.username
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE l.name ILIKE '%calculo%imc%'
   OR l.name ILIKE '%calculoimc%'
ORDER BY l.created_at DESC;

-- 6. VERIFICAR STATUS DE ATIVAÇÃO DO USUÁRIO
SELECT 
    id,
    name,
    email,
    phone,
    username,
    is_active,
    subscription_status,
    CASE 
        WHEN is_active = false THEN 'USUÁRIO INATIVO'
        WHEN subscription_status != 'active' THEN 'ASSINATURA INATIVA'
        WHEN phone IS NULL OR phone = '' THEN 'SEM TELEFONE'
        WHEN username IS NULL THEN 'SEM USERNAME'
        ELSE 'USUÁRIO OK'
    END as status_diagnostico
FROM professionals 
WHERE name ILIKE '%olivio%'
ORDER BY created_at DESC;

-- 7. VERIFICAR SE HÁ PROBLEMAS DE PERMISSÃO (RLS)
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE tablename IN ('professionals', 'links');

-- 8. CONTAR TOTAL DE LINKS POR STATUS
SELECT 
    status,
    COUNT(*) as total
FROM links 
GROUP BY status;

-- 9. VERIFICAR LINKS RECENTES (últimos 10)
SELECT 
    l.id,
    l.name as projeto,
    l.tool_name as ferramenta,
    l.status,
    l.created_at,
    p.name as usuario,
    p.username,
    p.is_active as usuario_ativo,
    p.subscription_status
FROM links l
JOIN professionals p ON l.user_id = p.id
ORDER BY l.created_at DESC
LIMIT 10;







