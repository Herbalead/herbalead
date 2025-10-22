-- Script para corrigir outros usuários com o mesmo problema
-- Problema: Interface usa auth.users.id mas links precisam de professionals.id

-- 1. Verificar usuários que têm auth.users mas não conseguem criar links
SELECT 
    u.id as auth_user_id,
    u.email as auth_email,
    p.id as professional_id,
    p.name as professional_name,
    p.email as professional_email,
    COUNT(l.id) as total_links
FROM auth.users u
LEFT JOIN professionals p ON u.email = p.email
LEFT JOIN links l ON p.id = l.user_id
WHERE u.email_confirmed_at IS NOT NULL
GROUP BY u.id, u.email, p.id, p.name, p.email
HAVING COUNT(l.id) = 0
ORDER BY u.created_at DESC;

-- 2. Criar links para usuários que não conseguem criar pela interface
-- Substitua os IDs pelos encontrados na consulta acima

-- Exemplo para usuários sem links:
/*
-- Para cada usuário sem links, criar um link de teste
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
) VALUES 
-- Substitua PROFESSIONAL_ID pelo ID encontrado na consulta 1
-- Substitua USER_NAME pelo nome do usuário
(
    gen_random_uuid(),
    'PROFESSIONAL_ID_AQUI',
    'teste',
    'bmi',
    'Teste de criação de link',
    'https://wa.me/5511999999999?text=Teste',
    'USER_NAME/teste',
    'Teste de funcionamento',
    'active',
    0,
    0,
    NOW(),
    NOW(),
    'whatsapp',
    'Teste',
    'Teste de criação de link',
    'Teste - USER_NAME',
    'Olá! Este é um teste.',
    'Testar'
);
*/

-- 3. Verificar usuários que já têm links funcionando
SELECT 
    u.id as auth_user_id,
    u.email as auth_email,
    p.id as professional_id,
    p.name as professional_name,
    COUNT(l.id) as total_links
FROM auth.users u
JOIN professionals p ON u.email = p.email
JOIN links l ON p.id = l.user_id
WHERE u.email_confirmed_at IS NOT NULL
GROUP BY u.id, u.email, p.id, p.name
ORDER BY COUNT(l.id) DESC;

