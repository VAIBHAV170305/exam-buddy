import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI, documentsAPI } from '../services/api';
import Footer from '../components/Footer';
import {
  FolderOpen,
  Bot,
  Sparkles,
  FileText,
  HelpCircle,
  BookOpenCheck,
  CalendarCheck2,
  BarChart3,
  Flame,
  Award,
  ArrowRight,
  UploadCloud,
  FileCheck2,
  Clock
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [anRes, docsRes] = await Promise.all([
          analyticsAPI.getOverview(),
          documentsAPI.list(),
        ]);
        setAnalytics(anRes.data);
        setRecentDocs(docsRes.data.slice(0, 3));
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = analytics?.stats || {
    total_documents: 1,
    bookmarked_documents: 1,
    average_quiz_score: 82.5,
    completion_rate: 65,
    study_streak_days: 5,
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-indigo-700 to-slate-900 p-8 text-white shadow-xl shadow-brand-900/10">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-200 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI-Powered Learning Workspace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Student'}! 🎓
          </h1>
          <p className="text-brand-100 text-sm leading-relaxed">
            Ready to prepare for <strong>{user?.target_exam || 'your exams'}</strong>? Upload your notes, consult your AI PDF Tutor with page citations, or test yourself with AI-generated mock exams.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/pdf-tutor"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-brand-900 font-bold text-sm shadow-md hover:bg-brand-50 transition-colors"
            >
              <BookOpenCheck className="w-4 h-4 text-brand-600" />
              <span>Ask PDF Tutor (RAG)</span>
            </Link>
            <Link
              to="/notes"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm backdrop-blur-sm transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Notes</span>
            </Link>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-white/10 to-transparent pointer-events-none transform -skew-x-12"></div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Study Streak</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.study_streak_days} Days</h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
              <span>🔥 Consistent Study Streak</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Notes Indexed</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.total_documents} Files</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {stats.bookmarked_documents} Bookmarked
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <FolderOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Quiz Accuracy</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.average_quiz_score}%</h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
              Above target threshold
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Plan Completion</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.completion_rate}%</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {stats.completed_tasks || 1} Tasks finished
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <CalendarCheck2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Core Feature Launcher Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Learning & Examination Modules</h2>
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">All Tools Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: RAG PDF Tutor */}
          <Link
            to="/pdf-tutor"
            className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <BookOpenCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors">
                AI PDF Tutor (RAG-Based)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ask questions directly against your uploaded notes and receive grounded answers with exact source document and page citations.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-600">
              <span>Start Document Tutor</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: AI Academic Assistant */}
          <Link
            to="/assistant"
            className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                Academic Assistant
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Step-by-step academic explanations with custom Learning Modes (Beginner, Detailed, Exam Prep, Quick Revision).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
              <span>Open Academic Chat</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Concept Explainer */}
          <Link
            to="/explainer"
            className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors">
                AI Concept Explainer
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Break down complex topics with real-world analogies, beginner/advanced toggles, and English & Hindi bilingual explanations.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-600">
              <span>Explain Any Concept</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Exam Question Generator */}
          <Link
            to="/questions"
            className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-600 transition-colors">
                Exam Question Generator
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate high-yield MCQs, short/long questions, and full mock examination papers tailored to your syllabus with instant scoring.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
              <span>Generate Practice Quiz</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 5: AI Answer Evaluator */}
          <Link
            to="/evaluator"
            className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-rose-300 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-rose-600 transition-colors">
                AI Answer Evaluator
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit your subjective exam answers and receive rubric grading, missing keyword analysis, and actionable improvement feedback.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-rose-600">
              <span>Evaluate My Answer</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 6: AI Notes Summarizer */}
          <Link
            to="/summarizer"
            className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-cyan-600 transition-colors">
                AI Notes Summarizer
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transform 50-page lecture slides into concise chapter summaries, key takeaways, formulas, and last-minute revision sheets.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-cyan-600">
              <span>Generate Summary</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Notes & Study Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Uploaded Notes */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-brand-600" />
              <span>Recent Course Materials</span>
            </h3>
            <Link to="/notes" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
              View All Notes →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentDocs.length > 0 ? (
              recentDocs.map((doc) => (
                <div key={doc.id} className="py-3.5 flex items-center justify-between hover:bg-slate-50/70 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 font-bold text-xs uppercase flex items-center justify-center border border-brand-100">
                      {doc.file_type}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">{doc.title}</h4>
                      <p className="text-xs text-slate-500">{doc.subject} • {doc.page_count} Pages</p>
                    </div>
                  </div>
                  <Link
                    to="/pdf-tutor"
                    className="text-xs font-medium text-slate-600 hover:text-brand-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-300 transition-colors"
                  >
                    Query with RAG
                  </Link>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-xs text-slate-500">No notes uploaded yet. Start by uploading lecture notes.</p>
            )}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Personalized Recommendations</span>
            </div>
            <h4 className="font-bold text-white text-base">Recommended Study Action</h4>
            <p className="text-xs text-indigo-100/90 leading-relaxed">
              Your Operating Systems finals are in 3 weeks. Take a 5-question Deadlock quiz now to reinforce Coffman conditions and Banker's Algorithm.
            </p>
          </div>

          <Link
            to="/questions"
            className="w-full text-center py-2.5 px-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-xs transition-colors shadow-lg shadow-brand-500/20"
          >
            Start Practice Quiz
          </Link>
        </div>
      </div>

      {/* Footer rendered strictly on the main Dashboard */}
      <Footer />
    </div>
  );
}
