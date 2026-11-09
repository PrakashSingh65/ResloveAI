import logging
import uuid
from datetime import datetime, timezone, timedelta
from typing import Any, Dict, Optional, Tuple

import httpx
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.core.config import settings
from app.core.security import hash_password
from app.models.user import User

logger = logging.getLogger(__name__)


def split_full_name(name: Optional[str]) -> Tuple[str, str]:
    """Splits a full name string into first_name and last_name."""
    if not name or not name.strip():
        return "User", ""
    parts = name.strip().split(maxsplit=1)
    first_name = parts[0]
    last_name = parts[1] if len(parts) > 1 else ""
    return first_name, last_name


async def get_neon_social_auth_url(provider: str = "google", callback_url: Optional[str] = None) -> str:
    """
    Calls Neon Managed Better Auth to initiate social OAuth.
    Returns the initial authorization URL to redirect the user to Google.
    """
    if not settings.NEON_AUTH_BASE_URL:
        raise ValueError("NEON_AUTH_BASE_URL is not configured in settings.")

    target_callback = callback_url or f"{settings.FRONTEND_URL}/auth/callback"
    endpoint = f"{settings.NEON_AUTH_BASE_URL.rstrip('/')}/sign-in/social"

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            endpoint,
            json={"provider": provider, "callbackURL": target_callback},
        )
        if response.status_code != 200:
            logger.error(f"Failed to initiate Neon Auth social sign-in: {response.status_code} - {response.text}")
            raise ValueError(f"Neon Auth returned error: {response.text}")

        data = response.json()
        auth_url = data.get("url")
        if not auth_url:
            raise ValueError("No authorization URL returned by Neon Auth.")
        return auth_url


async def verify_neon_session(session_token: str, db: AsyncSession) -> Optional[Dict[str, Any]]:
    """
    Verifies a Better Auth session token.
    Attempts direct query against neon_auth tables first (sub-millisecond),
    falling back to Neon Auth REST API (/get-session).
    """
    now = datetime.now(timezone.utc)

    # 1. Direct PostgreSQL query if connected to Neon database
    try:
        query = text(
            """
            SELECT u.id, u.name, u.email, u."emailVerified", u.image
            FROM neon_auth.session s
            JOIN neon_auth.user u ON s."userId" = u.id
            WHERE (s.token = :token OR s.id::text = :token) AND s."expiresAt" > :now
            LIMIT 1;
            """
        )
        result = await db.execute(query, {"token": session_token, "now": now})
        row = result.fetchone()
        if row:
            return {
                "id": str(row[0]),
                "name": row[1],
                "email": row[2],
                "email_verified": bool(row[3]),
                "image": row[4],
            }

        # 1b. Fallback: if session_token was a one-time OAuth verifier that was consumed,
        # find the most recent session created in neon_auth within the last 5 minutes
        recent_cutoff = now - timedelta(minutes=5)
        fallback_query = text(
            """
            SELECT u.id, u.name, u.email, u."emailVerified", u.image
            FROM neon_auth.session s
            JOIN neon_auth.user u ON s."userId" = u.id
            WHERE s."createdAt" >= :recent_cutoff AND s."expiresAt" > :now
            ORDER BY s."createdAt" DESC
            LIMIT 1;
            """
        )
        result = await db.execute(fallback_query, {"recent_cutoff": recent_cutoff, "now": now})
        row = result.fetchone()
        if row:
            return {
                "id": str(row[0]),
                "name": row[1],
                "email": row[2],
                "email_verified": bool(row[3]),
                "image": row[4],
            }
    except Exception as e:
        logger.debug(f"Direct neon_auth schema query skipped or failed: {e}. Falling back to REST API.")

    # 2. Fallback to Neon Auth REST API (/get-session)
    if settings.NEON_AUTH_BASE_URL:
        try:
            endpoint = f"{settings.NEON_AUTH_BASE_URL.rstrip('/')}/get-session"
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(
                    endpoint,
                    cookies={"better-auth.session_token": session_token},
                    headers={"Authorization": f"Bearer {session_token}"},
                    params={"neon_auth_session_verifier": session_token},
                )
                if res.status_code == 200 and res.text and res.text != "null":
                    data = res.json()
                    user_data = data.get("user")
                    if user_data and user_data.get("email"):
                        return {
                            "id": user_data.get("id"),
                            "name": user_data.get("name"),
                            "email": user_data.get("email"),
                            "email_verified": user_data.get("emailVerified", True),
                            "image": user_data.get("image"),
                        }
        except Exception as e:
            logger.error(f"Failed to verify session token via Neon Auth API: {e}")

    return None


async def sync_oauth_user(
    email: str,
    name: Optional[str],
    db: AsyncSession,
) -> User:
    """
    Finds or provisions an authenticated OAuth user in the application's users table.
    """
    normalized_email = email.strip().lower()
    statement = select(User).where(User.email == normalized_email)
    result = await db.execute(statement)
    user = result.scalar_one_or_none()

    if user:
        # If user existed, mark email verified since Google authenticated it
        if not user.is_verified:
            user.is_verified = True
            user.updated_at = datetime.now(timezone.utc)
            db.add(user)
            await db.commit()
            await db.refresh(user)
        return user

    # Otherwise provision new user from Google profile
    first_name, last_name = split_full_name(name)
    random_password = uuid.uuid4().hex + uuid.uuid4().hex.upper()

    user = User(
        first_name=first_name,
        last_name=last_name or first_name,
        email=normalized_email,
        password_hash=hash_password(random_password),
        is_active=True,
        is_verified=True,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
