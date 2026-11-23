import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderOpen,
  Bot,
  Lightbulb,
  FileText,
  HelpCircle,
  FileCheck2,
  BookOpenCheck,
  CalendarCheck2,
  BarChart3,
  User,
  GraduationCap,
  ShieldCheck
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Smart Notes Hub', path: '/notes', icon: FolderOpen },
  { name: 'Academic Assistant', path: '/assistant', icon: Bot },
  { name: 'Concept Explainer', path: '/explainer', icon: Lightbulb },
  { name: 'Notes Summarizer', path: '/summarizer', icon: FileText },
  { name: 'Exam Question Gen', path: '/questions', icon: HelpCircle },
  { name: 'Answer Evaluator', path: '/evaluator', icon: FileCheck2 },
  { name: 'AI PDF Tutor (RAG)', path: '/pdf-tutor', icon: BookOpenCheck },
  { name: 'Study Planner', path: '/planner', icon: CalendarCheck2 },
  { name: 'Performance Analytics', path: '/performance', icon: BarChart3 },
  { name: 'Student Profile', path: '/profile', icon: User },
];

export default function Sidebar() {
  return (
    <aside
      className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none"
      aria-label="Main sidebar navigation"
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 gap-3 border-b border-slate-800 bg-slate-950">
        <Link to="/dashboard" className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm shrink-0">
          <GraduationCap className="w-5 h-5" aria-hidden="true" />
        </Link>
        <div>
          <Link to="/dashboard" className="font-bold text-white text-base tracking-tight flex items-center gap-1.5 hover:text-brand-300 transition-colors">
            EXAM BUDDY
          </Link>
          <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">AI Academic Companion</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="Learning modules">
        <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Learning Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 focus-visible:ring-2 focus-visible:ring-brand-400 focus:outline-none ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                  item.badge === 'New' 
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Engine Status Card */}
      <div className="p-3 mx-3 my-2 rounded-xl bg-slate-800/90 border border-slate-700">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true"></span>
          <span className="text-xs font-semibold text-slate-200">RAG Vector Engine Active</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
          Grounding answers with page citations from your uploaded materials.
        </p>
      </div>

      {/* Legal & Compliance Footer Links */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          <span>DPDP Act 2023 Compliant</span>
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-slate-400">
          <Link to="/privacy-policy" className="hover:text-white underline">Privacy</Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-white underline">Terms</Link>
          <span>•</span>
          <Link to="/cookie-policy" className="hover:text-white underline">Cookies</Link>
          <span>•</span>
          <Link to="/refund-policy" className="hover:text-white underline">Refunds</Link>
        </div>
      </div>
    </aside>
  );
}
