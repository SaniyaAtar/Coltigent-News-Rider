# Docker Scripts for News Frontend (PowerShell)
# This script provides various Docker operations for the news frontend application

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

function Write-Header {
    param([string]$Message)
    Write-Host "[DOCKER] $Message" -ForegroundColor $Blue
}

# Check if Docker is installed
function Test-Docker {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Error "Docker is not installed. Please install Docker Desktop first."
        exit 1
    }

    if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
        Write-Error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    }

    Write-Status "Docker and Docker Compose are available"
}

# Development mode
function Start-Dev {
    Write-Header "Starting development environment..."
    Test-Docker
    
    Write-Status "Building and starting development container..."
    docker-compose -f docker-compose.dev.yml up --build
    
    Write-Status "Development server should be available at http://localhost:5173"
}

# Production mode
function Start-Prod {
    Write-Header "Starting production environment..."
    Test-Docker
    
    Write-Status "Building production image..."
    docker-compose up --build -d
    
    Write-Status "Production server should be available at http://localhost:3000"
}

# Stop containers
function Stop-Containers {
    Write-Header "Stopping containers..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    Write-Status "All containers stopped"
}

# Clean up
function Remove-All {
    Write-Header "Cleaning up Docker resources..."
    
    Write-Warning "This will remove all containers, images, and volumes for this project"
    $response = Read-Host "Are you sure? (y/N)"
    
    if ($response -eq "y" -or $response -eq "Y") {
        docker-compose down -v --rmi all
        docker-compose -f docker-compose.dev.yml down -v --rmi all
        docker system prune -f
        Write-Status "Cleanup completed"
    } else {
        Write-Status "Cleanup cancelled"
    }
}

# Show logs
function Show-Logs {
    Write-Header "Showing container logs..."
    docker-compose logs -f
}

# Show development logs
function Show-LogsDev {
    Write-Header "Showing development container logs..."
    docker-compose -f docker-compose.dev.yml logs -f
}

# Build only
function Build-Image {
    Write-Header "Building production image..."
    docker-compose build
    Write-Status "Build completed"
}

# Build development image
function Build-DevImage {
    Write-Header "Building development image..."
    docker-compose -f docker-compose.dev.yml build
    Write-Status "Development build completed"
}

# Show help
function Show-Help {
    Write-Host "Docker Scripts for News Frontend" -ForegroundColor $Blue
    Write-Host ""
    Write-Host "Usage: .\docker-scripts.ps1 [COMMAND]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  dev         Start development environment (with hot reload)"
    Write-Host "  prod        Start production environment"
    Write-Host "  stop        Stop all containers"
    Write-Host "  clean       Clean up all Docker resources"
    Write-Host "  logs        Show production container logs"
    Write-Host "  logs-dev    Show development container logs"
    Write-Host "  build       Build production image only"
    Write-Host "  build-dev   Build development image only"
    Write-Host "  help        Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\docker-scripts.ps1 dev      # Start development server"
    Write-Host "  .\docker-scripts.ps1 prod     # Start production server"
    Write-Host "  .\docker-scripts.ps1 logs     # View production logs"
}

# Main script logic
switch ($Command.ToLower()) {
    "dev" {
        Start-Dev
    }
    "prod" {
        Start-Prod
    }
    "stop" {
        Stop-Containers
    }
    "clean" {
        Remove-All
    }
    "logs" {
        Show-Logs
    }
    "logs-dev" {
        Show-LogsDev
    }
    "build" {
        Build-Image
    }
    "build-dev" {
        Build-DevImage
    }
    "help" {
        Show-Help
    }
    default {
        Write-Error "Unknown command: $Command"
        Show-Help
        exit 1
    }
}


