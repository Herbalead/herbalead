-- Teste de normalização para entender o problema da Stephanie
-- Link que não funciona: stephanie-izidio/calculadora-proteina

-- 1. Simular a normalização que o sistema faz
-- "Calculadora de Proteína" -> "calculadora-de-proteina"
-- "Calculadora Proteína" -> "calculadora-proteina" 
-- "calculadora proteina" -> "calculadora-proteina"

-- 2. Buscar links da Stephanie com diferentes variações
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.created_at,
    p.name as user_name,
    -- Mostrar como seria normalizado
    LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                REGEXP_REPLACE(l.name, '[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]', '', 'g'),
                '\s+', '-', 'g'
            ),
            '[^a-z0-9-]', '', 'g'
        )
    ) as normalized_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.id = '8d0ccf34-e8a7-4baa-b25a-39158918a11b'
ORDER BY l.created_at DESC;

-- 3. Buscar especificamente por projetos que normalizam para "calculadora-proteina"
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    p.name as user_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.id = '8d0ccf34-e8a7-4baa-b25a-39158918a11b'
  AND LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                REGEXP_REPLACE(l.name, '[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]', '', 'g'),
                '\s+', '-', 'g'
            ),
            '[^a-z0-9-]', '', 'g'
        )
    ) = 'calculadora-proteina';

-- 4. Buscar por projetos que contenham "calculadora" E "proteina" (separados)
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    p.name as user_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.id = '8d0ccf34-e8a7-4baa-b25a-39158918a11b'
  AND l.name ILIKE '%calculadora%'
  AND l.name ILIKE '%proteina%';

-- 5. Verificar se existe algum link com nome exato "calculadora-proteina"
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    p.name as user_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.id = '8d0ccf34-e8a7-4baa-b25a-39158918a11b'
  AND l.name = 'calculadora-proteina';

-- 6. Verificar se existe algum link com nome "calculadora" (uma palavra só)
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    p.name as user_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.id = '8d0ccf34-e8a7-4baa-b25a-39158918a11b'
  AND l.name = 'calculadora';

-- 7. Verificar se existe algum link com nome "proteina" (uma palavra só)
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    p.name as user_name
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE p.id = '8d0ccf34-e8a7-4baa-b25a-39158918a11b'
  AND l.name = 'proteina';
