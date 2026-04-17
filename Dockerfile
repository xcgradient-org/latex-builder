# Use the official TeXLive image for reliability
FROM texlive/texlive:latest

# Install additional system dependencies if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    findutils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

# Ensure the build script is executable
RUN chmod +x scripts/build-all.sh

# Build all documents by default
CMD ["bash", "scripts/build-all.sh"]
