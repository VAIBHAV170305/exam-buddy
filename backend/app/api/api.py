from fastapi import APIRouter
from app.api.endpoints import (
    auth,
    documents,
    assistant,
    explainer,
    summarizer,
    questions,
    rag,
    planner,
    analytics,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & Profile"])
api_router.include_router(documents.router, prefix="/documents", tags=["Smart Notes Management"])
api_router.include_router(assistant.router, prefix="/assistant", tags=["AI Academic Assistant"])
api_router.include_router(explainer.router, prefix="/explainer", tags=["AI Concept Explainer"])
api_router.include_router(summarizer.router, prefix="/summarizer", tags=["AI Notes Summarizer"])
api_router.include_router(questions.router, prefix="/questions", tags=["AI Examination Question Generator"])
api_router.include_router(rag.router, prefix="/rag", tags=["AI PDF Tutor (RAG)"])
api_router.include_router(planner.router, prefix="/planner", tags=["Personalized Study Planner"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Performance Analytics"])
api_router.include_router(analytics.router, prefix="/performance", tags=["Performance Metrics"])
api_router.include_router(analytics.router, prefix="/insights", tags=["Performance Insights"])
