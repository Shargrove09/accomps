# Multi-stage build for Python FastAPI agent

# Stage 1: Builder - Install dependencies
FROM python:3.12-slim AS builder

WORKDIR /build

# Install uv for fast dependency management
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy dependency files
COPY pyproject.toml ./
COPY uv.lock ./

# Install Python dependencies using uv (much faster than pip)
# Use --no-dev to skip development dependencies, --frozen to use lockfile
RUN uv pip install --system --no-cache \
    langchain>=1.0.5 \
    langchain-ollama>=1.0.0 \
    langchain-openai>=0.2.0 \
    langgraph>=1.0.3 \
    python-dotenv>=1.2.1 \
    requests>=2.32.5 \
    fastapi>=0.109.0 \
    uvicorn>=0.27.0

# Stage 2: Runtime - Minimal production image
FROM python:3.12-slim AS runtime

WORKDIR /app

# Install runtime dependencies (curl for healthcheck)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code
COPY server.py .
COPY tool.py .
COPY tool_helpers.py .
COPY main.py .
COPY cache.py .
COPY parser_chain.py .
COPY schemas.py .

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    OLLAMA_MODEL=llama3.2:3b \
    OLLAMA_BASE_URL=http://ollama:11434 \
    PORT=8000

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
