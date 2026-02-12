#!/bin/bash
set -e

cd /home/site/wwwroot

# Ensure Next.js listens on all interfaces (required for Azure App Service)
export HOSTNAME="0.0.0.0"
export PORT="${PORT:-8080}"

echo "Starting Next.js server on ${HOSTNAME}:${PORT}..."
node server.js
