-- Script para cadastro manual do Claudinei Leite
-- Dados fornecidos pelo usuário:
-- Nome: Claudinei Leite
-- Email: claubemestar@gmail.com
-- Senha: 12345678
-- Telefone: 11940013832
-- Especialidade: Mentor
-- Empresa: CLAU

-- 1. Primeiro, vamos verificar se já existe algum registro órfão
SELECT 
    p.id,
    p.name,
    p.email,
    p.phone,
    p.specialty,
    p.company,
    p.created_at
FROM professionals p
WHERE p.email = 'claubemestar@gmail.com' 
   OR p.name ILIKE '%claudinei%'
   OR p.name ILIKE '%leite%';

-- 2. Verificar se existe na tabela auth.users
SELECT 
    au.id,
    au.email,
    au.created_at,
    au.email_confirmed_at
FROM auth.users au
WHERE au.email = 'claubemestar@gmail.com';

-- 3. Se existir registro órfão, vamos deletá-lo primeiro
DELETE FROM professionals 
WHERE email = 'claubemestar@gmail.com';

-- 4. Criar o registro na tabela auth.users (simulação)
-- NOTA: Esta parte precisa ser feita manualmente no Supabase Auth ou via API
-- O ID do usuário será gerado automaticamente pelo Supabase

-- 5. Inserir o registro na tabela professionals
-- Substitua 'USER_ID_AQUI' pelo ID real do usuário criado no auth.users
INSERT INTO professionals (
    id,
    name,
    email,
    phone,
    specialty,
    company,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(), -- ID será gerado automaticamente
    'Claudinei Leite',
    'claubemestar@gmail.com',
    '5511940013832', -- Telefone com código do país
    'Mentor',
    'CLAU',
    NOW(),
    NOW()
);

-- 6. Verificar se o registro foi criado corretamente
SELECT 
    p.id,
    p.name,
    p.email,
    p.phone,
    p.specialty,
    p.company,
    p.created_at
FROM professionals p
WHERE p.email = 'claubemestar@gmail.com';

-- 7. Opcional: Criar alguns links de exemplo para o usuário
-- (Descomente se quiser criar links automáticos)
/*
INSERT INTO links (
    id,
    user_id,
    name,
    tool_name,
    redirect_url,
    page_title,
    page_greeting,
    button_text,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM professionals WHERE email = 'claubemestar@gmail.com'),
    'IMC',
    'bmi',
    'https://wa.me/5511940013832',
    'Quer uma análise mais completa?',
    'Vi que você calculou seu IMC. Tenho orientações personalizadas que podem ajudar muito no seu bem-estar. Gostaria de mais informações?',
    'Consultar Especialista',
    NOW(),
    NOW()
);
*/
