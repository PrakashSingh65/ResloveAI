import json
import os
from functools import lru_cache
from typing import List, Optional
from dotenv import load_dotenv

# Load environment variables from .env file into the system environment (do not override explicit env vars)
load_dotenv(override=False)
load_dotenv("server/.env", override=False)


def _get_bool(key: str, default: bool = False) -> bool:
    """Read a boolean from os.getenv without hardcoding."""
    val = os.getenv(key)
    if val is None:
        return default
    return val.strip().lower() in ("true", "1", "yes", "on")


def _get_int(key: str, default: int) -> int:
    """Read an integer from os.getenv without hardcoding."""
    val = os.getenv(key)
    if val is None:
        return default
    try:
        return int(val.strip())
    except ValueError:
        return default


def _get_list(key: str, default: Optional[List[str]] = None) -> List[str]:
    """Read a list from a JSON array or comma-separated string in os.getenv."""
    val = os.getenv(key)
    if not val or not val.strip():
        return default if default is not None else []
    try:
        parsed = json.loads(val)
        if isinstance(parsed, list):
            return [str(item).strip() for item in parsed if str(item).strip()]
    except Exception:
        pass
    return [item.strip() for item in val.split(",") if item.strip()]


class Settings:
    """
    Application Settings strictly driven by environment variables using os.getenv().
    Zero secrets, URLs, or dummy keys are hardcoded.
    """

    def __init__(self):
        # 1. Server Configuration
        self.PROJECT_NAME: str = os.getenv("PROJECT_NAME", "")
        self.ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
        self.DEBUG: bool = _get_bool("DEBUG", False)
        self.PORT: int = _get_int("PORT", 8000)
        self.HOST: str = os.getenv("HOST", "0.0.0.0")

        # 2. Client & CORS Configuration
        self.FRONTEND_URL: str = os.getenv("FRONTEND_URL", "")
        self.CORS_ORIGINS: List[str] = _get_list("CORS_ORIGINS", [])

        # 3. Database (PostgreSQL / Neon)
        self.DATABASE_URL: str = os.getenv("DATABASE_URL", "")
        self.DATABASE_URL_POOLED: Optional[str] = os.getenv("DATABASE_URL_POOLED", None)

        # 4. JWT Authentication Secrets & Lifespans
        self.SECRET_KEY: str = os.getenv("SECRET_KEY", "")
        self.REFRESH_SECRET_KEY: Optional[str] = os.getenv("REFRESH_SECRET_KEY", None)
        self.ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
        self.ACCESS_TOKEN_EXPIRE_MINUTES: int = _get_int("ACCESS_TOKEN_EXPIRE_MINUTES", 15)
        self.REFRESH_TOKEN_EXPIRE_DAYS: int = _get_int("REFRESH_TOKEN_EXPIRE_DAYS", 7)

        # 5. Cookie Security Configuration
        self.COOKIE_ACCESS_NAME: str = os.getenv("COOKIE_ACCESS_NAME", "access_token")
        self.COOKIE_REFRESH_NAME: str = os.getenv("COOKIE_REFRESH_NAME", "refresh_token")
        self.COOKIE_SAMESITE: str = os.getenv("COOKIE_SAMESITE", "lax")

        cookie_domain_raw = os.getenv("COOKIE_DOMAIN")
        if cookie_domain_raw:
            cleaned_domain = cookie_domain_raw.strip().strip("'\"")
            self.COOKIE_DOMAIN: Optional[str] = (
                None if cleaned_domain in ("", "localhost", ".localhost") else cleaned_domain
            )
        else:
            self.COOKIE_DOMAIN = None

        cookie_sec_raw = os.getenv("COOKIE_SECURE")
        self.COOKIE_SECURE: Optional[bool] = (
            _get_bool("COOKIE_SECURE") if cookie_sec_raw is not None else None
        )

        # 6. Neon Managed Better Auth (OAuth / Social Login)
        self.NEON_AUTH_BASE_URL: str = os.getenv("NEON_AUTH_BASE_URL", "")

        # 7. AI & LLM (Groq & Google Gemini)
        self.GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        self.EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "text-embedding-004")
        self.VECTOR_DIMENSION: int = _get_int("VECTOR_DIMENSION", 768)

        self.GROQ_API_KEY: Optional[str] = os.getenv("GROQ_API_KEY", None)
        self.GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
        self.GROQ_FAST_MODEL: str = os.getenv("GROQ_FAST_MODEL", "llama-3.1-8b-instant")

        # =====================================================================
        # Runtime Validation (Fails fast if critical variables are missing)
        # =====================================================================
        if self.ENVIRONMENT != "testing":
            if not self.SECRET_KEY:
                raise ValueError("CRITICAL ERROR: 'SECRET_KEY' environment variable is missing in .env.")
            if self.ENVIRONMENT == "production":
                if len(self.SECRET_KEY) < 32:
                    raise ValueError("CRITICAL ERROR: 'SECRET_KEY' must be at least 32 characters in production.")
                if not self.DATABASE_URL:
                    raise ValueError("CRITICAL ERROR: 'DATABASE_URL' environment variable is missing in .env.")

    @property
    def async_database_url(self) -> str:
        """
        Transforms raw PostgreSQL database URL into an asyncpg-compatible URI,
        stripping libpq-only parameters handled via asyncpg connect_args.
        """
        url = self.DATABASE_URL
        if not url:
            return "sqlite+aiosqlite:///./test.db"

        # Replace postgres dialect with asyncpg
        if url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)

        # Strip libpq-specific parameters
        if "?" in url:
            base_url, query_params = url.split("?", 1)
            allowed_params = []
            for param in query_params.split("&"):
                key = param.split("=")[0].lower()
                if key in ["ssl", "server_settings", "timeout", "command_timeout"]:
                    allowed_params.append(param)
            if allowed_params:
                url = f"{base_url}?{'&'.join(allowed_params)}"
            else:
                url = base_url

        return url

    @property
    def is_ssl_required(self) -> bool:
        """Determines if SSL is needed based on the database host or URL flags."""
        url = self.DATABASE_URL.lower()
        return "sslmode=require" in url or "neon.tech" in url or "ssl=require" in url

    @property
    def effective_refresh_secret_key(self) -> str:
        return self.REFRESH_SECRET_KEY or self.SECRET_KEY

    @property
    def is_cookie_secure(self) -> bool:
        if self.COOKIE_SECURE is not None:
            return self.COOKIE_SECURE
        return self.ENVIRONMENT not in ["development", "testing"]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
