# Created automatically by Cursor AI (2024-12-19)
from celery import Celery
from app.core.config import settings
import structlog

logger = structlog.get_logger()

# Create Celery app
celery_app = Celery(
    "crisis_crew_workers",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=[
        "app.tasks.intake_normalizer",
        "app.tasks.plan_builder", 
        "app.tasks.content_writer",
        "app.tasks.legal_linter",
        "app.tasks.social_pack",
        "app.tasks.monitor_ingest",
        "app.tasks.exporter",
    ]
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
    broker_connection_retry_on_startup=True,
)

# Task routing
celery_app.conf.task_routes = {
    "app.tasks.intake_normalizer.*": {"queue": "interactive"},
    "app.tasks.plan_builder.*": {"queue": "interactive"},
    "app.tasks.content_writer.*": {"queue": "interactive"},
    "app.tasks.legal_linter.*": {"queue": "interactive"},
    "app.tasks.social_pack.*": {"queue": "interactive"},
    "app.tasks.monitor_ingest.*": {"queue": "monitor"},
    "app.tasks.exporter.*": {"queue": "exports"},
}

if __name__ == "__main__":
    celery_app.start()
