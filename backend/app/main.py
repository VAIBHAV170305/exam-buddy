import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.core.config import settings
from app.database.session import engine, Base, SessionLocal
from app.models import User, Document, DocumentChunk, StudyTask, Quiz
from app.core.security import get_password_hash
from app.api.api import api_router
from app.services.doc_service import DocumentService

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for Exam Buddy — Your Personal AI-Powered Learning & Examination Companion",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Seed database on startup if empty
@app.on_event("startup")
def seed_default_data():
    db = SessionLocal()
    try:
        demo_user = db.query(User).filter(User.email == "demo@exambuddy.ai").first()
        if not demo_user:
            demo_user = User(
                email="demo@exambuddy.ai",
                hashed_password=get_password_hash("password123"),
                full_name="Aarav Sharma",
                education_level="Undergraduate",
                course="B.Tech Computer Science & Engineering",
                semester="Semester 5",
                target_exam="University Final Examination & GATE",
                bio="Passionate computer science student aiming for top scores in Systems and Algorithms."
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)

            # Seed sample notes on Operating Systems Deadlocks
            sample_os_text = (
                "OPERATING SYSTEMS: DEADLOCK AND SYNCHRONIZATION\n\n"
                "Chapter 7: Deadlocks\n"
                "A deadlock is a situation where a set of processes are blocked because each process is holding a resource "
                "and waiting for another resource held by some other process.\n\n"
                "Necessary Conditions for Deadlock (Coffman Conditions):\n"
                "1. Mutual Exclusion: At least one resource must be held in a non-shareable mode.\n"
                "2. Hold and Wait: A process must be concurrently holding at least one resource and requesting additional resources.\n"
                "3. No Preemption: Resources cannot be preempted; a resource can be released only voluntarily by the process holding it.\n"
                "4. Circular Wait: A closed chain of processes exists such that each process holds at least one resource needed by the next process in the chain.\n\n"
                "Deadlock Handling Strategies:\n"
                "- Deadlock Prevention: Invalidate at least one of the four necessary conditions.\n"
                "- Deadlock Avoidance: Use Banker's Algorithm by Dijkstra to ensure the system never enters an unsafe state.\n"
                "- Deadlock Detection & Recovery: Allow deadlocks to occur, detect cycle via Resource Allocation Graph (RAG), and recover by process termination or resource preemption.\n"
                "- Ignorance (Ostrich Algorithm): Stick head in the sand; assume deadlocks never occur (used in modern general OS like Linux/Windows when cost of avoidance exceeds rare deadlock events)."
            )

            user_dir = os.path.join(settings.UPLOAD_DIR, str(demo_user.id))
            os.makedirs(user_dir, exist_ok=True)
            sample_file_path = os.path.join(user_dir, "OS_Deadlocks_Chapter7.txt")
            with open(sample_file_path, "w", encoding="utf-8") as f:
                f.write(sample_os_text)

            sample_doc = Document(
                user_id=demo_user.id,
                title="OS Deadlocks & Synchronization (Chapter 7)",
                subject="Operating Systems",
                category_folder="Core Lectures",
                file_type="txt",
                file_name="OS_Deadlocks_Chapter7.txt",
                file_path=sample_file_path,
                file_size=len(sample_os_text),
                page_count=2,
                is_bookmarked=True,
                extracted_text=sample_os_text,
                summary="Comprehensive study material covering Coffman's 4 conditions for deadlock, Banker's Algorithm, and Deadlock Handling Strategies."
            )
            db.add(sample_doc)
            db.commit()
            db.refresh(sample_doc)

            # Add chunks for sample document
            chunks = DocumentService.chunk_document([
                {"page_number": 1, "text": sample_os_text[:800]},
                {"page_number": 2, "text": sample_os_text[800:]}
            ])
            for c in chunks:
                chunk_obj = DocumentChunk(
                    document_id=sample_doc.id,
                    chunk_index=c["chunk_index"],
                    page_number=c["page_number"],
                    content=c["content"]
                )
                db.add(chunk_obj)

            # Seed sample study tasks
            from datetime import datetime, timedelta
            task1 = StudyTask(
                user_id=demo_user.id,
                title="Review Operating Systems Banker's Algorithm",
                subject="Operating Systems",
                target_date=datetime.utcnow() + timedelta(days=1),
                duration_minutes=45,
                priority="high",
                category="study",
                is_completed=False
            )
            task2 = StudyTask(
                user_id=demo_user.id,
                title="Practice 10 Deadlock Avoidance MCQs",
                subject="Operating Systems",
                target_date=datetime.utcnow() + timedelta(days=2),
                duration_minutes=30,
                priority="medium",
                category="exam_practice",
                is_completed=True,
                completed_at=datetime.utcnow()
            )
            db.add(task1)
            db.add(task2)
            db.commit()
    finally:
        db.close()

# API Info & Health endpoints
@app.get("/api")
@app.get("/api/v1")
def api_info():
    return {
        "message": "Welcome to Exam Buddy API",
        "version": "1.0.0",
        "docs_url": f"{settings.API_V1_STR}/docs",
        "status": "online"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "Exam Buddy"}

# Serve Frontend SPA from dist if built
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/")
    def serve_index():
        return FileResponse(os.path.join(frontend_dist, "index.html"))

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        # Do not catch api or doc paths
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("openapi"):
            return {"error": "Not Found"}
        file_path = os.path.join(frontend_dist, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/")
    def root():
        return {
            "message": "Welcome to Exam Buddy API",
            "version": "1.0.0",
            "docs_url": f"{settings.API_V1_STR}/docs",
            "status": "online"
        }
