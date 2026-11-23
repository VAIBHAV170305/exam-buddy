import React, { Component } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DataNoticeBanner from './components/DataNoticeBanner';

// Functional Pages
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import NotesManager from './pages/NotesManager';
import AiAssistant from './pages/AiAssistant';
import ConceptExplainer from './pages/ConceptExplainer';
import NotesSummarizer from './pages/NotesSummarizer';
import QuestionGenerator from './pages/QuestionGenerator';
import AnswerEvaluator from './pages/AnswerEvaluator';
import PdfTutorRag from './pages/PdfTutorRag';
import StudyPlanner from './pages/StudyPlanner';
import PerformanceView from './pages/PerformanceView';
import Profile from './pages/Profile';

// Legal & Compliance Pages (Renamed to prevent Brave Shield / EasyPrivacy URL-blocking)
import LegalPrivacy from './pages/LegalPrivacy';
import LegalTerms from './pages/LegalTerms';
import LegalStorage from './pages/LegalStorage';
import LegalRefunds from './pages/LegalRefunds';

// Resilient Error Boundary to completely prevent white screen crashes
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Exam Buddy Application Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <h1 className="text-xl font-bold text-white">Application Encountered an Issue</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Exam Buddy recovered from an unexpected client error. Click below to continue learning.
            </p>
            <div className="pt-2 flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-xl transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Master Layout with Sidebar, Navbar, and Content Outlet (Footer only on main pages)
function MainLayout() {
  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main id="main-content" className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          {/* Global Notice Banner */}
          <DataNoticeBanner />

          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Public Legal Compliance Routes */}
            <Route path="/privacy" element={<LegalPrivacy />} />
            <Route path="/privacy-policy" element={<LegalPrivacy />} />
            <Route path="/terms" element={<LegalTerms />} />
            <Route path="/terms-and-conditions" element={<LegalTerms />} />
            <Route path="/cookie-policy" element={<LegalStorage />} />
            <Route path="/cookies" element={<LegalStorage />} />
            <Route path="/refund-policy" element={<LegalRefunds />} />
            <Route path="/refunds" element={<LegalRefunds />} />

            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />

            {/* Authenticated Workspace with MainLayout and Outlet */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="notes" element={<NotesManager />} />
              <Route path="assistant" element={<AiAssistant />} />
              <Route path="explainer" element={<ConceptExplainer />} />
              <Route path="summarizer" element={<NotesSummarizer />} />
              <Route path="questions" element={<QuestionGenerator />} />
              <Route path="evaluator" element={<AnswerEvaluator />} />
              <Route path="pdf-tutor" element={<PdfTutorRag />} />
              <Route path="planner" element={<StudyPlanner />} />
              <Route path="performance" element={<PerformanceView />} />
              <Route path="analytics" element={<PerformanceView />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Global Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
