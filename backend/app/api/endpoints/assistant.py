from typing import List, Any
import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.chat import Conversation, Message
from app.models.document import Document
from app.schemas.chat import AskQuestionRequest, ConversationOut, MessageOut
from app.services.ai_service import AIService

router = APIRouter()

@router.post("/chat")
async def chat_with_assistant(
    request: AskQuestionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    # Retrieve or create conversation
    conv = None
    if request.conversation_id:
        conv = db.query(Conversation).filter(
            Conversation.id == request.conversation_id,
            Conversation.user_id == current_user.id
        ).first()

    if not conv:
        # Generate initial title from first few words of question
        title = request.question.strip()[:40] + ("..." if len(request.question) > 40 else "")
        conv = Conversation(
            user_id=current_user.id,
            title=title,
            module_type="assistant"
        )
        db.add(conv)
        db.commit()
        db.refresh(conv)

    # Save user message
    user_msg = Message(
        conversation_id=conv.id,
        role="user",
        content=request.question,
        learning_mode=request.learning_mode or "detailed"
    )
    db.add(user_msg)
    db.commit()

    # Load recent conversation history
    past_messages = db.query(Message).filter(Message.conversation_id == conv.id).order_by(Message.created_at.asc()).all()
    history = [{"role": m.role, "content": m.content} for m in past_messages]

    # Optional context from selected documents
    context_text = ""
    if request.document_ids:
        docs = db.query(Document).filter(
            Document.id.in_(request.document_ids),
            Document.user_id == current_user.id
        ).all()
        for doc in docs:
            if doc.extracted_text:
                context_text += f"\n--- {doc.title} ---\n{doc.extracted_text[:2500]}\n"

    # Generate AI response
    ai_response_text = await AIService.generate_chat_response(
        question=request.question,
        conversation_history=history,
        learning_mode=request.learning_mode or "detailed",
        context_docs=context_text if context_text else None
    )

    # Save assistant message
    asst_msg = Message(
        conversation_id=conv.id,
        role="assistant",
        content=ai_response_text,
        learning_mode=request.learning_mode or "detailed"
    )
    db.add(asst_msg)
    db.commit()
    db.refresh(asst_msg)

    return {
        "conversation_id": conv.id,
        "message": {
            "id": asst_msg.id,
            "role": asst_msg.role,
            "content": asst_msg.content,
            "learning_mode": asst_msg.learning_mode,
            "created_at": asst_msg.created_at
        }
    }

@router.get("/conversations", response_model=List[ConversationOut])
def list_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    return db.query(Conversation).filter(
        Conversation.user_id == current_user.id,
        Conversation.module_type == "assistant"
    ).order_by(Conversation.updated_at.desc()).all()

@router.get("/conversations/{conversation_id}", response_model=ConversationOut)
def get_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    return conv

@router.delete("/conversations/{conversation_id}")
def delete_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    db.delete(conv)
    db.commit()
    return {"message": "Conversation deleted successfully"}
