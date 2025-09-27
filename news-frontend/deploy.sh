#!/bin/bash

# News Frontend Deployment Script
# This script builds and deploys the news frontend application

set -e  # Exit on any error

echo "🚀 Starting News Frontend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

print_status "npm version: $(npm -v)"

# Check if environment file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_warning "Please update .env file with your configuration before deploying."
    else
        print_error ".env.example file not found. Please create environment configuration."
        exit 1
    fi
fi

# Install dependencies
print_status "Installing dependencies..."
npm ci --only=production

# Run type checking
print_status "Running TypeScript type checking..."
npm run type-check

# Run linting
print_status "Running ESLint..."
npm run lint

# Build the application
print_status "Building application for production..."
npm run build:prod

# Check if build was successful
if [ ! -d "dist" ]; then
    print_error "Build failed. dist directory not found."
    exit 1
fi

print_status "Build completed successfully!"

# Display build information
BUILD_SIZE=$(du -sh dist | cut -f1)
print_status "Build size: $BUILD_SIZE"

# List build contents
print_status "Build contents:"
ls -la dist/

# Optional: Deploy to specific platform
if [ "$1" = "vercel" ]; then
    print_status "Deploying to Vercel..."
    if command -v vercel &> /dev/null; then
        vercel --prod
    else
        print_error "Vercel CLI not found. Install with: npm i -g vercel"
        exit 1
    fi
elif [ "$1" = "netlify" ]; then
    print_status "Deploying to Netlify..."
    if command -v netlify &> /dev/null; then
        netlify deploy --prod --dir=dist
    else
        print_error "Netlify CLI not found. Install with: npm i -g netlify-cli"
        exit 1
    fi
else
    print_status "Build ready for deployment!"
    print_status "Upload the contents of the 'dist' directory to your hosting platform."
fi

print_status "Deployment completed successfully! 🎉"

