-- Verificar se o link específico existe no banco de dados
-- Link: https://www.herbalead.com/anna-slim/imc

-- Buscar usuário 'anna-slim'
SELECT 
    id,
    name,
    email,
    username,
    is_active,
    subscription_status
FROM professionals 
WHERE username = 'anna-slim' OR name ILIKE '%anna%' OR name ILIKE '%slim%';

-- Buscar links do usuário 'anna-slim'
SELECT 
    id,
    name,
    tool_name,
    redirect_url,
    cta_text,
    custom_message,
    capture_type,
    created_at
FROM professional_links 
WHERE user_id IN (
    SELECT id FROM professionals 
    WHERE username = 'anna-slim' OR name ILIKE '%anna%' OR name ILIKE '%slim%'
);

-- Buscar todos os usuários com 'anna' no nome
SELECT 
    id,
    name,
    email,
    username,
    is_active,
    subscription_status
FROM professionals 
WHERE name ILIKE '%anna%' OR username ILIKE '%anna%';

-- Verificar estrutura da tabela professional_links
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'professional_links' 
ORDER BY ordinal_position;
