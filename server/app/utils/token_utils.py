from typing import Optional, Tuple
from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import create_access_token, create_refresh_token, hash_token
from app.models.user import RefreshToken, User
from app.utils.request_utils import get_client_info


async def issue_and_store_tokens(
    user: User,
    db: AsyncSession,
    request: Request,
    replaced_by_token_hash: Optional[str] = None,
) -> Tuple[str, str, int]:
    """
    Generate an access token and a rotating refresh token,
    storing the hashed refresh token in the database along with client metadata.

    Returns:
        tuple of (access_token, refresh_token, expires_in_seconds)
    """
    access_token, _ = create_access_token(user_id=user.id, email=user.email)
    refresh_token, jti, refresh_expires_at = create_refresh_token(user_id=user.id)
    token_hash = hash_token(refresh_token)

    ip_address, user_agent = get_client_info(request)

    db_refresh_token = RefreshToken(
        user_id=user.id,
        token_hash=token_hash,
        jti=jti,
        expires_at=refresh_expires_at,
        ip_address=ip_address,
        user_agent=user_agent,
    )
    db.add(db_refresh_token)

    expires_in = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    return access_token, refresh_token, expires_in
