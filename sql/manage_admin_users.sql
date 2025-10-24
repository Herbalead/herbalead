-- Script para gerenciar administradores do sistema
-- Execute este código no Supabase SQL Editor

-- 1. Verificar estrutura atual da tabela professionals
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'professionals' 
ORDER BY ordinal_position;

-- 2. Adicionar coluna is_admin se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'professionals' 
        AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE professionals ADD COLUMN is_admin BOOLEAN DEFAULT false;
        RAISE NOTICE 'Coluna is_admin adicionada à tabela professionals';
    ELSE
        RAISE NOTICE 'Coluna is_admin já existe na tabela professionals';
    END IF;
END $$;

-- 3. Criar função para tornar usuário administrador
CREATE OR REPLACE FUNCTION make_user_admin(user_email TEXT)
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
    
    -- Tornar usuário administrador
    UPDATE professionals 
    SET is_admin = true, is_active = true
    WHERE id = user_id;
    
    result := 'Usuário ' || user_email || ' foi promovido a administrador com sucesso!';
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 4. Criar função para remover privilégios de administrador
CREATE OR REPLACE FUNCTION remove_user_admin(user_email TEXT)
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
    
    -- Remover privilégios de administrador
    UPDATE professionals 
    SET is_admin = false
    WHERE id = user_id;
    
    result := 'Privilégios de administrador removidos do usuário: ' || user_email;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 5. Criar função para listar administradores
CREATE OR REPLACE FUNCTION list_admins()
RETURNS TABLE(
    id UUID,
    name TEXT,
    email TEXT,
    is_active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.name, p.email, p.is_active, p.created_at
    FROM professionals p
    WHERE p.is_admin = true
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 6. Exemplo de uso - Tornar um usuário administrador
-- Substitua 'seu-email@exemplo.com' pelo email do usuário que você quer tornar admin
-- SELECT make_user_admin('seu-email@exemplo.com');

-- 7. Listar todos os administradores atuais
SELECT * FROM list_admins();

-- 8. Verificar usuários ativos
SELECT 
    id,
    name,
    email,
    is_active,
    is_admin,
    created_at
FROM professionals 
ORDER BY created_at DESC;

-- 9. Criar política RLS para administradores
DROP POLICY IF EXISTS "admin_access_policy" ON professionals;
CREATE POLICY "admin_access_policy" ON professionals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM professionals p 
            WHERE p.id = auth.uid() 
            AND p.is_admin = true
        )
    );

-- 10. Verificar se as políticas estão ativas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'professionals';

-- 11. Instruções de uso:
/*
INSTRUÇÕES PARA GERENCIAR ADMINISTRADORES:

1. Para tornar um usuário administrador:
   SELECT make_user_admin('email@exemplo.com');

2. Para remover privilégios de administrador:
   SELECT remove_user_admin('email@exemplo.com');

3. Para listar todos os administradores:
   SELECT * FROM list_admins();

4. Para ver todos os usuários:
   SELECT id, name, email, is_active, is_admin, created_at 
   FROM professionals 
   ORDER BY created_at DESC;

5. Para verificar se um usuário específico é admin:
   SELECT name, email, is_admin 
   FROM professionals 
   WHERE email = 'email@exemplo.com';
*/

-- 12. Status final
SELECT 'Sistema de gerenciamento de administradores configurado com sucesso!' as status;
























