-- Script para diagnosticar problemas da Cleusa Mizuno
-- Problema: Não consegue criar links (diferente da Stephanie que criava mas não funcionavam)

-- 1. Verificar se a Cleusa existe em todas as tabelas
SELECT 
    'professionals' as tabela,
    id,
    name,
    email,
    subscription_status,
    is_active,
    created_at
FROM professionals 
WHERE name ILIKE '%cleusa%mizuno%'
   OR email ILIKE '%cleusa%'
ORDER BY created_at DESC;

-- 2. Verificar se existe em auth.users
SELECT 
    'auth.users' as tabela,
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users
WHERE email ILIKE '%cleusa%'
ORDER BY created_at DESC;

-- 3. Verificar se tem algum link criado
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.created_at,
    p.name as professional_name,
    p.email as professional_email
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.name ILIKE '%cleusa%mizuno%'
   OR p.email ILIKE '%cleusa%'
ORDER BY l.created_at DESC;

-- 4. Verificar se há problemas de foreign key
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

-- 5. Verificar usuários recentes (últimos 2 dias) para comparar
SELECT 
    p.id,
    p.name,
    p.email,
    p.subscription_status,
    p.is_active,
    p.created_at,
    COUNT(l.id) as total_links,
    COUNT(CASE WHEN l.status = 'active' THEN 1 END) as links_ativos
FROM professionals p
LEFT JOIN links l ON p.id = l.user_id
WHERE p.created_at >= NOW() - INTERVAL '2 days'
GROUP BY p.id, p.name, p.email, p.subscription_status, p.is_active, p.created_at
ORDER BY p.created_at DESC;

-- 6. Testar criação de link para a Cleusa (se existir)
-- Substitua CLEUSA_ID pelo ID encontrado na consulta 1
/*
INSERT INTO links (
    id,
    user_id,
    name,
    tool_name,
    cta_text,
    redirect_url,
    custom_url,
    custom_message,
    status,
    clicks,
    leads,
    created_at,
    updated_at,
    capture_type,
    material_title,
    material_description,
    page_title,
    page_greeting,
    button_text
) VALUES (
    gen_random_uuid(),
    'CLEUSA_ID_AQUI', -- Substitua pelo ID da Cleusa
    'teste',
    'bmi',
    'Teste de criação de link',
    'https://wa.me/5511999999999?text=Teste',
    'cleusa-mizuno/teste',
    'Teste de funcionamento',
    'active',
    0,
    0,
    NOW(),
    NOW(),
    'whatsapp',
    'Teste',
    'Teste de criação de link',
    'Teste - Cleusa Mizuno',
    'Olá! Este é um teste.',
    'Testar'
);
*/

