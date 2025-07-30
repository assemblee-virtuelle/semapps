#!/bin/bash

# Script to typecheck frontend code.
# Called by pre-push hook.

ROOT_DIR=$(git rev-parse --show-toplevel)

echo "=== Running typecheck for frontend ==="

cd "$ROOT_DIR"/src/frontend
yarn typecheck > /dev/null
if [ $? -ne 0 ]; then
  echo "⛔ Typecheck failed! To see the errors, run \`yarn typecheck\` in the frontend directory."
  echo "   You can skip pre-push checks by setting \$SKIP_PREPUSH_CHECKS=true"
  exit 1
fi

echo "=== Running typecheck for middleware ==="

cd "$ROOT_DIR"/src/middleware
yarn typecheck > /dev/null
if [ $? -ne 0 ]; then
  echo "⛔ Typecheck failed! To see the errors, run \`yarn typecheck\` in the middleware directory."
  echo "   You can skip pre-push checks by setting \$SKIP_PREPUSH_CHECKS=true"
  exit 1
fi

echo "✅ Typecheck successful!"