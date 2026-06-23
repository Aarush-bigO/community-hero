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
  agent: {
    ask: (question) =>
      request('/api/agent/ask', { method: 'POST', body: JSON.stringify({ question }) }),
  },
  pulse: {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/api/pulse${q ? '?' + q : ''}`);
    },
    summary: () => request('/api/pulse/summary'),
    simulate: () => request('/api/pulse/simulate', { method: 'POST' }),
  },
  assets: {
    roads: () => request('/api/assets/roads.json'),
    classify: (lat, lng) => request(`/api/assets/classify?lat=${lat}&lng=${lng}`),
    duplicates: (lat, lng, category) =>
      request(`/api/assets/duplicates?lat=${lat}&lng=${lng}&category=${encodeURIComponent(category)}`),
  },
  admin: {
    queue: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/api/admin/queue${q ? '?' + q : ''}`);
    },
    breaches: () => request('/api/admin/breaches'),
    departments: () => request('/api/admin/departments'),
    deptMetrics: () => request('/api/admin/dept-metrics'),
    staff: () => request('/api/admin/staff'),
    assign: (id, payload) =>
      request(`/api/admin/issues/${id}/assign`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    resolve: (id, formData) =>
      request(`/api/admin/issues/${id}/resolve`, { method: 'POST', body: formData }),
  },
  stats: () => request('/api/stats'),
};

export const assetUrl = (p) => (p?.startsWith('http') ? p : `${BASE}${p}`);
