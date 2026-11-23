import os
from typing import List, Union
from pydantic_settings import BaseSettings

# Absolute path to backend directory
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if os.path.basename(BACKEND_DIR) != "backend":
    BACKEND_DIR = os.path.join(BACKEND_DIR, "backend")

# Locate .env whether run from root or backend
ENV_FILE_PATH = os.path.join(BACKEND_DIR, ".env")
if not os.path.exists(ENV_FILE_PATH):
    ENV_FILE_PATH = os.path.join(os.path.dirname(BACKEND_DIR), ".env")

DB_PATH = os.path.join(BACKEND_DIR, "exam_buddy.db").replace("\\", "/")

class Settings(BaseSettings):
    PROJECT_NAME: str = "Exam Buddy API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "exam_buddy_super_secret_jwt_key_for_development_and_testing"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database (always resolves to backend/exam_buddy.db)
    DATABASE_URL: str = f"sqlite:///{DB_PATH}"
    
    # Storage
    UPLOAD_DIR: str = os.path.join(BACKEND_DIR, "uploads")
    
    # AI Engine
    GEMINI_API_KEY: str = ""
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://localhost:8001",
        "http://127.0.0.1:8001",
        "*"
    ]

    class Config:
        env_file = ENV_FILE_PATH
        case_sensitive = True
        extra = "allow"

settings = Settings()

# Normalize relative sqlite path to absolute backend path so both root and backend CWD use identical DB
if settings.DATABASE_URL.startswith("sqlite:///") and not os.path.isabs(settings.DATABASE_URL.replace("sqlite:///", "")):
    rel = settings.DATABASE_URL.replace("sqlite:///", "").lstrip("./").lstrip(".\\")
    settings.DATABASE_URL = f"sqlite:///{os.path.join(BACKEND_DIR, rel).replace('\\', '/')}"

if not os.path.isabs(settings.UPLOAD_DIR):
    settings.UPLOAD_DIR = os.path.join(BACKEND_DIR, settings.UPLOAD_DIR.lstrip("./").lstrip(".\\"))

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
