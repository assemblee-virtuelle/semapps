#!/bin/bash

# Script to run prettier on staged files before commit.
# This is called by `.git-hooks/pre-commit`


echo "=== Running prettier ==="

FILES="$@"

ROOT_DIR=$(git rev-parse --show-toplevel)

MIDDLEWARE_FILES="$(echo "$FILES" | grep -E "src/middleware" | grep -v '/dist/' | xargs -r realpath | sed 's/.*/"&"/')"
FRONTEND_FILES="$(echo "$FILES" | grep -E "src/frontend" | grep -v '/dist/' | xargs -r realpath | sed 's/.*/"&"/')"

cd "$ROOT_DIR"/src/middleware
echo "$MIDDLEWARE_FILES" | xargs npx prettier --write --ignore-unknown
cd "$ROOT_DIR"/src/frontend
echo "$FRONTEND_FILES" | xargs npx prettier --write --ignore-unknown
cd "$ROOT_DIR"

if [ $? != 0 ]; then
    echo "⛔ Something went wrong running prettier. Have you run \`npm install\` yet?"
    echo "   You can skip pre-commit checks by setting \$SKIP_PRECOMMIT_CHECKS"
    exit 1
fi

echo "✅ Prettier done!"

exit 0