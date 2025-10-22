-- Script para verificar ferramentas de recrutamento
-- Verificar se todas as ferramentas estão configuradas corretamente

-- 1. Verificar links com ferramentas de recrutamento
SELECT 
  id,
  name,
  tool_name,
  custom_url,
  og_image,
  status,
  created_at
FROM links 
WHERE tool_name LIKE 'recruitment-%'
ORDER BY created_at DESC;

-- 2. Verificar se há inconsistências nos tool_name
SELECT 
  tool_name,
  COUNT(*) as total_links,
  COUNT(CASE WHEN og_image IS NOT NULL THEN 1 END) as with_image,
  COUNT(CASE WHEN og_image IS NULL THEN 1 END) as without_image
FROM links 
WHERE tool_name LIKE 'recruitment-%'
GROUP BY tool_name
ORDER BY tool_name;

-- 3. Verificar links específicos do propósito
SELECT 
  id,
  name,
  tool_name,
  custom_url,
  og_image,
  status,
  created_at
FROM links 
WHERE tool_name = 'recruitment-proposito'
ORDER BY created_at DESC;

-- 4. Verificar se há problemas com URLs
SELECT 
  id,
  name,
  tool_name,
  custom_url,
  og_image,
  status
FROM links 
WHERE custom_url LIKE '%proposito%' 
   OR name LIKE '%proposito%'
ORDER BY created_at DESC;
