-- Script para investigar problema do telefone fixo
-- Verificar estrutura da tabela professionals

-- 1. Verificar se o campo phone existe na tabela professionals
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'professionals' 
AND column_name = 'phone';

-- 2. Verificar dados de telefone na tabela professionals
SELECT id, name, email, phone 
FROM professionals 
LIMIT 10;

-- 3. Verificar quantos profissionais têm telefone preenchido
SELECT 
  COUNT(*) as total_professionals,
  COUNT(phone) as professionals_with_phone,
  COUNT(*) - COUNT(phone) as professionals_without_phone
FROM professionals;

-- 4. Verificar dados de um profissional específico (substitua pelo ID do seu usuário)
-- SELECT id, name, email, phone 
-- FROM professionals 
-- WHERE name ILIKE '%seu_nome%';

-- 5. Verificar estrutura da tabela links
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'links' 
AND column_name IN ('custom_message', 'user_id');

-- 6. Verificar dados de links com mensagem personalizada
SELECT id, name, custom_message, user_id 
FROM links 
WHERE custom_message IS NOT NULL 
LIMIT 5;
