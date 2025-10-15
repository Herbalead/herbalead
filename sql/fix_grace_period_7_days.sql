-- Corrigir período de graça para 7 dias
-- Atualizar todos os usuários que têm período de graça maior que 7 dias

DO $$
BEGIN
  -- Verificar se a coluna grace_period_end existe
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'professionals' 
    AND column_name = 'grace_period_end'
  ) THEN
    
    -- Atualizar usuários com período de graça maior que 7 dias
    UPDATE public.professionals 
    SET grace_period_end = created_at + INTERVAL '7 days'
    WHERE 
      subscription_status = 'active' 
      AND grace_period_end IS NOT NULL
      AND grace_period_end > created_at + INTERVAL '7 days';
    
    -- Log da atualização
    RAISE NOTICE 'Períodos de graça corrigidos para 7 dias';
    
  ELSE
    RAISE NOTICE 'Coluna grace_period_end não existe ainda';
  END IF;
END $$;

-- Verificar quantos usuários foram atualizados
SELECT 
  COUNT(*) as usuarios_atualizados,
  'Usuários com período de graça corrigido para 7 dias' as descricao
FROM public.professionals 
WHERE 
  subscription_status = 'active' 
  AND grace_period_end IS NOT NULL
  AND grace_period_end = created_at + INTERVAL '7 days';

