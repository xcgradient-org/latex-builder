# 🏗️ XCGradient LaTeX Builder

A standardized, multi-project LaTeX build system designed for automated document generation. This repository provides a unified workflow for compiling complex LaTeX documents with `latexmk` and `biber`.

## 📂 Structure

- `projects/`: The main directory for LaTeX documents.
  - `proposta/`: Core corporate and strategy documents in English, Catalan, and Spanish.
  - `example-minimal/`: A template for starting new documents.
- `scripts/`: Build and orchestration scripts.
- `brand-assets/logo.png`: Global brand asset used across templates (Git Submodule).

## 🚀 Getting Started

### Prerequisites

You need a LaTeX distribution (like TeX Live) with the following tools:
- `latexmk`
- `biber`
- `pdflatex`

### Installation

Clone the repository to get started:

```bash
git clone <repo-url>
cd latex-builder
```

## 🛠️ Usage

### Build All Documents

Run the build script from the repository root:

```bash
bash scripts/build-all.sh
```

To clean all build artifacts:

```bash
bash scripts/build-all.sh --clean
```

### Creating a New Project

Use the scaffolding script (requires Node.js):

```bash
node scripts/scaffold-project.js <project-name>
```

## 👨‍💻 Development

The project structure is modular, allowing for easy expansion of document types and branding. To contribute, create a new folder under `projects/` and ensure your `main.tex` is compatible with the `latexmk` orchestration.

## 🐳 Docker & CI/CD

This repository is fully containerized.

### Run in Docker
To build all PDFs without installing LaTeX locally:

```bash
docker build -t latex-builder .
docker run --rm -v $(pwd)/projects:/app/projects latex-builder
```

### GitHub Actions
Every push to `main` triggers:
- **Smoke Test:** Verifies that the Docker image builds and successfully runs `build-all.sh`.
- **GHCR Push:** Automatically publishes the image to `ghcr.io/xcgradient-org/latex-builder:latest`.

## 🛠️ VS Code Integration

This repository includes pre-configured tasks for VS Code:
- `Terminal > Run Build Task...` -> `LaTeX: Build All PDFs`

## ⚖️ License

All rights reserved. © 2026 XC Gradient.
