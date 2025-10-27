-- ============================================
-- FIX: Criar conta de autenticação para Marcela Roberto
-- ============================================
-- Esta script cria uma conta de autenticação (auth.users) para Marcela Roberto
-- que já tem professional e subscription criados

-- 1. Primeiro, buscar informações da Marcela
SELECT 
    id as professional_id,
    email,
    name,
    phone,
    subscription_status,
    created_at
FROM professionals
WHERE email LIKE '%marcela%' OR name ILIKE '%marcela%';

-- 2. Anotar o ID encontrado acima (por exemplo: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')

-- 3. Verificar se já tem auth (substituir pelo ID real encontrado acima)
SELECT id, email, created_at
FROM auth.users
WHERE id = 'SEU_PROFESSIONAL_ID_AQUI';

-- 4. Se não tiver auth, criar usando Admin API via JavaScript/Node.js
-- Porque não podemos criar auth.users diretamente via SQL

-- ============================================
-- SOLUÇÃO MANUAL:
-- ============================================

-- Opção 1: Usar o Supabase Admin API via página de recuperação de senha
-- 1. Ir em Authentication > Users > Add User
-- 2. Adicionar:
--    - Email: (email da Marcela encontrado na query acima)
--    - Password: SenhaTemporaria123!
--    - Auto Confirm: SIM
--    - User ID: (pegar o ID do professional encontrado na query 1)

-- Opção 2: Via terminal com Supabase CLI
-- supabase db execute -f fix_marcela_auth_manual.sql

-- ============================================
-- QUERY DE VERIFICAÇÃO FINAL:
-- ============================================

-- Verificar se Marcela tem professional, subscription e auth
SELECT 
    p.id as professional_id,
    p.email,
    p.name,
    p.subscription_status,
    p.created_at as professional_created_at,
    au.id as auth_id,
    au.email as auth_email,
    au.created_at as auth_created_at,
    s.id as subscription_id,
    s.status as subscription_status,
    s.created_at as subscription_created_at
FROM professionals p
LEFT JOIN auth.users au ON p.id = au.id
LEFT JOIN subscriptions s ON p.id = s.user_id
WHERE p.email LIKE '%marcela%' OR p.name ILIKE '%marcela%';

-- ============================================
-- INSTRUÇÕES PARA CRIAR A AUTH VIA DASHBOARD:
-- ============================================

-- 1. Ir para: https://supabase.com/dashboard/project/[seu-projeto]/auth/users
-- 2. Clicar em "Add user" ou "Invite user"
-- 3. Preencher:
--    - Email: (email da Marcela)
--    - Password: SenhaTemporaria123!
--    - Importante: Usar o mesmo ID do professional.id
-- 4. Marcar "Auto confirm user"
-- 5. Salvar

-- ============================================
-- OU VIA SUPA_CLI:
-- ============================================

-- supabase admin create-user \
--   --email marcelaroberto@email.com \
--   --password 'SenhaTemporaria123!' \
--   --user-id [professional_id_aqui] \
--   --email-confirmed

