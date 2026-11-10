from fastapi import APIRouter

from app.api.v1 import auth, knowledge, tickets

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(tickets.router, prefix="/tickets", tags=["Tickets & Live Desk"])
api_router.include_router(knowledge.router, prefix="/knowledge", tags=["RAG Knowledge Base"])
