-- Verificar status do usuário Galdino
SELECT 
    id,
    name,
    email,
    is_active,
    subscription_status,
    created_at
FROM professionals 
WHERE name ILIKE '%galdino%' OR email ILIKE '%galdino%';

-- Verificar se existe na auth.users
SELECT 
    id,
    email,
    created_at
FROM auth.users 
WHERE email ILIKE '%galdino%';
