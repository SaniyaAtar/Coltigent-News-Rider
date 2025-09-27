# Docker Setup for News Frontend

This document provides comprehensive instructions for running the News Frontend application using Docker in both development and production environments.

## 🐳 Prerequisites

- **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
- **Docker Compose** (usually included with Docker Desktop)
- At least **2GB RAM** available for Docker
- **Ports 3000 and 5173** available on your system

## 📁 Docker Files Overview

```
├── Dockerfile              # Production build
├── Dockerfile.dev          # Development build
├── docker-compose.yml      # Production orchestration
├── docker-compose.dev.yml  # Development orchestration
├── nginx.conf              # Nginx configuration
├── .dockerignore           # Files to exclude from Docker context
├── docker-scripts.sh       # Bash helper scripts
└── docker-scripts.ps1      # PowerShell helper scripts
```

## 🚀 Quick Start

### Development Mode (Recommended for local development)

```bash
# Using npm scripts
npm run docker:dev

# Or using PowerShell script
.\docker-scripts.ps1 dev

# Or using docker-compose directly
docker-compose -f docker-compose.dev.yml up --build
```

**Access the application at:** `http://localhost:5173`

### Production Mode

```bash
# Using npm scripts
npm run docker:prod

# Or using PowerShell script
.\docker-scripts.ps1 prod

# Or using docker-compose directly
docker-compose up --build -d
```

**Access the application at:** `http://localhost:3000`

## 🔧 Development Environment

### Features
- **Hot Module Replacement (HMR)**: Changes reflect immediately
- **Source code mounting**: Edit files on host, see changes in container
- **Development server**: Vite dev server with full debugging
- **API proxy**: Automatic API requests to backend

### Configuration
- **Port**: 5173 (Vite default)
- **Environment**: Development
- **API Base URL**: `http://host.docker.internal:8000/api/v1`
- **Volume mounting**: Source code mounted for live editing

### Usage
```bash
# Start development environment
npm run docker:dev

# View logs
npm run docker:logs-dev

# Stop development environment
npm run docker:stop
```

## 🏭 Production Environment

### Features
- **Optimized build**: Minified and compressed assets
- **Nginx server**: High-performance web server
- **Static file serving**: Optimized for production
- **Security headers**: Production-ready security configuration
- **Gzip compression**: Reduced bandwidth usage
- **Caching**: Optimized cache headers

### Configuration
- **Port**: 3000 (mapped to container port 80)
- **Environment**: Production
- **Server**: Nginx
- **Build**: Multi-stage Docker build

### Usage
```bash
# Start production environment
npm run docker:prod

# View logs
npm run docker:logs

# Stop production environment
npm run docker:stop
```

## 📋 Available Commands

### NPM Scripts
```bash
npm run docker:dev      # Start development environment
npm run docker:prod     # Start production environment
npm run docker:stop     # Stop all containers
npm run docker:clean    # Clean up all Docker resources
npm run docker:logs     # View production logs
npm run docker:logs-dev # View development logs
```

### PowerShell Scripts
```powershell
.\docker-scripts.ps1 dev         # Start development
.\docker-scripts.ps1 prod        # Start production
.\docker-scripts.ps1 stop        # Stop containers
.\docker-scripts.ps1 clean       # Clean up resources
.\docker-scripts.ps1 logs        # View production logs
.\docker-scripts.ps1 logs-dev    # View development logs
.\docker-scripts.ps1 build       # Build production image
.\docker-scripts.ps1 build-dev   # Build development image
.\docker-scripts.ps1 help        # Show help
```

### Direct Docker Commands
```bash
# Development
docker-compose -f docker-compose.dev.yml up --build
docker-compose -f docker-compose.dev.yml down

# Production
docker-compose up --build -d
docker-compose down

# Build only
docker-compose build
docker-compose -f docker-compose.dev.yml build
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
netstat -an | findstr :5173
netstat -an | findstr :3000

# Kill the process or use different ports
# Edit docker-compose.yml to change port mapping
```

