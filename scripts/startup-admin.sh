#!/bin/bash
# ============================================
# ASAGUS Admin Panel - Azure App Service Startup Script
# Starts all microservices concurrently
# ============================================

echo "🚀 Starting ASAGUS Admin Panel Services..."

cd /home/site/wwwroot

# Start Auth Service in background
echo "🔐 Starting Auth Service on port 4001..."
node services/auth-service/dist/index.js &
AUTH_PID=$!

# Start Content Service in background
echo "📝 Starting Content Service on port 4002..."
node services/content-service/dist/index.js &
CONTENT_PID=$!

# Start Analytics Service in background
echo "📊 Starting Analytics Service on port 4003..."
node services/analytics-service/dist/index.js &
ANALYTICS_PID=$!

# Give services a moment to start
sleep 3

# Start API Gateway (foreground - Azure monitors this process)
echo "🌐 Starting API Gateway on port ${PORT:-8080}..."
node services/api-gateway/dist/index.js

# If gateway exits, clean up other services
kill $AUTH_PID $CONTENT_PID $ANALYTICS_PID 2>/dev/null
