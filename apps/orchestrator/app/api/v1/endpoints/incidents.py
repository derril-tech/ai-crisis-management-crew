# Created automatically by Cursor AI (2024-12-19)
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

router = APIRouter()

class IncidentCreate(BaseModel):
    title: str
    type: str
    severity: str = "high"
    detected_at: Optional[datetime] = None

class IncidentResponse(BaseModel):
    id: str
    title: str
    type: str
    severity: str
    status: str
    created_at: datetime

@router.post("/", response_model=IncidentResponse)
async def create_incident(incident: IncidentCreate):
    """Create a new incident."""
    incident_id = str(uuid.uuid4())
    return IncidentResponse(
        id=incident_id,
        title=incident.title,
        type=incident.type,
        severity=incident.severity,
        status="created",
        created_at=datetime.utcnow(),
    )

@router.get("/{incident_id}", response_model=IncidentResponse)
async def get_incident(incident_id: str):
    """Get incident details."""
    # TODO: Implement actual database lookup
    raise HTTPException(status_code=404, detail="Incident not found")
