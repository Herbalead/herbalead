-- Script para atualizar a coluna og_image na tabela links
-- Execute no SQL Editor do Supabase

-- 1. Adicionar coluna se não existir
ALTER TABLE links ADD COLUMN IF NOT EXISTS og_image TEXT;

-- 2. Atualizar TODOS os links existentes com imagens baseadas na ferramenta
-- IMPORTANTE: Remove a condição WHERE para atualizar TODOS os links, mesmo os que já têm imagem
UPDATE links 
SET og_image = CASE 
    WHEN tool_name = 'bmi' THEN 'https://www.herbalead.com/logos/herbalead/imc-og-image.jpg'
    WHEN tool_name = 'protein' THEN 'https://www.herbalead.com/logos/herbalead/proteina-og-image.jpg'
    WHEN tool_name = 'hydration' THEN 'https://www.herbalead.com/logos/herbalead/hidratacao-og-image.jpg'
    WHEN tool_name = 'body-composition' THEN 'https://www.herbalead.com/logos/herbalead/body-fat-og-image.jpg'
    WHEN tool_name = 'meal-planner' THEN 'https://www.herbalead.com/logos/herbalead/meal-planner-og-image.jpg'
    WHEN tool_name = 'nutrition-assessment' THEN 'https://www.herbalead.com/logos/herbalead/nutricao-og-image.jpg'
    WHEN tool_name = 'wellness-profile' THEN 'https://www.herbalead.com/logos/herbalead/wellness-profile-og-image.jpg'
    WHEN tool_name = 'daily-wellness' THEN 'https://www.herbalead.com/logos/herbalead/daily-wellness-og-image.jpg'
    WHEN tool_name = 'healthy-eating' THEN 'https://www.herbalead.com/logos/herbalead/healthy-eating-og-image.jpg'
    WHEN tool_name = 'recruitment-potencial' THEN 'https://www.herbalead.com/logos/herbalead/recruitment-potencial-og-image.jpg'
    WHEN tool_name = 'recruitment-ganhos' THEN 'https://www.herbalead.com/logos/herbalead/recruitment-ganhos-og-image.jpg'
    WHEN tool_name = 'recruitment-proposito' THEN 'https://www.herbalead.com/logos/herbalead/recruitment-proposito-og-image.jpg'
    WHEN tool_name = 'portal-saude' THEN 'https://www.herbalead.com/logos/herbalead/portal-saude-og-image.jpg'
    ELSE 'https://www.herbalead.com/logos/herbalead/herbalead-og-image.jpg'
END;

-- 3. Verificar resultado
SELECT 
    l.id,
    l.name,
    l.tool_name,
    l.og_image,
    p.name as professional_name
FROM links l
JOIN professionals p ON l.user_id = p.id
ORDER BY l.created_at DESC
LIMIT 10;

