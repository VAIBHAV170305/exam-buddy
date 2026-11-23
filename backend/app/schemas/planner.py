from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class StudyTaskBase(BaseModel):
    title: str
    subject: Optional[str] = "General"
    target_date: Optional[datetime] = None
    duration_minutes: Optional[int] = 45
    priority: Optional[str] = "medium"  # high, medium, low
    category: Optional[str] = "study"  # study, revision, exam_practice, assignment

class StudyTaskCreate(StudyTaskBase):
    pass

class StudyTaskUpdate(BaseModel):
    title: Optional[str] = None
    subject: Optional[str] = None
    target_date: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    is_completed: Optional[bool] = None

class StudyTaskOut(StudyTaskBase):
    id: int
    user_id: int
    is_completed: bool
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
