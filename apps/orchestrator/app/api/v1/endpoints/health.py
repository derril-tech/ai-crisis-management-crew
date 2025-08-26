# Created automatically by Cursor AI (2024-12-19)
from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/")
async def health_check():
    """Health check endpoint for the orchestrator service."""
    return {
        "status": "healthy",
        "service": "orchestrator",
        "timestamp": datetime.utcnow().isoformat(),
    }
