import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Sparkles,
  BookOpenCheck,
  Bot,
  FolderOpen,
  FileCheck2,
  HelpCircle,
  FileText,
  CalendarCheck2,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Award,
  Search,
  BookOpen,
  Clock,
  Flame,
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  Cpu,
  Lock,
  ArrowUpRight
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      icon: BookOpenCheck,
      title: 'AI PDF Tutor (RAG-Grounded)',
      desc: 'Upload lecture slides, notes, or textbooks. Chat directly with your syllabus and receive grounded answers with exact source document and page citations.',
      badge: 'Zero Hallucination',
      color: 'from-blue-500 to-indigo-600',
      path: '/pdf-tutor',
    },
    {
      icon: Bot,
      title: 'Direct Academic Assistant',
      desc: 'Get straight-to-the-point answers without boilerplate or filler headings. Supports 4 dedicated learning modes: Beginner, Detailed, Exam Prep, and Quick Revision.',
      badge: 'Direct Answers',
      color: 'from-indigo-500 to-purple-600',
      path: '/assistant',
    },
    {
      icon: Sparkles,
      title: 'Concept Explainer (Bilingual)',
      desc: 'Master tough concepts through intuitive real-world analogies, beginner/advanced depth toggles, and dual-language (English & Hindi) explanations.',
      badge: 'Analogies & Hindi',
      color: 'from-amber-500 to-orange-600',
      path: '/explainer',
    },
    {
      icon: HelpCircle,
      title: 'Exam Question Generator',
      desc: 'Generate high-yield MCQs, numerical problems, short/long questions, and timed mock tests customized to your university syllabus with instant scoring.',
      badge: 'Mock Papers',
      color: 'from-emerald-500 to-teal-600',
      path: '/questions',
    },
    {
      icon: FileCheck2,
      title: 'Subjective Answer Evaluator',
      desc: 'Submit your handwritten or typed exam answers for AI rubric grading, missing keyword identification, and step-by-step scoring improvement tips.',
      badge: 'Rubric Scoring',
      color: 'from-rose-500 to-pink-600',
      path: '/evaluator',
    },
    {
      icon: FileText,
      title: 'Smart Notes Summarizer',
      desc: 'Condense 100-page slide decks into high-yield chapter digests, formula sheets, key definitions, and rapid revision sheets in seconds.',
      badge: 'Formula Sheets',
      color: 'from-cyan-500 to-blue-600',
      path: '/summarizer',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Upload Course Materials',
      desc: 'Drag & drop lecture PDFs, DOCX slides, syllabus outlines, or textbook chapters into your private Smart Notes Hub.',
      icon: FolderOpen,
    },
    {
      step: '02',
      title: 'Learn, Query & Practice',
      desc: 'Ask your AI PDF Tutor with page-level citations, get direct answers to tough exam questions, or practice auto-graded mock quizzes.',
      icon: Zap,
    },
    {
      step: '03',
      title: 'Ace Your Examination',
      desc: 'Submit subjective answers for rubric grading, track your daily study streak, and walk into the exam hall fully prepared.',
      icon: Award,
    },
  ];

  const comparisons = [
    {
      feature: 'Source Citation',
      generic: 'No citations; often invents textbook references',
      examBuddy: 'Exact document name and page number citations via RAG',
    },
    {
      feature: 'Answer Style',
      generic: 'Verbose meta-talk ("Sure! Let me explain...", boilerplate tips)',
      examBuddy: 'Direct answer on line 1 with step-by-step technical proofs',
    },
    {
      feature: 'Syllabus Alignment',
      generic: 'Generic web knowledge, not tailored to your course',
      examBuddy: 'Strictly grounded in your uploaded university course materials',
    },
    {
      feature: 'Exam Practice',
      generic: 'Basic multiple choice without marking schemes',
      examBuddy: 'MCQs, numericals, mock exams + subjective rubric grading',
    },
    {
      feature: 'Bilingual Explanations',
      generic: 'Awkward translation without cultural analogies',
      examBuddy: 'Native English & Hindi explanations with real-world analogies',
    },
  ];

  const faqs = [
    {
      q: 'How does the AI PDF Tutor cite exact page numbers?',
      a: 'Exam Buddy uses Retrieval-Augmented Generation (RAG). When you upload documents, our vector engine chunks and indexes them with precise page metadata. Every AI answer quotes the exact excerpt along with a clickable [Doc: Name, Page #] citation.',
    },
    {
      q: 'Does Exam Buddy give direct answers or generic boilerplate?',
      a: 'Exam Buddy is specifically engineered to deliver direct answers immediately on line 1. There are no generic filler greetings or empty headers like "Academic Guidance" or "Tips for Scoring". You get the exact answer, formulas, and high-yield explanations needed for top marks.',
    },
    {
      q: 'Can I prepare for both University Semester Exams and Competitive Exams?',
      a: 'Yes! Exam Buddy supports undergraduate/postgraduate university exams (B.Tech, B.Sc, M.Tech, etc.) as well as competitive examinations like GATE, JEE, GRE, and UPSC. You can set your target exam in your student profile to tailor question generation.',
    },
    {
      q: 'Is my uploaded study data private and protected?',
      a: 'Absolutely. Exam Buddy adheres to the Digital Personal Data Protection (DPDP) Act 2023. Your uploaded notes, chats, and mock exam results are strictly isolated to your student account and never shared with unauthorized third parties.',
    },
    {
      q: 'What formats can I upload for notes and textbooks?',
      a: 'You can upload PDF files, Word documents (DOCX), and plain text notes (TXT). The text is processed automatically, and you can preview notes in our built-in document viewer.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-brand-700 via-indigo-600 to-purple-700 px-4 py-2 text-center text-xs font-semibold text-white tracking-wide shadow-inner flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>Next-Generation AI Academic Companion & Exam Prep Operating System</span>
        <span className="hidden md:inline bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-1">
          Live Demo Available
        </span>
      </div>

      {/* Sticky Navigation Bar */}
      <header className="sticky top-0 z-50 bg-slate-900/85 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight flex items-center gap-1.5">
                EXAM BUDDY
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">AI Academic Companion</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#comparison" className="hover:text-white transition-colors">Why Exam Buddy</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <Link to="/pdf-tutor" className="hover:text-white transition-colors flex items-center gap-1 text-brand-300">
              <BookOpenCheck className="w-3.5 h-3.5" />
              <span>PDF Tutor</span>
            </Link>
          </nav>

          {/* User Auth / Launch App Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all hover:shadow-lg"
              >
                <span>Student Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all hover:shadow-lg"
                >
                  <span>Launch App</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-brand-600/20 via-indigo-500/20 to-purple-600/20 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-brand-300 text-xs font-semibold backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Built Specifically for University & Competitive Examinations</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Master Any Subject.{' '}
            <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Ace Every Exam.
            </span>
            <br className="hidden sm:inline" /> Supercharged by AI.
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            Upload your lecture slides, notes, and textbooks. Get instant direct answers, page-level citations from your exact syllabus, AI-graded mock exams, and step-by-step problem solving.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-brand-600/25 transition-all transform hover:-translate-y-0.5"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Launch Student Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/pdf-tutor"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 font-semibold text-sm border border-slate-700 backdrop-blur-sm transition-all"
            >
              <BookOpenCheck className="w-4 h-4 text-brand-400" />
              <span>Try RAG PDF Tutor</span>
            </Link>

            <Link
              to="/assistant"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-700/60 transition-all"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>Ask Academic Assistant</span>
            </Link>
          </div>

          {/* Key Value Prop Checkmarks */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Page-Level Citations (RAG)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Direct Answers (Zero Fluff)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>4 Specialized Learning Modes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>DPDP Act 2023 Compliant</span>
            </div>
          </div>

          {/* Interactive Live Product Preview Mockup */}
          <div className="pt-10 max-w-5xl mx-auto">
            <div className="relative rounded-3xl bg-slate-950/70 border border-slate-800 shadow-2xl p-4 sm:p-6 backdrop-blur-xl text-left overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-[11px] text-slate-400">
                    exambuddy.ai/assistant • Direct Problem Solver
                  </span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-[11px]">RAG Vector Engine Ready</span>
                </div>
              </div>

              {/* Mockup Split Screen */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
                {/* Left Side: Uploaded Document Context */}
                <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3 font-sans">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <FolderOpen className="w-3.5 h-3.5 text-brand-400" />
                      Compiler_Design_LALR.pdf
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      Page 114
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <p className="text-slate-500 uppercase tracking-widest text-[9px] font-bold mb-1">
                      EXTRACTED SOURCE EXCERPT
                    </p>
                    "...when two LR(1) states with identical cores are merged in an LALR parser, the shift actions remain unchanged. However, unioning the lookaheads of two reduction items can introduce <span className="bg-brand-900/60 text-brand-200 px-1 py-0.5 rounded font-bold">reduce/reduce conflicts</span>, whereas <span className="bg-emerald-900/60 text-emerald-200 px-1 py-0.5 rounded font-bold">no shift/reduce conflicts</span> can ever be generated..."
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified source groundings with 98.4% retrieval accuracy</span>
                  </div>
                </div>

                {/* Right Side: Direct AI Answer Card */}
                <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-[10px]">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-white text-xs">Direct Problem Solver</span>
                    </div>
                    <span className="text-[10px] bg-brand-500/20 text-brand-300 border border-brand-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                      Quick Revision Mode
                    </span>
                  </div>

                  {/* Student Question */}
                  <div className="bg-slate-800/60 p-3 rounded-xl text-xs text-slate-300 border border-slate-700/50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Student Question:
                    </span>
                    <p className="font-medium text-white">
                      "Merging states with a common core may produce ______ conflicts and does not produce ______ conflicts in an LALR parser."
                    </p>
                  </div>

                  {/* Direct Answer Box */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl text-xs text-slate-200 border border-brand-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Direct Solution
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Source: [Doc: Compiler_Design_LALR.pdf, Page 114]
                      </span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <p>• <strong>First Blank:</strong> <code className="text-brand-300 bg-slate-800 px-1 rounded">reduce/reduce</code> (or R-R)</p>
                      <p>• <strong>Second Blank:</strong> <code className="text-emerald-300 bg-slate-800 px-1 rounded">shift/reduce</code> (or S-R)</p>
                    </div>
                    <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                      <strong>Why:</strong> Merging common cores unions lookaheads, which may cause lookahead collisions for reductions (reduce/reduce), but cannot create shift/reduce conflicts because shift actions depend strictly on the core.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Row */}
      <section className="border-y border-slate-800 bg-slate-950/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-white">100+</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Course Subjects</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-brand-400">98.4%</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Grounding Accuracy</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-purple-400">0%</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Generic Boilerplate</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">5x</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Faster Exam Revision</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider">
            Comprehensive Learning Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything You Need to Rank at the Top of Your Class
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Exam Buddy replaces scattered study materials, generic AI bots, and manual flashcards with a single cohesive academic cockpit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="group relative bg-slate-850 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 hover:border-brand-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                    {f.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80">
                  <Link
                    to={f.path}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    <span>Launch Module</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section id="how-it-works" className="py-24 bg-slate-950/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
              Simple 3-Step Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              From Lecture Slides to Exam Mastery
            </h2>
            <p className="text-sm text-slate-400">
              Exam Buddy seamlessly indexes your notes, extracts high-yield facts, and equips you with answers that score full marks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className="relative bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-extrabold text-slate-700">
                      {st.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    {st.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Generic AI vs. Exam Buddy Comparison */}
      <section id="comparison" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
            Purpose-Built for Academics
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Generic AI Chatbots Fail Students
          </h2>
          <p className="text-sm text-slate-400">
            Standard chatbots deliver verbose filler, hallucinate formulas, and have no connection to your university's syllabus. Exam Buddy is engineered specifically for students.
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="border border-slate-800 rounded-3xl overflow-hidden shadow-xl bg-slate-950/60">
              <table className="min-w-full divide-y divide-slate-800 text-left text-xs">
                <thead className="bg-slate-900">
                  <tr>
                    <th scope="col" className="py-4 px-6 font-bold text-slate-400 uppercase tracking-wider">
                      Evaluation Criteria
                    </th>
                    <th scope="col" className="py-4 px-6 font-bold text-rose-400 uppercase tracking-wider">
                      Standard Generic AI
                    </th>
                    <th scope="col" className="py-4 px-6 font-bold text-emerald-400 uppercase tracking-wider">
                      Exam Buddy AI
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {comparisons.map((c, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-900/60'}>
                      <td className="py-4 px-6 text-white font-bold whitespace-nowrap">
                        {c.feature}
                      </td>
                      <td className="py-4 px-6 text-slate-400">
                        <span className="inline-block mr-1.5 text-rose-500 font-bold">✕</span>
                        {c.generic}
                      </td>
                      <td className="py-4 px-6 text-emerald-300 font-semibold">
                        <span className="inline-block mr-1.5 text-emerald-400 font-bold">✓</span>
                        {c.examBuddy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) */}
      <section id="faq" className="py-24 bg-slate-950/50 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-400">
              Everything you need to know about Exam Buddy and your academic journey.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div
                  key={i}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full py-4 px-6 text-left flex items-center justify-between text-sm font-bold text-slate-200 hover:text-white transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-brand-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call To Action */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="bg-gradient-to-r from-brand-700 via-indigo-700 to-purple-800 rounded-3xl p-10 sm:p-14 text-white shadow-2xl space-y-6 relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Ready to Upgrade Your Study Routine?
              </h2>
              <p className="text-sm text-brand-100 leading-relaxed">
                Join thousands of students turning complex lecture slides into top exam scores. Free to use, instant access, zero hassle.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-brand-900 hover:bg-brand-50 font-extrabold text-sm shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                <GraduationCap className="w-5 h-5 text-brand-600" />
                <span>Enter Student Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-[11px] text-brand-200/80">
              No credit card required • Instant academic AI companion access
            </p>
          </div>
        </div>
      </section>

      {/* Comprehensive Landing Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-400 text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base">EXAM BUDDY</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/cookies" className="hover:text-white transition-colors">Storage & Cookies</Link>
              <Link to="/refunds" className="hover:text-white transition-colors">Refund Policy</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} Exam Buddy AI. All rights reserved. Compliant with DPDP Act 2023.</p>
            <p className="flex items-center gap-1">
              <span>Engineered for Student Academic Excellence</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
