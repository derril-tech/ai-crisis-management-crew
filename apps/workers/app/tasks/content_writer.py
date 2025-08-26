# Created automatically by Cursor AI (2024-12-19)

import json
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from pydantic import BaseModel, Field
from celery import shared_task
import structlog

logger = structlog.get_logger()

class ContentRequest(BaseModel):
    incident_id: str
    content_type: str = Field(..., description="Type of content: holding_statement, press_release, internal_memo, faq, social_media")
    incident_facts: Dict[str, Any] = Field(..., description="Structured incident facts")
    severity: str = Field(..., description="Incident severity: low, medium, high, critical")
    target_audience: List[str] = Field(default_factory=list, description="Target audience segments")
    tone: str = Field(default="professional", description="Content tone: professional, empathetic, technical, urgent")
    custom_instructions: Optional[str] = Field(default=None, description="Additional instructions for content generation")
    template_variables: Optional[Dict[str, str]] = Field(default_factory=dict, description="Custom variables for template substitution")

class ContentResponse(BaseModel):
    content_id: str
    content_type: str
    title: str
    content: str
    metadata: Dict[str, Any]
    generated_at: datetime
    version: str = "1.0"
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    suggested_revisions: List[str] = Field(default_factory=list)
    legal_flags: List[str] = Field(default_factory=list)
    approval_required: bool = True

class FAQItem(BaseModel):
    question: str
    answer: str
    category: str
    priority: int = Field(..., ge=1, le=5)

class SocialMediaPost(BaseModel):
    platform: str
    content: str
    hashtags: List[str] = Field(default_factory=list)
    character_count: int
    includes_media: bool = False

