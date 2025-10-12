-- Script para verificar o estado atual dos módulos e seus conteúdos
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar todos os módulos existentes com seus conteúdos
SELECT 
    cm.id as module_id,
    cm.title as module_title,
    cm.description,
    cm.duration,
    cm.video_url,
    cm.pdf_files,
    cm.pdf_materials,
    cm.order_index,
    cm.is_active,
    cm.created_at,
    cm.updated_at,
    c.title as course_title,
    c.id as course_id
FROM course_modules cm
LEFT JOIN courses c ON cm.course_id = c.id
ORDER BY c.title, cm.order_index;

-- 2. Verificar se há módulos sem conteúdo
SELECT 
    'Módulos sem vídeo' as tipo,
    COUNT(*) as quantidade
FROM course_modules 
WHERE video_url IS NULL OR video_url = ''

UNION ALL

SELECT 
    'Módulos sem PDFs' as tipo,
    COUNT(*) as quantidade
FROM course_modules 
WHERE pdf_files IS NULL OR pdf_files = '{}'

UNION ALL

SELECT 
    'Módulos sem materiais PDF' as tipo,
    COUNT(*) as quantidade
FROM course_modules 
WHERE pdf_materials IS NULL OR pdf_materials = '';

-- 3. Verificar módulos com conteúdo
SELECT 
    'Módulos com vídeo' as tipo,
    COUNT(*) as quantidade
FROM course_modules 
WHERE video_url IS NOT NULL AND video_url != ''

UNION ALL

SELECT 
    'Módulos com PDFs' as tipo,
    COUNT(*) as quantidade
FROM course_modules 
WHERE pdf_files IS NOT NULL AND pdf_files != '{}'

UNION ALL

SELECT 
    'Módulos com materiais PDF' as tipo,
    COUNT(*) as quantidade
FROM course_modules 
WHERE pdf_materials IS NOT NULL AND pdf_materials != '';

-- 4. Verificar URLs dos vídeos
SELECT 
    id,
    title,
    video_url,
    CASE 
        WHEN video_url LIKE '%youtube%' THEN 'YouTube'
        WHEN video_url LIKE '%supabase%' THEN 'Supabase'
        WHEN video_url LIKE '%http%' THEN 'Externo'
        ELSE 'Outro'
    END as tipo_video
FROM course_modules 
WHERE video_url IS NOT NULL AND video_url != ''
ORDER BY created_at DESC;

-- 5. Verificar URLs dos PDFs
SELECT 
    id,
    title,
    pdf_files,
    array_length(pdf_files, 1) as quantidade_pdfs
FROM course_modules 
WHERE pdf_files IS NOT NULL AND pdf_files != '{}'
ORDER BY created_at DESC;
