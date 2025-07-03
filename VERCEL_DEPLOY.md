# Deploy na Vercel - Guia Completo

## 🚀 Deploy Rápido

```bash
# Opção 1: Script automatizado
./deploy-vercel.sh

# Opção 2: Manual via CLI
npm i -g vercel
vercel login
vercel --prod
```

## 📋 Configuração Completa

### 1. **Variáveis de Ambiente no Dashboard da Vercel**

Configure estas variáveis em: https://vercel.com/dashboard → Seu Projeto → Settings → Environment Variables

#### **Obrigatórias:**
```env
DATABASE_URL=postgresql://username:password@host:5432/database_name
NEXTAUTH_SECRET=your-production-secret-here-minimum-32-characters
NEXTAUTH_URL=https://your-app.vercel.app
JWT_SECRET=your-jwt-secret-here-minimum-32-characters
NODE_ENV=production
```

#### **Opcionais (Google Cloud Storage):**
```env
GOOGLE_APPLICATION_CREDENTIALS=/tmp/gcp-key.json
GCS_BUCKET_NAME=your-bucket-name
```

### 2. **Opções de Banco de Dados**

#### **🟢 Recomendado: Vercel Postgres**
1. Vá para: https://vercel.com/dashboard → Storage → Create Database
2. Escolha PostgreSQL
3. A `DATABASE_URL` será automaticamente configurada

#### **🔵 Alternativas Externas:**
- **Neon**: https://neon.tech (PostgreSQL serverless)
- **Supabase**: https://supabase.com (PostgreSQL + extras)
- **Railway**: https://railway.app (PostgreSQL managed)
- **PlanetScale**: https://planetscale.com (MySQL serverless)

### 3. **Deploy via GitHub (Recomendado)**

1. **Push do código:**
   ```bash
   git add .
   git commit -m "feat: configuração para Vercel"
   git push origin main
   ```

2. **Conectar na Vercel:**
   - Acesse: https://vercel.com/dashboard
   - Clique "Import Project"
   - Selecione seu repositório GitHub
   - Configure as variáveis de ambiente
   - Deploy automático!

### 4. **Deploy via CLI**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Ver logs
vercel logs your-app.vercel.app
```

## 🔧 Configurações Técnicas

### **Limites da Vercel**

| Recurso | Hobby (Free) | Pro |
|---------|-------------|-----|
| **Function Timeout** | 10s | 60s |
| **Memory** | 512MB | 3GB |
| **File Upload** | 10MB | 50MB |
| **Bandwidth** | 100GB | 1TB |

### **Configurações Otimizadas**

✅ **next.config.ts** - Configurado para serverless  
✅ **vercel.json** - Timeouts e regiões otimizadas  
✅ **Prisma** - Auto-generate configurado  
✅ **Health Check** - Endpoint em `/api/health`  

## 🛠️ Pós-Deploy

### **1. Executar Migrações**
```bash
# Via Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy

# Ou configurar como Build Command no Vercel:
# npm ci && npx prisma generate && npx prisma migrate deploy && npm run build
```

### **2. Verificar Funcionamento**
```bash
# Health check
curl https://your-app.vercel.app/api/health

# Página principal
curl https://your-app.vercel.app
```

### **3. Configurar Domínio Personalizado**
1. Vá para: Dashboard → Seu Projeto → Settings → Domains
2. Adicione seu domínio
3. Configure DNS conforme instruções

## � Troubleshooting

### **Build Errors**
```bash
# Testar build local primeiro
npm run build:vercel

# Ver logs detalhados
vercel logs your-app.vercel.app --follow
```

### **Database Connection Issues**
```bash
# Testar conexão local
npx prisma db pull

# Verificar variáveis
vercel env ls

# Ver logs da função
vercel logs your-app.vercel.app --since=1h
```

### **Function Timeout**
Se suas funções demoram mais que 10s (Hobby) ou 60s (Pro):
1. Otimize queries do banco
2. Use connection pooling
3. Considere background jobs
4. Upgrade para Pro se necessário

## 📊 Monitoramento

### **Analytics Built-in**
- Dashboard → Seu Projeto → Analytics
- Métricas de performance, errors, etc.

### **Custom Monitoring**
```bash
# Health check endpoint
GET /api/health

# Response esperado:
{
  "status": "ok",
  "timestamp": "2025-07-03T03:20:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

## 🔗 Links Úteis

- 📊 [Vercel Dashboard](https://vercel.com/dashboard)
- 📚 [Vercel Docs](https://vercel.com/docs)
- 🗃️ [Vercel Postgres](https://vercel.com/storage/postgres)
- 🔧 [Next.js Deployment](https://nextjs.org/docs/deployment)
- 🎯 [Prisma + Vercel](https://www.prisma.io/docs/guides/deployment/deploying-to-vercel)

## 📝 Exemplo Completo

```bash
# 1. Clonar e configurar
git clone https://github.com/your-org/trusttech-dashboard
cd trusttech-dashboard
npm install

# 2. Configurar ambiente local
cp .env.example .env.local
# Editar .env.local com suas configurações

# 3. Testar local
npm run dev

# 4. Build e deploy
npm run build:vercel
./deploy-vercel.sh

# 5. Configurar produção na Vercel
# - Adicionar variáveis de ambiente
# - Executar migrações
# - Testar health check
```

---

**🎉 Seu app estará rodando em: `https://your-app.vercel.app`**
