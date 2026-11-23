from sqlalchemy import Column, Integer, String, DateTime, Text, Float, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.session import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    subject = Column(String(100), default="General")
    topic = Column(String(255), nullable=True)
    difficulty = Column(String(50), default="Medium")  # Easy, Medium, Hard
    question_type = Column(String(50), default="mcq")  # mcq, short_answer, long_answer, mock_paper
    # JSON string containing array of questions with options, answer, explanation
    questions_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="quizzes")
    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False, index=True)
    score = Column(Float, default=0.0)
    total_points = Column(Float, default=0.0)
    percentage = Column(Float, default=0.0)
    # Student's submitted answers
    answers_json = Column(Text, nullable=False)
    # AI Answer Evaluation breakdown (correctness, keyword presence, feedback)
    evaluation_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    quiz = relationship("Quiz", back_populates="attempts")
