-- CORRIGIR tool_name dos links de recrutamento que estão incorretos
-- Este script corrige links que deveriam ser recruitment-* mas estão com tool_name errado

-- 1. Corrigir links com nome "potencial" ou mensagem sobre "transformar habilidades"
UPDATE links 
SET 
    tool_name = 'recruitment-potencial',
    updated_at = NOW()
WHERE (
    name ILIKE '%potencial%' OR
    page_greeting ILIKE '%transformar suas habilidades%' OR
    page_greeting ILIKE '%crescimento real%'
)
AND tool_name != 'recruitment-potencial'
AND status = 'active';

-- 2. Corrigir links com nome "ganhos" ou mensagem sobre "multiplicar renda"
UPDATE links 
SET 
    tool_name = 'recruitment-ganhos',
    updated_at = NOW()
WHERE (
    name ILIKE '%ganhos%' OR
    page_greeting ILIKE '%multiplicar minha renda%' OR
    page_greeting ILIKE '%aumentar minha renda%'
)
AND tool_name != 'recruitment-ganhos'
AND status = 'active';

-- 3. Corrigir links com nome "proposito" ou mensagem sobre "multiplicar impacto"
UPDATE links 
SET 
    tool_name = 'recruitment-proposito',
    updated_at = NOW()
WHERE (
    name ILIKE '%proposito%' OR
    page_greeting ILIKE '%multiplicar meu impacto%' OR
    page_greeting ILIKE '%equilíbrio entre propósito%'
)
AND tool_name != 'recruitment-proposito'
AND status = 'active';

-- 4. Verificar quantos links foram corrigidos
SELECT 
    'Links corrigidos para recruitment-potencial' as tipo,
    COUNT(*) as quantidade
FROM links 
WHERE tool_name = 'recruitment-potencial'
AND status = 'active'

UNION ALL

SELECT 
    'Links corrigidos para recruitment-ganhos' as tipo,
    COUNT(*) as quantidade
FROM links 
WHERE tool_name = 'recruitment-ganhos'
AND status = 'active'

UNION ALL

SELECT 
    'Links corrigidos para recruitment-proposito' as tipo,
    COUNT(*) as quantidade
FROM links 
WHERE tool_name = 'recruitment-proposito'
AND status = 'active';

-- 5. Listar todos os links de recrutamento após correção
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.status,
    l.page_title,
    l.page_greeting,
    p.name as professional_name,
    l.created_at,
    l.updated_at
FROM links l
JOIN professionals p ON l.user_id = p.id
WHERE l.tool_name IN (
    'recruitment-potencial',
    'recruitment-ganhos',
    'recruitment-proposito'
)
AND l.status = 'active'
ORDER BY l.updated_at DESC;
