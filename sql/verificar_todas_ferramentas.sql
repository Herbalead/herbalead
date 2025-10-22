-- Script completo para verificar todas as ferramentas
-- Testar se todas as ferramentas estão configuradas corretamente

-- 1. Verificar todas as ferramentas disponíveis no sistema
SELECT 
  'Ferramentas MVP:' as categoria,
  'bmi' as tool_name,
  'Calculadora IMC' as nome
UNION ALL
SELECT 'Ferramentas MVP:', 'protein', 'Calculadora de Proteína'
UNION ALL
SELECT 'Ferramentas MVP:', 'hydration', 'Calculadora de Hidratação'
UNION ALL
SELECT 'Ferramentas MVP:', 'body-composition', 'Composição Corporal'
UNION ALL
SELECT 'Ferramentas MVP:', 'meal-planner', 'Planejador de Refeições'
UNION ALL
SELECT 'Ferramentas MVP:', 'nutrition-assessment', 'Avaliação Nutricional'
UNION ALL
SELECT 'Ferramentas MVP:', 'wellness-profile', 'Quiz: Perfil de Bem-Estar'
UNION ALL
SELECT 'Ferramentas MVP:', 'daily-wellness', 'Tabela: Bem-Estar Diário'
UNION ALL
SELECT 'Ferramentas MVP:', 'healthy-eating', 'Quiz: Alimentação Saudável'
UNION ALL
SELECT 'Recrutamento:', 'recruitment-potencial', 'Quiz: Potencial e Crescimento'
UNION ALL
SELECT 'Recrutamento:', 'recruitment-ganhos', 'Quiz: Ganhos e Prosperidade'
UNION ALL
SELECT 'Recrutamento:', 'recruitment-proposito', 'Quiz: Propósito e Equilíbrio'
ORDER BY categoria, tool_name;

-- 2. Verificar links existentes por ferramenta
SELECT 
  tool_name,
  COUNT(*) as total_links,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_links,
  COUNT(CASE WHEN og_image IS NOT NULL AND og_image != '' THEN 1 END) as with_image,
  COUNT(CASE WHEN og_image IS NULL OR og_image = '' THEN 1 END) as without_image
FROM links 
GROUP BY tool_name
ORDER BY tool_name;

-- 3. Verificar links específicos de recrutamento
SELECT 
  'Links de Recrutamento:' as info,
  id,
  name,
  tool_name,
  custom_url,
  og_image,
  status,
  created_at
FROM links 
WHERE tool_name LIKE 'recruitment-%'
ORDER BY tool_name, created_at DESC;

-- 4. Verificar se há problemas com URLs específicas
SELECT 
  'Links com problemas:' as info,
  id,
  name,
  tool_name,
  custom_url,
  og_image,
  status
FROM links 
WHERE (og_image IS NULL OR og_image = '')
   OR (custom_url IS NULL OR custom_url = '')
   OR status != 'active'
ORDER BY created_at DESC;

-- 5. Atualizar todos os links sem og_image
UPDATE links 
SET og_image = CASE tool_name
  WHEN 'bmi' THEN 'https://www.herbalead.com/logos/herbalead/imc-og-image.jpg'
  WHEN 'protein' THEN 'https://www.herbalead.com/logos/herbalead/proteina-og-image.jpg'
  WHEN 'hydration' THEN 'https://www.herbalead.com/logos/herbalead/hidratacao-og-image.jpg'
  WHEN 'body-composition' THEN 'https://www.herbalead.com/logos/herbalead/body-fat-og-image.jpg'
  WHEN 'meal-planner' THEN 'https://www.herbalead.com/logos/herbalead/meal-planner-og-image.jpg'
  WHEN 'nutrition-assessment' THEN 'https://www.herbalead.com/logos/herbalead/nutricao-og-image.jpg'
  WHEN 'wellness-profile' THEN 'https://www.herbalead.com/logos/herbalead/wellness-profile-og-image.jpg'
  WHEN 'daily-wellness' THEN 'https://www.herbalead.com/logos/herbalead/daily-wellness-og-image.jpg'
  WHEN 'healthy-eating' THEN 'https://www.herbalead.com/logos/herbalead/healthy-eating-og-image.jpg'
  WHEN 'recruitment-potencial' THEN 'https://www.herbalead.com/logos/herbalead/recruitment-potencial-og-image.jpg'
  WHEN 'recruitment-ganhos' THEN 'https://www.herbalead.com/logos/herbalead/recruitment-ganhos-og-image.jpg'
  WHEN 'recruitment-proposito' THEN 'https://www.herbalead.com/logos/herbalead/recruitment-proposito-og-image.jpg'
  ELSE 'https://www.herbalead.com/logos/herbalead/herbalead-og-image.jpg'
END
WHERE og_image IS NULL OR og_image = '';

-- 6. Verificar resultado final
SELECT 
  'Resultado final:' as info,
  tool_name,
  COUNT(*) as total_links,
  COUNT(CASE WHEN og_image IS NOT NULL AND og_image != '' THEN 1 END) as with_image
FROM links 
GROUP BY tool_name
ORDER BY tool_name;
