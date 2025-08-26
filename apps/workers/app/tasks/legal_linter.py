# Created automatically by Cursor AI (2024-12-19)

from typing import List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field
from celery import shared_task
import structlog

logger = structlog.get_logger()

RISKY_TERMS = {
    "breach": "security incident",
    "hack": "unauthorized access",
    "stolen": "accessed",
    "guarantee": "aim to",
    "promise": "intend to",
    "never": "do not typically",
}

class Redline(BaseModel):
    start: int
    end: int
    original: str
    suggestion: str
    reason: str
    severity: str = Field(..., description="low|medium|high|critical")

class LegalLintRequest(BaseModel):
    incident_id: str
    artifact_id: str
    content: str
    jurisdiction: str | None = None
    categories: List[str] = []

class LegalLintResponse(BaseModel):
    artifact_id: str
    incident_id: str
    redlines: List[Redline]
    summary: Dict[str, Any]
    generated_at: datetime

@shared_task(bind=True, name="legal_lint_content")
def legal_lint_content(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
    request = LegalLintRequest(**request_data)
    logger.info("Legal lint started", incident_id=request.incident_id, artifact_id=request.artifact_id)

    text = request.content
    redlines: List[Redline] = []

    lowered = text.lower()
    for risky, safe in RISKY_TERMS.items():
        start = 0
        while True:
            idx = lowered.find(risky, start)
            if idx == -1:
                break
            end = idx + len(risky)
            original = text[idx:end]
            reason = f"Replace '{risky}' with '{safe}' to reduce liability/exposure."
            severity = "high" if risky in ["breach", "hack", "stolen"] else "medium"
            redlines.append(Redline(start=idx, end=end, original=original, suggestion=safe, reason=reason, severity=severity))
            start = end

    summary = {
        "total": len(redlines),
        "by_severity": {
            "critical": sum(1 for r in redlines if r.severity == "critical"),
            "high": sum(1 for r in redlines if r.severity == "high"),
            "medium": sum(1 for r in redlines if r.severity == "medium"),
            "low": sum(1 for r in redlines if r.severity == "low"),
        }
    }

    response = LegalLintResponse(
        artifact_id=request.artifact_id,
        incident_id=request.incident_id,
        redlines=redlines,
        summary=summary,
        generated_at=datetime.utcnow(),
    )

    logger.info("Legal lint completed", total=response.summary["total"])
    return response.dict()
