#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Determine the absolute path of the directory where the script is located.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Define source and destination paths based on the script's location.
DEST_DIR_PATH="${SCRIPT_DIR}/../node_modules/moleculer/"
SOURCE_FILE_PATH="${SCRIPT_DIR}/moleculer/index.d.ts"
DEST_FILE_PATH="${DEST_DIR_PATH}/index.d.ts"
BACKUP_FILE_PATH="${DEST_DIR_PATH}/index.d.ts.original"

# Ensure the destination directory exists. Create it if it doesn't.
mkdir -p "${DEST_DIR_PATH}"

# If the destination file exists and backup doesn't exist, create backup
if [ -f "${DEST_FILE_PATH}" ] && [ ! -f "${BACKUP_FILE_PATH}" ]; then
  cp "${DEST_FILE_PATH}" "${BACKUP_FILE_PATH}"
fi

# Copy the source file to the destination, overwriting if it already exists.
# The -f flag ensures that the destination file is overwritten if it exists.
cp -f "${SOURCE_FILE_PATH}" "${DEST_FILE_PATH}"


# To the index.js file in moleculer's node_modules directory, add the defineAction function.
MOLECULER_INDEX_JS="${DEST_DIR_PATH}/index.js"
DEFINE_ACTION_SOURCE="${SCRIPT_DIR}/moleculer/defineAction.js.template"

# Create backup of index.js if it doesn't exist
if [ -f "${MOLECULER_INDEX_JS}" ] && [ ! -f "${MOLECULER_INDEX_JS}.original" ]; then
  cp "${MOLECULER_INDEX_JS}" "${MOLECULER_INDEX_JS}.original"
fi

# Read the defineAction function from the source file
DEFINE_ACTION_CONTENT=$(cat "${DEFINE_ACTION_SOURCE}")

# Add the defineAction function to module.exports in index.js
# Check if defineAction is already added to avoid duplicates
if ! grep -q "defineAction" "${MOLECULER_INDEX_JS}"; then
  # Create a temporary file with the new content
  {
    echo "${DEFINE_ACTION_CONTENT}"
    echo ""
    sed 's/module\.exports = {/module.exports = {\n\tdefineAction,/' "${MOLECULER_INDEX_JS}"
  } > "${MOLECULER_INDEX_JS}.tmp"
  
  # Replace the original file with the temporary file
  mv "${MOLECULER_INDEX_JS}.tmp" "${MOLECULER_INDEX_JS}"
fi
