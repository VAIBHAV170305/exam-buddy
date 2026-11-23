import React from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function LegalStorage() {
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
          <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200 flex items-center gap-1.5">
            <Cookie className="w-3.5 h-3.5" />
            <span>Zero 3rd-Party Ad Cookies</span>
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 sm:px-12 py-12 space-y-10">
        <div className="space-y-3 border-b border-slate-200 pb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Storage & Local Data Notice
          </h1>
          <p className="text-sm text-slate-600">
            Exam Buddy utilizes only strictly necessary local storage (e.g. your login session token) to authenticate you safely. We do not use third-party tracking or advertising cookies.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4 text-sm text-slate-700">
          <h2 className="text-lg font-bold text-slate-900">Essential Storage Keys</h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-600">
            <li><strong>exam_buddy_token:</strong> Keeps your student session authenticated securely.</li>
            <li><strong>exam_buddy_user:</strong> Stores your student profile information for faster load times.</li>
          </ul>
        </div>

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
