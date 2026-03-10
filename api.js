// simple wrapper for the express backend APIs
// Use the backend server on port 3000, accommodate both frontend ports (8000 for development, 3000 for production)
const BASE = window.location.port === '3000' ? '/api' : 'http://localhost:3000/api';

async function request(path, options = {}) {
  const headers = options.headers || {};
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  headers['Content-Type'] = 'application/json';
  try {
    const res = await fetch(BASE + path, { ...options, headers });
    if (!res.ok) {
      // special-case 401 to avoid confusing messages when credentials fail
      if (res.status === 401) {
        // try to parse the JSON body for a clearer message
        try {
          const data = await res.json();
          throw new Error(data.error || 'Invalid credentials or unauthorized');
        } catch {
          throw new Error('Invalid credentials or unauthorized');
        }
      }
      // Try to parse error as JSON, fallback to status text
      try {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
      } catch (e) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
    }
    const data = await res.json();
    return data;
  } catch (err) {
    // Handle network errors and JSON parsing errors
    if (err instanceof SyntaxError) {
      throw new Error('Invalid server response. Please check if the backend server is running on port 3000.');
    }
    throw err;
  }
}

export async function signUpUser(user) {
  return request('/auth/signup', { method: 'POST', body: JSON.stringify(user) });
}

export async function signInUser(creds) {
  const data = await request('/auth/signin', { method: 'POST', body: JSON.stringify(creds) });
  if (data.token) localStorage.setItem('token', data.token);
  return data;
}

export async function getMe() {
  return request('/auth/me');
}

export async function updateProfile(data) {
  return request('/auth/me', { method: 'PUT', body: JSON.stringify(data) });
}

export async function uploadProfilePicture(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  // Don't set Content-Type for FormData - browser will set it with boundary
  
  try {
    const res = await fetch(BASE + '/auth/me/profile-picture', {
      method: 'POST',
      headers,
      body: formData
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || `HTTP ${res.status}`);
    }
    return res.json();
  } catch (err) {
    throw err;
  }
}

export async function removeProfilePicture() {
  const headers = {};
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  headers['Content-Type'] = 'application/json';
  
  try {
    const res = await fetch(BASE + '/auth/me/profile-picture', {
      method: 'DELETE',
      headers
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || `HTTP ${res.status}`);
    }
    return res.json();
  } catch (err) {
    throw err;
  }
}

export async function submitApplication(app) {
  return request('/application', { method: 'POST', body: JSON.stringify(app) });
}

export async function getMyApplications() {
  return request('/applications');
}

export async function logout() {
  localStorage.removeItem('token');
}

// more helper end points can be added as needed...
