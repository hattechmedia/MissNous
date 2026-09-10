// Central API client for MissNous Frontend
// All requests go through this file

const RAW_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const BASE_URL = RAW_URL.endsWith('/api') ? RAW_URL : `${RAW_URL.replace(/\/$/, '')}/api`;

// Get JWT token from localStorage
const getToken = () => {
  try {
    const user = localStorage.getItem('missnous_current_user');
    if (user) {
      const parsed = JSON.parse(user);
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
