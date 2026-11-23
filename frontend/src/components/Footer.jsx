import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, GraduationCap, Building2, Mail, MapPin, Scale, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-12 py-10 px-6 sm:px-10 text-slate-700 font-sans" role="contentinfo">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Grid: Brand & Directives */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-brand-500/20">
                <GraduationCap className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="font-extrabold text-slate-900 text-base tracking-tight">EXAM BUDDY</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md">
              Your Personal AI-Powered Learning & Examination Companion. Built for students to study smarter through document grounding (RAG), step-by-step concept explanations, and personalized mock tests.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                <span>India DPDP Act (2023) Compliant</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 text-brand-800 text-[11px] font-bold border border-brand-200">
                <Lock className="w-3.5 h-3.5 text-brand-600" aria-hidden="true" />
                <span>Zero 3rd-Party Trackers</span>
              </span>
            </div>
          </div>

          {/* Col 2: Legal & Compliance Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Legal & Compliance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-slate-600 hover:text-brand-600 font-medium focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
                >
                  Privacy Policy (DPDP / GDPR)
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-slate-600 hover:text-brand-600 font-medium focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/cookie-policy"
                  className="text-slate-600 hover:text-brand-600 font-medium focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
                >
                  Cookie & Local Storage Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="text-slate-600 hover:text-brand-600 font-medium focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
                >
                  Refund & Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Entity & Grievance Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Corporate & Grievance Redressal
            </h4>
            <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
              <p className="font-semibold text-slate-800">Exam Buddy Edutech Pvt. Ltd.</p>
              <p className="text-[11px] text-slate-500">CIN: U80904DL2026PTC123456</p>
              <p className="flex items-start gap-1 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span>Connaught Place, New Delhi – 110001, India</span>
              </p>
              <p className="flex items-center gap-1 text-[11px] pt-1">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                <span>Grievance: <a href="mailto:grievance@exambuddy.ai" className="text-brand-600 underline font-semibold">grievance@exambuddy.ai</a></span>
              </p>
              <p className="flex items-center gap-1 text-[11px]">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                <span>Support: <a href="mailto:support@exambuddy.ai" className="text-brand-600 underline font-semibold">support@exambuddy.ai</a></span>
              </p>
            </div>
          </div>
        </div>

        {/* Academic Disclaimers Notice */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-1">
          <p>
            <strong>Academic Transparency & Disclaimer:</strong> Exam Buddy is an independent educational technology platform. It is not affiliated with, accredited by, or endorsed by the National Testing Agency (NTA), UPSC, CBSE, AICTE, or any specific university or exam authority. All trademarks, exam acronyms, and syllabus names are used strictly for nominative identification and student revision purposes.
          </p>
          <p className="text-[11px] text-slate-500">
            AI-generated answers, notes summaries, and question sets are tools to assist student study and should be cross-referenced with your official textbooks and course syllabi.
          </p>
        </div>

        {/* Bottom Line */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 Exam Buddy Edutech Pvt. Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" aria-label="love" />
            <span>for students learning smarter worldwide.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
