import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function LegalPrivacy() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 py-6 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg p-1"
            aria-label="Return to Exam Buddy Home"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Exam Buddy</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>India DPDP Act (2023) Compliant</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="max-w-5xl mx-auto px-6 sm:px-12 py-12 space-y-10">
        <div className="space-y-3 border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>Data Protection & Privacy Notice</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-600">
            <strong>Effective Date:</strong> November 19, 2026 | <strong>Last Updated:</strong> November 19, 2026
          </p>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            Exam Buddy Edutech Pvt. Ltd. ("Exam Buddy", "we", "us", or "our") is deeply committed to protecting the privacy, confidentiality, and data sovereignty of students and educators who use our AI-powered educational platform. This policy outlines how we handle personal data in accordance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act, India)</strong>, the <strong>Information Technology Act, 2000</strong>, and international standards including <strong>GDPR</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Purpose Limitation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your notes and data are processed solely to provide personal tutoring, summarization, and mock exams. We never sell your data or train external models on private student materials.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">No Behavioral Profiling</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              In accordance with Section 9 of the DPDP Act 2023, we prohibit tracking, behavioural targeting, or advertising directed at children and students.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Right to Erasure</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              You maintain complete ownership of your personal data. You can delete your notes, question history, or full account permanently with one click.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm space-y-8 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-brand-600">1.</span> Personal Data We Collect
            </h2>
            <p>
              In line with the principle of <em>Data Minimization</em>, we only collect information strictly required to deliver our educational and examination preparation features:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Account Identification:</strong> Full Name, Email Address, and securely encrypted (bcrypt-hashed) password.</li>
              <li><strong>Academic Profile:</strong> Education Level (High School, Undergraduate, etc.), Course/Major, Semester, and Target Examination.</li>
              <li><strong>User-Uploaded Study Materials:</strong> Documents (PDF, DOCX, TXT) that you voluntarily upload for text extraction, RAG querying, and summarization.</li>
              <li><strong>System Interaction:</strong> Practice quiz responses, score logs, and study task checklists stored exclusively to compute your personal readiness analytics.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-brand-600">2.</span> Purpose and Legal Basis for Processing
            </h2>
            <p>
              Under Section 4 and Section 6 of the DPDP Act 2023, personal data is processed exclusively on the basis of your explicit, informed consent for specified educational purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-brand-600">3.</span> Grievance Redressal Officer
            </h2>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2 text-xs text-slate-700">
              <p><strong>Grievance Officer:</strong> Mr. Vikram Malhotra</p>
              <p><strong>Entity:</strong> Exam Buddy Edutech Pvt. Ltd.</p>
              <p><strong>Office Address:</strong> Level 5, Barakhamba Road, Connaught Place, New Delhi – 110001, India</p>
              <p><strong>Email:</strong> <a href="mailto:grievance@exambuddy.ai" className="text-brand-600 font-semibold underline">grievance@exambuddy.ai</a></p>
            </div>
          </section>
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
