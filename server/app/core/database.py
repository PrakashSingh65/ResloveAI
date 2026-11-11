import logging
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlmodel import SQLModel

from app.core.config import settings

logger = logging.getLogger(__name__)

# Connection arguments for SSL (e.g. Neon PostgreSQL)
connect_args = {}
if settings.is_ssl_required:
    connect_args["ssl"] = True

# Silence noisy SQLAlchemy query logs unless SQL_ECHO is explicitly True
if not settings.SQL_ECHO:
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine.Engine").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.pool").setLevel(logging.WARNING)

# Engine creation
engine_kwargs = {
    "echo": settings.SQL_ECHO,
    "future": True,
    "connect_args": connect_args,
}

# Only configure connection pooling for non-SQLite connections
if not settings.async_database_url.startswith("sqlite"):
    engine_kwargs.update(
        {
            "pool_size": 10,
            "max_overflow": 20,
            "pool_pre_ping": True,
            "pool_recycle": 300,
        }
    )

engine = create_async_engine(settings.async_database_url, **engine_kwargs)

async_session_maker = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Dependency that yields an asynchronous database session."""
    async with async_session_maker() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """Creates database tables asynchronously if they don't already exist."""
    async with engine.begin() as conn:
        logger.info("Initializing database tables...")
        if not settings.async_database_url.startswith("sqlite"):
            try:
                from sqlalchemy import text
                await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
            except Exception as ext_err:
                logger.warning(f"Note on vector extension initialization: {ext_err}")
        await conn.run_sync(SQLModel.metadata.create_all)
        logger.info("Database tables initialized successfully.")
