import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function LegalTerms() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 py-6 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg p-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Exam Buddy</span>
          </Link>
          <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full border border-brand-200 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 sm:px-12 py-12 space-y-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Terms and Conditions</h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          By using Exam Buddy, you agree to respect academic integrity and use AI study materials as a supportive learning companion.
        </p>
        <div className="text-center pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
