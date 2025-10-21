-- Script SIMPLES para ativar acesso ao curso
-- Execute este código no SQL Editor do Supabase

-- 1. Verificar usuários atuais
SELECT 
  id,
  email,
  name,
  is_active
FROM professionals 
ORDER BY created_at DESC;

-- 2. Ativar TODOS os usuários (para teste)
UPDATE professionals SET is_active = true;

-- 3. Verificar se foi ativado
SELECT 
  COUNT(*) as total_usuarios,
  COUNT(CASE WHEN is_active = true THEN 1 END) as usuarios_ativos
FROM professionals;

















