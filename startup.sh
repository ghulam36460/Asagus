#!/bin/bash
set -e

cd /home/site/wwwroot

# Kudu's NodeProjectOptimizer zips node_modules and creates a symlink
# to /node_modules/ which is empty. Extract the tarball to fix this.
if [ -f node_modules.tar.gz ]; then
    echo "Extracting node_modules from tarball..."
    # Remove broken symlink if exists
    if [ -L node_modules ]; then
        rm -f node_modules
    fi
    # Extract only if node_modules doesn't exist as a real directory
    if [ ! -d node_modules ]; then
        tar xzf node_modules.tar.gz
        echo "node_modules extracted successfully"
    fi
fi

echo "Starting Next.js server..."
node server.js
