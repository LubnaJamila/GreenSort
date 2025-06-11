const BASE_URL = 'https://greenshort-production.up.railway.app'; // Backend kamu jalan di sini

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

export async function getUserDetailById(id_user) {
  try {
    const res = await fetch(`${BASE_URL}/api/user/${id_user}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Gagal mengambil detail user:", err);
    return { success: false, message: "Terjadi kesalahan saat mengambil data" };
  }
}
export async function updateUserProfile(id_user, data) {
  try {
    const res = await fetch(`${BASE_URL}/api/user/${id_user}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    return await res.json();
  } catch (err) {
    console.error("Gagal update profil:", err);
    return { success: false, message: "Terjadi kesalahan saat update profile" };
  }
}
export async function changePassword(id_user, data) {
  try {
    const res = await fetch(`${BASE_URL}/api/user/password/${id_user}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (err) {
    console.error("Gagal ubah password:", err);
    return { success: false, message: "Terjadi kesalahan" };
  }
}
export async function getRekeningByUserId(id_user) {
  try {
    const res = await fetch(`${BASE_URL}/api/rekening/${id_user}`);
    const result = await res.json();
    return result;
  } catch (err) {
    console.error("Gagal mengambil data rekening:", err);
    return { success: false, message: "Terjadi kesalahan saat mengambil data rekening" };
  }
}
export async function createRekening(dataRekening) {
  try {
    const res = await fetch(`${BASE_URL}/api/rekening`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataRekening)
    });

    return await res.json();
  } catch (err) {
    console.error("Gagal menyimpan rekening:", err);
    return { success: false, message: "Terjadi kesalahan saat menyimpan rekening" };
  }
}
export async function getBankList() {
  try {
    const res = await fetch(`${BASE_URL}/api/banks`);
    return await res.json();
  } catch (err) {
    console.error("Gagal mengambil daftar bank:", err);
    return [];
  }
}
export async function deleteRekeningById(id_rekening) {
  try {
    const res = await fetch(`${BASE_URL}/api/rekening/${id_rekening}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    console.error("Gagal menghapus rekening:", error);
    return { success: false, message: "Terjadi kesalahan saat menghapus rekening." };
  }
}
export async function updateRekeningById(id_rekening, data) {
  try {
    const res = await fetch(`http://localhost:3000/api/rekening/${id_rekening}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: "Network error" };
  }
}


export function logoutUser() {
  localStorage.removeItem('currentUser');
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}
