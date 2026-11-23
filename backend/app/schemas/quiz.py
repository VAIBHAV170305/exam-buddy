from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class QuizQuestionItem(BaseModel):
    id: int
    question: str
    question_type: str = "mcq"  # mcq, short, long
    options: Optional[List[str]] = None
    correct_answer: Optional[str] = None
    explanation: Optional[str] = None
    marks: Optional[int] = 1

class QuizGenerateRequest(BaseModel):
    subject: str = "General"
    topic: str
    difficulty: str = "Medium"  # Easy, Medium, Hard
    question_type: str = "mcq"  # mcq, short_answer, long_answer, mock_paper
    number_of_questions: int = 5
    document_id: Optional[int] = None

class QuizOut(BaseModel):
    id: int
    user_id: int
    title: str
    subject: str
    topic: Optional[str] = None
    difficulty: str
    question_type: str
    questions: List[Dict[str, Any]]
    created_at: datetime

    class Config:
        from_attributes = True

class QuizSubmitRequest(BaseModel):
    quiz_id: int
    # mapping of question_id/index to student answer text
    answers: Dict[str, str]

class AnswerEvaluationRequest(BaseModel):
    question: str
    model_answer: Optional[str] = None
    student_answer: str
    subject: Optional[str] = None
    max_marks: Optional[int] = 10
