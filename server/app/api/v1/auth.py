import logging
import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.api.deps import get_current_user, get_db
from app.core.config import settings
from app.core.security import decode_jwt, hash_password, hash_token, verify_password
from app.models.user import RefreshToken, User
from app.schemas.auth import (
    AuthResponse,
    ChangePasswordRequest,
    MessageResponse,
    UserLogin,
    UserRegister,
    UserResponse,
)
from app.utils import (
    clear_auth_cookies,
    ensure_utc,
    issue_and_store_tokens,
    set_auth_cookies,
)

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Registers a new user and sets secure HttpOnly JWT cookies for access and refresh tokens.",
)
async def register(
    payload: UserRegister,
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    # Check if user already exists
    statement = select(User).where(User.email == payload.email)
    existing_user_result = await db.execute(statement)
    if existing_user_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists.",
        )

    # Hash the password with Argon2
    hashed_pwd = hash_password(payload.password)

    # Create new User model instance
    user = User(
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=payload.email,
        date_of_birth=payload.date_of_birth,
        country=payload.country,
        city=payload.city,
        phone_no=payload.phone_no,
        gender=payload.gender,
        password_hash=hashed_pwd,
        is_active=True,
        is_verified=False,
    )
    db.add(user)
    await db.flush()  # Populates user.id without committing transaction yet

    # Generate tokens & store refresh token in DB
    access_token, refresh_token, _ = await issue_and_store_tokens(
        user=user, db=db, request=request
    )

    await db.commit()
    await db.refresh(user)

    # Set secure HttpOnly cookies
    set_auth_cookies(response=response, access_token=access_token, refresh_token=refresh_token)

    return AuthResponse(
        message="Registration successful. Authentication cookies set.",
        user=UserResponse.model_validate(user),
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post(
    "/login",
    response_model=AuthResponse,
    summary="User login",
    description="Authenticates credentials and sets secure HttpOnly JWT cookies for access and refresh tokens.",
)
async def login(
    payload: UserLogin,
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    # Fetch user by email
    statement = select(User).where(User.email == payload.email)
    result = await db.execute(statement)
    user = result.scalar_one_or_none()

    # Generic invalid credentials response to prevent user enumeration
    invalid_credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect email or password.",
    )

    if not user:
        raise invalid_credentials_exception

    if not verify_password(payload.password, user.password_hash):
        raise invalid_credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated. Please contact support.",
        )

    # Issue tokens
    access_token, refresh_token, _ = await issue_and_store_tokens(
        user=user, db=db, request=request
    )

    await db.commit()
    await db.refresh(user)

    # Set secure HttpOnly cookies
    set_auth_cookies(response=response, access_token=access_token, refresh_token=refresh_token)

    return AuthResponse(
        message="Login successful. Authentication cookies set.",
        user=UserResponse.model_validate(user),
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post(
    "/refresh",
    response_model=AuthResponse,
    summary="Rotate refresh token cookie & issue new access token cookie",
    description="Reads the refresh token from HttpOnly cookie, performs rotation, and updates cookies.",
)
async def refresh_tokens(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    # Extract refresh token from HttpOnly cookie
    raw_refresh_token = request.cookies.get(settings.COOKIE_REFRESH_NAME)

    if not raw_refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token cookie missing. Please log in.",
        )

    try:
        token_payload = decode_jwt(raw_refresh_token, expected_type="refresh")
        user_id_str = token_payload.get("sub")
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
            detail="Invalid refresh token.",
        )

    token_hash_value = hash_token(raw_refresh_token)

    # Find the refresh token in the database
    token_stmt = select(RefreshToken).where(RefreshToken.token_hash == token_hash_value)
    token_res = await db.execute(token_stmt)
    db_token = token_res.scalar_one_or_none()

    now = datetime.now(timezone.utc)

    if not db_token:
        clear_auth_cookies(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unrecognized or invalid refresh token.",
        )

    # Replay attack detection: If token was already revoked, someone might have stolen it!
    if db_token.revoked:
        logger.warning(
            f"Security Alert: Revoked refresh token reused for user {user_uuid}. Inactivating user token family."
        )
        revoke_all_stmt = select(RefreshToken).where(
            RefreshToken.user_id == user_uuid,
            RefreshToken.revoked == False,  # noqa: E712
        )
        res = await db.execute(revoke_all_stmt)
        active_tokens = res.scalars().all()
        for tok in active_tokens:
            tok.revoked = True
            tok.revoked_at = now
        await db.commit()
        clear_auth_cookies(response)

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Revoked refresh token reused. All sessions invalidated for security.",
        )

    # Check token expiration
    if ensure_utc(db_token.expires_at) < now:
        db_token.revoked = True
        db_token.revoked_at = now
        await db.commit()
        clear_auth_cookies(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has expired. Please log in again.",
        )

    # Fetch user
    user_stmt = select(User).where(User.id == user_uuid)
    user_res = await db.execute(user_stmt)
    user = user_res.scalar_one_or_none()

    if not user or not user.is_active:
        clear_auth_cookies(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive.",
        )

    # Mark current token as revoked (rotation)
    db_token.revoked = True
    db_token.revoked_at = now

    # Issue new token pair
    access_token, new_refresh_token, _ = await issue_and_store_tokens(
        user=user, db=db, request=request
    )

    db_token.replaced_by = hash_token(new_refresh_token)

    await db.commit()
    await db.refresh(user)

    # Update secure cookies with new rotated tokens
    set_auth_cookies(response=response, access_token=access_token, refresh_token=new_refresh_token)

    return AuthResponse(
        message="Token refreshed successfully. New cookies set.",
        user=UserResponse.model_validate(user),
        access_token=access_token,
        refresh_token=new_refresh_token,
    )


