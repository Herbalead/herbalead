-- =====================================================
-- HERBALEAD - SISTEMA COMPLETO DE MATERIAIS
-- =====================================================
-- Execute este código no SQL Editor do Supabase Dashboard
-- Link: https://supabase.com/dashboard/project/rjwuedzmapeozijjrcik/sql

-- 1. FUNÇÃO PARA ATUALIZAR 'updated_at' (se ainda não existir)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. TABELA 'materials' (atualizada com novos campos)
DROP TABLE IF EXISTS public.materials CASCADE;

CREATE TABLE public.materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL DEFAULT 'pdf', -- 'pdf', 'video', 'image', 'document'
  file_url TEXT, -- URL para arquivo (Supabase Storage)
  file_size BIGINT, -- Tamanho do arquivo em bytes
  file_name VARCHAR(255), -- Nome original do arquivo
  thumbnail_url TEXT, -- URL para thumbnail (videos/imagens)
  category VARCHAR(100) DEFAULT 'personal', -- 'personal', 'herbalead', 'partner'
  tags TEXT[], -- Array de tags para busca
  is_public BOOLEAN DEFAULT false, -- Se pode ser usado por outros distribuidores
  is_featured BOOLEAN DEFAULT false, -- Se é material em destaque
  download_count INTEGER DEFAULT 0, -- Contador de downloads
  view_count INTEGER DEFAULT 0, -- Contador de visualizações
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'pending_approval'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para 'materials'
CREATE TRIGGER update_materials_updated_at
  BEFORE UPDATE ON public.materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 3. TABELA 'material_categories' (categorias do Herbalead)
