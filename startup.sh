#!/bin/bash  
set -e

cd /home/site/wwwroot

echo "[startup] Starting deployment script..."

# ============================================================
# INSTALL DEPENDENCIES AT RUNTIME (ONCE)
# This completely bypasses Azure/Oryx's tar.gz behavior.
# We install with npm (no symlinks) and cache the result.
# ============================================================

# Remove any Oryx artifacts
rm -f node_modules.tar.gz oryx-manifest.toml 2>/dev/null || true

# If Oryx created a symlink, remove it
if [ -L node_modules ]; then
    echo "[startup] Removing Oryx symlink..."
    rm -f node_modules
fi

# Install dependencies if not already installed (or if incomplete)
if [ ! -f node_modules/next/package.json ] || [ ! -f node_modules/styled-jsx/package.json ]; then
    echo "[startup] Installing production dependencies with npm (this may take 2-3 minutes on first run)..."
    
  # Remove incomplete node_modules
    rm -rf node_modules _del_node_modules
    
    # Install with npm (no symlinks, unlike pnpm)
    npm install --production --no-package-lock --ignore-scripts --legacy-peer-deps 
    
    echo "[startup] ✓ Dependencies installed"
else
    echo "[startup] ✓ Dependencies already installed ($(ls node_modules | wc -l) packages)"
fi

# Verify critical modules exist
if [ ! -f node_modules/next/package.json ]; then
    echo "[startup] ERROR: next module not found after install!"
    ls -la node_modules/ | head -20
    exit 1
fi

if [ ! -f node_modules/styled-jsx/package.json ]; then
    echo "[startup] ERROR: styled-jsx module not found after install!"
    ls -la node_modules/ | head -20
    exit 1
fi

export PORT="${PORT:-8080}"

echo "[startup] Starting Next.js server on ${HOSTNAME}:${PORT}..."
exec node server.js
