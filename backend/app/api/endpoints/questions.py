import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
from app.database.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.quiz import Quiz, QuizAttempt
from app.models.document import Document
from app.schemas.quiz import (
    QuizGenerateRequest,
    QuizOut,
    QuizSubmitRequest,
    AnswerEvaluationRequest
)
from app.services.ai_service import AIService

router = APIRouter()

@router.post("/generate", response_model=QuizOut)
async def generate_quiz(
    request: QuizGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    context_text = None
    if request.document_id:
        doc = db.query(Document).filter(
            Document.id == request.document_id,
            Document.user_id == current_user.id
        ).first()
        if doc:
            context_text = doc.extracted_text

    questions = await AIService.generate_quiz(
        topic=request.topic,
        subject=request.subject or "General",
        difficulty=request.difficulty or "Medium",
        question_type=request.question_type or "mcq",
        count=request.number_of_questions or 5,
        context_text=context_text
    )

    quiz = Quiz(
        user_id=current_user.id,
        title=f"{request.topic} - {request.difficulty} ({request.question_type.upper()})",
        subject=request.subject,
        topic=request.topic,
        difficulty=request.difficulty,
        question_type=request.question_type,
        questions_json=json.dumps(questions)
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)

    return {
        "id": quiz.id,
        "user_id": quiz.user_id,
        "title": quiz.title,
        "subject": quiz.subject,
        "topic": quiz.topic,
        "difficulty": quiz.difficulty,
        "question_type": quiz.question_type,
        "questions": questions,
        "created_at": quiz.created_at
    }

@router.get("/quizzes", response_model=List[QuizOut])
def list_quizzes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    quizzes = db.query(Quiz).filter(Quiz.user_id == current_user.id).order_by(Quiz.created_at.desc()).all()
    results = []
    for q in quizzes:
        try:
            q_list = json.loads(q.questions_json)
        except Exception:
            q_list = []
        results.append({
            "id": q.id,
            "user_id": q.user_id,
            "title": q.title,
            "subject": q.subject,
            "topic": q.topic,
            "difficulty": q.difficulty,
            "question_type": q.question_type,
            "questions": q_list,
            "created_at": q.created_at
        })
    return results

@router.post("/submit-quiz")
def submit_quiz_attempt(
    request: QuizSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    quiz = db.query(Quiz).filter(Quiz.id == request.quiz_id, Quiz.user_id == current_user.id).first()
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found")

    questions = json.loads(quiz.questions_json)
    total_points = len(questions)
    score = 0.0
    results_detail = []

    for q in questions:
        q_id = str(q.get("id"))
        correct_ans = str(q.get("correct_answer", "")).strip().upper()
        # Student submitted answer
        student_ans = str(request.answers.get(q_id, "")).strip().upper()

        is_correct = False
        if correct_ans and student_ans:
            # Check prefix match like "A" or exact match
            if student_ans == correct_ans or student_ans.startswith(correct_ans):
                is_correct = True
                score += 1.0

        results_detail.append({
            "question_id": q.get("id"),
            "question": q.get("question"),
            "student_answer": student_ans,
            "correct_answer": correct_ans,
            "is_correct": is_correct,
            "explanation": q.get("explanation")
        })

    percentage = round((score / max(total_points, 1)) * 100, 1)

    attempt = QuizAttempt(
        user_id=current_user.id,
        quiz_id=quiz.id,
        score=score,
        total_points=float(total_points),
        percentage=percentage,
        answers_json=json.dumps(request.answers),
        evaluation_json=json.dumps(results_detail)
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return {
        "attempt_id": attempt.id,
        "score": score,
        "total_points": total_points,
        "percentage": percentage,
        "results": results_detail
    }

@router.post("/evaluate-answer")
async def evaluate_student_answer(
    request: AnswerEvaluationRequest,
    current_user: User = Depends(get_current_user)
) -> Any:
    """Evaluates student's open-ended answer against criteria, keywords, and correctness."""
    evaluation = await AIService.evaluate_answer(
        question=request.question,
        student_answer=request.student_answer,
        model_answer=request.model_answer,
        subject=request.subject or "General",
        max_marks=request.max_marks or 10
    )
    return evaluation
