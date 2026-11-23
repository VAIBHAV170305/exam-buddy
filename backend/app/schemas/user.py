from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    education_level: Optional[str] = "Undergraduate"
    course: Optional[str] = "Computer Science"
    semester: Optional[str] = "Semester 1"
    target_exam: Optional[str] = "University Semester Exams"
    bio: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    education_level: Optional[str] = None
    course: Optional[str] = None
    semester: Optional[str] = None
    target_exam: Optional[str] = None
    bio: Optional[str] = None
    password: Optional[str] = None

class UserOut(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class TokenPayload(BaseModel):
    sub: Optional[str] = None
