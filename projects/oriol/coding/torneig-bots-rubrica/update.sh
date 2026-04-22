#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="$(basename "$PROJECT_DIR")"

cd "$PROJECT_DIR"
latexmk -pdf "$PROJECT_NAME.tex"
echo "Updated $PROJECT_DIR/$PROJECT_NAME.pdf"
