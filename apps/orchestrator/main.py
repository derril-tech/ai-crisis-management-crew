# Created automatically by Cursor AI (2024-12-19)
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import uvicorn
from contextlib import asynccontextmanager
import structlog

from app.core.config import settings
from app.api.v1.api import api_router
from app.core.logging import setup_logging

logger = structlog.get_logger()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Crisis Crew Orchestrator")
    yield
    # Shutdown
    logger.info("Shutting down Crisis Crew Orchestrator")

def create_application() -> FastAPI:
    setup_logging()
    
    app = FastAPI(
        title="Crisis Management Crew Orchestrator",
        description="Multi-agent crisis response orchestration service",
        version="1.0.0",
        lifespan=lifespan,
    )

    # Security middleware
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.ALLOWED_HOSTS,
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include API router
    app.include_router(api_router, prefix="/api/v1")

    @app.get("/health")
    async def health_check():
        return {"status": "healthy", "service": "orchestrator"}

    return app

app = create_application()

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(settings.ORCHESTRATOR_PORT),
        reload=settings.DEBUG,
    )
