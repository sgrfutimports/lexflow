-- ============================================
-- Migration: Enable Row Level Security (RLS)
-- Description: Configurar políticas de segurança para todas as tabelas
-- Date: 2026-02-10
-- ============================================

-- ============================================
-- 1. HABILITAR RLS EM TODAS AS TABELAS
-- ============================================

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. POLÍTICAS PARA TABELA 'cases'
-- ============================================

-- Usuários podem ver apenas seus próprios processos
CREATE POLICY "Users can view own cases"
ON cases FOR SELECT
USING (auth.uid() = user_id);

-- Usuários podem inserir processos para si mesmos
CREATE POLICY "Users can insert own cases"
ON cases FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar apenas seus processos
CREATE POLICY "Users can update own cases"
ON cases FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Usuários podem deletar apenas seus processos
CREATE POLICY "Users can delete own cases"
ON cases FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- 3. POLÍTICAS PARA TABELA 'clients'
-- ============================================

-- Usuários podem ver apenas seus próprios clientes
CREATE POLICY "Users can view own clients"
ON clients FOR SELECT
USING (auth.uid() = user_id);

-- Usuários podem inserir clientes para si mesmos
CREATE POLICY "Users can insert own clients"
ON clients FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar apenas seus clientes
CREATE POLICY "Users can update own clients"
ON clients FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Usuários podem deletar apenas seus clientes
CREATE POLICY "Users can delete own clients"
ON clients FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- 4. POLÍTICAS PARA TABELA 'tasks'
-- ============================================

-- Usuários podem ver tarefas dos seus processos
CREATE POLICY "Users can view own tasks"
ON tasks FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM cases
    WHERE cases.id = tasks.case_id
    AND cases.user_id = auth.uid()
  )
);

-- Usuários podem inserir tarefas nos seus processos
CREATE POLICY "Users can insert own tasks"
ON tasks FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM cases
    WHERE cases.id = tasks.case_id
    AND cases.user_id = auth.uid()
  )
);

-- Usuários podem atualizar tarefas dos seus processos
CREATE POLICY "Users can update own tasks"
ON tasks FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM cases
    WHERE cases.id = tasks.case_id
    AND cases.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM cases
    WHERE cases.id = tasks.case_id
    AND cases.user_id = auth.uid()
  )
);

-- Usuários podem deletar tarefas dos seus processos
CREATE POLICY "Users can delete own tasks"
ON tasks FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM cases
    WHERE cases.id = tasks.case_id
    AND cases.user_id = auth.uid()
  )
);

-- ============================================
-- 5. POLÍTICAS PARA TABELA 'transactions'
-- ============================================

-- Usuários podem ver apenas suas transações
CREATE POLICY "Users can view own transactions"
ON transactions FOR SELECT
USING (auth.uid() = user_id);

-- Usuários podem inserir transações para si mesmos
CREATE POLICY "Users can insert own transactions"
ON transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar apenas suas transações
CREATE POLICY "Users can update own transactions"
ON transactions FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Usuários podem deletar apenas suas transações
CREATE POLICY "Users can delete own transactions"
ON transactions FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- 6. POLÍTICAS PARA STORAGE (bucket 'documents')
-- ============================================

-- Criar bucket se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Usuários podem fazer upload de arquivos na sua pasta
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Usuários podem ver apenas seus arquivos
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Usuários podem atualizar apenas seus arquivos
CREATE POLICY "Users can update own documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Usuários podem deletar apenas seus arquivos
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- 7. FUNÇÕES AUXILIARES
-- ============================================

-- Função para verificar se usuário é dono do processo
CREATE OR REPLACE FUNCTION is_case_owner(case_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM cases
    WHERE id = case_id
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar se usuário é dono do cliente
CREATE OR REPLACE FUNCTION is_client_owner(client_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM clients
    WHERE id = client_id
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. ÍNDICES PARA PERFORMANCE
-- ============================================

-- Índices para melhorar performance das queries com RLS
CREATE INDEX IF NOT EXISTS idx_cases_user_id ON cases(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_case_id ON tasks(case_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- ============================================
-- 9. COMENTÁRIOS
-- ============================================

COMMENT ON POLICY "Users can view own cases" ON cases IS 
'Permite que usuários vejam apenas seus próprios processos';

COMMENT ON POLICY "Users can view own clients" ON clients IS 
'Permite que usuários vejam apenas seus próprios clientes';

COMMENT ON POLICY "Users can view own tasks" ON tasks IS 
'Permite que usuários vejam tarefas apenas dos seus processos';

COMMENT ON POLICY "Users can view own transactions" ON transactions IS 
'Permite que usuários vejam apenas suas próprias transações';

-- ============================================
-- 10. VERIFICAÇÃO
-- ============================================

-- Verificar se RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('cases', 'clients', 'tasks', 'transactions');

-- Verificar políticas criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- ============================================
-- FIM DA MIGRATION
-- ============================================
