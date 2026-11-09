from typing import Optional, Tuple
from fastapi import Request


def get_client_info(request: Request) -> Tuple[Optional[str], Optional[str]]:
    """
    Extract client IP address and User-Agent header safely from a FastAPI Request.
    Handles truncated User-Agent to prevent database column overflows.
    """
    ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    if user_agent and len(user_agent) > 500:
        user_agent = user_agent[:500]
    return ip, user_agent
