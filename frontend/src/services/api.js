import axios from 'axios';
import { safeStorage } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000, // 25s timeout allows AI analysis, RAG indexing, and large document processing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use((config) => {
  const token = safeStorage.getItem('exam_buddy_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor for token expiry and connection error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message?.includes('Network Error') || error.response?.status === 502) {
      console.warn(
        `[Exam Buddy Alert] Backend unreachable via ${API_BASE_URL}. ` +
        `Make sure the FastAPI backend is running on http://127.0.0.1:8001 (run ./run_exam_buddy.ps1).`
      );
    }
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on login check failure
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        // Optional redirect or guest fallback
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (data) => apiClient.post('/auth/register', data),
  getMe: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
  deleteAccount: () => apiClient.delete('/auth/account'),
};

export const documentsAPI = {
  list: (params) => apiClient.get('/documents', { params }),
  get: (id) => apiClient.get(`/documents/${id}`),
  upload: (formData) => apiClient.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => apiClient.put(`/documents/${id}`, data),
  delete: (id) => apiClient.delete(`/documents/${id}`),
  downloadUrl: (id) => `${API_BASE_URL}/documents/${id}/download`,
  getTaxonomy: () => apiClient.get('/documents/meta/taxonomy'),
};

export const assistantAPI = {
  chat: (data) => apiClient.post('/assistant/chat', data),
  listConversations: () => apiClient.get('/assistant/conversations'),
  getConversation: (id) => apiClient.get(`/assistant/conversations/${id}`),
  deleteConversation: (id) => apiClient.delete(`/assistant/conversations/${id}`),
};

export const explainerAPI = {
  explain: (data) => apiClient.post('/explainer/explain', data),
};

export const summarizerAPI = {
  summarize: (data) => apiClient.post('/summarizer/summarize', data),
};

export const questionsAPI = {
  generate: (data) => apiClient.post('/questions/generate', data),
  listQuizzes: () => apiClient.get('/questions/quizzes'),
  submitQuiz: (data) => apiClient.post('/questions/submit-quiz', data),
  evaluateAnswer: (data) => apiClient.post('/questions/evaluate-answer', data),
};

export const ragAPI = {
  query: (data) => apiClient.post('/rag/query', data),
};

export const plannerAPI = {
  listTasks: () => apiClient.get('/planner/tasks'),
  createTask: (data) => apiClient.post('/planner/tasks', data),
  updateTask: (id, data) => apiClient.put(`/planner/tasks/${id}`, data),
  deleteTask: (id) => apiClient.delete(`/planner/tasks/${id}`),
};

export const analyticsAPI = {
  getOverview: () => apiClient.get('/performance/overview'),
};
export const performanceAPI = analyticsAPI;

export default apiClient;
