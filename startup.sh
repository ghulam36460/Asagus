#!/bin/bash
set -e

cd /home/site/wwwroot

# ============================================================
# FIX ORYX DAMAGE
# Oryx's startup wrapper runs BEFORE this script and:
#   1. Extracts node_modules.tar.gz to /node_modules (broken pnpm symlinks)
#   2. Moves ./node_modules to ./_del_node_modules
#   3. Creates symlink ./node_modules -> /node_modules (broken)
# We undo this by restoring the real node_modules from _del_node_modules.
# ============================================================

if [ -L node_modules ]; then
    echo "[startup] Detected Oryx symlink at node_modules, restoring real modules..."
    rm -f node_modules
    if [ -d _del_node_modules ]; then
        mv _del_node_modules node_modules
        echo "[startup] Restored node_modules from _del_node_modules"
    fi
fi

# Prevent Oryx from re-creating the tarball/extracting on next restart
rm -f node_modules.tar.gz oryx-manifest.toml 2>/dev/null || true

# Verify critical module exists
if [ ! -f node_modules/next/package.json ]; then
    echo "[startup] ERROR: node_modules/next/package.json not found!"
    ls -la node_modules/ 2>/dev/null | head -20
    exit 1
fi

# Ensure Next.js listens on all interfaces (required for Azure App Service)
export HOSTNAME="0.0.0.0"
export PORT="${PORT:-8080}"

echo "[startup] Starting Next.js server on ${HOSTNAME}:${PORT}..."
exec node server.js
