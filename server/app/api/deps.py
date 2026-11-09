import uuid
from typing import AsyncGenerator, Optional

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.core.config import settings
from app.core.database import get_session
from app.core.security import decode_jwt
from app.models.user import User


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for providing database sessions to endpoint handlers."""
    async for session in get_session():
        yield session


def extract_token_from_request(request: Request) -> Optional[str]:
    """
    Extracts the JWT access token primarily from the secure HttpOnly cookie.
    Falls back to the Authorization Bearer header if provided (e.g. for API/Swagger testing).
    """
    # 1. Primary: HttpOnly Cookie
    token = request.cookies.get(settings.COOKIE_ACCESS_NAME)
    if token:
        return token

    # 2. Secondary fallback: Authorization header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.split(" ", 1)[1].strip()

    return None


async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Dependency that extracts the access token from the HttpOnly cookie,
    decodes it, verifies the user, and ensures the account is active.
    """
    token = extract_token_from_request(request)

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication cookie missing. Please log in.",
        )

    try:
        payload = decode_jwt(token, expected_type="access")
        user_id_str: str = payload.get("sub")
        if not user_id_str:
            raise ValueError("Token missing user subject")
        user_uuid = uuid.UUID(user_id_str)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        )

    statement = select(User).where(User.id == user_uuid)
    result = await db.execute(statement)
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account.",
        )

    return user


async def get_current_verified_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Dependency that ensures the authenticated user is email-verified."""
    if not current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User email is not verified.",
        )
    return current_user
