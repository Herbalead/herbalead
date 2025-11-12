-- 🔄 SINCRONIZAR IDs: Jorge Mattar
-- Email: jjmattar@gmail.com

BEGIN;

-- 1. VERIFICAR SITUAÇÃO ATUAL
SELECT
    '📋 ANTES' as etapa,
    p.id as professional_id,
    p.email,
    p.name,
    au.id as auth_id,
    au.email as auth_email,
    CASE
        WHEN p.id = au.id THEN '✅ Sincronizado'
        ELSE '❌ Dessincronizado'
    END as status
FROM professionals p
FULL OUTER JOIN auth.users au ON p.email = au.email
WHERE p.email = 'jjmattar@gmail.com'
   OR au.email = 'jjmattar@gmail.com';

-- 2. OBTER AUTH ID E SINCRONIZAR
DO $$
DECLARE
    auth_id UUID;
    professional_id UUID;
    email_jorge TEXT := 'jjmattar@gmail.com';
    dados_professional RECORD;
BEGIN
    -- Buscar auth ID
    SELECT id INTO auth_id
    FROM auth.users
    WHERE email = email_jorge
    LIMIT 1;

    -- Buscar professional ID atual e salvar dados
    SELECT * INTO dados_professional
    FROM professionals
    WHERE email = email_jorge
    LIMIT 1;

    IF auth_id IS NULL THEN
        RAISE EXCEPTION '❌ Usuário não encontrado no auth.users';
    END IF;

    IF dados_professional IS NULL THEN
        RAISE EXCEPTION '❌ Professional não encontrado';
    END IF;

    professional_id := dados_professional.id;

    -- Se IDs são diferentes, sincronizar
    IF auth_id != professional_id THEN
        RAISE NOTICE '⚠️ IDs diferentes. Auth: %, Professional: %', auth_id, professional_id;
        
        -- Migrar subscriptions
        UPDATE subscriptions
        SET user_id = auth_id
        WHERE user_id = professional_id
        AND user_id != auth_id;

        -- Migrar links
        UPDATE links
        SET user_id = auth_id
        WHERE user_id = professional_id
        AND user_id != auth_id;

        -- Deletar professional antigo
        DELETE FROM professionals
        WHERE id = professional_id;

        -- Criar professional com ID do auth usando dados salvos
        INSERT INTO professionals (
            id, email, name, phone, specialty, company,
            subscription_status, is_active, is_admin, max_leads, created_at, updated_at
        )
        VALUES (
            auth_id,
            email_jorge,
            COALESCE(dados_professional.name, 'Jorge Mattar'),
            dados_professional.phone,
            dados_professional.specialty,
            dados_professional.company,
            COALESCE(dados_professional.subscription_status, 'active'),
            true,
            false,
            COALESCE(dados_professional.max_leads, 100),
            COALESCE(dados_professional.created_at, NOW()),
            NOW()
        );

        RAISE NOTICE '✅ IDs sincronizados com sucesso!';
    ELSE
        RAISE NOTICE '✅ IDs já estão sincronizados!';
    END IF;
END $$;

-- 3. VERIFICAÇÃO FINAL
SELECT
    '✅ DEPOIS' as etapa,
    p.id as professional_id,
    p.email,
    p.name,
    p.is_active,
    p.subscription_status,
    au.id as auth_id,
    au.email_confirmed_at,
    CASE
        WHEN p.id = au.id AND p.is_active = true THEN '✅ LOGIN DEVE FUNCIONAR!'
        WHEN p.id != au.id THEN '❌ IDs ainda diferentes'
        WHEN p.is_active = false THEN '❌ Professional inativo'
        WHEN au.email_confirmed_at IS NULL THEN '⚠️ Email não confirmado (pode usar recuperação de senha)'
        ELSE '⚠️ Verificar manualmente'
    END as status_login
FROM professionals p
LEFT JOIN auth.users au ON p.id = au.id
WHERE p.email = 'jjmattar@gmail.com';

COMMIT;

