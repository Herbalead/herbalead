# 🔍 DIAGNÓSTICO COMPLETO - POLÍTICAS RLS

## ❓ POSSÍVEIS PROBLEMAS IDENTIFICADOS

Você pode estar esquecendo de:

1. **🔐 RLS não habilitado** na tabela `professionals`
2. **📋 Políticas conflitantes** que não foram removidas
3. **🏗️ Estrutura da tabela** incorreta ou incompleta
4. **🔑 Constraints** de chave primária ausentes
5. **👤 Autenticação** não configurada corretamente

## ✅ SOLUÇÃO DEFINITIVA

### **OPÇÃO 1: DIAGNÓSTICO PRIMEIRO**
Execute este código para identificar o problema:

```sql
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
```

### **OPÇÃO 2: SOLUÇÃO DEFINITIVA**
Se quiser resolver tudo de uma vez:

```sql
-- SOLUÇÃO DEFINITIVA PARA POLÍTICAS RLS
-- Este script resolve TODOS os problemas possíveis

-- =====================================================
-- 1. VERIFICAR E CORRIGIR ESTRUTURA DA TABELA
-- =====================================================

-- Verificar se a tabela professionals existe e tem a estrutura correta
DO $$
BEGIN
    -- Se a tabela não existir, criar
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'professionals') THEN
        CREATE TABLE professionals (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(20),
            specialty VARCHAR(255),
            company VARCHAR(255),
            bio TEXT,
            profile_image TEXT,
            whatsapp_link TEXT,
            website_link TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

-- =====================================================
-- 2. REMOVER TODAS AS POLÍTICAS EXISTENTES
-- =====================================================

-- Remover TODAS as políticas possíveis da tabela professionals
DROP POLICY IF EXISTS "Professionals can manage their own data" ON professionals;
DROP POLICY IF EXISTS "Anyone can create professional profile" ON professionals;
DROP POLICY IF EXISTS "Professionals can view their own data" ON professionals;
DROP POLICY IF EXISTS "Professionals can update their own data" ON professionals;
DROP POLICY IF EXISTS "Professionals can delete their own data" ON professionals;
DROP POLICY IF EXISTS "professionals_insert_policy" ON professionals;
DROP POLICY IF EXISTS "professionals_select_policy" ON professionals;
DROP POLICY IF EXISTS "professionals_update_policy" ON professionals;
DROP POLICY IF EXISTS "professionals_public_insert" ON professionals;
DROP POLICY IF EXISTS "professionals_own_select" ON professionals;
DROP POLICY IF EXISTS "professionals_own_update" ON professionals;

-- =====================================================
-- 3. HABILITAR RLS (SE NÃO ESTIVER HABILITADO)
-- =====================================================

ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. CRIAR POLÍTICAS CORRETAS E SIMPLES
-- =====================================================

-- Política para INSERT: Qualquer pessoa pode criar um profissional
CREATE POLICY "allow_public_insert" ON professionals
    FOR INSERT 
    WITH CHECK (true);

-- Política para SELECT: Profissionais podem ver apenas seus próprios dados
CREATE POLICY "allow_own_select" ON professionals
    FOR SELECT 
    USING (auth.uid()::text = id::text);

-- Política para UPDATE: Profissionais podem editar apenas seus próprios dados
CREATE POLICY "allow_own_update" ON professionals
    FOR UPDATE 
    USING (auth.uid()::text = id::text)
    WITH CHECK (auth.uid()::text = id::text);

-- Política para DELETE: Profissionais podem deletar apenas seus próprios dados
CREATE POLICY "allow_own_delete" ON professionals
    FOR DELETE 
    USING (auth.uid()::text = id::text);

-- =====================================================
-- 5. VERIFICAR SE FUNCIONOU
-- =====================================================

-- Verificar se RLS está habilitado
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'professionals';

-- Verificar políticas criadas
SELECT 
    policyname,
    cmd as operation,
    permissive
FROM pg_policies 
WHERE tablename = 'professionals'
ORDER BY policyname;

SELECT 'Políticas RLS configuradas com sucesso!' as resultado;
```

## 🎯 **RESULTADO ESPERADO**

Após executar a solução definitiva:
- ✅ **RLS habilitado** na tabela `professionals`
- ✅ **4 políticas criadas**: INSERT público + SELECT/UPDATE/DELETE próprios
- ✅ **Cadastro funcionará** sem erro de política RLS
- ✅ **Segurança mantida** para dados próprios

## 🆘 **SE AINDA NÃO FUNCIONAR**

1. **Verifique se a tabela existe** executando o diagnóstico
2. **Confirme se RLS está habilitado** (deve aparecer `true`)
3. **Verifique se as 4 políticas foram criadas**
4. **Teste inserção manual** descomentando a linha de teste

## 📋 **CHECKLIST DE POLÍTICAS**

- [ ] **RLS habilitado** na tabela `professionals`
- [ ] **Política INSERT** pública (`allow_public_insert`)
- [ ] **Política SELECT** própria (`allow_own_select`)
- [ ] **Política UPDATE** própria (`allow_own_update`)
- [ ] **Política DELETE** própria (`allow_own_delete`)
- [ ] **Estrutura da tabela** correta
- [ ] **Chave primária** configurada

**Execute a solução definitiva e me diga o resultado!** 🌿



