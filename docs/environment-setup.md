# 🔐 Guia de Configuração de Ambiente - LexFlow SaaS

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase
- Conta no Google AI Studio (para Gemini API)
- Conta no Sentry (opcional, para logging em produção)

## 🚀 Configuração Inicial

### 1. Clonar o Repositório

```bash
git clone <seu-repositorio>
cd lexflow-saas
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

### 3. Obter Credenciais

#### **Gemini API Key**

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada

#### **Supabase**

1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Crie um novo projeto ou selecione um existente
3. Vá em Settings > API
4. Copie:
   - **Project URL** (VITE_SUPABASE_URL)
   - **anon/public key** (VITE_SUPABASE_ANON_KEY)

#### **Sentry** (Opcional)

1. Acesse [Sentry.io](https://sentry.io)
2. Crie um novo projeto React
3. Copie o **DSN** fornecido

### 4. Preencher `.env.local`

```env
# Gemini AI Configuration
GEMINI_API_KEY=AIzaSy...sua_chave_aqui

# Supabase Configuration
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Sentry Configuration (opcional)
VITE_SENTRY_DSN=https://...@sentry.io/...
```

## 🗄️ Configurar Banco de Dados

### 1. Executar Migrations

No Supabase Dashboard:

1. Vá em SQL Editor
2. Execute os scripts na pasta `supabase/migrations/` na ordem:
   - `001_initial_schema.sql`
   - `002_add_tasks_table.sql`
   - `003_enable_rls.sql` (quando criado)

### 2. Configurar Storage

1. No Supabase Dashboard, vá em Storage
2. Crie um bucket chamado `documents`
3. Configure as políticas de acesso (RLS)

## ▶️ Executar o Projeto

### Desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

### Build de Produção

```bash
npm run build
npm run preview
```

## 🔒 Segurança

### ⚠️ IMPORTANTE

- **NUNCA** commite o arquivo `.env.local`
- **NUNCA** exponha suas API keys publicamente
- Rotacione suas chaves regularmente
- Use variáveis de ambiente diferentes para dev/staging/prod

### Rotação de Chaves

#### Gemini API

1. Acesse Google AI Studio
2. Revogue a chave antiga
3. Gere uma nova chave
4. Atualize `.env.local`
5. Reinicie o servidor de desenvolvimento

#### Supabase

1. Acesse Supabase Dashboard > Settings > API
2. Clique em "Reset database password" (se necessário)
3. Gere novas keys se comprometidas
4. Atualize `.env.local`

## 🌍 Deploy em Produção

### Vercel

1. Conecte seu repositório no Vercel
2. Configure as variáveis de ambiente no dashboard
3. Deploy automático a cada push

### Netlify

1. Conecte seu repositório no Netlify
2. Configure as variáveis de ambiente
3. Build command: `npm run build`
4. Publish directory: `dist`

## 📝 Variáveis de Ambiente por Ambiente

### Desenvolvimento (`.env.local`)
```env
GEMINI_API_KEY=sua_chave_dev
VITE_SUPABASE_URL=https://dev-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_dev
```

### Produção (`.env.production`)
```env
GEMINI_API_KEY=sua_chave_prod
VITE_SUPABASE_URL=https://prod-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_prod
VITE_SENTRY_DSN=https://...@sentry.io/...
```

## 🐛 Troubleshooting

### Erro: "Invalid API Key"
- Verifique se a chave está correta no `.env.local`
- Certifique-se de que não há espaços extras
- Reinicie o servidor de desenvolvimento

### Erro: "Supabase connection failed"
- Verifique a URL do projeto
- Confirme que a anon key está correta
- Verifique se o projeto Supabase está ativo

### Erro: "Module not found"
- Execute `npm install` novamente
- Limpe o cache: `npm cache clean --force`
- Delete `node_modules` e reinstale

## 📞 Suporte

Para problemas ou dúvidas:
- Abra uma issue no repositório
- Consulte a documentação do Supabase
- Consulte a documentação do Gemini API

---

**Última atualização:** 10 de fevereiro de 2026
