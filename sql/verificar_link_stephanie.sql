-- Verificação específica do link da Stephanie Izidio
-- Link que aparece no painel: lead.com/stephanie-izidio/calculadora-proteina

-- 1. Buscar Stephanie Izidio por ID específico (da imagem anterior)
SELECT 
    id,
    name,
    email,
    is_active,
    subscription_status
FROM professionals 
WHERE id = '8d0ccf34-e8a7-4baa-b25a-39158918a11b';

-- 2. Buscar TODOS os links da Stephanie (sem filtros)
SELECT 
    l.*,
    p.name as user_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.id = '8d0ccf34-e8a7-4baa-b25a-39158918a11b';

-- 3. Buscar links com nome "calculadora-proteina" ou similar
SELECT 
    l.*,
    p.name as user_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE l.name ILIKE '%calculadora%proteina%'
   OR l.name ILIKE '%calculadora%'
   OR l.name ILIKE '%proteina%';

-- 4. Verificar se existe algum link com redirect_url contendo "stephanie-izidio"
SELECT 
    l.*,
    p.name as user_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE l.redirect_url ILIKE '%stephanie%izidio%'
   OR l.redirect_url ILIKE '%calculadora%proteina%';

-- 5. Verificar estrutura da tabela links
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'links'
ORDER BY ordinal_position;
