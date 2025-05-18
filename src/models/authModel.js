const BASE_URL = 'http://localhost:3000'; // Backend kamu jalan di sini

export async function registerUser(userData) {
  // Kirim data ke backend
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  const result = await res.json();
  return result;
}

export async function loginUser(credentials) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  const result = await res.json();

  // Jika login berhasil, simpan user ke localStorage
  if (result.success) {
    localStorage.setItem('currentUser', JSON.stringify(result.user));
  }

  return result;
}

export function logoutUser() {
  localStorage.removeItem('currentUser');
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}
