# 🎓 EXAM BUDDY
### *Your Personal AI-Powered Learning & Examination Companion*

[![Python](https://img.shields.io/badge/Python-3.14-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite%20%2F%20PostgreSQL-003B57?logo=sqlite&logoColor=white)](https://sqlite.org/)

---

## 🌟 Project Vision

**Exam Buddy** is an AI-powered educational and examination preparation companion designed to empower students across their learning lifecycle. It merges smart document processing, retrieval-augmented generation (RAG) over lecture materials, interactive step-by-step academic explanations, examination question generators, objective answer evaluators, and personalized study planners into an unified workspace.

---

## 🚀 Module Overview & Architecture

| Module | Status | Description |
|---|---|---|
| **Public Landing Page** | ✅ Implemented | Modern dark-theme landing page with feature showcase, live preview, and FAQ |
| **Student Auth & Profile** | ✅ Implemented | Secure JWT auth, course, semester, target exam settings |
| **Smart Notes Management** | ✅ Implemented | Multi-file upload (PDF, DOCX, TXT), categorization, bookmarks, preview, search |
| **AI Academic Assistant** | ✅ Implemented | Multi-turn chat with 4 AI Learning Modes & direct problem-solving |
| **AI Concept Explainer** | ✅ Implemented | Analogies, beginner vs. advanced, bilingual English & Hindi explanations |
| **AI Notes Summarizer** | ✅ Implemented | Bullet points, chapter digests, quick revision sheets, formula tables |
| **Exam Question Generator** | ✅ Implemented | MCQs, short/long questions, mock papers, interactive test-taking & instant grading |
| **AI Answer Evaluator** | ✅ Implemented | Rubric grading, missing keyword analysis & scoring tips |
| **AI PDF Tutor (RAG)** | ✅ Implemented | Semantic retrieval over uploaded notes with verified source & page citations |
| **AI Voice Assistant** | ✅ Implemented | Text-to-speech audio narration for explanations & notes reading |
| **Flashcards & Revision** | ✅ Implemented | High-yield revision extracts & concept flashcards |
| **Study Planner** | ✅ Implemented | Daily targets, task checklist, priority tagging, duration tracking |
| **Performance Analytics** | ✅ Implemented | Exam readiness scorecards, subject distribution, AI study directives |

---

## 💡 High-Value Capabilities Built-In

1. **Answer Evaluation System**:
   Students submit handwritten or typed exam answers; the AI grades them against marking schemes, pinpoints matched vs. missing keywords, evaluates explanation depth, and delivers actionable tips to secure full marks.

2. **AI Learning Modes**:
   - 🐣 **Beginner Mode**: Everyday analogies, intuitive vocabulary, zero jargon.
   - 📖 **Detailed Explanation Mode**: Formal mechanisms, theoretical background, step-by-step rigor.
   - 🎯 **Exam Preparation Mode**: High-yield points, marking schemes, definitions, and trap avoidance.
   - ⚡ **Quick Revision Mode**: Rapid bullet summaries, memory mnemonics, and formula sheets.

3. **Citation-Based AI Responses (RAG)**:
   Every answer produced by the PDF Tutor references specific document excerpts and displays page numbers (e.g. `[Doc: OS_Deadlocks_Chapter7.txt, Page: 1]`) with relevance matching scores.

---

## 🛠️ Project Architecture

```
Exam Buddy/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/
│   │   │   │   ├── auth.py         # JWT authentication & student profile
│   │   │   │   ├── documents.py    # Notes upload, storage, indexing & search
│   │   │   │   ├── assistant.py    # Academic chat & conversation history
│   │   │   │   ├── explainer.py    # Concept explainer (English + Hindi)
│   │   │   │   ├── summarizer.py   # Notes digest & formula extractors
│   │   │   │   ├── questions.py    # Question generator & answer evaluator
│   │   │   │   ├── rag.py          # Grounded RAG query engine
│   │   │   │   ├── planner.py      # Study task scheduler & goals
│   │   │   │   └── analytics.py    # Performance metrics & readiness
│   │   │   └── api.py              # Aggregated API router
│   │   ├── core/
│   │   │   ├── config.py           # App settings & env loading
│   │   │   └── security.py         # Bcrypt hashing & JWT logic
│   │   ├── database/
│   │   │   └── session.py          # SQLAlchemy session & SQLite/Postgres engine
│   │   ├── models/                 # User, Document, Chunk, Chat, Quiz, Task models
│   │   ├── schemas/                # Pydantic schemas
│   │   ├── services/
│   │   │   ├── doc_service.py      # Multi-format document parser & chunker
│   │   │   ├── ai_service.py       # AI academic engine (Gemini & Fallback)
│   │   │   └── rag_service.py      # Vector & TF-IDF similarity engine
│   │   └── main.py                 # FastAPI application & startup seeder
│   ├── uploads/                    # User notes storage directory
│   ├── test_api.py                 # Integration test suite
│   ├── requirements.txt            # Python dependencies
│   └── .env                        # Environment configurations
│
└── frontend/
    ├── public/
    └── src/
        ├── components/             # Sidebar, Navbar, DocViewer, Modals
        ├── context/                # AuthContext
        ├── pages/
        │   ├── Dashboard.jsx
        │   ├── Login.jsx & Register.jsx
        │   ├── NotesManager.jsx
        │   ├── AiAssistant.jsx
        │   ├── ConceptExplainer.jsx
        │   ├── NotesSummarizer.jsx
        │   ├── QuestionGenerator.jsx
        │   ├── AnswerEvaluator.jsx
        │   ├── PdfTutorRag.jsx
        │   ├── StudyPlanner.jsx
        │   ├── PerformanceAnalytics.jsx
        │   └── Profile.jsx
        ├── services/api.js         # Axios API client
        ├── App.jsx                 # Routes & layout
        └── main.jsx
```

---

## ⚡ Quick Start Guide

### 1. Backend Setup

```powershell
cd backend

# (Optional) Set your Gemini API Key in .env for live Gemini 2.5 Flash model
# GEMINI_API_KEY="your-api-key"

# Run integration tests to verify all 7 subsystems:
python test_api.py

# Start the FastAPI server:
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

* API Docs will be live at: [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs)

### 2. Frontend Setup

```powershell
cd frontend

# Install dependencies:
npm install

# Start the Vite development server:
npm run dev
```

* Open your browser at: [http://localhost:5173](http://localhost:5173)

### 3. Demo Credentials
An initial demo account is automatically seeded for immediate out-of-the-box exploration:
- **Email:** `demo@exambuddy.ai`
- **Password:** `password123`
- *(Or click the "Instant Demo Sign In" button on the login screen!)*

---

## 🧪 Verification & Testing

To run the automated backend test suite covering all modules:
```powershell
python backend/test_api.py
```
Outputs:
```
--- 1. Testing Database Connection & Seeding ---
Demo User OK: Aarav Sharma (demo@exambuddy.ai)
Sample Document OK: OS Deadlocks & Synchronization (Chapter 7) (2 pages)
Document Chunks OK: 4 chunks indexed.

--- 2. Testing Authentication & JWT Generation ---
JWT Token OK: eyJhbGciOiJIUzI1NiIsInR5c...

--- 3. Testing RAG Retrieval & Top-K Scoring ---
RAG Retrieval OK: 2 relevant chunks returned with page citations.

--- 4. Testing AI Services (Fallback & Formatting) ---
AI Academic Engine OK: Generated structured explanation.
Bilingual Hindi/English Explainer OK: Found Devanagari text.
Quiz Generator OK: Structured JSON response returned.
Answer Evaluation Engine OK: Parsed evaluation rubric.

--- 5. Testing Study Tasks & Analytics ---
Study Tasks OK: 2 tasks.
Analytics OK: Total Docs: 1, Completion Rate: 50.0%
==========================================
  ALL BACKEND MODULES VERIFIED & HEALTHY  
==========================================
```
