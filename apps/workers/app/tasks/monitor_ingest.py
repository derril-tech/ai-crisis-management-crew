# Created automatically by Cursor AI (2024-12-19)

from typing import List, Dict, Any
from datetime import datetime, timedelta
from pydantic import BaseModel, Field
from celery import shared_task
import random
import structlog

logger = structlog.get_logger()

class Mention(BaseModel):
    id: str
    incident_id: str
    source: str
    text: str
    created_at: datetime
    sentiment: float = Field(..., ge=-1.0, le=1.0)

class Rumor(BaseModel):
    id: str
    incident_id: str
    text: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    severity: str
    created_at: datetime

class SentimentPoint(BaseModel):
    t: datetime
    value: float

@shared_task(bind=True, name="monitor_ingest_mentions")
def monitor_ingest_mentions(self, incident_id: str, raw_feed: List[Dict[str, Any]]) -> Dict[str, Any]:
    mentions: List[Mention] = []
    now = datetime.utcnow()
    for idx, item in enumerate(raw_feed):
        text = item.get("text", "")
        sentiment = random.uniform(-0.5, 0.9) if text else 0.0
        mentions.append(Mention(
            id=f"m-{int(now.timestamp())}-{idx}",
            incident_id=incident_id,
            source=item.get("source", "unknown"),
            text=text,
            created_at=now - timedelta(minutes=random.randint(0, 120)),
            sentiment=round(sentiment, 2)
        ))
    logger.info("monitor_ingest_mentions", count=len(mentions))
    return {"mentions": [m.dict() for m in mentions]}

@shared_task(bind=True, name="analyze_sentiment_series")
def analyze_sentiment_series(self, incident_id: str, hours: int = 24) -> Dict[str, Any]:
    now = datetime.utcnow()
    points: List[SentimentPoint] = []
    base = random.uniform(-0.1, 0.1)
    for i in range(hours):
        jitter = random.uniform(-0.2, 0.2)
        val = max(-1.0, min(1.0, base + jitter))
        points.append(SentimentPoint(t=now - timedelta(hours=hours - i), value=round(val, 2)))
    return {"series": [p.dict() for p in points]}

@shared_task(bind=True, name="detect_rumors")
def detect_rumors(self, incident_id: str, mentions: List[Dict[str, Any]]) -> Dict[str, Any]:
    rumors: List[Rumor] = []
    for m in mentions:
        text = m.get("text", "")
        if any(kw in text.lower() for kw in ["breach", "leak", "stolen", "lawsuit", "fine"]):
            rumors.append(Rumor(
                id=f"r-{m.get('id', '')}",
                incident_id=incident_id,
                text=text,
                confidence=0.6,
                severity="medium",
                created_at=datetime.utcnow()
            ))
    return {"rumors": [r.dict() for r in rumors]}
