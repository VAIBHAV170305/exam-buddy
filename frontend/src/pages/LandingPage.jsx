import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Lightbulb,
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
  BookOpen,
  Clock,
  Check,
  ChevronDown,
  ChevronUp,
  Cpu
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      icon: BookOpenCheck,
      title: 'AI PDF Tutor (RAG-Grounded)',
      desc: 'Upload lecture slides, syllabus outlines, and textbooks. Query your course materials directly and get answers grounded with exact document and page citations.',
      badge: 'Grounded in Notes',
      iconBg: 'bg-blue-50 text-brand-600 border border-blue-200',
      path: '/pdf-tutor',
    },
    {
      icon: Bot,
      title: 'Direct Academic Assistant',
      desc: 'Straight answers to complex exam problems on line one. Zero generic filler or meta-commentary, with 4 targeted modes: Beginner, Detailed, Exam Prep, and Quick Revision.',
      badge: 'Direct Answers',
      iconBg: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
      path: '/assistant',
    },
    {
      icon: Lightbulb,
      title: 'Concept Explainer (Bilingual)',
      desc: 'Master challenging theoretical theorems through intuitive analogies, adjustable technical depth, and complete bilingual explanations in English and Hindi.',
      badge: 'Analogies & Hindi',
      iconBg: 'bg-amber-50 text-amber-700 border border-amber-200',
      path: '/explainer',
    },
    {
      icon: HelpCircle,
      title: 'Exam Question Generator',
      desc: 'Generate high-yield MCQs, numerical problems, short/long questions, and full mock examination papers tailored to your syllabus with instant automated grading.',
      badge: 'Practice Mocks',
      iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      path: '/questions',
    },
    {
      icon: FileCheck2,
      title: 'Subjective Answer Evaluator',
      desc: 'Submit your handwritten or typed university answers for rubric-based grading, missing keyword identification, and step-by-step scoring improvement guidance.',
      badge: 'Rubric Scoring',
      iconBg: 'bg-rose-50 text-rose-700 border border-rose-200',
      path: '/evaluator',
    },
    {
      icon: FileText,
      title: 'Smart Notes Summarizer',
      desc: 'Condense 80-page slide decks into high-yield chapter digests, formula sheets, key definitions, and rapid revision sheets in seconds.',
      badge: 'Formula Sheets',
      iconBg: 'bg-sky-50 text-sky-700 border border-sky-200',
      path: '/summarizer',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Upload Course Materials',
      desc: 'Add your lecture slides, syllabus outlines, textbook PDFs, or plain text notes to your personal Smart Notes Hub.',
      icon: FolderOpen,
    },
    {
      step: '02',
      title: 'Ask, Practice & Review',
      desc: 'Query your PDF tutor with exact page citations, solve challenging problems with direct answers, or take timed mock tests.',
      icon: Zap,
    },
    {
      step: '03',
      title: 'Score Full Marks',
      desc: 'Submit written answers for rubric evaluation, follow prioritized study tasks, and walk into your examination with confidence.',
      icon: Award,
    },
  ];

  const comparisons = [
    {
      feature: 'Source Citation',
      generic: 'No verifiable citations; often hallucinates textbook references',
      examBuddy: 'Exact document name and page number citations via RAG',
    },
    {
      feature: 'Answer Style',
      generic: 'Verbose meta-talk ("Certainly! Here is an overview...", template filler)',
      examBuddy: 'Direct answer on line 1 with step-by-step technical proofs',
    },
    {
      feature: 'Syllabus Alignment',
      generic: 'Broad internet data not aligned to your specific curriculum',
      examBuddy: 'Strictly grounded in your uploaded university course materials',
    },
    {
      feature: 'Exam Practice',
      generic: 'Basic multiple choice without university marking schemes',
      examBuddy: 'MCQs, numericals, full mock exams + subjective rubric grading',
    },
    {
      feature: 'Bilingual Explanations',
      generic: 'Mechanical translations without contextual analogies',
      examBuddy: 'Natural English & Hindi explanations with real-world analogies',
    },
  ];

  const faqs = [
    {
      q: 'How does the AI PDF Tutor cite exact page numbers?',
      a: 'Exam Buddy uses Retrieval-Augmented Generation (RAG). When you upload lecture slides or textbooks, our vector engine indexes each page chunk with exact metadata. Every AI answer quotes the source passage alongside a verified [Doc: Name, Page #] citation.',
    },
    {
      q: 'Does Exam Buddy give direct answers or generic boilerplate?',
      a: 'Exam Buddy is specifically engineered to provide direct answers immediately on line 1. There are no generic filler greetings or empty headers like "Academic Guidance" or "Tips for Scoring". You get the exact answer, formulas, and high-yield explanations needed for top marks.',
    },
    {
      q: 'Can I prepare for both university semester exams and competitive exams?',
      a: 'Yes. Exam Buddy is designed for undergraduate and postgraduate university examinations (B.Tech, B.Sc, BCA, M.Tech, etc.) as well as competitive examinations like GATE, JEE, and GRE. You can set your target exam in your student profile to customize question generation.',
    },
    {
      q: 'Is my uploaded study data private and protected?',
      a: 'Yes. Exam Buddy strictly complies with the Digital Personal Data Protection (DPDP) Act 2023. Your uploaded course notes, study logs, and mock results are isolated to your student account and never shared with third parties.',
    },
    {
      q: 'What file formats are supported for notes and textbooks?',
      a: 'You can upload PDF files, Word documents (DOCX), and plain text notes (TXT). The text is processed automatically and viewable in the built-in document viewer.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-brand-600 selection:text-white">
      {/* Top Banner */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 text-center text-xs text-slate-300 font-medium flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span>Academic Companion & Exam Preparation Platform</span>
        <span className="hidden sm:inline text-slate-500">•</span>
        <span className="hidden sm:inline text-slate-400">Grounded in your university syllabus</span>
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">
                EXAM BUDDY
              </span>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Academic Companion</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-brand-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-brand-600 transition-colors">How It Works</a>
            <a href="#comparison" className="hover:text-brand-600 transition-colors">Why Exam Buddy</a>
            <a href="#faq" className="hover:text-brand-600 transition-colors">FAQ</a>
            <Link to="/pdf-tutor" className="text-brand-600 hover:text-brand-700 flex items-center gap-1 font-bold">
              <BookOpenCheck className="w-3.5 h-3.5" />
              <span>PDF Tutor</span>
            </Link>
          </nav>

          {/* User Auth / Launch App */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-colors"
              >
                <span>Student Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-brand-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-colors"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-brand-700 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
            <span>Built for University Semester Finals & Competitive Exams</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            Master Any Course.{' '}
            <span className="text-brand-600">Ace Every Exam.</span>
            <br className="hidden sm:inline" /> With Precision AI.
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base text-slate-600 leading-relaxed font-normal">
            Upload your lecture slides, notes, and textbooks. Get direct answers without boilerplate, exact page-level citations from your syllabus, and realistic mock exams with rubric grading.
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-sm transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{isAuthenticated ? 'Go to Student Workspace' : 'Get Started Free'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to={isAuthenticated ? "/pdf-tutor" : "/login"}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm border border-slate-300 shadow-sm transition-colors"
            >
              <BookOpenCheck className="w-4 h-4 text-brand-600" />
              <span>Try RAG PDF Tutor</span>
            </Link>

            <Link
              to={isAuthenticated ? "/assistant" : "/login"}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-200/80 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors"
            >
              <Bot className="w-4 h-4 text-slate-700" />
              <span>Ask Academic Assistant</span>
            </Link>
          </div>

          {/* Quality Proof Points */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Page-Level Citations (RAG)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Direct Answers (No Boilerplate)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>4 Dedicated Learning Modes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>DPDP Act 2023 Compliant</span>
            </div>
          </div>

          {/* Crisp Software Frame Mockup (Solid, Professional) */}
          <div className="pt-8 max-w-5xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-5 text-left text-slate-200">
              {/* Desktop Window Controls Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 font-mono text-[11px] text-slate-400">
                    exambuddy.ai • Direct Problem Solver
                  </span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-emerald-400 text-[11px]">RAG Vector Engine Ready</span>
                </div>
              </div>

              {/* Split Screen View */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-4">
                {/* Left Side: Uploaded Document Excerpt */}
                <div className="lg:col-span-5 bg-slate-800/90 rounded-xl p-4 border border-slate-700/80 space-y-3 font-sans">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-700">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
                      Compiler_Design_LALR.pdf
                    </span>
                    <span className="text-[10px] bg-slate-900 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                      Page 114
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 leading-relaxed font-mono bg-slate-900 p-3 rounded-lg border border-slate-700/70">
                    <p className="text-slate-400 uppercase tracking-widest text-[9px] font-bold mb-1">
                      EXTRACTED SOURCE EXCERPT
                    </p>
                    "...when two LR(1) states with identical cores are merged in an LALR parser, the shift actions remain unchanged. However, unioning lookaheads can introduce <span className="bg-blue-900 text-blue-200 px-1 py-0.5 rounded font-bold">reduce/reduce conflicts</span>, whereas <span className="bg-emerald-900 text-emerald-200 px-1 py-0.5 rounded font-bold">no shift/reduce conflicts</span> can ever be generated..."
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Grounded with verifiable page citations</span>
                  </div>
                </div>

                {/* Right Side: Direct AI Answer */}
                <div className="lg:col-span-7 bg-slate-800/90 rounded-xl p-4 border border-slate-700/80 space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-[10px]">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-white text-xs">Direct Problem Solver</span>
                    </div>
                    <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-2.5 py-0.5 rounded-full font-bold uppercase">
                      Quick Revision Mode
                    </span>
                  </div>

                  {/* Question */}
                  <div className="bg-slate-900 p-3 rounded-lg text-xs text-slate-200 border border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Student Question:
                    </span>
                    <p className="font-medium text-white">
                      "Merging states with a common core may produce ______ conflicts and does not produce ______ conflicts in an LALR parser."
                    </p>
                  </div>

                  {/* Direct Answer */}
                  <div className="bg-slate-900 p-3.5 rounded-lg text-xs text-slate-200 border border-brand-600 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Direct Answer
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Source: [Doc: Compiler_Design_LALR.pdf, Page 114]
                      </span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <p>• <strong>First Blank:</strong> <code className="text-blue-300 bg-slate-800 px-1.5 py-0.5 rounded">reduce/reduce</code> (or R-R)</p>
                      <p>• <strong>Second Blank:</strong> <code className="text-emerald-300 bg-slate-800 px-1.5 py-0.5 rounded">shift/reduce</code> (or S-R)</p>
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

      {/* Metrics Strip */}
      <section className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">100+</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Course Syllabi Supported</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <p className="text-3xl sm:text-4xl font-extrabold text-brand-600">98.4%</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">RAG Retrieval Accuracy</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-700">0%</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Boilerplate Filler</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-700">5x</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Faster Revision</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
            Complete Academic Toolset
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Top Examination Performance
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            No fragmented tools. Exam Buddy brings document indexing, problem-solving, test generation, and evaluation into one unified student workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-brand-600 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-xl ${f.iconBg} flex items-center justify-center font-bold`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {f.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {f.desc}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100">
                  <Link
                    to={f.path}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    <span>Launch Tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
              Simple 3-Step Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              From Lecture Slides to Exam Ready
            </h2>
            <p className="text-sm text-slate-600">
              Exam Buddy organizes your materials and converts complex syllabus requirements into structured practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-slate-400">
                      {st.step}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center border border-blue-100">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {st.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="comparison" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
            Human-Centered Academic Design
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Standard AI Bots vs. Exam Buddy
          </h2>
          <p className="text-sm text-slate-600 font-normal">
            Generic chatbots deliver verbose filler and hallucinate formulas. Exam Buddy is engineered specifically for academic rigor.
          </p>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="py-3.5 px-6 font-bold text-slate-700 uppercase tracking-wider">
                  Capability
                </th>
                <th scope="col" className="py-3.5 px-6 font-bold text-rose-700 uppercase tracking-wider">
                  Generic AI Chatbots
                </th>
                <th scope="col" className="py-3.5 px-6 font-bold text-brand-700 uppercase tracking-wider">
                  Exam Buddy AI
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {comparisons.map((c, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                  <td className="py-4 px-6 text-slate-900 font-bold whitespace-nowrap">
                    {c.feature}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    <span className="inline-block mr-1.5 text-rose-600 font-bold">✕</span>
                    {c.generic}
                  </td>
                  <td className="py-4 px-6 text-slate-900 font-semibold">
                    <span className="inline-block mr-1.5 text-emerald-600 font-bold">✓</span>
                    {c.examBuddy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
              Common Inquiries
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 hover:text-brand-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-brand-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 font-normal">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-slate-900 rounded-2xl p-8 sm:p-12 text-white shadow-md space-y-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Upgrade Your Study Preparation?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed font-normal">
              Join students preparing for semester finals and competitive exams with grounded AI assistance.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-sm text-white shadow-sm transition-colors"
              >
                <GraduationCap className="w-4 h-4" />
                <span>{isAuthenticated ? 'Enter Student Workspace' : 'Sign In & Get Started Free'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Solid Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 py-10 text-slate-400 text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-sm">EXAM BUDDY</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-slate-400">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/cookies" className="hover:text-white transition-colors">Storage & Cookies</Link>
              <Link to="/refunds" className="hover:text-white transition-colors">Refund Policy</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} Exam Buddy AI. DPDP Act 2023 Compliant.</p>
            <p>Built for Student Academic Excellence</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
