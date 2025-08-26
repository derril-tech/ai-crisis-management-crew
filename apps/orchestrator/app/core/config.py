# Created automatically by Cursor AI (2024-12-19)
from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # Application
    DEBUG: bool = False
    ORCHESTRATOR_PORT: int = 8000
    
    # Security
    ALLOWED_HOSTS: List[str] = ["*"]
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/crisis_crew"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # NATS
    NATS_URL: str = "nats://localhost:4222"
    NATS_CLUSTER_ID: str = "test-cluster"
    NATS_CLIENT_ID: str = "crisis-crew-orchestrator"
    
    # S3/MinIO
    S3_ENDPOINT: str = "http://localhost:9000"
    S3_ACCESS_KEY_ID: str = "minioadmin"
    S3_SECRET_ACCESS_KEY: str = "minioadmin"
    S3_BUCKET: str = "crisis-crew"
    S3_REGION: str = "us-east-1"
    S3_FORCE_PATH_STYLE: bool = True
    
    # AI Services
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    CREWAI_API_KEY: Optional[str] = None
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
