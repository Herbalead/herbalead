-- ===================================================
-- CORRIGIR UUID DA MARCELA ROBERTO
-- ===================================================
-- Problem: Auth foi criada com UUID diferente do professional_id
-- Solution: Atualizar professional.id para usar o auth.id

-- Auth criada:
-- User UID: f7a15f22-9699-4b04-9f9d-0d48dd558989
-- Email: marcela_roberto@hotmail.com

-- Professional antigo:
-- ID: a30b5935-3bdc-4b30-a78b-346d10c287c4

-- ===================================================
-- SOLUÇÃO: Atualizar professional para usar auth.id
-- ===================================================

-- 1. Verificar dados atuais
SELECT 
    p.id as professional_id,
    p.email,
    p.name,
    au.id as auth_id,
    au.email as auth_email
FROM professionals p
LEFT JOIN auth.users au ON p.id = au.id
WHERE p.email = 'marcela_roberto@hotmail.com' OR p.email LIKE '%marcela%';

-- 2. Atualizar professional para usar o novo auth.id
UPDATE professionals
SET id = 'f7a15f22-9699-4b04-9f9d-0d48dd558989'
WHERE id = 'a30b5935-3bdc-4b30-a78b-346d10c287c4';

-- 3. Verificar update
SELECT 
    p.id as professional_id,
    p.email,
    p.name,
    au.id as auth_id,
    au.email as auth_email,
    CASE 
        WHEN p.id = au.id THEN '✅ VINCULADO CORRETAMENTE' 
        ELSE '❌ NÃO VINCULADO' 
    END as status
FROM professionals p
LEFT JOIN auth.users au ON p.id = au.id
WHERE p.email = 'marcela_roberto@hotmail.com';

-- ===================================================
-- NOTA: Se houver foreign key constraints, pode dar erro
-- ===================================================
-- Se der erro, precisa:
-- 1. Desabilitar constraint temporariamente
-- 2. Fazer update
-- 3. Reabilitar constraint

-- ALTERNATIVA MAIS SEGURA: Criar novo professional e migrar dados

-- ===================================================
-- ALTERNATIVA: Criar novo professional vinculado
-- ===================================================

-- 1. Buscar dados do professional antigo
SELECT * FROM professionals 
WHERE id = 'a30b5935-3bdc-4b30-a78b-346d10c287c4';

-- 2. Inserir novo professional com ID da auth
INSERT INTO professionals (
    id,  -- Usar auth.id
    email,
    name,
    phone,
    specialty,
    company,
    subscription_status,
    is_active,
    max_leads,
    created_at,
    updated_at
)
SELECT 
    'f7a15f22-9699-4b04-9f9d-0d48dd558989' as id,  -- auth.id
    email,
    name,
    phone,
    specialty,
    company,
    subscription_status,
    is_active,
    max_leads,
    created_at,
    updated_at
FROM professionals
WHERE id = 'a30b5935-3bdc-4b30-a78b-346d10c287c4';

-- 3. Verificar se novo professional foi criado
SELECT * FROM professionals 
WHERE id = 'f7a15f22-9699-4b04-9f9d-0d48dd558989';

-- 4. Migrar links (se houver foreign key com user_id)
UPDATE links
SET user_id = 'f7a15f22-9699-4b04-9f9d-0d48dd558989'
WHERE user_id = 'a30b5935-3bdc-4b30-a78b-346d10c287c4';

-- 5. Migrar subscriptions
UPDATE subscriptions
SET user_id = 'f7a15f22-9699-4b04-9f9d-0d48dd558989'
WHERE user_id = 'a30b5935-3bdc-4b30-a78b-346d10c287c4';

-- 6. (Opcional) Deletar professional antigo
-- DELETE FROM professionals WHERE id = 'a30b5935-3bdc-4b30-a78b-346d10c287c4';

-- ===================================================
-- VERIFICAÇÃO FINAL
-- ===================================================
SELECT 
    p.id,
    p.email,
    p.name,
    p.subscription_status,
    au.id as auth_id,
    au.email as auth_email,
    COUNT(l.id) as total_links,
    COUNT(s.id) as total_subscriptions
FROM professionals p
LEFT JOIN auth.users au ON p.id = au.id
LEFT JOIN links l ON p.id = l.user_id
LEFT JOIN subscriptions s ON p.id = s.user_id
WHERE p.email = 'marcela_roberto@hotmail.com'
GROUP BY p.id, p.email, p.name, p.subscription_status, au.id, au.email;