@shared_task(bind=True, name="generate_holding_statement")
def generate_holding_statement(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generate a holding statement for immediate release."""
    try:
        request = ContentRequest(**request_data)
        logger.info("Generating holding statement", incident_id=request.incident_id)
        
        # Extract key facts
        incident_type = request.incident_facts.get("incident_type", "incident")
        affected_systems = request.incident_facts.get("affected_systems", [])
        user_impact = request.incident_facts.get("user_impact", "some users")
        
        # Generate content based on severity and facts
        if request.severity in ["high", "critical"]:
            tone = "urgent"
            urgency_phrase = "immediately"
        else:
            tone = "professional"
            urgency_phrase = "promptly"
        
        content = f"""We are aware of a {incident_type} that may be affecting {user_impact}. Our team is {urgency_phrase} investigating the situation and working to resolve any issues.

We will provide updates as more information becomes available. We apologize for any inconvenience this may cause.

For the latest status updates, please visit our status page or contact our support team."""
        
        # Add severity-specific elements
        if request.severity in ["high", "critical"]:
            content += "\n\nIf you are experiencing urgent issues, please contact our emergency support line."
        
        if affected_systems:
            systems_list = ", ".join(affected_systems[:3])  # Limit to first 3
            content += f"\n\nAffected systems: {systems_list}"
        
        response = ContentResponse(
            content_id=f"holding_{request.incident_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            content_type="holding_statement",
            title=f"Holding Statement - {incident_type.title()}",
            content=content,
            metadata={
                "severity": request.severity,
                "tone": tone,
                "target_audience": request.target_audience,
                "word_count": len(content.split()),
                "estimated_read_time": "30 seconds"
            },
            generated_at=datetime.now(),
            confidence_score=0.85,
            suggested_revisions=[
                "Review for accuracy of affected systems",
                "Verify contact information",
                "Consider adding timeline for next update"
            ],
            legal_flags=[
                "Ensure no admission of liability",
                "Verify factual accuracy"
            ]
        )
        
        logger.info("Holding statement generated successfully", content_id=response.content_id)
        return response.dict()
        
    except Exception as e:
        logger.error("Failed to generate holding statement", error=str(e), incident_id=request_data.get("incident_id"))
        raise

@shared_task(bind=True, name="generate_press_release")
def generate_press_release(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generate a formal press release."""
    try:
        request = ContentRequest(**request_data)
        logger.info("Generating press release", incident_id=request.incident_id)
        
        # Extract facts
        incident_type = request.incident_facts.get("incident_type", "technical incident")
        detected_time = request.incident_facts.get("detected_time", "recently")
        affected_users = request.incident_facts.get("affected_users", "some users")
        company_name = request.template_variables.get("company_name", "Our Company")
        location = request.template_variables.get("location", "Company Headquarters")
        
        # Generate structured press release
        content = f"""FOR IMMEDIATE RELEASE

{company_name.upper()} RESPONDS TO {incident_type.upper()}

{location} - {datetime.now().strftime('%B %d, %Y')} - {company_name} today announced that it has identified and is addressing a {incident_type} that was detected {detected_time}.

WHAT HAPPENED:
Our monitoring systems detected {incident_type} affecting {affected_users}. Upon detection, our incident response team was immediately activated and began investigating the root cause.

WHAT WE'RE DOING:
Our technical teams are working around the clock to resolve this issue. We have implemented containment measures and are systematically restoring affected services. We are also conducting a thorough investigation to prevent similar incidents in the future.

WHAT THIS MEANS FOR YOU:
{self._generate_user_impact_section(request)}

TIMELINE:
- {detected_time}: Issue detected and investigation began
- {datetime.now().strftime('%H:%M')}: Containment measures implemented
- Ongoing: Service restoration and investigation

NEXT STEPS:
We will provide regular updates on our progress and will notify all affected parties once full service is restored. We are committed to transparency throughout this process.

FOR MORE INFORMATION:
Please visit our status page for real-time updates or contact our media relations team at media@{company_name.lower().replace(' ', '')}.com.

About {company_name}:
{company_name} is committed to providing reliable and secure services to our customers. We take all incidents seriously and are dedicated to continuous improvement of our systems and processes.

###
Contact: Media Relations
Email: media@{company_name.lower().replace(' ', '')}.com
Phone: [CONTACT_NUMBER]"""
        
        response = ContentResponse(
            content_id=f"press_{request.incident_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            content_type="press_release",
            title=f"Press Release - {incident_type.title()} Response",
            content=content,
            metadata={
                "severity": request.severity,
                "tone": "formal",
                "target_audience": request.target_audience,
                "word_count": len(content.split()),
                "estimated_read_time": "2 minutes",
                "boilerplate_included": True
            },
            generated_at=datetime.now(),
            confidence_score=0.80,
            suggested_revisions=[
                "Add specific timeline for resolution",
                "Include customer compensation details if applicable",
                "Add executive quote",
                "Review contact information"
            ],
            legal_flags=[
                "Legal review required",
                "Verify all factual statements",
                "Ensure compliance with disclosure requirements",
                "Check for any forward-looking statements"
            ],
            approval_required=True
        )
        
        logger.info("Press release generated successfully", content_id=response.content_id)
        return response.dict()
        
    except Exception as e:
        logger.error("Failed to generate press release", error=str(e), incident_id=request_data.get("incident_id"))
        raise

@shared_task(bind=True, name="generate_internal_memo")
def generate_internal_memo(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generate an internal memo for employees."""
    try:
        request = ContentRequest(**request_data)
        logger.info("Generating internal memo", incident_id=request.incident_id)
        
        # Extract facts
        incident_type = request.incident_facts.get("incident_type", "incident")
        affected_systems = request.incident_facts.get("affected_systems", [])
        current_status = request.incident_facts.get("current_status", "under investigation")
        
        content = f"""Subject: {incident_type.title()} - Internal Update

Team,

We have identified a {incident_type} that affects {', '.join(affected_systems) if affected_systems else 'our systems'}.

CURRENT STATUS: {current_status}
SEVERITY: {request.severity.upper()}
DETECTED: {request.incident_facts.get('detected_time', 'Recently')}

IMPACT:
{self._generate_impact_summary(request)}

WHAT WE'RE DOING:
- Incident response team is activated and coordinating
- Technical teams are working on containment and resolution
- Communications team is preparing external messaging
- Legal team is reviewing potential implications

NEXT STEPS:
- Regular updates will be provided via Slack/email
- All customer-facing communications will be coordinated
- Post-incident review will be scheduled

WHAT YOU SHOULD KNOW:
- Do not speculate about the incident externally
- Refer all media inquiries to the communications team
- Continue normal operations unless directed otherwise
- Support your colleagues who may be working extended hours

RESOURCES:
- Status page: [STATUS_PAGE_URL]
- Internal incident channel: [SLACK_CHANNEL]
- Emergency contact: [EMERGENCY_CONTACT]

Please direct any questions to your manager or the incident response team.

Best regards,
Incident Response Team

---
This is an automated message. For urgent matters, contact the incident commander directly."""
        
        response = ContentResponse(
            content_id=f"memo_{request.incident_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            content_type="internal_memo",
            title=f"Internal Memo - {incident_type.title()}",
            content=content,
            metadata={
                "severity": request.severity,
                "tone": "informative",
                "target_audience": ["employees"],
                "word_count": len(content.split()),
                "estimated_read_time": "1 minute",
                "internal_only": True
            },
            generated_at=datetime.now(),
            confidence_score=0.90,
            suggested_revisions=[
                "Add specific contact information",
                "Include timeline for next update",
                "Add any specific instructions for different departments"
            ],
            legal_flags=[
                "Ensure no confidential information is included",
                "Verify accuracy of status information"
            ],
            approval_required=False
        )
        
        logger.info("Internal memo generated successfully", content_id=response.content_id)
        return response.dict()
        
    except Exception as e:
        logger.error("Failed to generate internal memo", error=str(e), incident_id=request_data.get("incident_id"))
        raise

@shared_task(bind=True, name="generate_faq")
def generate_faq(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generate FAQ content based on incident facts."""
    try:
        request = ContentRequest(**request_data)
        logger.info("Generating FAQ", incident_id=request.incident_id)
        
        # Generate FAQ items based on incident type and severity
        faq_items = []
        
        # Common questions
        faq_items.append(FAQItem(
            question="What happened?",
            answer=f"We experienced a {request.incident_facts.get('incident_type', 'technical issue')} that affected some of our services. Our team is actively working to resolve this.",
            category="general",
            priority=1
        ))
        
        faq_items.append(FAQItem(
            question="When will this be fixed?",
            answer="Our technical teams are working as quickly as possible to resolve this issue. We will provide updates as soon as we have more information about the timeline for resolution.",
            category="timeline",
            priority=1
        ))
        
        faq_items.append(FAQItem(
            question="Is my data safe?",
            answer="We have no indication that any customer data has been compromised. Our security teams are monitoring the situation closely and will notify affected customers immediately if this changes.",
            category="security",
            priority=2
        ))
        
        # Severity-specific questions
        if request.severity in ["high", "critical"]:
            faq_items.append(FAQItem(
                question="What should I do if I'm experiencing issues?",
                answer="If you're experiencing urgent problems, please contact our emergency support line at [EMERGENCY_NUMBER]. For non-urgent issues, our regular support channels remain available.",
                category="support",
                priority=1
            ))
        
        # Incident-specific questions
        incident_type = request.incident_facts.get("incident_type", "")
        if "outage" in incident_type.lower():
            faq_items.append(FAQItem(
                question="Which services are affected?",
                answer=f"The following services may be experiencing issues: {', '.join(request.incident_facts.get('affected_systems', ['various services']))}. We're working to restore all services as quickly as possible.",
                category="services",
                priority=2
            ))
        
        if "breach" in incident_type.lower() or "security" in incident_type.lower():
            faq_items.append(FAQItem(
                question="What steps should I take to protect my account?",
                answer="As a precaution, we recommend changing your password and enabling two-factor authentication if you haven't already. We will provide specific guidance if any action is required.",
                category="security",
                priority=1
            ))
        
        # Sort by priority
        faq_items.sort(key=lambda x: x.priority)
        
        # Format FAQ content
        content = "FREQUENTLY ASKED QUESTIONS\n\n"
        for item in faq_items:
            content += f"Q: {item.question}\n"
            content += f"A: {item.answer}\n\n"
        
        content += "For additional questions, please contact our support team or visit our status page for real-time updates."
        
        response = ContentResponse(
            content_id=f"faq_{request.incident_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            content_type="faq",
            title=f"FAQ - {request.incident_facts.get('incident_type', 'Incident')}",
            content=content,
            metadata={
                "severity": request.severity,
                "tone": "helpful",
                "target_audience": request.target_audience,
                "word_count": len(content.split()),
                "estimated_read_time": "2 minutes",
                "faq_items": [item.dict() for item in faq_items],
                "categories": list(set(item.category for item in faq_items))
            },
            generated_at=datetime.now(),
            confidence_score=0.88,
            suggested_revisions=[
                "Add specific timeline information",
                "Include contact information for support",
                "Add any compensation or credit information if applicable"
            ],
            legal_flags=[
                "Verify accuracy of security statements",
                "Ensure no promises about resolution timeline"
            ],
            approval_required=True
        )
        
        logger.info("FAQ generated successfully", content_id=response.content_id)
        return response.dict()
        
    except Exception as e:
        logger.error("Failed to generate FAQ", error=str(e), incident_id=request_data.get("incident_id"))
        raise

@shared_task(bind=True, name="generate_social_media")
def generate_social_media(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generate social media posts for different platforms."""
    try:
        request = ContentRequest(**request_data)
        logger.info("Generating social media content", incident_id=request.incident_id)
        
        incident_type = request.incident_facts.get("incident_type", "issue")
        platforms = request.template_variables.get("platforms", ["twitter", "linkedin"])
        
        posts = []
        
        for platform in platforms:
            if platform.lower() == "twitter":
                post = SocialMediaPost(
                    platform="twitter",
                    content=f"We're aware of a {incident_type} and are working to resolve it. Updates: [STATUS_PAGE_URL] #ServiceUpdate",
                    hashtags=["#ServiceUpdate", "#CustomerFirst"],
                    character_count=140,
                    includes_media=False
                )
                posts.append(post)
                
            elif platform.lower() == "linkedin":
                post = SocialMediaPost(
                    platform="linkedin",
                    content=f"We're experiencing a {incident_type} and our team is actively working to resolve it. We'll provide updates as we have more information. Thank you for your patience.",
                    hashtags=["#ServiceUpdate", "#CustomerService"],
                    character_count=300,
                    includes_media=False
                )
                posts.append(post)
        
        # Create response with all posts
        content = "SOCIAL MEDIA POSTS\n\n"
        for post in posts:
            content += f"Platform: {post.platform.upper()}\n"
            content += f"Content: {post.content}\n"
            content += f"Hashtags: {', '.join(post.hashtags)}\n"
            content += f"Character count: {post.character_count}\n\n"
        
        response = ContentResponse(
            content_id=f"social_{request.incident_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            content_type="social_media",
            title=f"Social Media Posts - {incident_type.title()}",
            content=content,
            metadata={
                "severity": request.severity,
                "tone": "transparent",
                "target_audience": request.target_audience,
                "word_count": len(content.split()),
                "estimated_read_time": "1 minute",
                "posts": [post.dict() for post in posts],
                "platforms": platforms
            },
            generated_at=datetime.now(),
            confidence_score=0.85,
            suggested_revisions=[
                "Add status page URL",
                "Consider adding image/graphic",
                "Review hashtags for appropriateness"
            ],
            legal_flags=[
                "Ensure no admission of liability",
                "Verify factual accuracy"
            ],
            approval_required=True
        )
        
        logger.info("Social media content generated successfully", content_id=response.content_id)
        return response.dict()
        
    except Exception as e:
        logger.error("Failed to generate social media content", error=str(e), incident_id=request_data.get("incident_id"))
        raise

def _generate_user_impact_section(self, request: ContentRequest) -> str:
    """Generate user impact section based on incident facts."""
    severity = request.severity
    affected_users = request.incident_facts.get("affected_users", "some users")
    
    if severity in ["high", "critical"]:
        return f"We understand this {request.incident_facts.get('incident_type', 'issue')} is causing significant disruption for {affected_users}. We are prioritizing the restoration of critical services and will provide regular updates on our progress."
    else:
        return f"This {request.incident_facts.get('incident_type', 'issue')} may be affecting {affected_users}. We are working to resolve this quickly and minimize any disruption to your experience."

def _generate_impact_summary(self, request: ContentRequest) -> str:
    """Generate impact summary for internal memo."""
    severity = request.severity
    affected_systems = request.incident_facts.get("affected_systems", [])
    
    if severity in ["high", "critical"]:
        return f"Significant impact on {', '.join(affected_systems) if affected_systems else 'core systems'}. Customer-facing services may be degraded or unavailable."
    elif severity == "medium":
        return f"Moderate impact on {', '.join(affected_systems) if affected_systems else 'some systems'}. Some customers may experience delays or issues."
    else:
        return f"Limited impact on {', '.join(affected_systems) if affected_systems else 'non-critical systems'}. Minimal customer impact expected."
