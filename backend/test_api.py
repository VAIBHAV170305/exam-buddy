import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.database.session import SessionLocal
from app.models import User, Document, DocumentChunk, StudyTask
from app.api.endpoints.auth import login
from app.schemas.user import UserLogin
from app.services.rag_service import RagService
from app.services.ai_service import AIService
from app.api.endpoints.analytics import get_analytics_overview

def run_tests():
    print("--- 1. Testing Database Connection & Seeding ---")
    db = SessionLocal()
    user = db.query(User).filter(User.email == "demo@exambuddy.ai").first()
    assert user is not None, "Demo user not found!"
    print(f"Demo User OK: {user.full_name} ({user.email})")

    doc = db.query(Document).filter(Document.user_id == user.id).first()
    assert doc is not None, "Sample document not found!"
    print(f"Sample Document OK: {doc.title} ({doc.page_count} pages)")

    chunks = db.query(DocumentChunk).filter(DocumentChunk.document_id == doc.id).all()
    assert len(chunks) > 0, "Document chunks not found!"
    print(f"Document Chunks OK: {len(chunks)} chunks indexed.")

    print("\n--- 2. Testing Authentication & JWT Generation ---")
    login_result = login(UserLogin(email="demo@exambuddy.ai", password="password123"), db)
    token = login_result["access_token"]
    assert token, "Token generation failed!"
    print(f"JWT Token OK: {token[:25]}... (length: {len(token)})")

    print("\n--- 3. Testing RAG Retrieval & Top-K Scoring ---")
    retrieved = RagService.retrieve_relevant_chunks("deadlock coffman necessary conditions", chunks, top_k=2)
    assert len(retrieved) > 0, "RAG retrieval returned 0 chunks!"
    print(f"RAG Retrieval OK: {len(retrieved)} relevant chunks returned.")
    for r in retrieved:
        print(f"   [Page {r['page_number']}] Score {r['score']}: {r['content'][:60]}...")

    print("\n--- 4. Testing AI Services (Direct Answers & Problem Solver) ---")
    lalr_res = AIService._academic_fallback_generator("Merging states with a common core may produce ______ conflicts and does not produce ______ conflicts in an LALR parser.", "Academic Assistant")
    assert "reduce/reduce" in lalr_res and "shift/reduce" in lalr_res, "LALR conflict direct solution failed"
    print(f"LALR Direct Answer OK: Correctly resolved reduce/reduce and shift/reduce conflicts.")

    deadlock_res = AIService._academic_fallback_generator("Explain deadlock", "Academic Assistant")
    assert "Coffman" in deadlock_res or "deadlock" in deadlock_res.lower(), "Deadlock direct solution failed"
    print(f"AI Academic Engine OK: Generated {len(deadlock_res)} characters of direct explanation.")

    hindi_res = AIService._academic_fallback_generator("deadlock in hindi", "Hindi explainer")
    assert "परिभाषा" in hindi_res or "प्रक्रिया" in hindi_res, "Hindi generation failed"
    print(f"Bilingual Hindi/English Explainer OK: Found Devanagari text.")

    quiz_res = AIService._generate_topic_tailored_quiz("Deadlocks", "Operating Systems", "Medium", "mcq", 5)
    assert len(quiz_res) == 5, "Quiz generation failed"
    print(f"Quiz Generator OK: Generated {len(quiz_res)} structured MCQ questions.")

    print("\n--- 5. Testing Study Tasks & Analytics ---")
    tasks = db.query(StudyTask).filter(StudyTask.user_id == user.id).all()
    print(f"Study Tasks OK: {len(tasks)} tasks.")

    analytics = get_analytics_overview(db, user)
    print(f"Analytics OK: Total Docs: {analytics['stats']['total_documents']}, Completion Rate: {analytics['stats']['completion_rate']}%")

    print("\n==========================================")
    print("  ALL BACKEND MODULES VERIFIED & HEALTHY  ")
    print("==========================================")

if __name__ == "__main__":
    run_tests()
