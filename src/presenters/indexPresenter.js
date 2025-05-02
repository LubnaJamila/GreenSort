// src/presenters/indexPresenter.js
import IndexView from '../views/indexView.js';
import Router from '../routes/router.js';

export default class IndexPresenter {
  constructor() {
    this.view = new IndexView();
    this.router = new Router();
  }

  init() {
    // Render halaman utama
    this.view.render();
    
    // Setup navigasi untuk tombol register dan login
    this.setupNavigation();
  }

  setupNavigation() {
    // Event listener sudah dihandle di dalam view, tetapi presenter bisa
    // menambahkan logika tambahan di sini jika diperlukan
    
    // Misalnya, untuk memastikan pengguna belum login sebelum mengarahkan ke halaman register
    document.addEventListener('DOMContentLoaded', () => {
      const registerBtn = document.getElementById('register-btn');
      if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
          // Cek apakah pengguna sudah login
          const currentUser = localStorage.getItem('currentUser');
          if (currentUser) {
            e.preventDefault();
            alert('Anda sudah login. Silahkan logout terlebih dahulu untuk membuat akun baru.');
          } else {
            // Navigasi ke halaman register dengan path yang benar
            this.router.navigateTo('src/pages/register.html');
          }
        });
      }
      
      const loginBtn = document.getElementById('login-btn');
      if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
          // Cek apakah pengguna sudah login
          const currentUser = localStorage.getItem('currentUser');
          if (currentUser) {
            e.preventDefault();
            alert('Anda sudah login.');
          } else {
            // Navigasi ke halaman login dengan path yang benar
            this.router.navigateTo('src/pages/login.html');
          }
        });
      }
    });
  }
}