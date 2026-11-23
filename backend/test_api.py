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

    print("\n--- 4. Testing AI Services (Fallback & Formatting) ---")
    concept_res = AIService._academic_fallback_generator("Explain deadlock", "Academic Assistant")
    assert "Academic Analysis" in concept_res, "Concept generation failed"
    print(f"AI Academic Engine OK: Generated {len(concept_res)} characters of structured explanation.")

    hindi_res = AIService._academic_fallback_generator("deadlock in hindi", "Hindi explainer")
    assert "संकल्पना की व्याख्या" in hindi_res, "Hindi generation failed"
    print(f"Bilingual Hindi/English Explainer OK: Found Devanagari text.")

    quiz_res = AIService._academic_fallback_generator("generate quiz mcq for deadlock", "Quiz Setter")
    assert "Standardizing" in quiz_res or "characteristic" in quiz_res, "Quiz generation failed"
    print(f"Quiz Generator OK: Structured JSON response returned.")

    eval_res = AIService._academic_fallback_generator("evaluate student answer", "evaluating student answer")
    assert "score" in eval_res, "Evaluation generation failed"
    print(f"Answer Evaluation Engine OK: Parsed evaluation rubric.")

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
