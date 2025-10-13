-- Script para limpar COMPLETAMENTE todos os registros do Claudinei Leite
-- Execute este script no Supabase SQL Editor

-- Email do Claudinei
DO $$
DECLARE
    claudinei_email TEXT := 'claubemestar@gmail.com';
    auth_user_id UUID;
BEGIN
    RAISE NOTICE 'Iniciando limpeza para o email: %', claudinei_email;

    -- 1. Encontrar o ID do usuário na tabela auth.users
    SELECT id INTO auth_user_id FROM auth.users WHERE email = claudinei_email;

    IF auth_user_id IS NOT NULL THEN
        RAISE NOTICE 'Usuário encontrado em auth.users com ID: %', auth_user_id;

        -- 2. Deletar registros relacionados na tabela professionals
        RAISE NOTICE 'Deletando registros em professionals para o email: %', claudinei_email;
        DELETE FROM public.professionals WHERE email = claudinei_email;
        RAISE NOTICE 'Registros em professionals deletados.';

        -- 3. Deletar o usuário da tabela auth.users
        -- ATENÇÃO: Esta operação é irreversível e remove as credenciais de login.
        RAISE NOTICE 'Deletando usuário em auth.users com ID: %', auth_user_id;
        DELETE FROM auth.users WHERE id = auth_user_id;
        RAISE NOTICE 'Usuário em auth.users deletado.';
    ELSE
        RAISE NOTICE 'Nenhum usuário encontrado em auth.users para o email: %', claudinei_email;
        -- Se não encontrou em auth.users, ainda pode haver em professionals (registro órfão)
        RAISE NOTICE 'Verificando e deletando registros órfãos em professionals para o email: %', claudinei_email;
        DELETE FROM public.professionals WHERE email = claudinei_email;
        RAISE NOTICE 'Registros órfãos em professionals deletados (se existirem).';
    END IF;

    RAISE NOTICE 'Limpeza concluída para o email: %', claudinei_email;

    -- 4. Verificação final (opcional)
    RAISE NOTICE 'Verificação final:';
    PERFORM id, email FROM auth.users WHERE email = claudinei_email;
    IF FOUND THEN
        RAISE NOTICE 'ERRO: Usuário ainda existe em auth.users.';
    ELSE
        RAISE NOTICE 'SUCESSO: Usuário não encontrado em auth.users.';
    END IF;

    PERFORM id, name, email FROM public.professionals WHERE email = claudinei_email;
    IF FOUND THEN
        RAISE NOTICE 'ERRO: Perfil ainda existe em professionals.';
    ELSE
        RAISE NOTICE 'SUCESSO: Perfil não encontrado em professionals.';
    END IF;

END $$;
