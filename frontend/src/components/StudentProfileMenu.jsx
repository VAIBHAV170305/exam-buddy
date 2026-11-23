import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  GraduationCap,
  BookOpen,
  Award,
  LogOut,
  ChevronDown,
  ChevronUp,
  Edit3,
  Save,
  Download,
  ShieldCheck,
  Calendar,
  Flame,
  FolderOpen,
  BarChart3,
  Check,
  X,
  ExternalLink,
  Target,
  FileCheck2
} from 'lucide-react';

export default function StudentProfileMenu() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    full_name: '',
    education_level: 'Undergraduate',
    course: '',
    semester: 'Semester 1',
    target_exam: '',
    bio: '',
  });

  // Keep editForm synced with user
  useEffect(() => {
    if (user) {
      setEditForm({
        full_name: user.full_name || '',
        education_level: user.education_level || 'Undergraduate',
        course: user.course || 'Computer Science',
        semester: user.semester || 'Semester 1',
        target_exam: user.target_exam || 'University Semester Exams',
        bio: user.bio || '',
      });
    }
  }, [user]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setIsEditing(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setIsEditing(false);
        triggerRef.current?.focus();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (isOpen) {
      setIsEditing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await updateProfile(editForm);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        setIsEditing(false);
      }, 1200);
    } catch (err) {
      console.error('Failed to update student profile:', err);
      setErrorMsg('Could not save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // DPDP Section 11 - Right to Data Portability
  const handleExportData = () => {
    const exportPayload = {
      export_date: new Date().toISOString(),
      regulation_compliance: 'India DPDP Act 2023 (Section 11) & GDPR (Article 20)',
      platform: 'Exam Buddy AI — Personal Learning Companion',
      student_profile: {
        id: user?.id,
        full_name: user?.full_name,
        email: user?.email,
        education_level: user?.education_level,
        course: user?.course,
        semester: user?.semester,
        target_exam: user?.target_exam,
        bio: user?.bio,
        member_since: user?.created_at,
      },
      privacy_notice: 'This student data is strictly confidential and protected under DPDP Act 2023.'
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exam_buddy_student_profile_${user?.id || 'aarav'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const initial = user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A';

  return (
    <div className="relative flex items-center gap-2">
      {/* Student Profile Trigger Card - Exact visual match to screenshot */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Student Profile menu for ${user?.full_name || 'Aarav Sharma'}`}
        className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-100/70 transition-colors select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        {/* Solid Blue Circle Avatar */}
        <div className="w-9 h-9 rounded-full bg-[#0284c7] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
          {initial}
        </div>

        {/* Student Name & Email */}
        <div className="text-left hidden sm:block">
          <div className="text-sm font-bold text-[#0f172a] leading-tight">
            {user?.full_name || 'Aarav Sharma'}
          </div>
          <div className="text-xs text-[#0284c7] leading-tight mt-0.5 font-normal">
            {user?.email || 'demo@exambuddy.ai'}
          </div>
        </div>
      </button>

      {/* Direct Logout / Sign Out Icon Button */}
      <button
        type="button"
        onClick={() => {
          logout();
          navigate('/login');
        }}
        title="Sign Out"
        aria-label="Sign out of student account"
        className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
      >
        <LogOut className="w-5 h-5" />
      </button>

      {/* Entire Student Profile Hub Popover */}
      {isOpen && (
        <div
          ref={menuRef}
          role="dialog"
          aria-label="Student Profile and Academic Settings"
          className="absolute right-0 top-full mt-2.5 w-[380px] max-w-[calc(100vw-1.5rem)] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 flex flex-col max-h-[min(88vh,640px)]"
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-brand-950 p-5 text-white shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="w-13 h-13 w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-500 text-white flex items-center justify-center text-lg font-extrabold shadow-lg shadow-brand-500/25 ring-2 ring-white/20">
                    {initial}
                  </div>
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-[9px] font-bold text-white shadow uppercase tracking-wider">
                    PRO
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white leading-tight flex items-center gap-1.5">
                    <span>{user?.full_name || 'Aarav Sharma'}</span>
                    <Award className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                  </h3>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">{user?.email || 'demo@exambuddy.ai'}</p>
                  <p className="text-[10px] text-brand-300 font-medium mt-1">Student ID: #{user?.id || 1} • Active Scholar</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { setIsOpen(false); setIsEditing(false); }}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
                aria-label="Close profile menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Education Badge Bar */}
            <div className="mt-4 pt-3 border-t border-slate-700 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-semibold text-brand-300">
                <GraduationCap className="w-3 h-3 text-amber-400" />
                <span>{user?.course || 'B.Tech CSE'}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-medium text-slate-300">
                <BookOpen className="w-3 h-3 text-brand-400" />
                <span>{user?.semester || 'Semester 5'}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800 text-[10px] font-semibold text-emerald-300">
                <Target className="w-3 h-3" />
                <span>{user?.target_exam || 'Finals & GATE'}</span>
              </span>
            </div>
          </div>

          {/* Body Content: Switch between Overview and Quick Edit */}
          <div className="p-5 overflow-y-auto flex-1">
            {isEditing ? (
              /* QUICK EDIT FORM IN-PLACE */
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-brand-600" />
                    <span>Edit Student Profile Here</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); setErrorMsg(''); setSuccessMsg(''); }}
                    className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
                  >
                    Cancel
                  </button>
                </div>

                {successMsg && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {errorMsg && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <X className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="quick-full_name" className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Student Full Name
                  </label>
                  <input
                    id="quick-full_name"
                    name="full_name"
                    type="text"
                    required
                    value={editForm.full_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                    placeholder="e.g. Aarav Sharma"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="quick-education_level" className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Education Level
                    </label>
                    <select
                      id="quick-education_level"
                      name="education_level"
                      value={editForm.education_level}
                      onChange={handleInputChange}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none bg-white"
                    >
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Postgraduate">Postgraduate</option>
                      <option value="High School">High School (11th/12th)</option>
                      <option value="Competitive Exam Prep">Competitive Exam</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="quick-semester" className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Semester / Year
                    </label>
                    <select
                      id="quick-semester"
                      name="semester"
                      value={editForm.semester}
                      onChange={handleInputChange}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none bg-white"
                    >
                      <option value="Semester 1">Semester 1</option>
                      <option value="Semester 2">Semester 2</option>
                      <option value="Semester 3">Semester 3</option>
                      <option value="Semester 4">Semester 4</option>
                      <option value="Semester 5">Semester 5</option>
                      <option value="Semester 6">Semester 6</option>
                      <option value="Semester 7">Semester 7</option>
                      <option value="Semester 8">Semester 8</option>
                      <option value="Final Year">Final Year</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="quick-course" className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Course / Major / Degree
                  </label>
                  <input
                    id="quick-course"
                    name="course"
                    type="text"
                    value={editForm.course}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                    placeholder="e.g. B.Tech Computer Science & Engineering"
                  />
                </div>

                <div>
                  <label htmlFor="quick-target_exam" className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Target Examination
                  </label>
                  <input
                    id="quick-target_exam"
                    name="target_exam"
                    type="text"
                    value={editForm.target_exam}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                    placeholder="e.g. University Final Examination & GATE"
                  />
                </div>

                <div>
                  <label htmlFor="quick-bio" className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Academic Goal & Bio
                  </label>
                  <textarea
                    id="quick-bio"
                    name="bio"
                    rows={2}
                    value={editForm.bio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none resize-none"
                    placeholder="e.g. Preparing for University Semester Finals and GATE CS."
                  />
                </div>

                <div className="pt-2 sticky bottom-0 bg-white pb-1 flex items-center gap-2 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-60"
                  >
                    {saving ? (
                      <span>Saving...</span>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Profile Changes</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* PROFILE OVERVIEW VIEW */
              <div className="space-y-4">
                {/* Academic Highlights Box */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Academic Curriculum
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Here</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs">
                      <p className="text-[10px] text-slate-500 font-medium">Program / Major</p>
                      <p className="font-bold text-slate-800 truncate mt-0.5" title={user?.course}>
                        {user?.course || 'Computer Science'}
                      </p>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs">
                      <p className="text-[10px] text-slate-500 font-medium">Stage & Semester</p>
                      <p className="font-bold text-slate-800 truncate mt-0.5">
                        {user?.semester || 'Semester 1'}
                      </p>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs col-span-2">
                      <p className="text-[10px] text-slate-500 font-medium">Primary Examination Goal</p>
                      <p className="font-bold text-indigo-700 truncate mt-0.5" title={user?.target_exam}>
                        {user?.target_exam || 'University Semester Finals'}
                      </p>
                    </div>
                  </div>

                  {user?.bio && (
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 text-[11px] text-slate-600 italic">
                      "{user.bio}"
                    </div>
                  )}
                </div>

                {/* Key Student Progress Indicators */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-2">
                    <div className="flex items-center justify-center text-amber-500 mb-0.5">
                      <Flame className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-extrabold text-amber-900 block">5 Days</span>
                    <span className="text-[10px] text-amber-700 font-medium">Study Streak</span>
                  </div>

                  <div className="bg-brand-50/70 border border-brand-200/60 rounded-xl p-2">
                    <div className="flex items-center justify-center text-brand-500 mb-0.5">
                      <FolderOpen className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-extrabold text-brand-900 block">1 Notes</span>
                    <span className="text-[10px] text-brand-700 font-medium">Indexed (RAG)</span>
                  </div>

                  <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-xl p-2">
                    <div className="flex items-center justify-center text-emerald-500 mb-0.5">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-extrabold text-emerald-900 block">82.5%</span>
                    <span className="text-[10px] text-emerald-700 font-medium">Quiz Accuracy</span>
                  </div>
                </div>

                {/* Hub Shortcuts */}
                <div className="space-y-1 pt-1">
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-700 hover:bg-brand-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-brand-600" />
                      <span>Detailed Profile & Password Settings</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    to="/planner"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-700 hover:bg-brand-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span>Study Planner & Revision Calendar</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    to="/performance"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-700 hover:bg-brand-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <BarChart3 className="w-4 h-4 text-emerald-600" />
                      <span>Performance & Score Analytics</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </div>

                {/* Data Portability (DPDP Act) */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleExportData}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                    title="Export your personal student record under DPDP Act 2023"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Export Profile (JSON)</span>
                  </button>

                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>DPDP Act 2023</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar with Logout */}
          <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-slate-500">
              Exam Buddy v1.0 • Academic AI
            </span>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                logout();
                navigate('/login');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200/80 transition-colors"
              aria-label="Sign out of student account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
