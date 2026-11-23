from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Any
from app.database.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.ai_tools import ConceptExplainRequest
from app.services.ai_service import AIService

router = APIRouter()

@router.post("/explain")
async def explain_concept(
    request: ConceptExplainRequest,
    current_user: User = Depends(get_current_user)
) -> Any:
    explanation = await AIService.explain_concept(
        concept=request.concept,
        subject=request.subject or "General",
        level=request.level or "beginner",
        language=request.language or "english",
        include_examples=request.include_examples if request.include_examples is not None else True
    )
    return {
        "concept": request.concept,
        "subject": request.subject,
        "level": request.level,
        "language": request.language,
        "explanation": explanation
    }
