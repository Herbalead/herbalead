-- DIAGNÓSTICO COMPLETO DAS POLÍTICAS RLS
-- Execute este código para identificar exatamente o que está faltando

-- 1. VERIFICAR SE RLS ESTÁ HABILITADO
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('professionals', 'leads', 'professional_links', 'lead_notes')
ORDER BY tablename;

-- 2. VERIFICAR TODAS AS POLÍTICAS EXISTENTES
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as operation,
    qual as condition,
    with_check as insert_check
FROM pg_policies 
WHERE tablename IN ('professionals', 'leads', 'professional_links', 'lead_notes')
ORDER BY tablename, policyname;

-- 3. VERIFICAR ESTRUTURA DA TABELA PROFESSIONALS
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'professionals' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. VERIFICAR SE A TABELA TEM CONSTRAINT DE CHAVE PRIMÁRIA
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'professionals' 
AND tc.table_schema = 'public';

-- 5. TESTAR INSERÇÃO MANUAL (OPCIONAL)
-- Descomente para testar:
-- INSERT INTO professionals (id, name, email) 
-- VALUES (gen_random_uuid(), 'Teste Manual', 'teste@teste.com');




