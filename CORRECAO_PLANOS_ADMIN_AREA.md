# 🔧 Correção: Planos Mensais Aparecendo como Anuais na Área Administrativa

## Problema

Na área administrativa (`/admin/subscriptions`), vários usuários que pagaram planos **mensais** estão aparecendo como **anuais**, com vencimento de 1 ano ao invés de 1 mês.

## Usuários Afetados (do print)

1. **Jorge Mattar** - Aparece como Anual, vencimento 10/11/2026 (deveria ser mensal)
2. **Carol Garcia** - Aparece como Anual, vencimento 10/11/2026 (deveria ser mensal)
3. **Donarosa59** - Aparece como Anual, vencimento 10/11/2026 (deveria ser mensal)
4. **Cleiton De Sá** - Aparece como Anual, vencimento 10/11/2026 (deveria ser mensal)
5. **Rosana Elisa Sperandio** - Aparece como N/A, sem vencimento (deveria ser anual - única que realmente pagou anual)

## Causa

O problema está nos dados da tabela `subscriptions` no banco de dados:
- Subscriptions mensais foram marcadas com `plan_type = 'yearly'`
- O `current_period_end` foi calculado como 365 dias ao invés de 30 dias
- A Rosana Elisa não tem subscription ativa no banco

## Solução

Execute os seguintes scripts SQL no Supabase SQL Editor **nesta ordem**:

### 1. Corrigir TODOS os planos mensais
```sql
-- Execute: sql/corrigir_todos_planos_mensais_final.sql
```
Este script:
- Identifica todas as subscriptions mensais marcadas como anuais
- Corrige o `plan_type` de 'yearly' para 'monthly'
- Ajusta o `current_period_end` para 30 dias
- Preserva a Rosana Elisa (única anual real)

### 2. Verificar e corrigir Rosana Elisa
```sql
-- Execute: sql/verificar_e_corrigir_rosana_elisa.sql
```
Este script:
- Verifica se a Rosana Elisa tem subscription
- Cria subscription anual se não existir
- Garante que está marcada como 'yearly' com 365 dias
- Ativa o professional

## Após Executar os Scripts

1. **Recarregue a página** `/admin/subscriptions` no navegador
2. **Verifique** se os planos estão corretos:
   - Jorge, Carol, Donarosa59, Cleiton: **Mensal** com vencimento em ~30 dias
   - Rosana Elisa: **Anual** com vencimento em ~365 dias

## Verificação

Após executar os scripts, você pode verificar executando:

```sql
SELECT 
    p.name,
    p.email,
    s.plan_type,
    s.current_period_start::date as inicio,
    s.current_period_end::date as fim,
    (s.current_period_end::date - s.current_period_start::date) as dias
FROM subscriptions s
JOIN professionals p ON s.user_id = p.id
WHERE s.status = 'active'
  AND p.email IN (
    'jjmattar@gmail.com',
    'carolina.landim.garcia@gmail.com',
    'donarosa59@hotmail.com',
    'slimrosolem@gmail.com',
    'sperandio.rosanaelisa@gmail.com'
  )
ORDER BY p.email;
```

**Resultado esperado:**
- Jorge, Carol, Donarosa59, Cleiton: `plan_type = 'monthly'`, `dias = 30`
- Rosana Elisa: `plan_type = 'yearly'`, `dias = 365`

