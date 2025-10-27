# 🔐 RESET DE SENHA - GLADIS GORDALIZA

## Dados da Gladis:
- **Nome:** Gladis Gordaliza
- **Email:** (buscar no banco de dados)

## Como resetar a senha:

### Opção 1: Via Dashboard Supabase (Mais Rápido)

1. **Acesse:** https://supabase.com/dashboard
2. **Vá em:** Authentication → Users
3. **Busque:** email da Gladis
4. **Clique nos 3 pontos** (menu)
5. **Escolha:** "Reset Password"
6. **Copie a senha temporária** gerada
7. **Envie para Gladis** por email

### Opção 2: Via Link de Recuperação (Mais Seguro)

Envie este email para a Gladis:

---

**Assunto:** Recuperação de Senha - HerbaLead

Olá Gladis!

Para resetar sua senha:

1. Acesse: https://herbalead.com/login
2. Clique em "Esqueci minha senha"
3. Digite seu email
4. Verifique sua caixa de entrada
5. Clique no link de recuperação
6. Crie uma nova senha

Se não receber o email, verifique:
- Lixo eletrônico (Spam)
- Pasta Promoções
- Aguarde até 5 minutos

**Suporte:** Se tiver dificuldades, responda este email.

Atenciosamente,
Equipe HerbaLead

---

### Opção 3: Via Supabase SQL (Avançado)

Execute no SQL Editor do Supabase:

```sql
-- 1. Buscar dados da Gladis
SELECT id, email, name 
FROM professionals 
WHERE name ILIKE '%gladis%' OR email LIKE '%gladis%';

-- 2. Verificar se ela tem auth
SELECT 
    p.id,
    p.email,
    p.name,
    au.id as auth_id,
    au.email as auth_email
FROM professionals p
LEFT JOIN auth.users au ON p.id = au.id
WHERE p.name ILIKE '%gladis%';
```

Depois, no Dashboard → Authentication → Users:
- Buscar o email dela
- Clicar em "Reset Password"
- Copiar senha temporária
- Enviar por email

