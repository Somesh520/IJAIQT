#!/bin/bash

echo "🚀 Starting College Research Journal Platform..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Build and start services
echo "📦 Building and starting services..."
docker compose up --build -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Create admin user
echo ""
echo "👤 Creating admin user..."
docker compose exec -T backend node scripts/createAdmin.js

# Seed database
echo ""
echo "🌱 Seeding database with sample data..."
docker compose exec -T backend node scripts/seed.js

echo ""
echo "✅ Platform is ready!"
echo ""
echo "📍 Access points:"
echo "   Frontend:       http://localhost:3000"
echo "   Backend API:    http://localhost:5001/api"
echo "   Mongo Express:  http://localhost:8081"
echo ""
echo "🔑 Default admin credentials:"
echo "   Email:    admin@college-journal.com"
echo "   Password: admin123"
echo ""
echo "💡 To stop services: docker compose down"
echo "💡 To view logs: docker compose logs -f"
