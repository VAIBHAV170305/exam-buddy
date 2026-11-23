import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    education_level: 'Undergraduate',
    course: '',
    semester: '',
    target_exam: '',
    bio: ''
  });
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [parentalConsent, setParentalConsent] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consentAgreed) {
      setError('You must agree to the Terms & Privacy Policy to register.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please check your information.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center">
        <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-600 text-white shadow-sm mb-3">
          <GraduationCap className="w-7 h-7" aria-hidden="true" />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Create Student Account</h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-600 font-normal">
          Personalize Exam Buddy for your syllabus and upcoming examinations
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-slate-200 sm:px-10 space-y-5">
          {error && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-fullname" className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <input
                    id="reg-fullname"
                    type="text"
                    required
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="e.g. Aarav Sharma"
                    className="block w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-600 focus:border-brand-600"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-email" className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@college.edu"
                    className="block w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-600 focus:border-brand-600"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-xs font-bold text-slate-700 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" aria-hidden="true" />
                </div>
                <input
                  id="reg-password"
                  type="password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="block w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-600 focus:border-brand-600"
                />
              </div>
            </div>

            {/* Academic Level & Semester */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-education" className="block text-xs font-bold text-slate-700 mb-1">
                  Education Level
                </label>
                <select
                  id="reg-education"
                  name="education_level"
                  value={formData.education_level}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-brand-600 focus:border-brand-600"
                >
                  <option value="High School">High School (11th / 12th)</option>
                  <option value="Undergraduate">Undergraduate (B.Tech / B.Sc / MBBS)</option>
                  <option value="Graduate">Graduate / Master's (M.Tech / MBA)</option>
                  <option value="Competitive Exam">Competitive Exam Aspirant (GATE, GRE)</option>
                </select>
              </div>

              <div>
                <label htmlFor="reg-semester" className="block text-xs font-bold text-slate-700 mb-1">
                  Semester / Year
                </label>
                <input
                  id="reg-semester"
                  type="text"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  placeholder="e.g. Semester 5"
                  className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-600 focus:border-brand-600"
                />
              </div>
            </div>

            {/* Course & Target Exam */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-course" className="block text-xs font-bold text-slate-700 mb-1">
                  Course / Major
                </label>
                <input
                  id="reg-course"
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science & Eng"
                  className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-600 focus:border-brand-600"
                />
              </div>

              <div>
                <label htmlFor="reg-target-exam" className="block text-xs font-bold text-slate-700 mb-1">
                  Target Examination
                </label>
                <input
                  id="reg-target-exam"
                  type="text"
                  name="target_exam"
                  value={formData.target_exam}
                  onChange={handleChange}
                  placeholder="e.g. University Finals, GATE"
                  className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-600 focus:border-brand-600"
                />
              </div>
            </div>

            {/* Statutory DPDP & Terms Consent Checkboxes */}
            <div className="pt-2 space-y-3 border-t border-slate-200">
              <div className="flex items-start gap-2.5">
                <input
                  id="reg-consent"
                  type="checkbox"
                  required
                  checked={consentAgreed}
                  onChange={(e) => setConsentAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-brand-600 bg-white border-slate-300 focus:ring-brand-500 cursor-pointer"
                />
                <label htmlFor="reg-consent" className="text-xs text-slate-700 leading-relaxed cursor-pointer select-none">
                  I agree to the{' '}
                  <Link to="/terms" target="_blank" className="text-brand-600 hover:text-brand-700 underline font-bold">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy-policy" target="_blank" className="text-brand-600 hover:text-brand-700 underline font-bold">
                    Privacy Policy
                  </Link>
                  , and consent to processing my academic data strictly under the <strong>Digital Personal Data Protection Act, 2023</strong>. <span className="text-rose-500">*</span>
                </label>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  id="reg-parental"
                  type="checkbox"
                  checked={parentalConsent}
                  onChange={(e) => setParentalConsent(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-brand-600 bg-white border-slate-300 focus:ring-brand-500 cursor-pointer"
                />
                <label htmlFor="reg-parental" className="text-[11px] text-slate-500 leading-relaxed cursor-pointer select-none">
                  (Optional Declaration): If under 18 years of age, I confirm I have obtained the consent of my parent or lawful guardian as required under Section 9 of the DPDP Act 2023.
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !consentAgreed}
              aria-label="Complete Student Registration"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors mt-3 focus-visible:ring-2 focus-visible:ring-brand-500 focus:outline-none"
            >
              <span>{submitting ? 'Creating Profile...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-600 pt-1">
            Already registered?{' '}
            <Link to="/login" className="text-brand-600 hover:text-brand-700 font-bold underline">
              Sign into account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
