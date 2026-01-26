#!/bin/sh
set -e

# This script runs as root (because we set USER root in the Dockerfile)
# Its purpose is to fix permissions on the /fuseki volume before switching
# to the fuseki user and running the original entrypoint.

# Step 1: Ensure /fuseki directory exists
# (Docker creates the mount point, but we ensure it exists just in case)
mkdir -p /fuseki

# Step 2: Change ownership of /fuseki to fuseki:fuseki
# This ensures the fuseki user (non-root) can write to the directory
# -R means recursive (applies to all files/subdirs if any exist)
# 2>/dev/null suppresses error messages if chown fails (shouldn't happen as root)
# || true ensures the script doesn't fail if chown somehow fails
chown -R fuseki:fuseki /fuseki 2>/dev/null || true

# Step 3: Ensure the directory is writable by the owner (fuseki user)
# u+w gives write permission to the user (owner)
# -R applies recursively to all contents
chmod -R 777 /fuseki 2>/dev/null || true

# Step 4: Switch to the fuseki user and execute the original entrypoint
# su-exec is like su but designed for containers (handles signals properly)
# fuseki:fuseki means user:group
# The original entrypoint is: /sbin/tini -- sh /docker-entrypoint.sh
# We use tini (already in base image) to handle signals, and su-exec to switch users
# The "$@" passes through any arguments (CMD) that were provided
# The original entrypoint from base image is: /sbin/tini -- sh /docker-entrypoint.sh
# We use su-exec to switch users, then call tini with the original entrypoint script
exec su-exec fuseki:fuseki /sbin/tini -- sh /docker-entrypoint.sh "$@"
