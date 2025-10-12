-- Script para verificar o estado atual dos cursos no Supabase
-- Execute este código no Supabase SQL Editor

-- 1. Verificar todos os cursos existentes
SELECT 
    id,
    title,
    description,
    difficulty_level,
    estimated_hours,
    is_active,
    created_at,
    updated_at
FROM courses 
ORDER BY created_at DESC;

-- 2. Verificar todos os módulos existentes
SELECT 
    cm.id,
    cm.course_id,
    c.title as curso,
    cm.title as modulo,
    cm.description,
    cm.duration,
    cm.order_index,
    cm.video_url,
    cm.pdf_materials,
    cm.pdf_files,
    cm.is_active,
    cm.created_at,
    cm.updated_at
FROM course_modules cm
JOIN courses c ON cm.course_id = c.id
ORDER BY c.title, cm.order_index;

-- 3. Verificar se há materiais PDF nos módulos
SELECT 
    c.title as curso,
    cm.title as modulo,
    cm.pdf_files,
    cm.pdf_materials,
    CASE 
        WHEN cm.pdf_files IS NOT NULL AND array_length(cm.pdf_files, 1) > 0 THEN 'Tem PDFs'
        ELSE 'Sem PDFs'
    END as status_pdf
FROM course_modules cm
JOIN courses c ON cm.course_id = c.id
WHERE cm.pdf_files IS NOT NULL OR cm.pdf_materials IS NOT NULL
ORDER BY c.title, cm.order_index;

-- 4. Verificar URLs de vídeo
SELECT 
    c.title as curso,
    cm.title as modulo,
    cm.video_url,
    CASE 
        WHEN cm.video_url IS NOT NULL AND cm.video_url != '' THEN 'Tem vídeo'
        ELSE 'Sem vídeo'
    END as status_video
FROM course_modules cm
JOIN courses c ON cm.course_id = c.id
ORDER BY c.title, cm.order_index;

-- 5. Contar total de registros
SELECT 
    'Cursos' as tipo,
    COUNT(*) as total
FROM courses
UNION ALL
SELECT 
    'Módulos' as tipo,
    COUNT(*) as total
FROM course_modules
UNION ALL
SELECT 
    'Módulos com PDFs' as tipo,
    COUNT(*) as total
FROM course_modules 
WHERE pdf_files IS NOT NULL AND array_length(pdf_files, 1) > 0
UNION ALL
SELECT 
    'Módulos com Vídeos' as tipo,
    COUNT(*) as total
FROM course_modules 
WHERE video_url IS NOT NULL AND video_url != '';
