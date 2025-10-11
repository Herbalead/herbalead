-- Verificar políticas RLS da tabela professionals
-- Execute este código no SQL Editor do Supabase

-- 1. Verificar se RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'professionals';

-- 2. Verificar políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'professionals';

-- 3. Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'professionals' 
ORDER BY ordinal_position;

-- 4. Testar inserção manual (substitua pelos dados reais)
-- INSERT INTO professionals (id, email, name, phone, specialty, company, isActive, maxLeads)
-- VALUES ('test-id-123', 'teste@email.com', 'Usuário Teste', '11999999999', 'Nutricionista', 'Empresa Teste', true, 100);

-- 5. Verificar se há dados na tabela
SELECT COUNT(*) as total_professionals FROM professionals;
