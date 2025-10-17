-- Script para criar sistema de senha administrativa
-- Execute este código no Supabase SQL Editor

-- 1. Adicionar coluna para senha administrativa
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'professionals' 
        AND column_name = 'admin_password'
    ) THEN
        ALTER TABLE professionals ADD COLUMN admin_password VARCHAR(255);
        RAISE NOTICE 'Coluna admin_password adicionada à tabela professionals';
    ELSE
        RAISE NOTICE 'Coluna admin_password já existe na tabela professionals';
    END IF;
END $$;

-- 2. Criar função para definir senha administrativa
CREATE OR REPLACE FUNCTION set_admin_password(user_email TEXT, admin_password TEXT)
RETURNS TEXT AS $$
DECLARE
    user_id UUID;
    result TEXT;
BEGIN
    -- Buscar ID do usuário pelo email
    SELECT id INTO user_id 
    FROM professionals 
    WHERE email = user_email;
    
    IF user_id IS NULL THEN
        RETURN 'Usuário não encontrado com o email: ' || user_email;
    END IF;
    
    -- Definir senha administrativa e tornar admin
    UPDATE professionals 
    SET is_admin = true, 
        is_active = true,
        admin_password = crypt(admin_password, gen_salt('bf'))
    WHERE id = user_id;
    
    result := 'Senha administrativa definida para ' || user_email || ' e usuário promovido a administrador!';
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 3. Criar função para verificar senha administrativa
CREATE OR REPLACE FUNCTION verify_admin_password(user_email TEXT, admin_password TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    stored_password TEXT;
BEGIN
    -- Buscar senha armazenada
    SELECT admin_password INTO stored_password
    FROM professionals 
    WHERE email = user_email AND is_admin = true;
    
    IF stored_password IS NULL THEN
        RETURN false;
    END IF;
    
    -- Verificar senha
    RETURN stored_password = crypt(admin_password, stored_password);
END;
$$ LANGUAGE plpgsql;

-- 4. Criar função para alterar senha administrativa
CREATE OR REPLACE FUNCTION change_admin_password(user_email TEXT, old_password TEXT, new_password TEXT)
RETURNS TEXT AS $$
DECLARE
    user_id UUID;
    result TEXT;
BEGIN
    -- Verificar senha atual
    IF NOT verify_admin_password(user_email, old_password) THEN
        RETURN 'Senha atual incorreta!';
    END IF;
    
    -- Buscar ID do usuário
    SELECT id INTO user_id 
    FROM professionals 
    WHERE email = user_email AND is_admin = true;
    
    IF user_id IS NULL THEN
        RETURN 'Usuário administrador não encontrado!';
    END IF;
    
    -- Atualizar senha
    UPDATE professionals 
    SET admin_password = crypt(new_password, gen_salt('bf'))
    WHERE id = user_id;
    
    result := 'Senha administrativa alterada com sucesso para ' || user_email;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 5. Criar função para remover senha administrativa
CREATE OR REPLACE FUNCTION remove_admin_password(user_email TEXT, admin_password TEXT)
RETURNS TEXT AS $$
DECLARE
    user_id UUID;
    result TEXT;
BEGIN
    -- Verificar senha atual
    IF NOT verify_admin_password(user_email, admin_password) THEN
        RETURN 'Senha administrativa incorreta!';
    END IF;
    
    -- Buscar ID do usuário
    SELECT id INTO user_id 
    FROM professionals 
    WHERE email = user_email AND is_admin = true;
    
    IF user_id IS NULL THEN
        RETURN 'Usuário administrador não encontrado!';
    END IF;
    
    -- Remover privilégios administrativos
    UPDATE professionals 
    SET is_admin = false,
        admin_password = NULL
    WHERE id = user_id;
    
    result := 'Privilégios administrativos removidos de ' || user_email;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 6. Exemplo de uso - Definir senha administrativa
-- Substitua pelos valores reais:
-- SELECT set_admin_password('seu-email@exemplo.com', 'sua-senha-admin');

-- 7. Verificar administradores com senha
SELECT 
    name,
    email,
    is_admin,
    CASE 
        WHEN admin_password IS NOT NULL THEN 'Senha definida'
        ELSE 'Sem senha'
    END as password_status
FROM professionals 
WHERE is_admin = true
ORDER BY created_at DESC;

-- 8. Instruções de uso:
/*
INSTRUÇÕES PARA CONFIGURAR SENHA ADMINISTRATIVA:

1. Para definir senha administrativa e tornar usuário admin:
   SELECT set_admin_password('email@exemplo.com', 'senha-admin-123');

2. Para verificar se a senha está correta:
   SELECT verify_admin_password('email@exemplo.com', 'senha-admin-123');

3. Para alterar senha administrativa:
   SELECT change_admin_password('email@exemplo.com', 'senha-antiga', 'senha-nova');

4. Para remover privilégios administrativos:
   SELECT remove_admin_password('email@exemplo.com', 'senha-atual');

5. Para ver administradores e status das senhas:
   SELECT name, email, is_admin, 
          CASE WHEN admin_password IS NOT NULL THEN 'Senha definida' ELSE 'Sem senha' END
   FROM professionals WHERE is_admin = true;
*/

-- 9. Status final
SELECT 'Sistema de senha administrativa configurado com sucesso!' as status;












