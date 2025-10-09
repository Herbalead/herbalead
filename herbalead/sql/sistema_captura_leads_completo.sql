-- =====================================================
-- SISTEMA DE CAPTURA DE LEADS - HERBALEAD
-- =====================================================
-- Execute este código no SQL Editor do Supabase Dashboard
-- Link: https://supabase.com/dashboard/project/rjwuedzmapeozijjrcik/sql

-- =====================================================
-- 1. ATUALIZAR TABELA LINKS (Adicionar campos novos)
-- =====================================================

-- Adicionar novos campos na tabela links
ALTER TABLE links ADD COLUMN IF NOT EXISTS capture_type VARCHAR(50) DEFAULT 'direct';
-- 'direct' = botão direto para WhatsApp, 'capture' = captura de dados

ALTER TABLE links ADD COLUMN IF NOT EXISTS material_title VARCHAR(255);
-- Título do material gratuito (ex: "E-book Guia Completo")

ALTER TABLE links ADD COLUMN IF NOT EXISTS material_description TEXT;
-- Descrição do material (ex: "Receba nosso guia completo de nutrição")

-- =====================================================
-- 2. CRIAR TABELA LEADS (Captura de dados)
-- =====================================================

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  tool_name VARCHAR(100) NOT NULL,
  lead_type VARCHAR(50) DEFAULT 'capture',
  -- 'direct' = clicou no botão, 'capture' = preencheu formulário
  status VARCHAR(50) DEFAULT 'new',
  -- 'new', 'contacted', 'converted', 'lost'
  material_sent BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CRIAR TABELA MATERIALS (Materiais disponíveis)
-- =====================================================

CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type VARCHAR(50), -- 'pdf', 'image', 'video'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS nas novas tabelas
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. CRIAR POLÍTICAS RLS PARA LEADS
-- =====================================================

-- Usuários podem ver apenas seus próprios leads
CREATE POLICY "Users can view their own leads" ON leads
  FOR SELECT USING (auth.uid() = user_id);

-- Usuários podem inserir leads (para captura)
CREATE POLICY "Anyone can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

-- Usuários podem atualizar apenas seus próprios leads
CREATE POLICY "Users can update their own leads" ON leads
  FOR UPDATE USING (auth.uid() = user_id);

-- Usuários podem deletar apenas seus próprios leads
CREATE POLICY "Users can delete their own leads" ON leads
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 6. CRIAR POLÍTICAS RLS PARA MATERIALS
-- =====================================================

-- Usuários podem ver apenas seus próprios materiais
CREATE POLICY "Users can view their own materials" ON materials
  FOR SELECT USING (auth.uid() = user_id);

-- Usuários podem inserir seus próprios materiais
CREATE POLICY "Users can insert their own materials" ON materials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar apenas seus próprios materiais
CREATE POLICY "Users can update their own materials" ON materials
  FOR UPDATE USING (auth.uid() = user_id);

-- Usuários podem deletar apenas seus próprios materiais
CREATE POLICY "Users can delete their own materials" ON materials
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 7. CRIAR TRIGGERS PARA UPDATED_AT
-- =====================================================

-- Trigger para leads
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_updated_at();

-- Trigger para materials
CREATE OR REPLACE FUNCTION update_materials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_materials_updated_at
  BEFORE UPDATE ON materials
  FOR EACH ROW
  EXECUTE FUNCTION update_materials_updated_at();

-- =====================================================
-- 8. FUNÇÃO PARA ENVIAR EMAIL DE NOTIFICAÇÃO
-- =====================================================

-- Função para enviar email quando novo lead é criado
CREATE OR REPLACE FUNCTION notify_new_lead()
RETURNS TRIGGER AS $$
DECLARE
  distributor_email TEXT;
  distributor_name TEXT;
  email_subject TEXT;
  email_body TEXT;
BEGIN
  -- Buscar dados do distribuidor
  SELECT email, name INTO distributor_email, distributor_name
  FROM professionals
  WHERE id = NEW.user_id;
  
  -- Se não encontrou o distribuidor, não envia email
  IF distributor_email IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Criar assunto do email
  email_subject := '🎉 Novo Lead Capturado - Herbalead';
  
  -- Criar corpo do email em HTML
  email_body := '
    <!DOCTYPE html>
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
        <p>Para parar de receber estas notificações, entre em contato conosco.</p>
      </div>
    </body>
    </html>
  ';
  
  -- Enviar email usando a função de email do Supabase
  PERFORM net.http_post(
    url := 'https://api.supabase.com/v1/projects/rjwuedzmapeozijjrcik/functions/send-email',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb,
    body := json_build_object(
      'to', distributor_email,
      'subject', email_subject,
      'html', email_body
    )::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 9. CRIAR TRIGGER PARA ENVIAR EMAIL
-- =====================================================

-- Trigger para enviar email quando novo lead é criado
CREATE TRIGGER send_lead_notification
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_lead();

-- =====================================================
-- 10. INSERIR DADOS DE EXEMPLO (OPCIONAL)
-- =====================================================

-- Inserir alguns materiais de exemplo
INSERT INTO materials (user_id, title, description, file_type, is_active)
SELECT 
  id,
  'E-book Guia Completo de Nutrição',
  'Guia completo com dicas de nutrição e alimentação saudável',
  'pdf',
  true
FROM professionals
WHERE id IN (SELECT id FROM professionals LIMIT 1);

INSERT INTO materials (user_id, title, description, file_type, is_active)
SELECT 
  id,
  'Checklist de Hábitos Saudáveis',
  'Lista de verificação para manter hábitos saudáveis',
  'pdf',
  true
FROM professionals
WHERE id IN (SELECT id FROM professionals LIMIT 1);

-- =====================================================
-- 11. VERIFICAR ESTRUTURA CRIADA
-- =====================================================

-- Verificar se as tabelas foram criadas
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('leads', 'materials')
ORDER BY table_name, ordinal_position;

-- Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('leads', 'materials')
ORDER BY tablename, policyname;

-- Verificar triggers
SELECT 
  event_object_schema AS schema_name,
  event_object_table AS table_name,
  trigger_name,
  event_manipulation AS event,
  action_timing AS timing
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN ('leads', 'materials')
ORDER BY table_name, trigger_name;
