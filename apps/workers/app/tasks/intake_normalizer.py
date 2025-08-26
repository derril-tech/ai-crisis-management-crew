# Created automatically by Cursor AI (2024-12-19)
from celery_app import celery_app
from pydantic import BaseModel
from typing import List, Dict, Any
import structlog

logger = structlog.get_logger()

class IncidentInput(BaseModel):
    title: str
    description: str
    detected_at: str
    affected_users: int
    data_types: List[str]
    jurisdictions: List[str]

class NormalizedFacts(BaseModel):
    facts: List[Dict[str, Any]]
    unknowns: List[str]
    severity: str
    jurisdictions: List[str]
    data_categories: List[str]

@celery_app.task(bind=True)
def normalize_incident(self, incident_data: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize incident input into structured facts and unknowns."""
    logger.info("Starting incident normalization", incident_id=incident_data.get("id"))
    
    try:
        # Parse input
        incident = IncidentInput(**incident_data)
        
        # Extract facts
        facts = [
            {"label": "title", "value": incident.title, "confidence": "high"},
            {"label": "detected_at", "value": incident.detected_at, "confidence": "high"},
            {"label": "affected_users", "value": str(incident.affected_users), "confidence": "medium"},
            {"label": "data_types", "value": ", ".join(incident.data_types), "confidence": "high"},
        ]
        
        # Determine unknowns
        unknowns = []
        if incident.affected_users == 0:
            unknowns.append("exact_user_count")
        if not incident.jurisdictions:
            unknowns.append("affected_jurisdictions")
        
        # Calculate severity
        severity = "high"
        if incident.affected_users > 10000:
            severity = "critical"
        elif incident.affected_users < 100:
            severity = "medium"
        
        result = NormalizedFacts(
            facts=facts,
            unknowns=unknowns,
            severity=severity,
            jurisdictions=incident.jurisdictions,
            data_categories=incident.data_types,
        )
        
        logger.info("Incident normalization completed", 
                   incident_id=incident_data.get("id"),
                   severity=severity)
        
        return result.dict()
        
    except Exception as e:
        logger.error("Incident normalization failed", 
                    incident_id=incident_data.get("id"),
                    error=str(e))
        raise
