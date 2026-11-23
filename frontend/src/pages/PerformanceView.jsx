import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import {
  BarChart3,
  Award,
  TrendingUp,
  FolderOpen,
  CalendarCheck2,
  Lightbulb,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function PerformanceAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await analyticsAPI.getOverview();
      setData(res.data);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const stats = data?.stats || {
    total_documents: 1,
    average_quiz_score: 82.5,
    completion_rate: 65,
    study_streak_days: 5,
  };

  const subjects = data?.subject_distribution || [
    { subject: 'Operating Systems', notesCount: 4 },
    { subject: 'Data Structures', notesCount: 3 },
    { subject: 'Computer Networks', notesCount: 2 },
  ];

  const recommendations = data?.recommendations || [
    "Focus on revision for topics where quiz accuracy is under 75%.",
    "Use AI PDF Tutor with 'Exam Preparation Mode' for past year question practice.",
    "Generate short revision flashcards 2 days prior to your target exam dates."
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <BarChart3 className="w-6 h-6 text-brand-600" />
          <span>AI Performance Analytics & Readiness</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor your preparation velocity, analyze subject-wise strength, and track exam readiness scores.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Exam Readiness</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-slate-900">{stats.average_quiz_score}%</h3>
            <span className="text-xs font-bold text-emerald-700">On Track</span>
          </div>
          <p className="text-[11px] text-slate-600">Benchmark across practice quizzes</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Study Consistency</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-slate-900">{stats.study_streak_days} Days</h3>
            <span className="text-xs font-bold text-amber-700">Active Streak</span>
          </div>
          <p className="text-[11px] text-slate-600">Daily learning session activity</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Knowledge Base</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-slate-900">{stats.total_documents}</h3>
            <span className="text-xs font-bold text-brand-700">Documents</span>
          </div>
          <p className="text-[11px] text-slate-600">Vectorized and indexed for RAG</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Task Completion</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-slate-900">{stats.completion_rate}%</h3>
            <span className="text-xs font-bold text-purple-700">Planner Velocity</span>
          </div>
          <p className="text-[11px] text-slate-600">Tasks checked off on schedule</p>
        </div>
      </div>

      {/* Subject Distribution & Strengths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-brand-600" aria-hidden="true" />
            <span>Subject-Wise Material Distribution</span>
          </h3>

          <div className="space-y-3 pt-2">
            {subjects.map((s, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>{s.subject}</span>
                  <span className="text-slate-600">{s.notesCount} Notes</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden" role="progressbar" aria-valuenow={s.notesCount} aria-label={`Notes count for ${s.subject}`}>
                  <div
                    className="bg-brand-500 h-2.5 rounded-full"
                    style={{ width: `${Math.min(s.notesCount * 25, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Personalized AI Study Directives</span>
          </h3>

          <div className="space-y-3 pt-1">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-800 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
