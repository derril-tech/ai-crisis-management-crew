# Created automatically by Cursor AI (2024-12-19)
from celery_app import celery_app
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime, timedelta
import structlog

logger = structlog.get_logger()

class TimelineItem(BaseModel):
    label: str
    at: datetime
    description: str

class TaskItem(BaseModel):
    title: str
    owner_role: str
    due_at: datetime
    depends_on: str = None
    priority: int = 3
    channel_hint: str = None

class PlanResult(BaseModel):
    timeline: List[TimelineItem]
    tasks: List[TaskItem]
    owners: List[str]
    dependencies: List[Dict[str, str]]

@celery_app.task(bind=True)
def build_plan(self, incident_data: Dict[str, Any]) -> Dict[str, Any]:
    """Build timeline and tasks for an incident."""
    logger.info("Starting plan building", incident_id=incident_data.get("id"))
    
    try:
        severity = incident_data.get("severity", "high")
        facts = incident_data.get("facts", [])
        
        # Calculate timeline based on severity
        now = datetime.utcnow()
        timeline = []
        tasks = []
        
        if severity in ["high", "critical"]:
            # High/Critical incidents need immediate response
            timeline = [
                TimelineItem(
                    label="T0",
                    at=now,
                    description="Incident detected - immediate response required"
                ),
                TimelineItem(
                    label="T+1h", 
                    at=now + timedelta(hours=1),
                    description="Holding statement due"
                ),
                TimelineItem(
                    label="T+4h",
                    at=now + timedelta(hours=4), 
                    description="Press release draft due"
                ),
                TimelineItem(
                    label="T+24h",
                    at=now + timedelta(hours=24),
                    description="Full disclosure package ready"
                ),
                TimelineItem(
                    label="T+72h",
                    at=now + timedelta(hours=72),
                    description="Incident resolution review"
                )
            ]
            
            tasks = [
                TaskItem(
                    title="Draft holding statement",
                    owner_role="pr",
                    due_at=now + timedelta(minutes=30),
                    priority=1
                ),
                TaskItem(
                    title="Legal review of holding statement",
                    owner_role="legal",
                    due_at=now + timedelta(minutes=45),
                    depends_on="Draft holding statement",
                    priority=1
                ),
                TaskItem(
                    title="Executive approval of holding statement",
                    owner_role="exec",
                    due_at=now + timedelta(minutes=55),
                    depends_on="Legal review of holding statement",
                    priority=1
                ),
                TaskItem(
                    title="Draft press release",
                    owner_role="pr",
                    due_at=now + timedelta(hours=3),
                    priority=2
                ),
                TaskItem(
                    title="Prepare internal communication",
                    owner_role="pr",
                    due_at=now + timedelta(hours=2),
                    priority=2
                ),
                TaskItem(
                    title="Update status page",
                    owner_role="pr",
                    due_at=now + timedelta(hours=1),
                    priority=2
                )
            ]
        else:
            # Medium/Low incidents have more relaxed timeline
            timeline = [
                TimelineItem(
                    label="T0",
                    at=now,
                    description="Incident detected"
                ),
                TimelineItem(
                    label="T+4h",
                    at=now + timedelta(hours=4),
                    description="Initial assessment due"
                ),
                TimelineItem(
                    label="T+24h",
                    at=now + timedelta(hours=24),
                    description="Communication plan due"
                ),
                TimelineItem(
                    label="T+72h",
                    at=now + timedelta(hours=72),
                    description="Resolution review"
                )
            ]
            
            tasks = [
                TaskItem(
                    title="Assess incident scope",
                    owner_role="pr",
                    due_at=now + timedelta(hours=2),
                    priority=3
                ),
                TaskItem(
                    title="Draft communication plan",
                    owner_role="pr",
                    due_at=now + timedelta(hours=6),
                    priority=3
                )
            ]
        
        result = PlanResult(
            timeline=[item.dict() for item in timeline],
            tasks=[item.dict() for item in tasks],
            owners=["pr", "legal", "exec", "social"],
            dependencies=[]
        )
        
        logger.info("Plan building completed", 
                   incident_id=incident_data.get("id"),
                   task_count=len(tasks))
        
        return result.dict()
        
    except Exception as e:
        logger.error("Plan building failed", 
                    incident_id=incident_data.get("id"),
                    error=str(e))
        raise
