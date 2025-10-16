-- Script para limpar dados de teste no Supabase
-- Execute este script no Supabase SQL Editor

-- 1. Deletar usuários de teste da tabela professionals
DELETE FROM public.professionals 
WHERE email IN (
  'andrefaula.ia@gmail.com',
  'suportebebidasfuncionais@gmail.com',
  'teste@teste.com',
  'test@test.com'
);

-- 2. Deletar assinaturas de teste
DELETE FROM public.subscriptions 
WHERE stripe_customer_id IN (
  SELECT stripe_customer_id FROM public.professionals 
  WHERE email IN (
    'andrefaula.ia@gmail.com',
    'suportebebidasfuncionais@gmail.com',
    'teste@teste.com',
    'test@test.com'
  )
);

-- 3. Deletar pagamentos de teste
DELETE FROM public.payments 
WHERE subscription_id IN (
  SELECT id FROM public.subscriptions 
  WHERE stripe_customer_id IN (
    SELECT stripe_customer_id FROM public.professionals 
    WHERE email IN (
      'andrefaula.ia@gmail.com',
      'suportebebidasfuncionais@gmail.com',
      'teste@teste.com',
      'test@test.com'
    )
  )
);

-- 4. Verificar quantos registros foram deletados
SELECT 
  'professionals' as tabela,
  COUNT(*) as registros_restantes
FROM public.professionals
UNION ALL
SELECT 
  'subscriptions' as tabela,
  COUNT(*) as registros_restantes
FROM public.subscriptions
UNION ALL
SELECT 
  'payments' as tabela,
  COUNT(*) as registros_restantes
FROM public.payments;

-- 5. Listar emails restantes na tabela professionals
SELECT email, name, created_at 
FROM public.professionals 
ORDER BY created_at DESC;
