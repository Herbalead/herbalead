-- Script para corrigir problema de login administrativo e trocar senha
-- Execute este código no Supabase SQL Editor

-- 1. Verificar se o usuário existe
SELECT 
    name,
    email,
    is_active,
    is_admin,
    admin_password IS NOT NULL as has_password
FROM professionals 
WHERE email = 'faulaandre@gmail.com';

-- 2. Verificar se as funções existem
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%admin%';

-- 3. Se as funções não existem, criar novamente
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

-- 4. Criar função para definir senha administrativa
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

-- 5. Garantir que o usuário é administrador e definir nova senha
UPDATE professionals 
SET is_admin = true, 
    is_active = true,
    admin_password = crypt('Hbl@0842', gen_salt('bf'))
WHERE email = 'faulaandre@gmail.com';

-- 6. Verificar se funcionou
SELECT 
    name,
    email,
    is_active,
    is_admin,
    CASE 
        WHEN admin_password IS NOT NULL THEN 'Senha definida'
        ELSE 'Sem senha'
    END as password_status
FROM professionals 
WHERE email = 'faulaandre@gmail.com';

-- 7. Testar se a nova senha está funcionando
SELECT verify_admin_password('faulaandre@gmail.com', 'Hbl@0842') as senha_correta;

-- 8. Status final
SELECT 'Senha administrativa atualizada para Hbl@0842!' as status;


















