#!/bin/bash

# Build and Deploy Script for Trusttech Dashboard

echo "🚀 Starting build and deploy process..."

# Check if docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t trusttech-dashboard:latest .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

echo "✅ Docker image built successfully!"

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "⚠️  .env.production file not found. Please create it based on .env.production.example"
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Start the application
echo "🚀 Starting application..."
docker-compose -f docker-compose.prod.yml up -d

if [ $? -eq 0 ]; then
    echo "✅ Application started successfully!"
    echo "🌐 Application is running at: http://localhost:3000"
    echo "📊 Check logs with: docker-compose -f docker-compose.prod.yml logs -f"
else
    echo "❌ Failed to start application!"
    exit 1
fi
