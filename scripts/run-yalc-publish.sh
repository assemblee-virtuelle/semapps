#!/bin/bash

# Script to run yalc:publish.
# Called by on-workdir-changed.sh


if [ "$SKIP_YALC_PUBLISH" = true ] || [ "$SKIP_YALC_PUBLISH" = 1 ] ; then
   echo "=== Skipping yalc:publish ==="
   exit 0
fi



# Determine repository root so we can cd into the frontend package.
ROOT_DIR=$(git rev-parse --show-toplevel)

# Run yalc:publish in a detached background process and discard all output.
nohup bash -lc "cd \"${ROOT_DIR}/src/frontend\" && yarn yalc:publish >/dev/null 2>&1" >/dev/null 2>&1 &

# Capture background PID and disown it so it won't be tied to this script's shell.
PID=$!
disown "$PID" >/dev/null 2>&1 || true

echo "=== Running yalc:publish in the background (pid ${PID}) ==="

exit 0
