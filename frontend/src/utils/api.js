const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  health: () => request('/api/health'),
  issues: {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/api/issues${q ? '?' + q : ''}`);
    },
    get: (id) => request(`/api/issues/${id}`),
    create: (formData) => request('/api/issues', { method: 'POST', body: formData }),
    verify: (id, payload) =>
      request(`/api/issues/${id}/verify`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    updateStatus: (id, payload) =>
      request(`/api/issues/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
  },
  users: {
    leaderboard: () => request('/api/users/leaderboard'),
    create: (payload) =>
      request('/api/users', { method: 'POST', body: JSON.stringify(payload) }),
    badges: () => request('/api/users/badges'),
  },
  ai: {
    analyze: (text) =>
      request('/api/ai/analyze', { method: 'POST', body: JSON.stringify({ text }) }),
    hotspots: () => request('/api/ai/hotspots'),
  },
  stats: () => request('/api/stats'),
};

export const assetUrl = (p) => (p?.startsWith('http') ? p : `${BASE}${p}`);
