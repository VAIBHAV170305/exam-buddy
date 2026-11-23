import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ShieldCheck, X } from 'lucide-react';
import { safeStorage } from '../utils/storage';

export default function DataNoticeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = safeStorage.getItem('exam_buddy_cookie_consent');
    if (!consent) {
      // Small delay for smooth entry
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    safeStorage.setItem('exam_buddy_cookie_consent', 'all');
    setVisible(false);
  };

  const handleAcceptEssential = () => {
    safeStorage.setItem('exam_buddy_cookie_consent', 'essential');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Local Storage Consent Banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-lg z-50 bg-slate-900 text-slate-200 p-5 rounded-3xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
          <Cookie className="w-5 h-5" aria-hidden="true" />
        </div>

        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <span>Your Privacy & Cookie Choices</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                No Ad Trackers
              </span>
            </h3>
            <button
              onClick={handleAcceptEssential}
              className="text-slate-400 hover:text-white p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label="Dismiss cookie notice with essential cookies only"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Exam Buddy uses strictly necessary local storage (such as your encrypted authentication token) to keep your account safe and your notes private. We do not use third-party advertising or cross-site tracking cookies.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleAcceptAll}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-colors focus-visible:ring-2 focus-visible:ring-brand-400 focus:outline-none"
              aria-label="Accept all cookies and local storage"
            >
              Accept All
            </button>

            <button
              type="button"
              onClick={handleAcceptEssential}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-600 transition-colors focus-visible:ring-2 focus-visible:ring-brand-400 focus:outline-none"
              aria-label="Accept essential cookies only"
            >
              Essential Only
            </button>

            <Link
              to="/cookie-policy"
              className="text-xs text-brand-400 hover:text-brand-300 font-semibold underline ml-1 focus-visible:ring-2 focus-visible:ring-brand-500 rounded p-0.5"
              aria-label="Read full Cookie and Storage Policy"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
