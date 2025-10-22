-- Script para migrar telefones existentes para formato unificado
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar telefones atuais na tabela professionals
SELECT 
  id,
  name,
  email,
  phone,
  LENGTH(phone) as phone_length,
  CASE 
    WHEN phone LIKE '+%' THEN 'Com código internacional'
    WHEN phone LIKE '55%' THEN 'Brasil sem +'
    WHEN phone LIKE '1%' THEN 'EUA/Canadá sem +'
    WHEN phone LIKE '351%' THEN 'Portugal sem +'
    WHEN phone LIKE '34%' THEN 'Espanha sem +'
    ELSE 'Formato desconhecido'
  END as phone_format
FROM professionals 
WHERE phone IS NOT NULL 
ORDER BY created_at DESC;

-- 2. Função para normalizar telefones
CREATE OR REPLACE FUNCTION normalize_phone(input_phone TEXT)
RETURNS TEXT AS $$
DECLARE
  clean_phone TEXT;
  country_code TEXT;
  phone_without_country TEXT;
  result TEXT;
BEGIN
  -- Remove todos os caracteres não numéricos
  clean_phone := REGEXP_REPLACE(input_phone, '[^0-9]', '', 'g');
  
  -- Detectar código do país
  IF clean_phone LIKE '55%' AND LENGTH(clean_phone) >= 12 THEN
    country_code := '55';
    phone_without_country := SUBSTRING(clean_phone FROM 3);
  ELSIF clean_phone LIKE '1%' AND LENGTH(clean_phone) >= 11 THEN
    country_code := '1';
    phone_without_country := SUBSTRING(clean_phone FROM 2);
  ELSIF clean_phone LIKE '351%' AND LENGTH(clean_phone) >= 12 THEN
    country_code := '351';
    phone_without_country := SUBSTRING(clean_phone FROM 4);
  ELSIF clean_phone LIKE '34%' AND LENGTH(clean_phone) >= 11 THEN
    country_code := '34';
    phone_without_country := SUBSTRING(clean_phone FROM 3);
  ELSE
    -- Assumir Brasil se não detectar código
    country_code := '55';
    phone_without_country := clean_phone;
  END IF;
  
  -- Retornar no formato: código do país + número
  result := country_code || phone_without_country;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 3. Testar a função com alguns exemplos
SELECT 
  phone as original,
  normalize_phone(phone) as normalized
FROM professionals 
WHERE phone IS NOT NULL 
LIMIT 10;

-- 4. Atualizar telefones na tabela professionals
UPDATE professionals 
SET phone = normalize_phone(phone)
WHERE phone IS NOT NULL 
AND phone != normalize_phone(phone);

-- 5. Verificar resultado da migração
SELECT 
  id,
  name,
  email,
  phone,
  LENGTH(phone) as phone_length,
  CASE 
    WHEN phone LIKE '55%' THEN 'Brasil'
    WHEN phone LIKE '1%' THEN 'EUA/Canadá'
    WHEN phone LIKE '351%' THEN 'Portugal'
    WHEN phone LIKE '34%' THEN 'Espanha'
    ELSE 'Outro'
  END as country_detected
FROM professionals 
WHERE phone IS NOT NULL 
ORDER BY updated_at DESC;

-- 6. Verificar telefones na tabela leads (se existir)
SELECT 
  id,
  name,
  phone,
  LENGTH(phone) as phone_length
FROM leads 
WHERE phone IS NOT NULL 
LIMIT 10;

-- 7. Atualizar telefones na tabela leads (se existir)
UPDATE leads 
SET phone = normalize_phone(phone)
WHERE phone IS NOT NULL 
AND phone != normalize_phone(phone);

-- 8. Criar função para formatar telefone para exibição
CREATE OR REPLACE FUNCTION format_phone_for_display(input_phone TEXT)
RETURNS TEXT AS $$
DECLARE
  clean_phone TEXT;
  country_code TEXT;
  phone_without_country TEXT;
  area_code TEXT;
  number_part TEXT;
  formatted TEXT;
BEGIN
  -- Remove todos os caracteres não numéricos
  clean_phone := REGEXP_REPLACE(input_phone, '[^0-9]', '', 'g');
  
  -- Detectar código do país
  IF clean_phone LIKE '55%' AND LENGTH(clean_phone) >= 12 THEN
    country_code := '55';
    phone_without_country := SUBSTRING(clean_phone FROM 3);
    
    -- Formatar para Brasil: (DDD) 99999-9999
    IF LENGTH(phone_without_country) = 10 THEN
      area_code := SUBSTRING(phone_without_country FROM 1 FOR 2);
      number_part := SUBSTRING(phone_without_country FROM 3);
      formatted := '(' || area_code || ') ' || 
                   SUBSTRING(number_part FROM 1 FOR 4) || '-' || 
                   SUBSTRING(number_part FROM 5);
    ELSIF LENGTH(phone_without_country) = 11 THEN
      area_code := SUBSTRING(phone_without_country FROM 1 FOR 2);
      number_part := SUBSTRING(phone_without_country FROM 3);
      formatted := '(' || area_code || ') ' || 
                   SUBSTRING(number_part FROM 1 FOR 5) || '-' || 
                   SUBSTRING(number_part FROM 6);
    ELSE
      formatted := '+' || country_code || ' ' || phone_without_country;
    END IF;
    
  ELSIF clean_phone LIKE '1%' AND LENGTH(clean_phone) >= 11 THEN
    country_code := '1';
    phone_without_country := SUBSTRING(clean_phone FROM 2);
    
    -- Formatar para EUA/Canadá: (999) 999-9999
    IF LENGTH(phone_without_country) = 10 THEN
      area_code := SUBSTRING(phone_without_country FROM 1 FOR 3);
      number_part := SUBSTRING(phone_without_country FROM 4);
      formatted := '(' || area_code || ') ' || 
                   SUBSTRING(number_part FROM 1 FOR 3) || '-' || 
                   SUBSTRING(number_part FROM 4);
    ELSE
      formatted := '+' || country_code || ' ' || phone_without_country;
    END IF;
    
  ELSE
    -- Formato genérico
    formatted := '+' || clean_phone;
  END IF;
  
  RETURN formatted;
END;
$$ LANGUAGE plpgsql;

-- 9. Testar formatação para exibição
SELECT 
  phone as stored,
  format_phone_for_display(phone) as display_format
FROM professionals 
WHERE phone IS NOT NULL 
LIMIT 10;

-- 10. Limpar função temporária (opcional)
-- DROP FUNCTION IF EXISTS normalize_phone(TEXT);
-- DROP FUNCTION IF EXISTS format_phone_for_display(TEXT);

SELECT 'Migração de telefones concluída com sucesso!' as status;
