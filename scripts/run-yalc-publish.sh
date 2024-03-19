#!/bin/bash

# Script to run yalc:publish.
# Called by on-workdir-changed.sh


if [ "$SKIP_YALC_PUBLISH" = true ] || [ "$SKIP_YALC_PUBLISH" = 1 ] ; then
   echo "=== Skipping yalc:publish ==="
   exit 0
fi


echo ===  Running yalc:publish ===

ROOT_DIR=$(git rev-parse --show-toplevel)
cd "$ROOT_DIR"/src/frontend

# Run yalc:publish. If not available, just print an info message.
yarn yalc:publish &> /dev/null || \
   echo "⚠️ yarn or yalc is not installed. Skipping yalc:publish" 

exit 0
