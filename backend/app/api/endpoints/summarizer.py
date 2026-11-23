from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any
from app.database.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.document import Document
from app.schemas.ai_tools import SummarizeRequest
from app.services.ai_service import AIService

router = APIRouter()

@router.post("/summarize")
async def summarize_notes(
    request: SummarizeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    text_to_summarize = ""
    title = "Notes Summary"

    if request.document_id:
        doc = db.query(Document).filter(
            Document.id == request.document_id,
            Document.user_id == current_user.id
        ).first()
        if not doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
        text_to_summarize = doc.extracted_text or ""
        title = doc.title
    elif request.custom_text:
        text_to_summarize = request.custom_text
        title = "Pasted Study Material"
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either a document_id or custom_text must be provided."
        )

    if not text_to_summarize.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The document or text contains no readable characters to summarize."
        )

    summary = await AIService.summarize_notes(
        text=text_to_summarize,
        summary_type=request.summary_type or "bullet_points",
        title=title
    )

    # If document_id was provided, update document summary cached field
    if request.document_id:
        doc = db.query(Document).filter(Document.id == request.document_id).first()
        if doc and not doc.summary:
            doc.summary = summary[:500] + "..." if len(summary) > 500 else summary
            db.commit()

    return {
        "title": title,
        "summary_type": request.summary_type,
        "summary": summary
    }
