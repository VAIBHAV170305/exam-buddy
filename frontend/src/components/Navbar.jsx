import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Target } from 'lucide-react';
import StudentProfileMenu from './StudentProfileMenu';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
      {/* Course & Semester Status */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700">
          <BookOpen className="w-3.5 h-3.5 text-brand-600" />
          <span>{user?.course || 'Undergraduate'}</span>
          <span className="text-slate-400">•</span>
          <span className="text-brand-700 font-semibold">{user?.semester || 'Semester 1'}</span>
        </div>

        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-medium">
          <Target className="w-3.5 h-3.5 text-indigo-600" />
          <span>Target: <strong className="font-semibold">{user?.target_exam || 'Finals'}</strong></span>
        </div>
      </div>

      {/* Entire Student Profile Hub */}
      <div className="flex items-center gap-3">
        <StudentProfileMenu />
      </div>
    </header>
  );
}
