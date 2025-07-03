# Deploy Guide - Trusttech Dashboard

Este guia te ajudará a fazer o deploy da aplicação Trusttech Dashboard usando Docker.

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Banco de dados PostgreSQL existente (externo)
- Arquivo GCP key (gcp-key.json) para Google Cloud Storage

## 🚀 Deploy Rápido

### 1. Preparar variáveis de ambiente

Crie o arquivo `.env.production` baseado no exemplo:

```bash
cp .env.production.example .env.production
```

Edite `.env.production` com seus valores:

```env
# Database (seu banco existente)
DATABASE_URL="postgresql://username:password@host:port/database_name"

# JWT Secret (gere uma chave segura)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Google Cloud Storage
GOOGLE_CLOUD_KEYFILE="/app/gcp-key.json"

# Next.js
NODE_ENV="production"
PORT=3000
HOSTNAME="0.0.0.0"
```

### 2. Executar o deploy

```bash
./deploy.sh
```

Isso irá:
- Construir a imagem Docker
- Parar containers existentes
- Iniciar a aplicação

### 3. Verificar status

```bash
# Ver status dos containers
./manage.sh status

# Ver logs da aplicação
./manage.sh logs

# Verificar saúde da aplicação
./manage.sh health
```

## 🛠 Comandos Úteis

### Gerenciar aplicação

```bash
# Parar aplicação
./manage.sh stop

# Reiniciar aplicação
./manage.sh restart

# Ver logs em tempo real
./manage.sh logs
```

### Deploy manual

```bash
# Build da imagem
docker build -t trusttech-dashboard:latest .

# Executar com docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f
```

## 🔧 Configuração do Banco

Certifique-se de que seu banco PostgreSQL existente:

1. Está acessível pela aplicação Docker
2. Tem as tabelas criadas (execute as migrations do Prisma se necessário)
3. Permite conexões da rede Docker

### Executar migrations (se necessário)

```bash
# Entre no container
docker-compose -f docker-compose.prod.yml exec app sh

# Execute as migrations
npx prisma migrate deploy
```

## 🌐 Acessos

- **Aplicação**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health

## 📂 Volumes

- `./public/uploads`: Armazena uploads de arquivos (mapeado para o host)
- `./gcp-key.json`: Chave do Google Cloud Storage

## 🔍 Troubleshooting

### Problemas comuns

1. **Erro de conexão com banco**
   - Verifique a `DATABASE_URL`
   - Certifique-se que o banco está acessível

2. **Erro no Google Cloud Storage**
   - Verifique se `gcp-key.json` existe
   - Verifique as permissões do arquivo

3. **Container não inicia**
   - Verifique os logs: `./manage.sh logs`
   - Verifique se as portas estão livres

### Debug

```bash
# Ver logs detalhados
docker-compose -f docker-compose.prod.yml logs -f app

# Entrar no container
docker-compose -f docker-compose.prod.yml exec app sh

# Verificar variáveis de ambiente
docker-compose -f docker-compose.prod.yml exec app printenv
```

## 🔒 Segurança

- Mantenha o arquivo `.env.production` seguro
- Use um `JWT_SECRET` forte e único
- Configure firewall para proteger as portas
- Mantenha o Docker atualizado
