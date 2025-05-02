// src/models/authModel.js
export async function registerUser(userData) {
    // Simulasi API: simpan data di localStorage
    if (userData.password !== userData.rePassword) {
    return { success: false, message: 'Password tidak cocok!' };
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const exist = users.find(u => u.email === userData.email || u.username === userData.username);

    if (exist) {
    return { success: false, message: 'User sudah terdaftar!' };
    }

    users.push({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    username: userData.username,
    password: userData.password
    });

    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, message: 'Pendaftaran berhasil!' };
}

export async function loginUser(credentials) {
    // Simulasi login dengan localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u =>
    (u.email === credentials.emailOrUsername || u.username === credentials.emailOrUsername) &&
    u.password === credentials.password
    );

    if (user) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, message: 'Login berhasil!' };
    } else {
    return { success: false, message: 'Email/Username atau Password salah!' };
    }
}

export function logoutUser() {
    sessionStorage.removeItem('currentUser');
}

export function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('currentUser'));
}
