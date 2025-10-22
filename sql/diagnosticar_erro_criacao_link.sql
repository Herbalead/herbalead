-- Script para diagnosticar problemas na criação de links
-- Verificar possíveis causas do erro

-- 1. Verificar se há problemas com a tabela links
SELECT 
  'Estrutura da tabela links:' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'links' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar se há problemas com foreign keys
SELECT 
  'Foreign Keys da tabela links:' as info,
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'links';

-- 3. Verificar se há problemas com usuários
SELECT 
  'Usuários ativos:' as info,
  p.id as professional_id,
  p.name,
  p.email,
  p.phone,
  p.subscription_status,
  p.is_active,
  au.id as auth_user_id
FROM professionals p
LEFT JOIN auth.users au ON p.email = au.email
WHERE p.is_active = true
ORDER BY p.created_at DESC
LIMIT 10;

-- 4. Verificar se há problemas com links existentes
SELECT 
  'Links existentes:' as info,
  l.id,
  l.name,
  l.tool_name,
  l.user_id,
  l.status,
  l.created_at,
  p.name as professional_name,
  p.email as professional_email
FROM links l
LEFT JOIN professionals p ON l.user_id = p.id
ORDER BY l.created_at DESC
LIMIT 10;

-- 5. Verificar se há problemas com permissões
SELECT 
  'Permissões da tabela links:' as info,
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'links' 
  AND table_schema = 'public';

-- 6. Testar inserção simples (comentado para não executar automaticamente)
/*
INSERT INTO links (
  user_id,
  name,
  tool_name,
  cta_text,
  redirect_url,
  custom_url,
  custom_message,
  capture_type,
  material_title,
  material_description,
  page_title,
  page_greeting,
  button_text,
  og_image,
  status,
  clicks,
  leads
) VALUES (
  'PROFESSIONAL_ID_AQUI', -- Substitua pelo ID real
  'teste-diagnostico',
  'bmi',
  'Falar com Especialista',
  'https://wa.me/5511999999999',
  '',
  'Teste de diagnóstico',
  'direct',
  '',
  '',
  'Teste',
  'Teste',
  'Testar',
  'https://www.herbalead.com/logos/herbalead/imc-og-image.jpg',
  'active',
  0,
  0
);
*/
