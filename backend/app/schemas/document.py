from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DocumentBase(BaseModel):
    title: str
    subject: Optional[str] = "General"
    category_folder: Optional[str] = "Default"
    is_bookmarked: Optional[bool] = False

class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    subject: Optional[str] = None
    category_folder: Optional[str] = None
    is_bookmarked: Optional[bool] = None

class DocumentChunkOut(BaseModel):
    id: int
    chunk_index: int
    page_number: int
    content: str

    class Config:
        from_attributes = True

class DocumentOut(DocumentBase):
    id: int
    user_id: int
    file_type: str
    file_name: str
    file_size: int
    page_count: int
    is_bookmarked: bool
    summary: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DocumentDetailOut(DocumentOut):
    extracted_text: Optional[str] = None
    chunks: List[DocumentChunkOut] = []
