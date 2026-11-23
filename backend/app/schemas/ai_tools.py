from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class ConceptExplainRequest(BaseModel):
    concept: str
    subject: Optional[str] = "General"
    level: Optional[str] = "beginner"  # beginner, intermediate, advanced
    language: Optional[str] = "english"  # english, hindi
    include_examples: Optional[bool] = True
    include_code_or_math: Optional[bool] = False

class SummarizeRequest(BaseModel):
    document_id: Optional[int] = None
    custom_text: Optional[str] = None
    summary_type: Optional[str] = "bullet_points"  # bullet_points, chapter_wise, quick_revision, formulas_definitions
    max_length: Optional[str] = "medium"  # short, medium, comprehensive

class RagQueryRequest(BaseModel):
    question: str
    document_ids: Optional[List[int]] = None  # query across specific documents or all
    learning_mode: Optional[str] = "exam_prep"  # beginner, detailed, exam_prep, quick_revision
    top_k: Optional[int] = 4
