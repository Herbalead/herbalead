-- Script para verificar e corrigir acesso ao curso
-- Execute este código no SQL Editor do Supabase

-- 1. Verificar usuários atuais e seus status
SELECT 
  id,
  email,
  name,
  is_active,
  created_at
FROM professionals 
ORDER BY created_at DESC;

-- 2. Ativar todos os usuários para teste (TEMPORÁRIO)
-- Descomente a linha abaixo para ativar todos os usuários
-- UPDATE professionals SET is_active = true;

-- 3. Verificar se há usuários com is_active = false
SELECT 
  COUNT(*) as usuarios_inativos,
  COUNT(CASE WHEN is_active = true THEN 1 END) as usuarios_ativos
FROM professionals;

-- 4. Ativar usuário específico (substitua pelo email do usuário)
-- UPDATE professionals SET is_active = true WHERE email = 'seu-email@exemplo.com';

-- 5. Verificar estrutura da tabela professionals
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'professionals' 
ORDER BY ordinal_position;
