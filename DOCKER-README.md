# Docker Setup para Trusttech Dashboard

Este documento explica como configurar e executar o Trusttech Dashboard usando Docker.

## Pré-requisitos

- Docker Desktop instalado
- Docker Compose instalado
- Pelo menos 4GB de RAM disponível

## Configuração Rápida

1. **Clone o repositório e navegue para o diretório:**
   ```bash
   cd trusttech-dashboard
   ```

2. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```
   Edite o arquivo `.env` com suas configurações.

3. **Execute o setup automatizado:**
   ```bash
   ./docker-dev.sh start
   ```

## Comandos Disponíveis

### Script de Gerenciamento (docker-dev.sh)

```bash
# Iniciar todos os serviços
./docker-dev.sh start

# Parar todos os serviços
./docker-dev.sh stop

# Reiniciar todos os serviços
./docker-dev.sh restart

# Ver logs de todos os serviços
./docker-dev.sh logs

# Ver logs de um serviço específico
./docker-dev.sh logs app
./docker-dev.sh logs db

# Ver status dos serviços
./docker-dev.sh status

# Resetar banco de dados
./docker-dev.sh db-reset

# Limpeza completa (remove tudo)
./docker-dev.sh clean

# Ajuda
./docker-dev.sh help
```

### Comandos Docker Compose Manuais

```bash
# Construir e iniciar em background
docker-compose up --build -d

# Parar serviços
docker-compose down

# Ver logs
docker-compose logs -f

# Executar comandos no container da aplicação
docker-compose exec app npm run dev
docker-compose exec app npx prisma studio
docker-compose exec app npx prisma migrate dev

# Executar comandos no banco de dados
docker-compose exec db psql -U postgres -d trusttech
```

## Serviços Incluídos

### 1. App (Next.js)
- **Porta:** 3000
- **URL:** http://localhost:3000
- **Descrição:** Aplicação principal Next.js

## Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@db:5432/trusttech"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=trusttech

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Google Cloud (se usando)
GOOGLE_CLOUD_PROJECT_ID="your-project-id"
GOOGLE_CLOUD_KEY_FILE="/app/gcp-key.json"
```

## Volumes e Persistência

- **postgres_data:** Dados do PostgreSQL
- **redis_data:** Dados do Redis
- **./public/uploads:** Upload de arquivos (montado como volume)
- **./gcp-key.json:** Chave do Google Cloud (se usando)

## Desenvolvimento

### Hot Reload
O Docker está configurado para desenvolvimento. Para habilitar hot reload durante o desenvolvimento:


1. Use o comando de desenvolvimento:
   ```bash
   docker-compose exec app npm run dev
   ```

### Debugging
Para debug da aplicação:

```bash
# Entrar no container
docker-compose exec app sh

# Ver logs em tempo real
docker-compose logs -f app

# Executar comandos Prisma
docker-compose exec app npx prisma studio
```

## Produção

### Build para Produção
```bash
# Build otimizado
docker-compose build --no-cache

# Executar em modo produção
docker-compose up -d
```

### Health Checks
Os serviços incluem health checks:
- **App:** Verifica se a aplicação responde na porta 3000
- **Database:** Verifica se PostgreSQL está aceitando conexões
- **Redis:** Verifica se Redis responde ao comando ping

## Troubleshooting

### Problemas Comuns

1. **Porta já em uso:**
   ```bash
   # Verificar qual processo está usando a porta
   lsof -i :3000
   # Alterar a porta no docker-compose.yml se necessário
   ```

2. **Permissões de arquivo:**
   ```bash
   # No macOS/Linux
   chmod +x docker-dev.sh
   ```

3. **Container não inicia:**
   ```bash
   # Ver logs detalhados
   docker-compose logs app
   
   # Verificar se todas as variáveis estão configuradas
   docker-compose config
   ```

4. **Erro de migração do banco:**
   ```bash
   # Resetar banco e migrar novamente
   ./docker-dev.sh db-reset
   ```

5. **Problema com Prisma:**
   ```bash
   # Regenerar cliente Prisma
   docker-compose exec app npx prisma generate
   ```

### Limpeza Completa
Se tiver problemas persistentes:

```bash
# Parar tudo e limpar
./docker-dev.sh clean

# Ou manualmente
docker-compose down -v
docker system prune -a
```

## Performance

### Otimizações Recomendadas

1. **Aumentar memória do Docker:**
   - Docker Desktop → Settings → Resources → Memory (mínimo 4GB)

2. **Cache de node_modules:**
   - O Dockerfile já otimiza o cache das dependências

3. **Build multi-stage:**
   - Reduz o tamanho da imagem final

## Monitoramento

### Logs
```bash
# Logs estruturados
docker-compose logs --timestamps app

# Logs do banco
docker-compose logs db
```

### Métricas
```bash
# Uso de recursos
docker stats

# Status dos containers
docker-compose ps
```

## Backup e Restore

### Backup do Banco
```bash
# Backup
docker-compose exec db pg_dump -U postgres trusttech > backup.sql

# Restore
docker-compose exec -T db psql -U postgres trusttech < backup.sql
```
