from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Any
from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserOut, UserLogin, Token, UserUpdate
from app.core.security import verify_password, get_password_hash, create_access_token
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name or user_in.email.split("@")[0].title(),
        education_level=user_in.education_level or "Undergraduate",
        course=user_in.course or "Computer Science",
        semester=user_in.semester or "Semester 1",
        target_exam=user_in.target_exam or "University Semester Exams",
        bio=user_in.bio
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=user.id)
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)) -> Any:
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    token = create_access_token(subject=user.id)
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)) -> Any:
    return current_user

@router.put("/profile", response_model=UserOut)
def update_profile(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    if user_update.education_level is not None:
        current_user.education_level = user_update.education_level
    if user_update.course is not None:
        current_user.course = user_update.course
    if user_update.semester is not None:
        current_user.semester = user_update.semester
    if user_update.target_exam is not None:
        current_user.target_exam = user_update.target_exam
    if user_update.bio is not None:
        current_user.bio = user_update.bio
    if user_update.password:
        current_user.hashed_password = get_password_hash(user_update.password)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/account")
def delete_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Permanently deletes student account, uploaded materials, and all associated data (DPDP Act 2023 Right to Erasure)."""
    import os
    import shutil
    from app.core.config import settings

    # Clean disk files
    user_upload_dir = os.path.join(settings.UPLOAD_DIR, str(current_user.id))
    if os.path.exists(user_upload_dir):
        try:
            shutil.rmtree(user_upload_dir)
        except Exception:
            pass

    db.delete(current_user)
    db.commit()
    return {"message": "Account and all associated personal data permanently erased in compliance with DPDP Act 2023."}
