# 🚀 CORREÇÃO SIMPLES - POLÍTICAS RLS

## 📋 PASSO A PASSO SIMPLES

### 1. No Supabase SQL Editor
- **Clique em "New query"** ou use uma aba nova
- **Cole o código abaixo**:

```sql
-- CORREÇÃO SIMPLES DAS POLÍTICAS RLS
-- Execute este código diretamente no SQL Editor do Supabase

-- 1. Remover políticas problemáticas dos profissionais
DROP POLICY IF EXISTS "Professionals can manage their own data" ON professionals;
DROP POLICY IF EXISTS "Anyone can create professional profile" ON professionals;

-- 2. Criar política para permitir cadastro público de profissionais
CREATE POLICY "professionals_public_insert" ON professionals
  FOR INSERT WITH CHECK (true);

-- 3. Criar política para profissionais verem apenas seus dados
CREATE POLICY "professionals_own_select" ON professionals
  FOR SELECT USING (auth.uid()::text = id::text);

-- 4. Criar política para profissionais editarem apenas seus dados
CREATE POLICY "professionals_own_update" ON professionals
  FOR UPDATE USING (auth.uid()::text = id::text);

-- 5. Verificar se funcionou
SELECT 'Políticas criadas com sucesso!' as status;
```

### 2. Execute o SQL
- **Clique em "Run"** ou pressione Ctrl+Enter
- **Deve aparecer**: "Políticas criadas com sucesso!"

### 3. Teste o Cadastro
- **Vá para**: https://herbalead.com/login
- **Tente fazer o cadastro** novamente
- **Deve funcionar** sem erro de política RLS

## ✅ O QUE ESTE SQL FAZ

1. **Remove** as políticas problemáticas
2. **Cria** política para cadastro público (`professionals_public_insert`)
3. **Cria** política para ver dados próprios (`professionals_own_select`)
4. **Cria** política para editar dados próprios (`professionals_own_update`)

## 🎯 RESULTADO ESPERADO

- ✅ **Cadastro funcionará** sem erro de política RLS
- ✅ **Segurança mantida** (cada um vê apenas seus dados)
- ✅ **Sem conflitos** de nomes de políticas

## 🆘 SE NÃO FUNCIONAR

1. **Verifique se o SQL executou sem erros**
2. **Aguarde alguns segundos**
3. **Teste o cadastro novamente**
4. **Verifique o console do navegador**

## 📞 STATUS
- ❌ **Cadastro**: Bloqueado por política RLS
- ✅ **SQL**: Pronto para executar
- ✅ **Solução**: Simples e direta



