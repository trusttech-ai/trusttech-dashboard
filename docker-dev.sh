#!/bin/bash

# Script para gerenciar o ambiente Docker do Trusttech Dashboard

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Setup environment file
setup_env() {
    if [ ! -f .env ]; then
        print_info "Creating .env file from .env.example..."
        cp .env.example .env
        print_warning "Please edit .env file with your configuration before running the application."
    else
        print_info ".env file already exists."
    fi
}

# Build and start services
start() {
    check_docker
    setup_env
    
    print_info "Building and starting services..."
    docker-compose up --build -d
    
    print_info "Waiting for database to be ready..."
    sleep 10
    
    print_info "Running Prisma migrations..."
    docker-compose exec app npx prisma migrate deploy
    
    print_info "Services started successfully!"
    print_info "Application: http://localhost:3000"
    print_info "Database: localhost:5432"
    print_info "Redis: localhost:6379"
}

# Stop services
stop() {
    print_info "Stopping services..."
    docker-compose down
    print_info "Services stopped."
}

# Restart services
restart() {
    stop
    start
}

# View logs
logs() {
    if [ -n "$1" ]; then
        docker-compose logs -f "$1"
    else
        docker-compose logs -f
    fi
}

# Clean up
clean() {
    print_warning "This will remove all containers, images, and volumes. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_info "Cleaning up..."
        docker-compose down -v --rmi all
        docker system prune -f
        print_info "Cleanup completed."
    else
        print_info "Cleanup cancelled."
    fi
}

# Database operations
db_reset() {
    print_warning "This will reset the database. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_info "Resetting database..."
        docker-compose exec app npx prisma migrate reset --force
        print_info "Database reset completed."
    else
        print_info "Database reset cancelled."
    fi
}

# Show status
status() {
    print_info "Service status:"
    docker-compose ps
}

# Help
show_help() {
    echo "Trusttech Dashboard Docker Management Script"
    echo ""
    echo "Usage: $0 {start|stop|restart|logs|status|clean|db-reset|help}"
    echo ""
    echo "Commands:"
    echo "  start    - Build and start all services"
    echo "  stop     - Stop all services"
    echo "  restart  - Restart all services"
    echo "  logs     - Show logs (optionally for specific service)"
    echo "  status   - Show service status"
    echo "  clean    - Remove all containers, images, and volumes"
    echo "  db-reset - Reset database and run migrations"
    echo "  help     - Show this help"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs app"
    echo "  $0 logs db"
}

# Main script
case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs "$2"
        ;;
    status)
        status
        ;;
    clean)
        clean
        ;;
    db-reset)
        db_reset
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Invalid command: $1"
        show_help
        exit 1
        ;;
esac