@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Log out user",
    description="Revokes the refresh token from cookie/database and clears all auth cookies.",
)
async def logout(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    raw_refresh_token = request.cookies.get(settings.COOKIE_REFRESH_NAME)

    if raw_refresh_token:
        token_hash_value = hash_token(raw_refresh_token)
        stmt = select(RefreshToken).where(RefreshToken.token_hash == token_hash_value)
        result = await db.execute(stmt)
        db_token = result.scalar_one_or_none()

        if db_token and not db_token.revoked:
            db_token.revoked = True
            db_token.revoked_at = datetime.now(timezone.utc)
            await db.commit()

    # Clear HttpOnly cookies
    clear_auth_cookies(response)

    return MessageResponse(message="Successfully logged out and cleared authentication cookies.")


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user profile",
    description="Returns the profile information of the currently authenticated user identified by the HttpOnly access token cookie.",
)
async def get_me(
    current_user: User = Depends(get_current_user),
):
    return UserResponse.model_validate(current_user)


@router.post(
    "/change-password",
    response_model=MessageResponse,
    summary="Change password",
    description="Securely updates the user password, revokes all active sessions, and clears cookies.",
)
async def change_password(
    payload: ChangePasswordRequest,
    response: Response,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Verify current password
    if not verify_password(payload.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password does not match.",
        )

    # Hash new password
    current_user.password_hash = hash_password(payload.new_password)
    current_user.updated_at = datetime.now(timezone.utc)
    db.add(current_user)

    # Revoke all existing sessions so that old sessions cannot be used
    revoke_stmt = select(RefreshToken).where(
        RefreshToken.user_id == current_user.id,
        RefreshToken.revoked == False,  # noqa: E712
    )
    result = await db.execute(revoke_stmt)
    active_tokens = result.scalars().all()
    now = datetime.now(timezone.utc)
    for token in active_tokens:
        token.revoked = True
        token.revoked_at = now

    await db.commit()

    # Clear auth cookies
    clear_auth_cookies(response)

    return MessageResponse(
        message="Password updated successfully. All sessions terminated. Please log in with your new password."
    )
