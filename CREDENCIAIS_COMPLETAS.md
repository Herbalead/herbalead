# 🔐 CREDENCIAIS PARA USUÁRIOS SEM ACESSO

## ⚠️ USUÁRIOS QUE PRECISAM RESETAR SENHA

### 1. Gladis Gordaliza
- **Email:** gladisgordaliza@gmail.com  
- **Senha:** Use "Esqueci minha senha" na página de login

### 2. João Araújo
- **Email:** joaoaraujo11@gmail.com  
- **Senha:** Use "Esqueci minha senha" na página de login

### 3. Galdino Albuquerque Junior
- **Email:** albuquerquegaldino1959@gmail.com  
- **Senha:** Use "Esqueci minha senha" na página de login

### 4. Stephanie Izidio
- **Email:** stephanieizidio@hotmail.com  
- **Senha:** Use "Esqueci minha senha" na página de login

### 5. Cleuza Mizuno
- **Email:** diasmizuno@hotmail.com  
- **Senha:** Use "Esqueci minha senha" na página de login

### 6. Rosana Elisa Sperandio
- **Email:** sperandio.rosanaelisa@gmail.com  
- **Senha:** Use "Esqueci minha senha" na página de login

---

## ✅ USUÁRIOS ATIVOS COM AUTH

Estes usuários já podem acessar normalmente:
- Mônica Miguel da Silva
- Aracy
- Vívian Nunes
- Marcela Roberto
- Iara Lallon
- André Oliveira
- Marta
- Claudinha Vitto
- Olívio Ortola
- Mídia EUA
- Thais Conte
- Deise
- Nayara Fernandes
- Andenutri
- Larissa
- Juliana Bortolazzo
- Renata Borges
- Claudinei Leite
- Carlota de Moraes
- Amanda Bonfogo
- Anna Slim
- Andre Faula

---

## 📧 AÇÃO PARA OS USUÁRIOS SEM ACESSO

Envie para cada um:

```
Olá! 

Seu pagamento foi confirmado! Para acessar seu sistema, siga estes passos:

1. Acesse: https://herbalead.com/login
2. Clique em "Esqueci minha senha"
3. Digite seu email: [EMAIL_DA_PESSOA]
4. Acesse o email e clique no link de recuperação
5. Defina uma nova senha
6. Faça login!

Em caso de dúvidas, entre em contato.
```

---

## 🔧 CORREÇÃO FUTURA

O fluxo foi corrigido para:
1. Usuário paga → NÃO cria auth automaticamente
2. Webhook registra pagamento
3. Usuário é redirecionado para /complete-registration
4. Usuário completa cadastro com dados completos
5. Sistema cria auth + professional + subscription
6. Usuário tem acesso total

⚠️ Isos corrige o problema de "usuário criado sem senha"
