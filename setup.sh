#!/bin/bash

# RAG Application Setup Script
echo "🚀 Setting up RAG Application for Deployment..."

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📋 Creating environment file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your API keys before continuing"
    echo "   - Google AI API key: https://makersuite.google.com/app/apikey"
    echo "   - Pinecone API key: https://www.pinecone.io/"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build Docker images
echo "🐳 Building Docker containers..."
docker-compose build

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Make sure .env file has your API keys"
echo "   2. Run: npm run docker:up"
echo "   3. Open: http://localhost:3000"
echo ""
echo "📚 For deployment options, see DEPLOYMENT.md"
