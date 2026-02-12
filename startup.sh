#!/bin/bash  
set -e

cd /home/site/wwwroot

# ============================================================
# HANDLE ORYX NODE_MODULES TAR.GZ
# If Azure created node_modules.tar.gz during deployment:
#   - node_modules directory was deleted by Azure
#   - tar.gz exists and needs to be extracted to restore modules
# With WEBSITE_RUN_FROM_PACKAGE=0, Oryx should not interfere,
# so we extract to a real directory ourselves.
# ============================================================

if [ -f node_modules.tar.gz ] && [ ! -d node_modules ]; then
    echo "[startup] Found node_modules.tar.gz but no node_modules dir, extracting..."
    mkdir -p node_modules
    tar -xzf node_modules.tar.gz -C node_modules
    echo "[startup] Extracted node_modules from tar.gz"
    # Clean up artifacts
    rm -f node_modules.tar.gz oryx-manifest.toml
fi

# If Oryx already ran and created a symlink (shouldn't happen with RUN_FROM_PACKAGE=0 but just in case)
if [ -L node_modules ]; then
    echo "[startup] Detected Oryx symlink, removing and extracting tar.gz..."
    rm -f node_modules
    if [ -f node_modules.tar.gz ]; then
        mkdir -p node_modules
        tar -xzf node_modules.tar.gz -C node_modules
        rm -f node_modules.tar.gz oryx-manifest.toml
    elif [ -d _del_node_modules ]; then
        mv _del_node_modules node_modules
    fi
fi

# Verify critical module exists
if [ ! -f node_modules/next/package.json ]; then
    echo "[startup] ERROR: node_modules/next/package.json not found!"
    echo "[startup] Listing wwwroot contents:"
    ls -la /home/site/wwwroot/
    echo "[startup] Listing node_modules (if exists):"
    ls -la node_modules/ 2>/dev/null | head -20 || echo "node_modules does not exist"
    exit 1
fi

# Ensure Next.js listens on all interfaces (required for Azure App Service)
export HOSTNAME="0.0.0.0"
export PORT="${PORT:-8080}"

echo "[startup] Starting Next.js server on ${HOSTNAME}:${PORT}..."
exec node server.js
