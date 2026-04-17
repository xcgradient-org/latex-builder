#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="$(basename "$(pwd)")"
latexmk -pdf "$PROJECT_NAME.tex"
