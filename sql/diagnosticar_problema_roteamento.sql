-- Script para diagnosticar o problema de roteamento
-- O sistema busca em professionals mas os links estão em auth.users

-- 1. Verificar se existe conexão entre professionals e auth.users
SELECT 
    p.id as professional_id,
    p.name as professional_name,
    p.email as professional_email,
    u.id as user_id,
    u.email as user_email
FROM professionals p
LEFT JOIN auth.users u ON p.email = u.email
WHERE p.name ILIKE '%stephanie%izidio%';

-- 2. Verificar se os links da Stephanie estão usando o ID correto
SELECT 
    l.id,
    l.name,
    l.user_id,
    l.status,
    u.email as user_email,
    p.name as professional_name,
    p.id as professional_id
FROM links l
JOIN auth.users u ON l.user_id = u.id
LEFT JOIN professionals p ON u.email = p.email
WHERE u.email = 'stephanieizidio@hotmail.com';

-- 3. Verificar se existe algum link usando professional.id como user_id
SELECT 
    l.id,
    l.name,
    l.user_id,
    l.status,
    p.name as professional_name,
    p.id as professional_id
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.name ILIKE '%stephanie%izidio%';

-- 4. Verificar a estrutura da tabela professionals
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'professionals'
ORDER BY ordinal_position;

-- 5. SOLUÇÃO: Atualizar os links para usar professional.id como user_id
-- Primeiro, vamos encontrar o professional.id da Stephanie
SELECT 
    id,
    name,
    email
FROM professionals
WHERE name ILIKE '%stephanie%izidio%'
   OR email = 'stephanieizidio@hotmail.com';

-- 6. Atualizar os links para usar o professional.id correto
-- (Execute primeiro a consulta acima para encontrar o professional.id)
-- Substitua PROFESSIONAL_ID_CORRETO pelo ID encontrado

/*
UPDATE links 
SET user_id = 'PROFESSIONAL_ID_CORRETO_AQUI'
WHERE user_id = 'd689279a-2ecd-4a58-a84d-f5eb78cd9e71'
  AND name IN ('proteina', 'minhaproteina');
*/
