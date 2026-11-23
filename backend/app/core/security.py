from datetime import datetime, timedelta
from typing import Any, Union, Optional
from jose import jwt
import bcrypt
import hashlib
from app.core.config import settings

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        # Standard bcrypt
        if hashed_password.startswith("$2b$") or hashed_password.startswith("$2a$"):
            return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
        
        # Fallback salt$hash format
        if hashed_password.startswith("sha256$"):
            _, salt, h = hashed_password.split("$", 2)
            return hashlib.sha256((salt + plain_password).encode("utf-8")).hexdigest() == h
        return False
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    try:
        # Standard bcrypt
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")
    except Exception:
        import secrets
        salt = secrets.token_hex(8)
        h = hashlib.sha256((salt + password).encode("utf-8")).hexdigest()
        return f"sha256${salt}${h}"

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
