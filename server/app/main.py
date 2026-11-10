import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.core.config import settings
from app.core.database import init_db

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("resolveai")

# Silence noisy third-party SQL query logs unless DEBUG is explicitly enabled
if not settings.DEBUG:
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.pool").setLevel(logging.WARNING)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database tables if not in test mode
    is_test = os.getenv("ENVIRONMENT") == "testing" or settings.ENVIRONMENT == "testing"
    if not is_test and settings.DATABASE_URL:
        logger.info("Starting up ResolveAI API...")
        try:
            await init_db()
            logger.info("Database schema verification and initialization completed.")
        except Exception as e:
            logger.error(f"Failed to auto-initialize database tables: {e}")
    yield
    # Shutdown
    logger.info("Shutting down ResolveAI API...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI Customer Support Agent with Smart Human Handoff - Backend API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected internal server error occurred."},
    )


# Health and discovery endpoints
@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": "0.1.0",
        "environment": settings.ENVIRONMENT,
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
    }


# Include versioned API router
app.include_router(api_router, prefix="/api/v1")
