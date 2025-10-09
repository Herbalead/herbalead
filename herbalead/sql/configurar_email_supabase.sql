-- =====================================================
-- CONFIGURAÇÃO DE EMAIL - SUPABASE
-- =====================================================
-- Execute este código no SQL Editor do Supabase Dashboard
-- Link: https://supabase.com/dashboard/project/rjwuedzmapeozijjrcik/sql

-- =====================================================
-- 1. CRIAR FUNÇÃO DE ENVIO DE EMAIL SIMPLIFICADA
-- =====================================================

-- Função alternativa usando pg_net (mais simples)
CREATE OR REPLACE FUNCTION send_lead_email(
  to_email TEXT,
  subject TEXT,
  html_content TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  response_status INTEGER;
BEGIN
  -- Usar pg_net para enviar email via webhook
  SELECT status INTO response_status
  FROM net.http_post(
    url := 'https://api.supabase.com/v1/projects/rjwuedzmapeozijjrcik/functions/send-email',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqd3VlZHptYXBlb3ppampyY2lraiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NzQ4NzQzLCJleHAiOjIwNTAzMjQ3NDN9.8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ"}'::jsonb,
    body := json_build_object(
      'to', to_email,
      'subject', subject,
      'html', html_content
    )::text
  );
  
  -- Retornar true se o status for 200
  RETURN response_status = 200;
EXCEPTION
  WHEN OTHERS THEN
    -- Em caso de erro, retornar false
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 2. ATUALIZAR FUNÇÃO DE NOTIFICAÇÃO DE LEAD
-- =====================================================

-- Versão simplificada da função de notificação
CREATE OR REPLACE FUNCTION notify_new_lead()
RETURNS TRIGGER AS $$
DECLARE
  distributor_email TEXT;
  distributor_name TEXT;
  email_sent BOOLEAN;
BEGIN
  -- Buscar dados do distribuidor
  SELECT email, name INTO distributor_email, distributor_name
  FROM professionals
  WHERE id = NEW.user_id;
  
  -- Se não encontrou o distribuidor, não envia email
  IF distributor_email IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Tentar enviar email
  SELECT send_lead_email(
    distributor_email,
    '🎉 Novo Lead Capturado - Herbalead',
    '<!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
        .header { background: #10B981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .lead-info { background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .button { background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
        .footer { color: #666; font-size: 12px; text-align: center; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Herbalead</h1>
        <p>Novo Lead Capturado!</p>
      </div>
      <div class="content">
        <p>Olá <strong>' || distributor_name || '</strong>!</p>
        <p>Parabéns! Você tem um novo lead capturado:</p>
        <div class="lead-info">
          <p><strong>Nome:</strong> ' || NEW.name || '</p>
          <p><strong>WhatsApp:</strong> ' || NEW.phone || '</p>
          <p><strong>Ferramenta:</strong> ' || NEW.tool_name || '</p>
          <p><strong>Data:</strong> ' || TO_CHAR(NEW.created_at, 'DD/MM/YYYY às HH24:MI') || '</p>
        </div>
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://herbalead.com/user" class="button">
            Ver Lead no Dashboard
          </a>
        </div>
        <p>Não perca tempo! Entre em contato com seu novo lead o quanto antes.</p>
      </div>
      <div class="footer">
        <p>Este email foi enviado automaticamente pelo sistema Herbalead.</p>
      </div>
    </body>
    </html>'
  ) INTO email_sent;
  
  -- Log do resultado (opcional)
  IF email_sent THEN
    RAISE NOTICE 'Email enviado com sucesso para: %', distributor_email;
  ELSE
    RAISE NOTICE 'Falha ao enviar email para: %', distributor_email;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3. TESTAR FUNÇÃO DE EMAIL (OPCIONAL)
-- =====================================================

-- Teste da função de email (descomente para testar)
-- SELECT send_lead_email(
--   'seu-email@exemplo.com',
--   'Teste - Herbalead',
--   '<h1>Teste de Email</h1><p>Este é um teste do sistema de email do Herbalead.</p>'
-- );

-- =====================================================
-- 4. VERIFICAR CONFIGURAÇÃO
-- =====================================================

-- Verificar se as funções foram criadas
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('send_lead_email', 'notify_new_lead')
ORDER BY routine_name;
