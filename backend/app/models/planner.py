from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, date
from app.database.session import Base

class StudyTask(Base):
    __tablename__ = "study_tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    subject = Column(String(100), default="General")
    target_date = Column(DateTime, default=datetime.utcnow)
    duration_minutes = Column(Integer, default=45)
    is_completed = Column(Boolean, default=False)
    priority = Column(String(20), default="medium")  # high, medium, low
    category = Column(String(50), default="study")  # study, revision, exam_practice, assignment
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="study_tasks")
