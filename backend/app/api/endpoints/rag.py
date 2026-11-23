from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any
from app.database.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.document import Document, DocumentChunk
from app.schemas.ai_tools import RagQueryRequest
from app.services.rag_service import RagService

router = APIRouter()

@router.post("/query")
async def query_rag_pdf_tutor(
    request: RagQueryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    # Query all user chunks or filter by specific document_ids
    chunk_query = db.query(DocumentChunk).join(Document).filter(Document.user_id == current_user.id)
    if request.document_ids:
        chunk_query = chunk_query.filter(DocumentChunk.document_id.in_(request.document_ids))

    all_chunks = chunk_query.all()
    if not all_chunks:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No uploaded documents or notes found. Please upload course material or notes first."
        )

    # Retrieve relevant chunks
    relevant_chunks = RagService.retrieve_relevant_chunks(
        query=request.question,
        chunks=all_chunks,
        top_k=request.top_k or 4
    )

    # Synthesize answer with citations
    rag_result = await RagService.answer_with_rag(
        query=request.question,
        relevant_chunks=relevant_chunks,
        learning_mode=request.learning_mode or "exam_prep"
    )

    return {
        "question": request.question,
        "learning_mode": request.learning_mode,
        "answer": rag_result["answer"],
        "citations": rag_result["citations"]
    }
