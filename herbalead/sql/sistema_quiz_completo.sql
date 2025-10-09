-- =====================================================
-- HERBALEAD - SISTEMA COMPLETO DE QUIZ BUILDER
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

-- 2. TABELA 'quizzes'
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  colors JSONB NOT NULL DEFAULT '{
    "primary": "#10B981",
    "secondary": "#059669", 
    "background": "#F0FDF4",
    "text": "#1F2937"
  }',
  settings JSONB NOT NULL DEFAULT '{
    "timeLimit": null,
    "attempts": null,
    "showCorrectAnswers": true,
    "randomizeQuestions": false,
    "customButtonText": "Falar com Especialista",
    "congratulationsMessage": "Parabéns! Você concluiu o quiz com sucesso! 🎉",
    "specialistButtonText": "Falar com Especialista",
    "specialistRedirectUrl": ""
  }',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para 'quizzes'
CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON public.quizzes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 3. TABELA 'questions'
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(20) NOT NULL DEFAULT 'multiple', -- 'multiple' ou 'essay'
  order_number INTEGER NOT NULL DEFAULT 0,
  options JSONB, -- Array de opções para múltipla escolha
  correct_answer JSONB, -- Resposta correta (número ou texto)
  points INTEGER DEFAULT 1,
  button_text VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para 'questions'
CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. TABELA 'quiz_responses' (respostas dos usuários)
CREATE TABLE IF NOT EXISTS public.quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  user_session_id VARCHAR(255) NOT NULL, -- ID da sessão do usuário
  answer JSONB NOT NULL, -- Resposta do usuário
  is_correct BOOLEAN,
  points_earned INTEGER DEFAULT 0,
  time_taken INTEGER, -- Tempo em segundos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABELA 'quiz_sessions' (sessões completas de quiz)
CREATE TABLE IF NOT EXISTS public.quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  user_session_id VARCHAR(255) NOT NULL,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  time_taken INTEGER, -- Tempo total em segundos
  completed BOOLEAN DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. HABILITAR RLS E APLICAR POLÍTICAS

-- RLS para 'quizzes'
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own quizzes" ON public.quizzes;
CREATE POLICY "Users can view their own quizzes" ON public.quizzes
  FOR SELECT USING (auth.uid() = professional_id);

DROP POLICY IF EXISTS "Anyone can view active quizzes" ON public.quizzes;
CREATE POLICY "Anyone can view active quizzes" ON public.quizzes
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Users can insert their own quizzes" ON public.quizzes;
CREATE POLICY "Users can insert their own quizzes" ON public.quizzes
  FOR INSERT WITH CHECK (auth.uid() = professional_id);

DROP POLICY IF EXISTS "Users can update their own quizzes" ON public.quizzes;
CREATE POLICY "Users can update their own quizzes" ON public.quizzes
  FOR UPDATE USING (auth.uid() = professional_id);

DROP POLICY IF EXISTS "Users can delete their own quizzes" ON public.quizzes;
CREATE POLICY "Users can delete their own quizzes" ON public.quizzes
  FOR DELETE USING (auth.uid() = professional_id);

-- RLS para 'questions'
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view questions from their quizzes" ON public.questions;
CREATE POLICY "Users can view questions from their quizzes" ON public.questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.professional_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Anyone can view questions from active quizzes" ON public.questions;
CREATE POLICY "Anyone can view questions from active quizzes" ON public.questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.is_active = true
    )
  );

DROP POLICY IF EXISTS "Users can insert questions to their quizzes" ON public.questions;
CREATE POLICY "Users can insert questions to their quizzes" ON public.questions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.professional_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update questions from their quizzes" ON public.questions;
CREATE POLICY "Users can update questions from their quizzes" ON public.questions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.professional_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete questions from their quizzes" ON public.questions;
CREATE POLICY "Users can delete questions from their quizzes" ON public.questions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.professional_id = auth.uid()
    )
  );

-- RLS para 'quiz_responses'
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view responses from their quizzes" ON public.quiz_responses;
CREATE POLICY "Users can view responses from their quizzes" ON public.quiz_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = quiz_responses.quiz_id 
      AND quizzes.professional_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Anyone can insert responses" ON public.quiz_responses;
CREATE POLICY "Anyone can insert responses" ON public.quiz_responses
  FOR INSERT WITH CHECK (true);

-- RLS para 'quiz_sessions'
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view sessions from their quizzes" ON public.quiz_sessions;
CREATE POLICY "Users can view sessions from their quizzes" ON public.quiz_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = quiz_sessions.quiz_id 
      AND quizzes.professional_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Anyone can insert sessions" ON public.quiz_sessions;
CREATE POLICY "Anyone can insert sessions" ON public.quiz_sessions
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update sessions" ON public.quiz_sessions;
CREATE POLICY "Anyone can update sessions" ON public.quiz_sessions
  FOR UPDATE USING (true);

-- 7. ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_quizzes_professional_id ON public.quizzes(professional_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_active ON public.quizzes(is_active);
CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON public.questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_questions_order ON public.questions(quiz_id, order_number);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_quiz_id ON public.quiz_responses(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_session ON public.quiz_responses(user_session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_quiz_id ON public.quiz_sessions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_session ON public.quiz_sessions(user_session_id);

-- 8. FUNÇÃO PARA CALCULAR ESTATÍSTICAS DO QUIZ
CREATE OR REPLACE FUNCTION get_quiz_stats(quiz_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  stats JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_sessions', COUNT(*),
    'completed_sessions', COUNT(*) FILTER (WHERE completed = true),
    'average_score', ROUND(AVG(total_points::numeric), 2),
    'average_time', ROUND(AVG(time_taken::numeric), 2)
  ) INTO stats
  FROM public.quiz_sessions
  WHERE quiz_id = quiz_uuid;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_quiz_stats(UUID) TO authenticated;

-- 9. COMENTÁRIOS PARA DOCUMENTAÇÃO
COMMENT ON TABLE public.quizzes IS 'Armazena quizzes criados pelos distribuidores';
COMMENT ON TABLE public.questions IS 'Perguntas dos quizzes';
COMMENT ON TABLE public.quiz_responses IS 'Respostas individuais dos usuários';
COMMENT ON TABLE public.quiz_sessions IS 'Sessões completas de quiz';
COMMENT ON FUNCTION get_quiz_stats(UUID) IS 'Calcula estatísticas de um quiz';
