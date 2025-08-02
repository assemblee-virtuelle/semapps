#!/bin/bash

# Type checking test for tests in `types/*.test-d.ts`.
# This script runs tsc --noEmit and checks if there are any type errors
# in the `*.test-d.ts` files which should have none if types are correct.

echo "🔍 Running TypeScript type checking tests..."
echo

# Run TypeScript compiler and capture output
tsc_output=$(tsc --noEmit 2>&1)

# Check if moleculer.test-d.ts appears in the output
if echo "$tsc_output" | grep -q ".test-d.ts"; then
  echo "❌ Type test failed. Found type errors in:"
  echo
  echo "$tsc_output" | grep ".test-d.ts"
  echo
  exit 1
else
  echo "✅ Type test PASSED"
  echo
  exit 0
fi
