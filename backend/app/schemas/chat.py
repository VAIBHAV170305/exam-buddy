from pydantic import BaseModel
from typing import Optional, List, Any, Dict
from datetime import datetime

class MessageBase(BaseModel):
    role: str
    content: str
    learning_mode: Optional[str] = "detailed"
    citations_json: Optional[str] = None

class MessageOut(MessageBase):
    id: int
    conversation_id: int
    created_at: datetime
    citations: Optional[List[Dict[str, Any]]] = None

    class Config:
        from_attributes = True

class ConversationBase(BaseModel):
    title: str
    module_type: Optional[str] = "assistant"

class ConversationCreate(ConversationBase):
    pass

class ConversationOut(ConversationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    messages: List[MessageOut] = []

    class Config:
        from_attributes = True

class AskQuestionRequest(BaseModel):
    conversation_id: Optional[int] = None
    question: str
    learning_mode: Optional[str] = "detailed"  # beginner, detailed, exam_prep, quick_revision
    document_ids: Optional[List[int]] = None   # if questioning specific notes/PDFs
    subject: Optional[str] = None
