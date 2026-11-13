# ⚙️ ResolveAI — Backend API Server

FastAPI asynchronous backend powering ResolveAI with multi-model LLM routing, real-time safety guardrails, executive briefing synthesis, and Neon PostgreSQL persistence.

---

## 🛠️ Tech Stack & Key Libraries

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) `0.162+`
- **ASGI Server**: [Uvicorn](https://www.uvicorn.org/)
- **Database ORM**: [SQLModel](https://sqlmodel.tiangolo.com/) (Pydantic + SQLAlchemy 2.0 Async)
- **Migrations**: [Alembic](https://alembic.sqlalchemy.org/)
- **Database Engine**: [asyncpg](https://github.com/MagicStack/asyncpg) + [Neon Serverless PostgreSQL](https://neon.tech/)
- **Dependency Manager**: [uv](https://docs.astral.sh/uv/)
- **LLM Integrations**:
  - [Groq Python SDK](https://github.com/groq/groq-python) (Async Groq client for Llama 3.3/3.1)
  - [Google GenAI SDK](https://github.com/google-gemini/generative-ai-python) (`google-genai` for Gemini 3.8/2.0 & text-embedding-004)
- **Authentication**: JWT (`pyjwt`) with HttpOnly pure cookie transport & Argon2 hashing (`pwdlib`)
- **Testing**: `pytest`, `pytest-asyncio`, `aiosqlite`

---

## 📁 Directory Structure

```bash
server/
├── alembic/                # Database migration scripts & environments
│   └── versions/           # Versioned migration revisions
├── app/
│   ├── api/                # API router declarations
│   │   ├── router.py       # Main API router registry
│   │   └── v1/             # Endpoints for v1
│   │       ├── auth.py     # Authentication, registration, login, logout, OAuth
│   │       └── tickets.py  # Support tickets, messages, briefings, CSAT
│   ├── core/
│   │   ├── config.py       # Pydantic Settings & environment validation
│   │   ├── database.py     # Async database engine, session makers & table initialization
│   │   └── security.py     # Password hashing (Argon2), JWT token creation & decoding
│   ├── models/             # SQLModel database entity schemas
│   │   ├── briefing.py     # AI executive handoff briefing schema
│   │   ├── diagnostic.py   # Diagnostic check steps schema
│   │   ├── feedback.py     # CSAT customer feedback schema
│   │   ├── message.py      # Ticket conversation messages schema
│   │   ├── ticket.py       # Core Ticket entity schema
│   │   └── user.py         # User account entity schema
│   ├── schemas/            # Pydantic input/output schemas & DTOs
│   ├── services/           # Core domain services
│   │   ├── guardrails.py   # PII masking, injection prevention, sentiment analysis
│   │   ├── llm_router.py   # Groq & Gemini multi-model routing engine
│   │   └── ticket_service.py # Ticket lifecycle, handoff orchestration & diagnostics
│   ├── utils/              # Cookie utilities, token parsers & Neon Auth helpers
│   └── main.py             # FastAPI entrypoint, middleware, lifespan hooks
├── tests/                  # Pytest async test suite
├── Dockerfile              # Multi-stage production container build
├── pyproject.toml          # Project metadata and dependencies
├── alembic.ini             # Alembic migration configuration
└── .env.example            # Environment variable template
```

---

## ⚡ Quickstart

### 1. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Ensure you configure:
- `DATABASE_URL`: Connection URL from your Neon console.
- `SECRET_KEY`: Random 32+ character hex string for signing access tokens.
- `GROQ_API_KEY`: API key from Groq Console (for real-time streaming).
- `GEMINI_API_KEY`: API key from Google AI Studio (for briefings and embeddings).

*(Note: If AI keys are omitted, the server operates in a deterministic mock fallback mode).*

---

### 2. Dependency Installation with `uv`

We recommend Astral's **uv** for ultra-fast package management:

```bash
# Sync dependencies
uv sync

# Run the development server with live reload
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Alternatively, with standard Python `venv`:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -e .
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

### 3. Database Migrations

Apply current database migrations:
```bash
uv run alembic upgrade head
```

Create a new migration revision:
```bash
uv run alembic revision --autogenerate -m "add_new_feature_table"
```

---

### 4. Running Tests

The test suite runs with in-memory SQLite and mocks:
```bash
uv run pytest -v
```

---

## 🐳 Docker Deployment

Build and run with Docker:
```bash
docker build -t resolveai-server .
docker run -p 8000:8000 --env-file .env resolveai-server
```

---

## 📖 API Documentation

Once the server is running, explore the interactive documentation:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
