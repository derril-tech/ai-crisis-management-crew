# Created automatically by Cursor AI (2024-12-19)
from fastapi import APIRouter

from app.api.v1.endpoints import incidents, health

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(incidents.router, prefix="/incidents", tags=["incidents"])
