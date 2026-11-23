// Safe storage utility with in-memory fallback for privacy browsers (Brave Shields, Safari Private Mode)
const memoryStorage = new Map();

export const safeStorage = {
  getItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const val = window.localStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch (e) {
      // Access blocked by browser shield
    }
    return memoryStorage.get(key) || null;
  },

  setItem: (key, value) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      // Access blocked
    }
    memoryStorage.set(key, String(value));
  },

  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      // Access blocked
    }
    memoryStorage.delete(key);
  },
};
