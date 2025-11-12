# 🔍 Diagnóstico: Planos Mensais Marcados como Anuais

## Problema Identificado

Alguns planos de assinatura **mensais** estão aparecendo como **anuais** na área administrativa, mesmo tendo recebido apenas o valor mensal.

## Causa Raiz

O problema estava no **webhook do Mercado Pago** (`src/app/api/webhook/mercadopago/route.ts`):

1. **Linha 84 e 143**: O código estava sempre definindo `current_period_end` como **30 dias**, independentemente do tipo de plano:
   ```typescript
   current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
   ```

2. Isso fazia com que mesmo quando o `plan_type` era 'yearly', o `current_period_end` era calculado como mensal (30 dias).

3. Além disso, pode haver casos onde o `plan_type` está incorreto no banco de dados (marcado como 'yearly' quando deveria ser 'monthly').

## Solução Implementada

### 1. Correção do Código do Webhook ✅

O webhook agora calcula corretamente o `current_period_end` baseado no tipo de plano:
- **Mensal**: +1 mês (30 dias)
- **Anual**: +1 ano (365 dias)

### 2. Scripts SQL para Diagnóstico e Correção ✅

#### `sql/diagnosticar_planos_incorretos.sql`
- Identifica todas as subscriptions com problemas
- Mostra quais são mensais marcadas como anuais
- Verifica especificamente a Rosana Elisa (única que pagou anual)

#### `sql/corrigir_planos_mensais_incorretos.sql`
- Corrige subscriptions mensais marcadas como anuais
- Garante que a Rosana Elisa está correta (anual)
- Ajusta `current_period_end` para o valor correto

## Próximos Passos

1. **Execute o diagnóstico** no Supabase SQL Editor:
   ```sql
   -- Execute: sql/diagnosticar_planos_incorretos.sql
   ```

2. **Revise os resultados** para confirmar quais subscriptions precisam correção

3. **Execute a correção** no Supabase SQL Editor:
   ```sql
   -- Execute: sql/corrigir_planos_mensais_incorretos.sql
   ```

4. **Faça commit e deploy** da correção do webhook:
   ```bash
   git add src/app/api/webhook/mercadopago/route.ts
   git commit -m "fix: calcular current_period_end corretamente baseado no plan_type"
   git push origin main
   ```

## Verificação

Após executar os scripts SQL, verifique:
- ✅ Todas as subscriptions mensais têm `plan_type = 'monthly'` e `current_period_end` de ~30 dias
- ✅ A Rosana Elisa tem `plan_type = 'yearly'` e `current_period_end` de ~365 dias
- ✅ Não há mais subscriptions mensais marcadas como anuais

## Observação Importante

A **Rosana Elisa** (`sperandio.rosanaelisa@gmail.com`) é a **única usuária que realmente pagou o plano anual**. Todos os demais são mensais e devem ser corrigidos.

