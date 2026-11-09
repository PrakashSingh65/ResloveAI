# ------------------------------------------------------------------------------
# ResolveAI Backend Dockerfile (FastAPI + uv)
# ------------------------------------------------------------------------------
FROM ghcr.io/astral-sh/uv:bookworm-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_INSTALL_DIR="/opt/python" \
    PATH="/app/.venv/bin:$PATH"

WORKDIR /app

# Install system build tools (gcc, make, libffi, libssl) needed for compiling C-extensions & curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libffi-dev \
    libssl-dev \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency specifications & python version
COPY pyproject.toml uv.lock .python-version ./

# Install project dependencies into /app/.venv
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --no-install-project --no-dev

# Copy application code and Alembic migrations
COPY alembic.ini ./
COPY alembic ./alembic
COPY app ./app

# Finalize project installation
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --no-dev

# Ensure Python and virtualenv are accessible globally
RUN chmod -R a+rx /opt/python /app

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
