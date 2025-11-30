#!/bin/bash

# ================================
# Verdleaf Docker Deployment Script
# ================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Determine docker compose command
    if docker compose version &> /dev/null 2>&1; then
        DOCKER_COMPOSE="docker compose"
    elif command -v docker-compose &> /dev/null; then
        DOCKER_COMPOSE="docker-compose"
    else
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker is installed (using: $DOCKER_COMPOSE)"
}

# Check if .env file exists
check_env() {
    if [ ! -f ".env" ]; then
        if [ -f ".env.docker" ]; then
            print_warning ".env file not found. Creating from .env.docker template..."
            cp .env.docker .env
            print_warning "Please edit .env file with your actual values before running again."
            exit 1
        else
            print_error ".env file not found. Please create one from .env.docker template."
            exit 1
        fi
    fi
    print_success "Environment file found"
}

# Build the Docker image
build() {
    print_header "Building Verdleaf Docker Image"
    $DOCKER_COMPOSE build
    print_success "Build completed"
}

# Start all services
start() {
    print_header "Starting Verdleaf Services"
    $DOCKER_COMPOSE up -d
    print_success "Services started"
    
    echo -e "\n${GREEN}Verdleaf is running at: http://localhost:3000${NC}\n"
}

# Stop all services
stop() {
    print_header "Stopping Verdleaf Services"
    $DOCKER_COMPOSE down
    print_success "Services stopped"
}

# Restart all services
restart() {
    print_header "Restarting Verdleaf Services"
    $DOCKER_COMPOSE restart
    print_success "Services restarted"
}

# View logs
logs() {
    $DOCKER_COMPOSE logs -f "${1:-app}"
}

# Run database migrations
migrate() {
    print_header "Running Database Migrations"
    $DOCKER_COMPOSE --profile migrate up migrate
    print_success "Migrations completed"
}

# Open shell in app container
shell() {
    $DOCKER_COMPOSE exec app sh
}

# Clean up everything
clean() {
    print_header "Cleaning Up"
    $DOCKER_COMPOSE down -v --rmi all --remove-orphans
    print_success "Cleanup completed"
}

# Show status
status() {
    print_header "Verdleaf Service Status"
    $DOCKER_COMPOSE ps
}

# Health check
health() {
    print_header "Health Check"
    
    # Check database
    if $DOCKER_COMPOSE exec db pg_isready -U verdleaf &> /dev/null; then
        print_success "Database: Healthy"
    else
        print_error "Database: Unhealthy"
    fi
    
    # Check app
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_success "Application: Healthy"
    else
        print_error "Application: Unhealthy or starting..."
    fi
}

# Production deployment
deploy_prod() {
    print_header "Production Deployment"
    
    check_docker
    check_env
    
    # Pull latest changes if in git repo
    if [ -d ".git" ]; then
        print_warning "Pulling latest changes..."
        git pull origin main
    fi
    
    # Build
    print_header "Building Verdleaf Docker Image"
    $DOCKER_COMPOSE build
    print_success "Build completed"
    
    # Run migrations
    print_header "Running Database Migrations"
    $DOCKER_COMPOSE --profile migrate up migrate
    print_success "Migrations completed"
    
    # Start services
    print_header "Starting Verdleaf Services"
    $DOCKER_COMPOSE up -d
    print_success "Services started"
    
    # Wait for app to be ready
    echo -e "\n${YELLOW}Waiting for application to be ready...${NC}"
    sleep 10
    
    # Health check
    health
    
    print_header "Deployment Complete!"
    echo -e "${GREEN}Verdleaf is now running at: http://localhost:3000${NC}\n"
}

# Show help
show_help() {
    echo -e "${BLUE}Verdleaf Docker Deployment Script${NC}"
    echo ""
    echo "Usage: ./deploy.sh [command]"
    echo ""
    echo "Commands:"
    echo "  build       Build Docker images"
    echo "  start       Start all services"
    echo "  stop        Stop all services"
    echo "  restart     Restart all services"
    echo "  logs [svc]  View logs (default: app)"
    echo "  migrate     Run database migrations"
    echo "  shell       Open shell in app container"
    echo "  status      Show service status"
    echo "  health      Run health checks"
    echo "  clean       Remove all containers, volumes, and images"
    echo "  deploy      Full production deployment"
    echo "  help        Show this help message"
    echo ""
}

# Main
case "${1:-help}" in
    build)
        check_docker
        build
        ;;
    start)
        check_docker
        check_env
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
    migrate)
        check_docker
        check_env
        migrate
        ;;
    shell)
        shell
        ;;
    status)
        status
        ;;
    health)
        health
        ;;
    clean)
        clean
        ;;
    deploy)
        deploy_prod
        ;;
    help|*)
        show_help
        ;;
esac
