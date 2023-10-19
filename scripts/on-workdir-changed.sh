#!/bin/bash

# This script is called when a git command possibly modified files in the working dir.


ROOT_DIR=$(git rev-parse --show-toplevel)
cd "$ROOT_DIR"

./scripts/run-yalc-publish.sh