// Central API client for MissNous Admin
// All requests go through this file

const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://miss-nous-backend.vercel.app/api';
  }
  return 'http://localhost:5000/api';
};

const RAW_URL = getApiBase();
export const BASE_URL = RAW_URL.endsWith('/api') ? RAW_URL : `${RAW_URL.replace(/\/$/, '')}/api`;

// Get JWT token from active session
const getToken = () => {
  try {
    const token = sessionStorage.getItem('missnous_admin_token');
    if (token) return token;
    const sessionUser = sessionStorage.getItem('missnous_admin_user');
    if (sessionUser) {
      const parsed = JSON.parse(sessionUser);
      return parsed.token || null;
    }
  } catch (e) {}
  return null;
};

// Generic fetch wrapper
const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      try {
        sessionStorage.removeItem('missnous_admin_token');
        sessionStorage.removeItem('missnous_admin_user');
        localStorage.removeItem('missnous_current_user');
        window.dispatchEvent(new Event('auth_unauthorized'));
      } catch (e) {}
    }
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' })
};

export default api;
