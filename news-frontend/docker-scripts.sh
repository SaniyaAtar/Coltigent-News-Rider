#!/bin/bash

# Docker Scripts for News Frontend
# This script provides various Docker operations for the news frontend application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[DOCKER]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    print_status "Docker and Docker Compose are available"
}

# Development mode
dev() {
    print_header "Starting development environment..."
    check_docker
    
    print_status "Building and starting development container..."
    docker-compose -f docker-compose.dev.yml up --build
    
    print_status "Development server should be available at http://localhost:5173"
}

# Production mode
prod() {
    print_header "Starting production environment..."
    check_docker
    
    print_status "Building production image..."
    docker-compose up --build -d
    
    print_status "Production server should be available at http://localhost:3000"
}

# Stop containers
stop() {
    print_header "Stopping containers..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    print_status "All containers stopped"
}

# Clean up
clean() {
    print_header "Cleaning up Docker resources..."
    
    print_warning "This will remove all containers, images, and volumes for this project"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v --rmi all
        docker-compose -f docker-compose.dev.yml down -v --rmi all
        docker system prune -f
        print_status "Cleanup completed"
    else
        print_status "Cleanup cancelled"
    fi
}

# Show logs
logs() {
    print_header "Showing container logs..."
    docker-compose logs -f
}

# Show development logs
logs-dev() {
    print_header "Showing development container logs..."
    docker-compose -f docker-compose.dev.yml logs -f
}

# Build only
build() {
    print_header "Building production image..."
    docker-compose build
    print_status "Build completed"
}

# Build development image
build-dev() {
    print_header "Building development image..."
    docker-compose -f docker-compose.dev.yml build
    print_status "Development build completed"
}

# Show help
help() {
    echo "Docker Scripts for News Frontend"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev         Start development environment (with hot reload)"
    echo "  prod        Start production environment"
    echo "  stop        Stop all containers"
    echo "  clean       Clean up all Docker resources"
    echo "  logs        Show production container logs"
    echo "  logs-dev    Show development container logs"
    echo "  build       Build production image only"
    echo "  build-dev   Build development image only"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev      # Start development server"
    echo "  $0 prod     # Start production server"
    echo "  $0 logs     # View production logs"
}

# Main script logic
case "${1:-help}" in
    dev)
        dev
        ;;
    prod)
        prod
        ;;
    stop)
        stop
        ;;
    clean)
        clean
        ;;
    logs)
        logs
        ;;
    logs-dev)
        logs-dev
        ;;
    build)
        build
        ;;
    build-dev)
        build-dev
        ;;
    help|--help|-h)
        help
        ;;
    *)
        print_error "Unknown command: $1"
        help
        exit 1
        ;;
esac

