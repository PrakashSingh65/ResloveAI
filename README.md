# ⚡ ResolveAI

> **Autonomous Tier-1 AI Customer Support Agent with Smart Human Handoff & Operator Copilot**

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.162.2-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11%2B-3776AB?style=for-the-badge&logo=python)](https://python.org)
[![Neon PostgreSQL](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Groq](https://img.shields.io/badge/Groq-Llama--3.3-F05A28?style=for-the-badge)](https://groq.com/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture & Request Flow](#-architecture--request-flow)
- [Multi-Model LLM Routing Strategy](#-multi-model-llm-routing-strategy)
- [Enterprise Safety & Guardrails](#-enterprise-safety--guardrails)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Running with Docker Compose (Recommended)](#running-with-docker-compose-recommended)
  - [Running Manually (Local Development)](#running-manually-local-development)
- [API Reference](#-api-reference)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**ResolveAI** bridges the gap between high-velocity automated customer care and high-touch human escalation. 

Traditional customer service chatbots either get stuck in repetitive loops or frustrate users when edge cases arise. When a human representative finally steps in, they are forced to re-read long conversational transcripts from scratch while the customer is forced to repeat themselves.

**ResolveAI changes that by providing:**
1. **Autonomous Tier-1 Resolution**: Handles routine customer inquiries, account checks, order tracking, and troubleshooting instantly using low-latency LLMs.
2. **Deterministic Safety Guardrails**: Strips customer PII (credit cards, SSNs, credentials) and blocks prompt injections before queries ever hit LLMs.
3. **Smart Zero-Context-Loss Human Handoff**: Detects customer frustration or complex edge cases and transfers the session to an operator desk alongside an **AI Executive Briefing** (issue summary, root-cause diagnosis, attempted steps, and recommended action).
4. **Agent Copilot & Live Desk**: An intuitive dashboard for support agents with diagnostic timeline inspection, instant resolution triggers, real-time chat takeover, and CSAT telemetry.

---

## 🚀 Key Features

### 🤖 Multi-Model LLM Routing Engine
- **Groq Llama 3.3 (70B) & Llama 3.1 (8B)**: Delivers sub-second conversational streaming responses for live customer queries.
- **Google Gemini (3.8 Flash / 2.0 Flash)**: Generates high-fidelity executive briefings, root cause analysis, and semantic analysis.
- **Google Gemini Embeddings (`text-embedding-004`)**: Embeds diagnostic and ticket contexts with 768-dimensional vector representations.
- **Graceful Mock Fallbacks**: Allows the entire system to boot, run, and be tested locally even when external API keys are not supplied.

### 🛡️ Enterprise Guardrails & Compliance
- **Real-Time PII Masking**: Automatically detects and redacts credit cards (Visa, MasterCard, Amex, Discover), Social Security Numbers (SSN), phone numbers, and leaked credentials using regex before storage and model processing.
- **Prompt Injection Defense**: Intercepts jailbreaks, prompt override attempts, and system instructions leaks.
- **Sentiment & Frustration Telemetry**: Monitors customer tone for anger, escalation triggers, and profanity to preemptively flag tickets for human intervention.

### 🤝 Smart Human Handoff with Executive Briefings
- Zero-latency escalation trigger when an issue exceeds AI confidence or when a customer requests a representative.
- Generates structured briefings containing:
  - **Issue Summary**: Concise 2-sentence synopsis of what the customer is experiencing.
  - **Diagnosed Root Cause**: Specific technical failure or policy boundary identified.
  - **Customer Sentiment**: Scored as Positive, Neutral, Frustrated, or Critical.
  - **Steps Attempted**: Chronological log of automated self-service checks performed.
  - **Recommended Action**: One-click guidance for the human agent (e.g. *"Issue immediate \$45 refund and reset session token"*).

### 🖥️ Operator Live Support Desk
- **Omnichannel Triage**: View tickets across Chat, Email, Phone, WhatsApp, and Web channels.
- **Real-Time Diagnostic Timelines**: Step-by-step audit logs showing API ping results, database lookups, and security checks.
- **Interactive Ticket Creator**: Includes scenario presets (*Payment Failure*, *Account Lockout*, *Order Cancellation*, *Delivery Delay*) to simulate real customer incidents.
- **CSAT Analytics**: Captures customer ratings (1–5 stars), sentiment breakdown, and feedback comments upon resolution.

### 🔐 Secure Authentication & Session Management
- Pure **HttpOnly cookie-based JWT architecture** protecting against XSS token theft.
- Password hashing powered by **Argon2id** (`pwdlib`).
- Native social authentication integration via **Neon Managed Better Auth** (Google OAuth).
- Automatic token refresh rotation and configurable expiration timeouts.

---

## 🏗️ Architecture & Request Flow

```mermaid
flowchart TD
    subgraph Client["Frontend Client (Next.js 16 + Tailwind CSS)"]
        UI[Customer / Agent UI]
        Desk[Live Support Desk]
    end

    subgraph API["FastAPI Application Server"]
        Router[API Router]
        Guardrails[Safety Guardrails\n- PII Redaction\n- Prompt Injection Check]
        Sentiment[Sentiment & Frustration Analyzer]
        LLMRouter[Multi-Model LLM Router]
        TicketSvc[Ticket & Handoff Service]
    end

    subgraph LLMs["AI & LLM Services"]
        Groq["Groq Cloud\n(Llama 3.3 70B / 3.1 8B)"]
        Gemini["Google Gemini\n(Briefings & Embeddings)"]
    end

    subgraph Storage["Persistence & Identity"]
        NeonDB[(Neon PostgreSQL\nSQLModel / Async Engine)]
        BetterAuth[Neon Managed Better Auth\n(Google OAuth)]
    end

    UI -->|Customer Query| Router
    Router --> Guardrails
    Guardrails -->|Sanitized Prompt| Sentiment
    Sentiment --> LLMRouter
    LLMRouter --> Groq
    LLMRouter --> Gemini
    LLMRouter -->|Generated Response| TicketSvc
    TicketSvc --> NeonDB
    
    TicketSvc -->|Escalation Triggered| Desk
    Gemini -->|Synthesize Executive Briefing| Desk
    Desk -->|Operator Live Takeover| Router
```

---

## 🧠 Multi-Model LLM Routing Strategy

ResolveAI dynamically routes tasks to the best-suited model to maximize speed, minimize token costs, and maintain reasoning depth:

| Task | Primary Model | Fallback Model | Why? |
| :--- | :--- | :--- | :--- |
| **Tier-1 Interactive Chat** | Groq `llama-3.3-70b-versatile` | Gemini `gemini-3.8-flash` | Ultra-low latency (<300ms time-to-first-token) for natural conversation. |
| **Intent & Sentiment Triage** | Groq `llama-3.1-8b-instant` | Heuristic Rule Engine | Extremely fast JSON-structured classification at negligible compute cost. |
| **Executive Handoff Briefing** | Gemini `gemini-3.8-flash` | Groq Llama 3.3 | Deep summarization capabilities and multi-turn root-cause reasoning. |
| **Knowledge Base Embeddings** | Gemini `text-embedding-004` | Local Fallback | 768-dimensional normalized dense vectors optimized for enterprise search. |

---

## 🛡️ Enterprise Safety & Guardrails

Security and privacy are baked into the core request pipeline:

```
[Customer Input]
       │
       ▼
┌───────────────────────────────────────────────┐
│ 1. PII Redaction:                             │
│    - Credit Card numbers -> [REDACTED_CARD]   │
│    - Social Security Nos -> [REDACTED_SSN]    │
│    - Passwords / Keys    -> [REDACTED_CRED]   │
│    - Phone Numbers       -> [REDACTED_PHONE]  │
└───────────────────────┬───────────────────────┘
       │
       ▼
┌───────────────────────────────────────────────┐
│ 2. Prompt Injection Detection:                │
│    - Checks for "ignore previous", "jailbreak"│
│    - Blocks system prompt leak attempts       │
└───────────────────────┬───────────────────────┘
       │
       ▼
┌───────────────────────────────────────────────┐
│ 3. Frustration & Urgency Evaluation:          │
│    - Detects severe profanity or legal threats│
│    - Automatically flags for human takeover   │
└───────────────────────┬───────────────────────┘
       │
       ▼
[Forwarded to LLM Router]
```

---

## 💻 Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server & Client Components)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with Oxide engine
- **UI Primitives**: Base UI, Radix UI & Shadcn-compatible design tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/) with automatic cookie credentials

### Backend
- **Framework**: [FastAPI 0.162+](https://fastapi.tiangolo.com/) (Asynchronous ASGI)
- **Database ORM**: [SQLModel](https://sqlmodel.tiangolo.com/) & [SQLAlchemy 2.0 Async](https://www.sqlalchemy.org/)
- **Migrations**: [Alembic](https://alembic.sqlalchemy.org/)
- **Package & Runtime Manager**: [uv](https://docs.astral.sh/uv/) (Astral)
- **Database**: [Neon Serverless PostgreSQL](https://neon.tech/)
- **Authentication**: JWT via `pyjwt`, Argon2 hashing via `pwdlib`
- **Testing**: `pytest`, `pytest-asyncio`, `aiosqlite`

### AI & Observability
- **Inference Providers**: [Groq Cloud](https://groq.com/) & [Google GenAI / Gemini](https://ai.google.dev/)
- **Containerization**: Docker & Docker Compose

---

## 📁 Project Structure

```bash
ResloveAI/
├── docker-compose.yml          # Container configuration for full-stack orchestration
├── README.md                   # Project documentation
│
├── client/                     # Next.js 16 Frontend Application
│   ├── app/                    # App Router pages (landing, dashboard, auth)
│   │   ├── dashboard/          # Live Operator Support Desk
│   │   ├── login/              # Sign-in page
│   │   ├── signup/             # Registration page
│   │   └── page.tsx            # High-conversion product landing page
│   ├── components/             # Reusable UI components
│   │   ├── dashboard/          # Live desk, metrics, ticket modal, timeline
│   │   ├── landing/            # Hero, features, architecture, comparisons
│   │   └── ui/                 # Accessible button, badge, input, card primitives
│   ├── lib/                    # Client libraries, auth context, API services
│   ├── build-css.js            # Tailwind CSS v4 compiler runner
│   ├── package.json            # Node.js dependencies
│   └── .env.example            # Client environment configuration
│
└── server/                     # FastAPI Backend Application
    ├── alembic/                # Database migration scripts
    ├── app/
    │   ├── api/                # API route definitions
    │   │   └── v1/             # Version 1 endpoints (auth, tickets)
    │   ├── core/               # Configuration, security, database engines
    │   ├── models/             # SQLModel database schemas (User, Ticket, Message, etc.)
    │   ├── schemas/            # Pydantic request & response validation schemas
    │   ├── services/           # Business logic (LLM Router, Guardrails, Ticket Service)
    │   ├── utils/              # Cookie, date, token, and Neon auth utilities
    │   └── main.py             # FastAPI entrypoint, lifespan, and middleware
    ├── tests/                  # Pytest test suite (auth, tickets, guardrails)
    ├── Dockerfile              # Multi-stage production Dockerfile using uv
    ├── pyproject.toml          # Python dependencies & project metadata
    └── .env.example            # Server environment configuration
```

---

## ⚡ Getting Started

### Prerequisites

Make sure you have the following installed on your machine:
- **Node.js**: `v20.x` or higher ([Download](https://nodejs.org/))
- **Python**: `3.11` or higher ([Download](https://www.python.org/)) or **uv** ([Install uv](https://docs.astral.sh/uv/getting-started/installation/))
- **Docker & Docker Compose**: (Optional, for containerized run) ([Install Docker](https://www.docker.com/))
- **PostgreSQL Database**: Free serverless instance from [Neon](https://neon.tech/)

---

### Environment Setup

#### 1. Configure Backend Environment
Navigate to the `server/` directory and copy the template:
```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your settings:
```env
ENVIRONMENT="development"
DEBUG=True
HOST="0.0.0.0"
PORT=8000
FRONTEND_URL="http://localhost:3000"
CORS_ORIGINS=["http://localhost:3000", "http://127.0.0.1:3000"]

# Neon PostgreSQL connection string
DATABASE_URL="postgresql://username:password@ep-something.us-east-2.aws.neon.tech/neondb?sslmode=require"

# JWT Secrets (generate with `openssl rand -hex 32`)
SECRET_KEY="your-32-byte-hex-secret-key-here"
REFRESH_SECRET_KEY="your-32-byte-hex-refresh-secret-key-here"

# AI Provider Keys (Optional: deterministic mock mode active if omitted)
GROQ_API_KEY="gsk_..."
GEMINI_API_KEY="AIzaSy..."
```

#### 2. Configure Frontend Environment
Navigate to the `client/` directory and copy the template:
```bash
cd ../client
cp .env.example .env.local
```

Edit `client/.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_API_VERSION=v1
```

---

### Running with Docker Compose (Recommended)

You can launch the entire backend environment with hot-reloading and healthchecks via Docker:

```bash
# From the root directory:
docker compose up --build
```

The backend API will be available at:
- **API Root**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`
- **Health Check**: `http://localhost:8000/health`

Then, launch the frontend:
```bash
cd client
npm install
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

### Running Manually (Local Development)

#### Backend Setup
```bash
cd server

# Using uv (fastest):
uv sync
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Or using standard venv:
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -e .
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Database Migrations (Alembic)
To apply or generate database schema migrations:
```bash
cd server
# Run existing migrations
uv run alembic upgrade head

# Generate a new migration revision
uv run alembic revision --autogenerate -m "describe_changes"
```

#### Frontend Setup
```bash
cd client

# Install dependencies
npm install

# Start development server (includes Tailwind CSS v4 auto-build)
npm run dev
```

Open `http://localhost:3000` to access the application.

---

## 📡 API Reference

### Health Endpoints
- `GET /` - Root service status & version
- `GET /health` - Health check status

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user account with email and password | No |
| `POST` | `/auth/login` | Authenticate credentials and receive HttpOnly cookies | No |
| `POST` | `/auth/refresh` | Rotate access token using valid refresh token cookie | Cookie |
| `GET` | `/auth/me` | Fetch currently authenticated user profile | Cookie / Bearer |
| `POST` | `/auth/logout` | Invalidate tokens and clear authentication cookies | Cookie |
| `GET` | `/auth/google` | Trigger Neon Managed Google OAuth flow | No |
| `GET` | `/auth/callback` | OAuth redirect callback handler | No |

### Tickets & Live Desk (`/api/v1/tickets`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/tickets` | List tickets with filters (`status`, `priority`, `channel`, `search`) |
| `POST` | `/tickets` | Create a new customer support ticket |
| `GET` | `/tickets/metrics/overview`| Fetch system-wide support KPIs (CSAT, resolution rate, handle time) |
| `GET` | `/tickets/{ticket_id}` | Retrieve comprehensive ticket details, conversation, and briefing |
| `PATCH` | `/tickets/{ticket_id}` | Update ticket attributes (status, priority, assigned agent) |
| `POST` | `/tickets/{ticket_id}/messages` | Send a customer or agent message (triggers AI streaming / response) |
| `POST` | `/tickets/{ticket_id}/resolve` | Mark ticket resolved with resolution notes |
| `POST` | `/tickets/{ticket_id}/feedback` | Submit CSAT customer feedback rating and comments |

---

## 🧪 Testing

The backend includes an asynchronous test suite covering authentication, cookie parsing, ticket creation, PII redaction, and guardrails:

```bash
cd server

# Run all test suites
uv run pytest -v

# Run tests with output printing
uv run pytest -v -s
```

To run frontend linting and production build verification:
```bash
cd client
npm run lint
npm run build
```

---

## 🤝 Contributing

Contributions, feedback, and issue submissions are welcome!

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ for modern support teams.
</p>
