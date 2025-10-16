-- Script para limpar TODOS os dados de teste do Supabase
-- Execute este script no Supabase SQL Editor

-- 1. Deletar usuários de teste da tabela professionals
DELETE FROM public.professionals 
WHERE email IN (
  'andrefaula.ia@gmail.com',
  'suportebebidasfuncionais@gmail.com',
  'oanfaol@gmail.com',
  'meuportalfitbr@gmail.com',
  'bellaesteticaguru@gmail.com',
  'herbalead.lead@gmail.com',
  'teste@teste.com',
  'test@test.com',
  'test@example.com',
  'admin@test.com'
);

-- 2. Deletar assinaturas de teste
DELETE FROM public.subscriptions 
WHERE stripe_customer_id IN (
  SELECT stripe_customer_id FROM public.professionals 
  WHERE email IN (
    'andrefaula.ia@gmail.com',
    'suportebebidasfuncionais@gmail.com',
    'oanfaol@gmail.com',
    'meuportalfitbr@gmail.com',
    'bellaesteticaguru@gmail.com',
    'herbalead.lead@gmail.com',
    'teste@teste.com',
    'test@test.com',
    'test@example.com',
    'admin@test.com'
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
      'oanfaol@gmail.com',
      'meuportalfitbr@gmail.com',
      'bellaesteticaguru@gmail.com',
      'herbalead.lead@gmail.com',
      'teste@teste.com',
      'test@test.com',
      'test@example.com',
      'admin@test.com'
    )
  )
);

-- 4. Deletar links de teste (se existirem)
-- NOTA: Tabela professional_links pode não existir - verificar antes de executar
-- DELETE FROM public.professional_links 
-- WHERE professional_id IN (
--   SELECT id FROM public.professionals 
--   WHERE email IN (
--     'andrefaula.ia@gmail.com',
--     'suportebebidasfuncionais@gmail.com',
--     'oanfaol@gmail.com',
--     'meuportalfitbr@gmail.com',
--     'bellaesteticaguru@gmail.com',
--     'herbalead.lead@gmail.com',
--     'teste@teste.com',
--     'test@test.com',
--     'test@example.com',
--     'admin@test.com'
--   )
-- );

-- 5. Deletar quizzes de teste (se existirem)
-- NOTA: Tabela quizzes pode não existir - verificar antes de executar
-- DELETE FROM public.quizzes 
-- WHERE professional_id IN (
--   SELECT id FROM public.professionals 
--   WHERE email IN (
--     'andrefaula.ia@gmail.com',
--     'suportebebidasfuncionais@gmail.com',
--     'oanfaol@gmail.com',
--     'meuportalfitbr@gmail.com',
--     'bellaesteticaguru@gmail.com',
--     'herbalead.lead@gmail.com',
--     'teste@teste.com',
--     'test@test.com',
--     'test@example.com',
--     'admin@test.com'
--   )
-- );

-- 6. Verificar quantos registros foram deletados
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

-- 7. Listar emails restantes na tabela professionals
SELECT email, name, created_at 
FROM public.professionals 
ORDER BY created_at DESC;

-- NOTA IMPORTANTE: 
-- Para deletar da auth.users, você precisa usar o Dashboard do Supabase
-- Vá em Authentication > Users e delete manualmente os emails de teste
