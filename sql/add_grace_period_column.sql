-- Adicionar coluna para período de graça na tabela professionals
-- Execute este SQL no Supabase SQL Editor

ALTER TABLE public.professionals 
ADD COLUMN IF NOT EXISTS grace_period_end TIMESTAMP WITH TIME ZONE;

-- Comentário para documentar a coluna
COMMENT ON COLUMN public.professionals.grace_period_end IS 'Data de fim do período de graça concedido manualmente pelo admin';
