from functools import lru_cache
from typing import List, Optional, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Application settings
    PROJECT_NAME: str = "ResolveAI Server"
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # CORS Settings
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if not v.strip():
                return []
            import json
            try:
                parsed = json.loads(v)
                if isinstance(parsed, list):
                    return parsed
            except Exception:
                return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    # Database
    DATABASE_URL: str = ""
    DATABASE_URL_POOLED: str = ""

    @property
    def async_database_url(self) -> str:
        """
        Returns an asyncpg-compatible PostgreSQL connection string,
        stripping libpq-specific parameters that asyncpg handles via connect_args.
        """
        url = self.DATABASE_URL
        if not url:
            return "sqlite+aiosqlite:///./test.db"

        # Ensure asyncpg driver dialect
        if url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)

        # Strip libpq-specific query arguments not natively parsed by asyncpg in URI
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
        """
        Determines if SSL is needed based on the raw DATABASE_URL.
        """
        url = self.DATABASE_URL.lower()
        return "sslmode=require" in url or "neon.tech" in url or "ssl=require" in url

    # JWT Authentication
    SECRET_KEY: str = "super-secret-jwt-key-replace-in-production-minimum-32-chars-long"
    REFRESH_SECRET_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    @property
    def effective_refresh_secret_key(self) -> str:
        return self.REFRESH_SECRET_KEY or self.SECRET_KEY

    # Cookie Configuration
    COOKIE_ACCESS_NAME: str = "access_token"
    COOKIE_REFRESH_NAME: str = "refresh_token"
    COOKIE_SAMESITE: str = "lax"
    COOKIE_DOMAIN: Optional[str] = None
    COOKIE_SECURE: Optional[bool] = None

    @property
    def is_cookie_secure(self) -> bool:
        if self.COOKIE_SECURE is not None:
            return self.COOKIE_SECURE
        return self.ENVIRONMENT not in ["development", "testing"]

    # Neon Better Auth Configuration
    NEON_AUTH_BASE_URL: str = ""
    FRONTEND_URL: str = "http://localhost:3000"

    # AI Configuration (Optional)
    GEMINI_API_KEY: str = ""
    EMBEDDING_MODEL: str = "text-embedding-004"
    VECTOR_DIMENSION: int = 768

    model_config = SettingsConfigDict(
        env_file=("server/.env", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
