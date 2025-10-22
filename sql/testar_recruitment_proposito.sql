-- Script para testar e corrigir ferramentas de recrutamento
-- Verificar se há problemas específicos com recruitment-proposito

-- 1. Verificar links existentes com recruitment-proposito
SELECT 
  'Links com recruitment-proposito:' as info,
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

-- 2. Verificar se há links com nomes similares mas tool_name diferente
SELECT 
  'Links com nome similar a proposito:' as info,
  id,
  name,
  tool_name,
  custom_url,
  og_image,
  status,
  created_at
FROM links 
WHERE name ILIKE '%proposito%' 
   OR custom_url ILIKE '%proposito%'
ORDER BY created_at DESC;

-- 3. Verificar se há problemas com og_image
SELECT 
  'Links sem og_image:' as info,
  id,
  name,
  tool_name,
  custom_url,
  og_image,
  status
FROM links 
WHERE tool_name = 'recruitment-proposito' 
  AND (og_image IS NULL OR og_image = '');

-- 4. Atualizar links que não têm og_image
UPDATE links 
SET og_image = 'https://www.herbalead.com/logos/herbalead/recruitment-proposito-og-image.jpg'
WHERE tool_name = 'recruitment-proposito' 
  AND (og_image IS NULL OR og_image = '');

-- 5. Verificar resultado da atualização
SELECT 
  'Após atualização:' as info,
  id,
  name,
  tool_name,
  custom_url,
  og_image,
  status
FROM links 
WHERE tool_name = 'recruitment-proposito'
ORDER BY created_at DESC;
