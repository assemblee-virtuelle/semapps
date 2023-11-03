#!/bin/bash

# Script to run linter before commit.
# This is called by `.git-hooks/pre-commit`


echo "======================"
echo "=== Running linter ==="
echo "======================"

cd $(git rev-parse --show-toplevel)

FILES="$@"
ROOT_DIR=$(git rev-parse --show-toplevel)

MIDDLEWARE_FILES="$(echo "$FILES" | grep -E "src/middleware" | xargs -r realpath | sed 's/.*/"&"/')"
FRONTEND_FILES="$(echo "$FILES" | grep -E "src/frontend" | xargs -r realpath | sed 's/.*/"&"/')"

LINT_FILE_TYPES="js|jsx|ts|tsx"
LINT_MIDDLEWARE_FILES=$(echo "$MIDDLEWARE_FILES" | grep -E "\.($LINT_FILE_TYPES)$")
LINT_FRONTEND_FILES=$(echo "$FRONTEND_FILES" | grep -E "\.($LINT_FILE_TYPES)$")

# Function to evaluate the linter results
function evaluate_linter_results {
    if [ $? == 1 ]; then
        echo "================================================================="
        echo "The linter found some errors. Please fix them before committing."
        echo "You can skip pre-commit checks by setting \$SKIP_PRECOMMIT_CHECKS"
        echo "================================================================="
        exit 1
    elif [ $? -ge 2 ]; then
        echo "==================================================================="
        echo "Something went wrong running the linter. Have you run \`yarn\` yet?"
        echo "You can skip pre-commit checks by setting \$SKIP_PRECOMMIT_CHECKS"
        echo "==================================================================="
        exit 1
    fi
}


# Run linter on middleware and frontend files

cd "$ROOT_DIR"/src/middleware
yarn run lint-files $LINT_MIDDLEWARE_FILES
evaluate_linter_results

cd "$ROOT_DIR"/src/frontend
yarn run lint-files $LINT_FRONTEND_FILES
evaluate_linter_results


echo "==== Linter done ====="

exit 0