CREATE TABLE IF NOT EXISTS public.material_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50), -- Nome do ícone (ex: 'nutrition', 'fitness', 'wellness')
  color VARCHAR(7), -- Cor em hex (ex: '#10B981')
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA 'material_templates' (templates/modelos do Herbalead)
CREATE TABLE IF NOT EXISTS public.material_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.material_categories(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  template_type VARCHAR(50) NOT NULL, -- 'pdf_template', 'video_template', 'presentation'
  template_data JSONB, -- Dados do template (cores, fontes, layout)
  preview_url TEXT, -- URL da prévia
  download_url TEXT, -- URL para download do template
  is_premium BOOLEAN DEFAULT false, -- Se é conteúdo premium
  required_subscription VARCHAR(50), -- 'basic', 'premium', 'enterprise'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABELA 'material_downloads' (controle de downloads)
CREATE TABLE IF NOT EXISTS public.material_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  download_type VARCHAR(50) DEFAULT 'direct', -- 'direct', 'email', 'whatsapp'
  ip_address INET,
  user_agent TEXT,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABELA 'material_analytics' (analytics de materiais)
CREATE TABLE IF NOT EXISTS public.material_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- 'view', 'download', 'share', 'complete'
  event_data JSONB, -- Dados adicionais do evento
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. HABILITAR RLS E APLICAR POLÍTICAS

-- RLS para 'materials'
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own materials" ON public.materials;
CREATE POLICY "Users can view their own materials" ON public.materials
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view public materials" ON public.materials;
CREATE POLICY "Users can view public materials" ON public.materials
  FOR SELECT USING (is_public = true AND status = 'active');

DROP POLICY IF EXISTS "Users can insert their own materials" ON public.materials;
CREATE POLICY "Users can insert their own materials" ON public.materials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own materials" ON public.materials;
CREATE POLICY "Users can update their own materials" ON public.materials
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own materials" ON public.materials;
CREATE POLICY "Users can delete their own materials" ON public.materials
  FOR DELETE USING (auth.uid() = user_id);

-- RLS para 'material_categories'
ALTER TABLE public.material_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active categories" ON public.material_categories;
CREATE POLICY "Anyone can view active categories" ON public.material_categories
  FOR SELECT USING (is_active = true);

-- RLS para 'material_templates'
ALTER TABLE public.material_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view templates" ON public.material_templates;
CREATE POLICY "Authenticated users can view templates" ON public.material_templates
  FOR SELECT USING (auth.role() = 'authenticated');

-- RLS para 'material_downloads'
ALTER TABLE public.material_downloads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their material downloads" ON public.material_downloads;
CREATE POLICY "Users can view their material downloads" ON public.material_downloads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.materials 
      WHERE materials.id = material_downloads.material_id 
      AND materials.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Anyone can insert downloads" ON public.material_downloads;
CREATE POLICY "Anyone can insert downloads" ON public.material_downloads
  FOR INSERT WITH CHECK (true);

-- RLS para 'material_analytics'
ALTER TABLE public.material_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their material analytics" ON public.material_analytics;
CREATE POLICY "Users can view their material analytics" ON public.material_analytics
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.material_analytics;
CREATE POLICY "Anyone can insert analytics" ON public.material_analytics
  FOR INSERT WITH CHECK (true);

-- 8. INSERIR CATEGORIAS PADRÃO DO HERBALEAD
INSERT INTO public.material_categories (name, description, icon, color, sort_order) VALUES
('Nutrição', 'Materiais sobre alimentação saudável e suplementação', 'nutrition', '#10B981', 1),
('Fitness', 'Guias de exercícios e treinos', 'fitness', '#3B82F6', 2),
('Bem-estar', 'Conteúdo sobre qualidade de vida', 'wellness', '#8B5CF6', 3),
('Produtos', 'Catálogos e informações de produtos', 'products', '#F59E0B', 4),
('Marketing', 'Materiais de vendas e apresentações', 'marketing', '#EF4444', 5),
('Treinamento', 'Cursos e capacitações', 'training', '#06B6D4', 6)
ON CONFLICT (name) DO NOTHING;

-- 9. INSERIR TEMPLATES PADRÃO DO HERBALEAD
INSERT INTO public.material_templates (category_id, title, description, template_type, is_premium, required_subscription) VALUES
((SELECT id FROM public.material_categories WHERE name = 'Nutrição'), 'Guia de Alimentação Saudável', 'Template para criar guias nutricionais personalizados', 'pdf_template', false, 'basic'),
((SELECT id FROM public.material_categories WHERE name = 'Fitness'), 'Plano de Treino Semanal', 'Template para criar planos de exercícios', 'pdf_template', false, 'basic'),
((SELECT id FROM public.material_categories WHERE name = 'Marketing'), 'Apresentação de Produtos', 'Template profissional para apresentar produtos', 'presentation', true, 'premium'),
((SELECT id FROM public.material_categories WHERE name = 'Bem-estar'), 'Checklist de Bem-estar', 'Template para criar listas de verificação', 'pdf_template', false, 'basic')
ON CONFLICT DO NOTHING;

-- 10. FUNÇÃO PARA INCREMENTAR CONTADORES
CREATE OR REPLACE FUNCTION increment_material_counter(
  material_uuid UUID,
  counter_type VARCHAR(20)
)
RETURNS VOID AS $$
BEGIN
  IF counter_type = 'download' THEN
    UPDATE public.materials 
    SET download_count = download_count + 1 
    WHERE id = material_uuid;
  ELSIF counter_type = 'view' THEN
    UPDATE public.materials 
    SET view_count = view_count + 1 
    WHERE id = material_uuid;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION increment_material_counter(UUID, VARCHAR) TO authenticated;

-- 11. TRIGGER PARA REGISTRAR DOWNLOADS
CREATE OR REPLACE FUNCTION log_material_download()
RETURNS TRIGGER AS $$
BEGIN
  -- Incrementar contador de downloads
  PERFORM increment_material_counter(NEW.material_id, 'download');
  
  -- Registrar analytics
  INSERT INTO public.material_analytics (material_id, user_id, event_type, event_data)
  VALUES (
    NEW.material_id,
    (SELECT user_id FROM public.materials WHERE id = NEW.material_id),
    'download',
    jsonb_build_object('download_id', NEW.id, 'lead_id', NEW.lead_id)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_log_material_download
  AFTER INSERT ON public.material_downloads
  FOR EACH ROW EXECUTE FUNCTION log_material_download();

-- 12. ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_materials_user_id ON public.materials(user_id);
CREATE INDEX IF NOT EXISTS idx_materials_category ON public.materials(category);
CREATE INDEX IF NOT EXISTS idx_materials_type ON public.materials(type);
CREATE INDEX IF NOT EXISTS idx_materials_status ON public.materials(status);
CREATE INDEX IF NOT EXISTS idx_materials_public ON public.materials(is_public, status);
CREATE INDEX IF NOT EXISTS idx_material_downloads_material_id ON public.material_downloads(material_id);
CREATE INDEX IF NOT EXISTS idx_material_analytics_material_id ON public.material_analytics(material_id);
CREATE INDEX IF NOT EXISTS idx_material_analytics_user_id ON public.material_analytics(user_id);

-- 13. COMENTÁRIOS PARA DOCUMENTAÇÃO
COMMENT ON TABLE public.materials IS 'Armazena materiais dos distribuidores (PDFs, vídeos, etc.)';
COMMENT ON TABLE public.material_categories IS 'Categorias de materiais do Herbalead';
COMMENT ON TABLE public.material_templates IS 'Templates/modelos fornecidos pelo Herbalead';
COMMENT ON TABLE public.material_downloads IS 'Controle de downloads de materiais';
COMMENT ON TABLE public.material_analytics IS 'Analytics de uso dos materiais';
