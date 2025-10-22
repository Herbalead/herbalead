-- Script para tornar usuário ADMIN
-- Execute APENAS este código no Supabase SQL Editor

-- 1. Verificar usuários existentes
SELECT 
  id,
  email,
  name,
  is_active,
  is_admin
FROM professionals 
ORDER BY created_at DESC;

-- 2. Tornar usuário específico admin (substitua pelo seu email)
UPDATE professionals 
SET is_admin = true 
WHERE email = 'seu-email@exemplo.com';

-- 3. Verificar se foi atualizado
SELECT 
  email,
  is_admin,
  is_active
FROM professionals 
WHERE is_admin = true;


















