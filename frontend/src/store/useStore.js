import { create } from 'zustand';

export const useStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('ch_user') || 'null'),
  setUser: (user) => {
    if (user) localStorage.setItem('ch_user', JSON.stringify(user));
    else localStorage.removeItem('ch_user');
    set({ user });
  },

  issues: [],
  setIssues: (issues) => set({ issues }),
  addIssue: (issue) => set({ issues: [issue, ...get().issues] }),

  stats: null,
  setStats: (stats) => set({ stats }),

  toast: null,
  showToast: (toast) => {
    set({ toast });
    setTimeout(() => set({ toast: null }), 3500);
  },
}));
