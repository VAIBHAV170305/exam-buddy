from datetime import datetime
from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.planner import StudyTask
from app.schemas.planner import StudyTaskCreate, StudyTaskUpdate, StudyTaskOut

router = APIRouter()

@router.get("/tasks", response_model=List[StudyTaskOut])
def get_study_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    return db.query(StudyTask).filter(StudyTask.user_id == current_user.id).order_by(StudyTask.target_date.asc()).all()

@router.post("/tasks", response_model=StudyTaskOut)
def create_study_task(
    task_in: StudyTaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    task = StudyTask(
        user_id=current_user.id,
        title=task_in.title,
        subject=task_in.subject or "General",
        target_date=task_in.target_date or datetime.utcnow(),
        duration_minutes=task_in.duration_minutes or 45,
        priority=task_in.priority or "medium",
        category=task_in.category or "study"
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.put("/tasks/{task_id}", response_model=StudyTaskOut)
def update_study_task(
    task_id: int,
    task_update: StudyTaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    task = db.query(StudyTask).filter(StudyTask.id == task_id, StudyTask.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Study task not found")

    if task_update.title is not None:
        task.title = task_update.title
    if task_update.subject is not None:
        task.subject = task_update.subject
    if task_update.target_date is not None:
        task.target_date = task_update.target_date
    if task_update.duration_minutes is not None:
        task.duration_minutes = task_update.duration_minutes
    if task_update.priority is not None:
        task.priority = task_update.priority
    if task_update.category is not None:
        task.category = task_update.category
    if task_update.is_completed is not None:
        task.is_completed = task_update.is_completed
        task.completed_at = datetime.utcnow() if task_update.is_completed else None

    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.delete("/tasks/{task_id}")
def delete_study_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    task = db.query(StudyTask).filter(StudyTask.id == task_id, StudyTask.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Study task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}
