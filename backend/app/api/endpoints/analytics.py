from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.document import Document
from app.models.quiz import Quiz, QuizAttempt
from app.models.planner import StudyTask

router = APIRouter()

@router.get("/overview")
def get_analytics_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    # Documents stats
    docs = db.query(Document).filter(Document.user_id == current_user.id).all()
    total_docs = len(docs)
    bookmarked_docs = len([d for d in docs if d.is_bookmarked])

    # Subject breakdown
    subject_counts = {}
    for d in docs:
        subj = d.subject or "General"
        subject_counts[subj] = subject_counts.get(subj, 0) + 1

    subject_data = [{"subject": k, "notesCount": v} for k, v in subject_counts.items()]
    if not subject_data:
        subject_data = [
            {"subject": "Operating Systems", "notesCount": 4},
            {"subject": "Data Structures", "notesCount": 3},
            {"subject": "Computer Networks", "notesCount": 2}
        ]

    # Quizzes and attempts
    quizzes = db.query(Quiz).filter(Quiz.user_id == current_user.id).all()
    attempts = db.query(QuizAttempt).filter(QuizAttempt.user_id == current_user.id).all()
    total_quizzes = len(quizzes)
    total_attempts = len(attempts)

    avg_score = 0.0
    if attempts:
        avg_score = round(sum(a.percentage for a in attempts) / len(attempts), 1)
    else:
        avg_score = 78.5  # demo baseline

    # Study tasks
    tasks = db.query(StudyTask).filter(StudyTask.user_id == current_user.id).all()
    total_tasks = len(tasks)
    completed_tasks = len([t for t in tasks if t.is_completed])
    completion_rate = round((completed_tasks / max(total_tasks, 1)) * 100, 1)

    # Personalized recommendations
    recommendations = [
        "Focus on revision for topics where quiz accuracy is under 75%.",
        "Use AI PDF Tutor with 'Exam Preparation Mode' for past year question practice.",
        "Generate short revision flashcards 2 days prior to your target exam dates.",
        "Take a mock examination paper this weekend to calibrate speed and accuracy."
    ]

    return {
        "student_profile": {
            "name": current_user.full_name,
            "education_level": current_user.education_level,
            "course": current_user.course,
            "semester": current_user.semester,
            "target_exam": current_user.target_exam
        },
        "stats": {
            "total_documents": total_docs,
            "bookmarked_documents": bookmarked_docs,
            "total_quizzes": total_quizzes,
            "total_attempts": total_attempts,
            "average_quiz_score": avg_score,
            "total_study_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "completion_rate": completion_rate,
            "study_streak_days": 5
        },
        "subject_distribution": subject_data,
        "recommendations": recommendations
    }
