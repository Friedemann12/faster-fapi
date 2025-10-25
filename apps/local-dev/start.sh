#!/bin/bash

# Start the Docker Compose services
echo "🚀 Starting Faster FAPI services..."

# Navigate to the local-dev directory
cd "$(dirname "$0")"

# Build and start services
docker-compose up --build -d

echo "✅ Services started!"
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "🌐 API available at: http://localhost:3000"
echo "🗄️  Database available at: localhost:5555"
echo "⚡ Valkey cache running"
echo ""
echo "📝 Logs: docker-compose logs -f api"
echo "🛑 Stop: docker-compose down"
