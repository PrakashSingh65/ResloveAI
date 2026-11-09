import hashlib
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional, Tuple

import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from pwdlib import PasswordHash
from pwdlib.hashers.argon2 import Argon2Hasher

from app.core.config import settings

# Initialize PasswordHash using Argon2 (modern, memory-hard hashing)
password_hash = PasswordHash((Argon2Hasher(),))


def hash_password(password: str) -> str:
    """Hash a plaintext password using Argon2id."""
    return password_hash.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against an Argon2id hash."""
    return password_hash.verify(plain_password, hashed_password)


def hash_token(token: str) -> str:
    """
    Generate SHA-256 digest of a token string for safe storage in DB.
    Never store raw refresh tokens in the database.
    """
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_access_token(
    user_id: Any,
    email: str,
    expires_delta: Optional[timedelta] = None,
    extra_claims: Optional[Dict[str, Any]] = None,
) -> Tuple[str, datetime]:
    """
    Generate a signed JWT access token.
    Returns (token_string, expire_datetime).
    """
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    jti = str(uuid.uuid4())
    payload: Dict[str, Any] = {
        "sub": str(user_id),
        "email": email,
        "type": "access",
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
        "jti": jti,
    }
    if extra_claims:
        payload.update(extra_claims)

    encoded_jwt = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt, expire


def create_refresh_token(
    user_id: Any,
    expires_delta: Optional[timedelta] = None,
    extra_claims: Optional[Dict[str, Any]] = None,
) -> Tuple[str, str, datetime]:
    """
    Generate a signed JWT refresh token.
    Returns (token_string, jti, expire_datetime).
    """
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    jti = str(uuid.uuid4())
    payload: Dict[str, Any] = {
        "sub": str(user_id),
        "type": "refresh",
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
        "jti": jti,
    }
    if extra_claims:
        payload.update(extra_claims)

    secret = settings.effective_refresh_secret_key
    encoded_jwt = jwt.encode(payload, secret, algorithm=settings.ALGORITHM)
    return encoded_jwt, jti, expire


def decode_jwt(token: str, expected_type: str = "access") -> Dict[str, Any]:
    """
    Decode and validate a JWT token.
    Checks signature, expiration, and token type.
    """
    secret = (
        settings.effective_refresh_secret_key
        if expected_type == "refresh"
        else settings.SECRET_KEY
    )

    try:
        payload = jwt.decode(
            token,
            secret,
            algorithms=[settings.ALGORITHM],
            options={"require": ["exp", "iat", "sub", "type"]},
        )
    except ExpiredSignatureError as e:
        raise ValueError("Token has expired") from e
    except InvalidTokenError as e:
        raise ValueError("Invalid token signature or payload") from e

    token_type = payload.get("type")
    if token_type != expected_type:
        raise ValueError(f"Invalid token type: expected '{expected_type}', got '{token_type}'")

    return payload
