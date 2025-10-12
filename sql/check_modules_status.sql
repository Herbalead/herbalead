-- Script para verificar o estado atual dos módulos no Supabase
-- Execute este script no SQL Editor do Supabase para diagnosticar problemas

-- 1. Verificar todos os módulos existentes
SELECT 
  id,
  course_id,
  title,
  description,
  duration,
  video_url,
  pdf_materials,
  pdf_files,
  order_index,
  is_active,
  created_at,
  updated_at
FROM course_modules 
ORDER BY course_id, order_index;

-- 2. Verificar cursos existentes
SELECT 
  id,
  title,
  description,
  is_active,
  created_at
FROM courses 
ORDER BY created_at DESC;

-- 3. Verificar módulos por curso
SELECT 
  c.title as curso,
  COUNT(cm.id) as total_modulos,
  COUNT(CASE WHEN cm.is_active = true THEN 1 END) as modulos_ativos
FROM courses c
LEFT JOIN course_modules cm ON c.id = cm.course_id
GROUP BY c.id, c.title
ORDER BY c.created_at DESC;

-- 4. Verificar módulos criados recentemente (últimas 24h)
SELECT 
  cm.title,
  cm.description,
  cm.duration,
  c.title as curso,
  cm.created_at
FROM course_modules cm
JOIN courses c ON cm.course_id = c.id
WHERE cm.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY cm.created_at DESC;

-- 5. Verificar se há problemas com order_index
SELECT 
  course_id,
  COUNT(*) as total,
  COUNT(DISTINCT order_index) as indices_unicos,
  MIN(order_index) as min_index,
  MAX(order_index) as max_index
FROM course_modules
WHERE is_active = true
GROUP BY course_id
HAVING COUNT(*) != COUNT(DISTINCT order_index);

-- 6. Verificar módulos sem curso associado
SELECT 
  cm.*
FROM course_modules cm
LEFT JOIN courses c ON cm.course_id = c.id
WHERE c.id IS NULL;
