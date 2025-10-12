-- Script para verificar ordem dos módulos
-- Execute este código no Supabase SQL Editor

-- 1. Verificar todos os módulos com suas ordens
SELECT 
  id,
  title,
  order_index,
  is_active,
  created_at,
  updated_at
FROM course_modules 
ORDER BY order_index ASC;

-- 2. Verificar se há módulos com order_index duplicado ou NULL
SELECT 
  order_index,
  COUNT(*) as count
FROM course_modules 
GROUP BY order_index 
HAVING COUNT(*) > 1 OR order_index IS NULL;

-- 3. Verificar módulos de um curso específico (substitua pelo ID do curso)
-- SELECT 
--   id,
--   title,
--   order_index,
--   is_active
-- FROM course_modules 
-- WHERE course_id = 'SUBSTITUA_PELO_ID_DO_CURSO'
-- ORDER BY order_index ASC;

-- 4. Corrigir ordem se necessário (descomente se precisar)
-- UPDATE course_modules 
-- SET order_index = 1 
-- WHERE title = 'Introdução à Plataforma';

-- UPDATE course_modules 
-- SET order_index = 2 
-- WHERE title = 'Segundo Módulo';
