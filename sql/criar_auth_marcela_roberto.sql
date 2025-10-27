-- ============================================
-- CRIAR AUTH PARA MARCELA ROBERTO
-- ============================================
-- ID: a30b5935-3bdc-4b30-a78b-346d10c287c4
-- Email: marcela_roberto@hotmail.com (corrigido)
-- Nome: marcela_roberto

-- 1. VERIFICAR SITUAÇÃO ATUAL
SELECT 
    p.id as professional_id,
    p.email,
    p.name,
    p.subscription_status,
    p.created_at,
    CASE 
        WHEN au.id IS NULL THEN '❌ SEM AUTH' 
        ELSE '✅ COM AUTH' 
    END as status_auth,
    au.id as auth_id,
    au.email as auth_email
FROM professionals p
LEFT JOIN auth.users au ON p.id = au.id
WHERE p.id = 'a30b5935-3bdc-4b30-a78b-346d10c287c4';

-- 2. VERIFICAR SUBSCRIPTION
SELECT 
    s.id,
    s.user_id,
    s.status,
    s.created_at,
    p.email,
    p.name
FROM subscriptions s
JOIN professionals p ON s.user_id = p.id
WHERE p.id = 'a30b5935-3bdc-4b30-a78b-346d10c287c4';

-- ============================================
-- IMPORTANTE: AUTH.NO.NO.SE.PODE.CRIAR.VIA.SQL
-- ============================================
-- É necessário usar o Supabase Admin API ou Dashboard

-- ============================================
-- SOLUÇÃO: VIA SUPABASE DASHBOARD
-- ============================================

-- Passo 1: Ir para https://supabase.com/dashboard
-- Passo 2: Selecionar seu projeto
-- Passo 3: Ir em Authentication > Users
-- Passo 4: Clicar em "Add user" ou "Invite user"
-- Passo 5: Preencher:
--    - Email: marcela_roberto@hotmail.com
--    - Password: SenhaTemporaria123!
--    - UUID: a30b5935-3bdc-4b30-a78b-346d10c287c4
--    - Auto Confirm: ✅ SIM
-- Passo 6: Clicar em "Create User"

-- ============================================
-- ALTERNATIVA: VIA ADMIN API (Node.js/Python)
-- ============================================

/*
// Código JavaScript para executar via Node.js ou Edge Function:

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'SUA_URL_SUPABASE';
const supabaseServiceKey = 'SUA_SERVICE_ROLE_KEY';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function criarAuthMarcela() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'marcela_roberto@hotmail.com',
    password: 'SenhaTemporaria123!',
    user_metadata: {
      full_name: 'marcela_roberto'
    },
    email_confirm: true
  });

  if (error) {
    console.error('Erro:', error);
  } else {
    console.log('Sucesso!', data.user);
    console.log('Credenciais para Marcela:');
    console.log('Email:', 'marcela_roberto@hotmail.com');
    console.log('Senha temporária:', 'SenhaTemporaria123!');
    console.log('URL de login: https://herbalead.com/login');
  }
}

criarAuthMarcela();
*/

-- ============================================
-- VERIFICAÇÃO FINAL (após criar auth)
-- ============================================

-- Verificar se auth foi criada corretamente
SELECT 
    p.id,
    p.email,
    p.name,
    p.phone,
    p.subscription_status,
    au.id as auth_id,
    au.email as auth_email,
    au.created_at as auth_created_at,
    CASE 
        WHEN au.id IS NULL THEN '❌ SEM AUTH - AÇÃO NECESSÁRIA' 
        ELSE '✅ TUDO OK' 
    END as STATUS_COMPLETO
FROM professionals p
LEFT JOIN auth.users au ON p.id = au.id
WHERE p.id = 'a30b5935-3bdc-4b30-a78b-346d10c287c4';

-- ============================================
-- PRÓXIMOS PASSOS APÓS CRIAR AUTH
-- ============================================

-- 1. Enviar email para Marcela:
--    - Assunto: "Bem-vinda ao HerbaLead - Suas Credenciais"
--    - Conteúdo: 
--      Olá Marcela!
--      
--      Sua conta foi criada com sucesso!
--      
--      Para acessar a área profissional:
--      URL: https://herbalead.com/login
--      
--      Suas credenciais:
--      Email: marcela_roberto@hotmail.com
--      Senha temporária: SenhaTemporaria123!
--      
--      IMPORTANTE: Por favor, altere esta senha após o primeiro acesso.
--      
--      Atenciosamente,
--      Equipe HerbaLead

-- 2. Verificar se ela consegue fazer login
-- 3. Orientá-la a atualizar perfil com dados completos (telefone, especialidade, etc)

-- ============================================
-- CORRIGIR EMAIL (remover espaço)
-- ============================================

-- O email parece ter um espaço ao invés de ponto
-- Verificar e corrigir:

-- SELECT email FROM professionals WHERE id = 'a30b5935-3bdc-4b30-a78b-346d10c287c4';

-- Se o email estiver errado (com espaço), corrigir:
-- UPDATE professionals 
-- SET email = 'marcela_roberto@hotmail.com' 
-- WHERE id = 'a30b5935-3bdc-4b30-a78b-346d10c287c4';

-- ============================================
-- QUERY PARA LISTAR TODOS OS PROFISSIONAIS SEM AUTH
-- ============================================

SELECT 
    p.id,
    p.email,
    p.name,
    p.subscription_status,
    p.created_at,
    '❌ SEM AUTH - AÇÃO NECESSÁRIA' as status
FROM professionals p
LEFT JOIN auth.users au ON p.id = au.id
WHERE au.id IS NULL
ORDER BY p.created_at DESC;

