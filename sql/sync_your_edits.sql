-- Script para sincronizar suas edições com o Supabase
-- Execute este código no Supabase SQL Editor

-- 1. VERIFICAR ESTADO ATUAL
-- Execute esta parte primeiro para ver o que existe
SELECT 
    '=== ESTADO ATUAL DOS CURSOS ===' as info;

SELECT 
    c.title as curso,
    cm.title as modulo,
    cm.order_index as ordem,
    cm.video_url as video_atual,
    cm.pdf_files as pdfs_atuais,
    cm.pdf_materials as descricao_atual,
    cm.updated_at as ultima_atualizacao
FROM course_modules cm
JOIN courses c ON cm.course_id = c.id
ORDER BY c.title, cm.order_index;

-- 2. INSTRUÇÕES PARA VOCÊ
-- 
-- Me diga quais edições você fez:
-- 
-- A) Vídeos:
--    - Qual módulo tem vídeo?
--    - É URL do YouTube ou arquivo enviado?
--    - Qual a URL?
--
-- B) PDFs:
--    - Quais módulos têm PDFs?
--    - São os PDFs originais ou você editou?
--    - Quais são os nomes dos arquivos?
--
-- C) Descrições:
--    - Você mudou alguma descrição dos módulos?
--    - Qual era o texto original e qual é o novo?
--
-- D) Ordem:
--    - Você mudou a ordem dos módulos?
--    - Qual é a ordem correta?

-- 3. EXEMPLO DE COMO ATUALIZAR (execute apenas se necessário)
-- 
-- Para atualizar um vídeo:
-- UPDATE course_modules 
-- SET video_url = 'https://youtube.com/watch?v=SEU_VIDEO'
-- WHERE title = 'Nome do Módulo';
--
-- Para atualizar PDFs:
-- UPDATE course_modules 
-- SET pdf_files = ARRAY['https://url-do-seu-pdf.pdf']
-- WHERE title = 'Nome do Módulo';
--
-- Para atualizar descrição:
-- UPDATE course_modules 
-- SET pdf_materials = 'Sua nova descrição aqui'
-- WHERE title = 'Nome do Módulo';

-- 4. VERIFICAR SE HÁ DADOS DUPLICADOS
SELECT 
    cm.title,
    COUNT(*) as quantidade
FROM course_modules cm
GROUP BY cm.title
HAVING COUNT(*) > 1;
