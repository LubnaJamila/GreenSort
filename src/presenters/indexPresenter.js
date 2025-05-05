// src/presenters/indexPresenter.js
import IndexView from '../views/indexView.js';
import Router from '../routes/router.js';

export default class IndexPresenter {
  constructor() {
    this.view = new IndexView();
    this.router = new Router();
    
    // Tambahkan event listener untuk navigasi
    this.setupNavigationListener();
  }

  init() {
    console.log('Initializing IndexPresenter');
    this.view.render();
  }
  
  setupNavigationListener() {
    // Dengarkan event navigate yang dipancarkan dari view
    document.addEventListener('navigate', (event) => {
      console.log('Navigation event received:', event.detail);
      if (event.detail && event.detail.page) {
        this.router.navigateTo(event.detail.page);
      }
    });
  }

  destroy() {
    console.log('Destroying IndexPresenter');
    // Hapus event listener saat presenter dihancurkan
    document.removeEventListener('navigate', this.handleNavigation);
    // Pastikan view juga dibersihkan
    this.view.destroy();
  }

  // setupNavigation() {
  //   document.addEventListener('DOMContentLoaded', () => {
  //     const registerBtn = document.getElementById('register-btn');
  //     if (registerBtn) {
  //       registerBtn.addEventListener('click', (e) => {
  //         // Cek apakah pengguna sudah login
  //         const currentUser = localStorage.getItem('currentUser');
  //         if (currentUser) {
  //           e.preventDefault();
  //           alert('Anda sudah login. Silahkan logout terlebih dahulu untuk membuat akun baru.');
  //         } else {
  //           // Navigasi ke halaman register dengan path yang benar
  //           this.router.navigateTo('src/pages/register.html');
  //         }
  //       });
  //     }
      
  //     const loginBtn = document.getElementById('login-btn');
  //     if (loginBtn) {
  //       loginBtn.addEventListener('click', (e) => {
  //         // Cek apakah pengguna sudah login
  //         const currentUser = localStorage.getItem('currentUser');
  //         if (currentUser) {
  //           e.preventDefault();
  //           alert('Anda sudah login.');
  //         } else {
  //           // Navigasi ke halaman login dengan path yang benar
  //           this.router.navigateTo('src/pages/login.html');
  //         }
  //       });
  //     }
  //   });
  // }
}