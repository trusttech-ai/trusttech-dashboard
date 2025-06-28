.PHONY: help build up down restart logs clean dev prod db-reset db-migrate db-studio

# Default target
help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Development commands
dev: ## Start development environment with hot reload
	docker-compose -f docker-compose.dev.yml up --build

dev-down: ## Stop development environment
	docker-compose -f docker-compose.dev.yml down

# Production commands
prod: ## Start production environment
	docker-compose up --build -d

build: ## Build all services
	docker-compose build

up: ## Start all services in background
	docker-compose up -d

down: ## Stop all services
	docker-compose down

restart: ## Restart all services
	docker-compose restart

logs: ## Show logs for all services
	docker-compose logs -f

logs-app: ## Show logs for app service only
	docker-compose logs -f app

logs-db: ## Show logs for database service only
	docker-compose logs -f db

# Database commands
db-reset: ## Reset database and run migrations
	docker-compose exec app npx prisma migrate reset --force

db-migrate: ## Run database migrations
	docker-compose exec app npx prisma migrate dev

db-studio: ## Open Prisma Studio
	docker-compose exec app npx prisma studio

db-seed: ## Seed the database
	docker-compose exec app npx prisma db seed

# Utility commands
clean: ## Remove all containers, images, and volumes
	docker-compose down -v --rmi all
	docker system prune -f

shell: ## Access app container shell
	docker-compose exec app sh

shell-db: ## Access database shell
	docker-compose exec db psql -U postgres -d trusttech

# Install/update commands
install: ## Install dependencies
	docker-compose exec app npm install

update: ## Update dependencies
	docker-compose exec app npm update

# Testing commands
test: ## Run tests
	docker-compose exec app npm test

test-coverage: ## Run tests with coverage
	docker-compose exec app npm run test:coverage

# Linting commands
lint: ## Run linting
	docker-compose exec app npm run lint

lint-fix: ## Fix linting issues
	docker-compose exec app npm run lint -- --fix

# Status and monitoring
status: ## Show container status
	docker-compose ps

health: ## Check health of all services
	docker-compose ps | grep -E "(healthy|up)"

# Backup and restore
backup: ## Backup database
	docker-compose exec db pg_dump -U postgres trusttech > backup_$(shell date +%Y%m%d_%H%M%S).sql

restore: ## Restore database from backup (requires BACKUP_FILE variable)
	@if [ -z "$(BACKUP_FILE)" ]; then echo "Please specify BACKUP_FILE=your_backup.sql"; exit 1; fi
	docker-compose exec -T db psql -U postgres trusttech < $(BACKUP_FILE)
