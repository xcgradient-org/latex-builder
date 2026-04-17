#!/usr/bin/env bash
set -euo pipefail

MODE="build"
if [[ "${1:-}" == "--clean" ]]; then
  MODE="clean"
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Check if we are in the monorepo or a standalone repo
if [[ -d "${SCRIPT_DIR}/../../latex-builder" ]]; then
  REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
  PROJECTS_DIR="${REPO_ROOT}/latex-builder/projects"
else
  REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
  PROJECTS_DIR="${REPO_ROOT}/projects"
fi

LATEXMK_BIN=""
if command -v latexmk >/dev/null 2>&1; then
  LATEXMK_BIN="latexmk"
elif command -v latexmk.exe >/dev/null 2>&1; then
  LATEXMK_BIN="latexmk.exe"
else
  echo "latexmk is not installed or not on PATH. Install TeX Live (latexmk + biber) first." >&2
  exit 1
fi

TARGETS=()
while IFS= read -r -d '' dir; do
  name="$(basename "$dir")"
  candidate="$dir/$name.tex"
  if [[ -f "$candidate" ]]; then
    TARGETS+=("$candidate")
  fi
done < <(find "$PROJECTS_DIR" -mindepth 1 -maxdepth 1 -type d -print0)

while IFS= read -r -d '' dir; do
  name="$(basename "$dir")"
  candidate="$dir/$name.tex"
  if [[ -f "$candidate" ]]; then
    TARGETS+=("$candidate")
  fi
done < <(find "$PROJECTS_DIR" -mindepth 2 -maxdepth 2 -type d -print0)

# Add all .tex files from 'proposta' and its subdirectories
if [[ -d "$PROJECTS_DIR/proposta" ]]; then
  while IFS= read -r -d '' tex; do
    # Avoid duplicates if they were already added via the folder/folder.tex convention
    # (though 'proposta' itself doesn't have a 'proposta.tex')
    ALREADY_ADDED=false
    for t in "${TARGETS[@]}"; do
      if [[ "$t" == "$tex" ]]; then
        ALREADY_ADDED=true
        break
      fi
    done
    if [[ "$ALREADY_ADDED" == "false" ]]; then
      TARGETS+=("$tex")
    fi
  done < <(find "$PROJECTS_DIR/proposta" -type f -name '*.tex' -print0 | sort -z)
fi

if [[ ${#TARGETS[@]} -eq 0 ]]; then
  echo "No LaTeX root documents were found." >&2
  exit 1
fi

FAILED=()
for target in "${TARGETS[@]}"; do
  rel="${target#${REPO_ROOT}/}"
  dir="$(dirname "$target")"
  leaf="$(basename "$target")"

  if [[ "$MODE" == "clean" ]]; then
    echo "==> Cleaning $rel"
    if (cd "$dir" && "$LATEXMK_BIN" -C "$leaf"); then
      echo "OK   $rel"
    else
      echo "FAIL $rel"
      FAILED+=("$rel")
    fi
  else
    echo "==> Building $rel"
    if (cd "$dir" && "$LATEXMK_BIN" -pdf -interaction=nonstopmode -halt-on-error "$leaf"); then
      echo "OK   $rel"
    else
      echo "FAIL $rel"
      FAILED+=("$rel")
    fi
  fi
done

if [[ ${#FAILED[@]} -gt 0 ]]; then
  echo
  echo "The following documents failed:"
  for file in "${FAILED[@]}"; do
    echo "  - $file"
  done
  exit 1
fi

if [[ "$MODE" == "clean" ]]; then
  echo "All LaTeX artifacts cleaned."
else
  echo "All LaTeX documents built successfully."
fi
