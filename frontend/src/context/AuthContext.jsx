import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { safeStorage } from '../utils/storage';

const AuthContext = createContext(null);

export const DEFAULT_DEMO_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3OTU2NjUxNTgsInN1YiI6IjEifQ.Ar_eb-aw4jiHXIVGiZQQz0weLJ9V2vjPWBkC8_SDbQ8';

export const DEFAULT_DEMO_STUDENT = {
  id: 1,
  email: 'demo@exambuddy.ai',
  full_name: 'Aarav Sharma',
  education_level: 'Undergraduate',
  course: 'B.Tech Computer Science & Engineering',
  semester: 'Semester 5',
  target_exam: 'University Final Examination & GATE',
  bio: 'Preparing for University Semester Finals and GATE CS.',
  created_at: '2026-08-01T09:00:00.000Z',
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const saved = safeStorage.getItem('exam_buddy_token');
    if (!saved || saved === 'undefined' || saved === 'null') {
      return null;
    }
    return saved;
  });

  const [user, setUser] = useState(() => {
    const savedUser = safeStorage.getItem('exam_buddy_user');
    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = safeStorage.getItem('exam_buddy_token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res?.data) {
            setUser(res.data);
            safeStorage.setItem('exam_buddy_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn("Backend server auth check:", err.message);
          if (err.response?.status === 401) {
            safeStorage.removeItem('exam_buddy_token');
            safeStorage.removeItem('exam_buddy_user');
            setToken(null);
            setUser(null);
          }
        }
      } else {
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login(email, password);
      const { access_token, user: userData } = res.data;
      safeStorage.setItem('exam_buddy_token', access_token);
      safeStorage.setItem('exam_buddy_user', JSON.stringify(userData));
      setToken(access_token);
      setUser(userData);
      return userData;
    } catch (err) {
      if (email === 'demo@exambuddy.ai' || !err.response) {
        console.warn("Activating demo student profile...");
        const demoUser = {
          ...DEFAULT_DEMO_STUDENT,
          email: email || DEFAULT_DEMO_STUDENT.email,
        };
        const demoToken = 'demo_session_token_exam_buddy_2026';
        safeStorage.setItem('exam_buddy_token', demoToken);
        safeStorage.setItem('exam_buddy_user', JSON.stringify(demoUser));
        setToken(demoToken);
        setUser(demoUser);
        return demoUser;
      }
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await authAPI.register(userData);
      const { access_token, user: createdUser } = res.data;
      safeStorage.setItem('exam_buddy_token', access_token);
      safeStorage.setItem('exam_buddy_user', JSON.stringify(createdUser));
      setToken(access_token);
      setUser(createdUser);
      return createdUser;
    } catch (err) {
      if (!err.response) {
        const offlineUser = {
          id: Date.now(),
          email: userData.email,
          full_name: userData.full_name,
          education_level: userData.education_level || 'Undergraduate',
          course: userData.course || 'Computer Science',
          semester: userData.semester || 'Semester 1',
          target_exam: userData.target_exam || 'Semester Finals',
          bio: userData.bio || '',
          created_at: new Date().toISOString(),
        };
        const offlineToken = 'offline_token_' + Date.now();
        safeStorage.setItem('exam_buddy_token', offlineToken);
        safeStorage.setItem('exam_buddy_user', JSON.stringify(offlineUser));
        setToken(offlineToken);
        setUser(offlineUser);
        return offlineUser;
      }
      throw err;
    }
  };

  const logout = () => {
    safeStorage.removeItem('exam_buddy_token');
    safeStorage.removeItem('exam_buddy_user');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updateData) => {
    try {
      const res = await authAPI.updateProfile(updateData);
      setUser(res.data);
      safeStorage.setItem('exam_buddy_user', JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      const updated = { ...user, ...updateData };
      setUser(updated);
      safeStorage.setItem('exam_buddy_user', JSON.stringify(updated));
      return updated;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
