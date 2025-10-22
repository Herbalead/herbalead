-- Script de backup e recuperação de módulos
-- Execute este script no SQL Editor do Supabase

-- 1. Criar tabela de backup se não existir
CREATE TABLE IF NOT EXISTS course_modules_backup (
  id UUID PRIMARY KEY,
  course_id UUID,
  title VARCHAR(255),
  description TEXT,
  duration VARCHAR(50),
  video_url TEXT,
  pdf_materials TEXT,
  pdf_files TEXT[],
  order_index INTEGER,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  backup_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Fazer backup de todos os módulos atuais
INSERT INTO course_modules_backup (
  id, course_id, title, description, duration, video_url, 
  pdf_materials, pdf_files, order_index, is_active, 
  created_at, updated_at
)
SELECT 
  id, course_id, title, description, duration, video_url,
  pdf_materials, pdf_files, order_index, is_active,
  created_at, updated_at
FROM course_modules
WHERE NOT EXISTS (
  SELECT 1 FROM course_modules_backup 
  WHERE course_modules_backup.id = course_modules.id
);

-- 3. Verificar backup
SELECT 
  COUNT(*) as total_backups,
  MAX(backup_date) as ultimo_backup
FROM course_modules_backup;

-- 4. Restaurar módulo "Como Criar Quiz Personalizado" se necessário
INSERT INTO course_modules (course_id, title, description, duration, order_index, pdf_materials, pdf_files, is_active)
SELECT 
  (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1),
  'Como Criar Quiz Personalizado',
  'Aprenda a criar quizzes personalizados e interativos para engajar seus clientes. Domine todas as funcionalidades do Quiz Builder do HerbaLead.',
  '25 min',
  COALESCE((SELECT MAX(order_index) FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1)), 0) + 1,
  'Como Criar Quiz Personalizado - Guia completo para criar quizzes interativos e personalizados.',
  ARRAY['https://rjwuedzmapeozijjrcik.supabase.co/storage/v1/object/public/herbalead-public/course-pdfs/Como-Criar-Quiz-Personalizado.pdf'],
  true
WHERE NOT EXISTS (
  SELECT 1 FROM course_modules 
  WHERE title = 'Como Criar Quiz Personalizado'
);

-- 5. Verificar estado atual dos módulos
SELECT 
  order_index,
  title,
  CASE 
    WHEN pdf_files IS NULL OR pdf_files = '{}' THEN '❌ Sem PDF'
    WHEN array_length(pdf_files, 1) > 0 THEN '✅ Com PDF'
    ELSE '⚠️ Status desconhecido'
  END as status_pdf,
  CASE 
    WHEN video_url IS NULL OR video_url = '' THEN '❌ Sem vídeo'
    ELSE '✅ Com vídeo'
  END as status_video
FROM course_modules 
WHERE course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1)
ORDER BY order_index;

-- 6. Verificar se há módulos duplicados
SELECT 
  title,
  COUNT(*) as quantidade
FROM course_modules 
WHERE course_id = (SELECT id FROM courses WHERE title = 'Como Usar as Ferramentas' LIMIT 1)
GROUP BY title
HAVING COUNT(*) > 1;

SELECT 'Backup e recuperação concluídos!' as status;