#### 2. Docker Not Running
```bash
# Start Docker Desktop (Windows/Mac)
# Or start Docker service (Linux)
sudo systemctl start docker
```

#### 3. Permission Issues (Linux/Mac)
```bash
# Add user to docker group
sudo usermod -aG docker $USER
# Log out and log back in
```

#### 4. Build Failures
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

#### 5. API Connection Issues
- Ensure backend API is running on `http://localhost:8000`
- Check if `host.docker.internal` resolves correctly
- Verify API endpoints are accessible

### Debugging

#### View Container Logs
```bash
# Development logs
docker-compose -f docker-compose.dev.yml logs -f

# Production logs
docker-compose logs -f

# Specific service logs
docker-compose logs -f news-frontend
```

#### Access Container Shell
```bash
# Development container
docker-compose -f docker-compose.dev.yml exec news-frontend-dev sh

# Production container
docker-compose exec news-frontend sh
```

#### Check Container Status
```bash
# List running containers
docker ps

# List all containers
docker ps -a

# Container details
docker inspect <container_id>
```

## 🔧 Customization

### Environment Variables

#### Development (.env)
```bash
VITE_API_BASE_URL=http://host.docker.internal:8000/api/v1
VITE_APP_NAME=News Frontend
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=development
```

#### Production (.env.production)
```bash
VITE_API_BASE_URL=https://your-production-api.com/api/v1
VITE_APP_NAME=News Frontend
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=production
```

### Port Configuration

#### Change Development Port
Edit `docker-compose.dev.yml`:
```yaml
ports:
  - "8080:5173"  # Change 8080 to your preferred port
```

#### Change Production Port
Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Change 8080 to your preferred port
```

### Nginx Configuration

Edit `nginx.conf` to customize:
- Security headers
- Caching policies
- API proxy settings
- SSL configuration

## 📊 Performance Optimization

### Development
- **Volume mounting**: Fast file changes
- **HMR**: Instant updates
- **Source maps**: Full debugging support

### Production
- **Multi-stage build**: Smaller image size
- **Nginx**: High-performance serving
- **Gzip compression**: Reduced bandwidth
- **Static caching**: Optimized asset delivery
- **Security headers**: Production security

## 🔒 Security Considerations

### Production Security
- **Security headers**: XSS, CSRF protection
- **Content Security Policy**: Script execution control
- **No source maps**: Hide source code
- **Minified code**: Obfuscated JavaScript

### Development Security
- **Host networking**: Secure API communication
- **Volume isolation**: Container file system
- **Environment variables**: Secure configuration

## 📈 Monitoring

### Health Checks
```bash
# Check container health
docker ps

# Health check endpoint (production)
curl http://localhost:3000/health
```

### Resource Usage
```bash
# Container resource usage
docker stats

# System resource usage
docker system df
```

## 🚀 Deployment

### Local Deployment
```bash
# Build and run production
npm run docker:prod

# Access at http://localhost:3000
```

### Cloud Deployment
1. **Build image**: `docker build -t news-frontend .`
2. **Push to registry**: `docker push your-registry/news-frontend`
3. **Deploy to cloud**: Use cloud provider's container service

### CI/CD Integration
```yaml
# Example GitHub Actions
- name: Build Docker image
  run: docker build -t news-frontend .

- name: Push to registry
  run: docker push ${{ secrets.REGISTRY }}/news-frontend
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Vite Docker Guide](https://vitejs.dev/guide/build.html#docker)

---

## 🎯 Quick Reference

| Command | Purpose | Port |
|---------|---------|------|
| `npm run docker:dev` | Development with HMR | 5173 |
| `npm run docker:prod` | Production build | 3000 |
| `npm run docker:stop` | Stop all containers | - |
| `npm run docker:clean` | Clean up resources | - |

**Happy Dockerizing! 🐳**


