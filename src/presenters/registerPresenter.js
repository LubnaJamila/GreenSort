// src/presenters/registerPresenter.js
import { registerUser } from '../models/authModel.js';
import RegisterView from '../views/registerView.js';

export default class RegisterPresenter {
  constructor() {
    this.view = new RegisterView();
    this.registerForm = null;
  }

  init() {
    // Render the view
    this.view.render();
    
    // Setup form event listener setelah view di-render
    this.setupFormListener();
    
    // Listen for navigation events
    // this.setupNavigationListener();
  }

  // DIPISAHKAN: untuk menghindari masalah DOMContentLoaded
  setupFormListener() {
    // Get register form element
    this.registerForm = document.getElementById('registerForm');
    
    if (this.registerForm) {
      // Pastikan event listener hanya ditambahkan sekali
      this.registerForm.removeEventListener('submit', this.handleRegisterSubmit.bind(this));
      this.registerForm.addEventListener('submit', this.handleRegisterSubmit.bind(this));
    } else {
      console.error('Register form not found in the DOM');
    }
  }
  
  // DIPISAHKAN: untuk kejelasan kode
  setupNavigationListener() {
    // Remove any existing event listeners to prevent duplication
    document.removeEventListener('navigate', this.handleNavigate);
    
    // Add new event listener
    this.handleNavigate = (event) => {
      if (event.detail.page === 'login') {
        // Navigate to login page melalui custom event
        const navEvent = new CustomEvent('navigate', { detail: { page: 'login' } });
        document.dispatchEvent(navEvent);
      }
    };
    
    document.addEventListener('navigate', this.handleNavigate);
  }

  // Handle form submit for registration
  async handleRegisterSubmit(event) {
    event.preventDefault();
    
    try {
      // Get data from form using view method
      const userData = this.view.getRegisterFormData();
      
      // Validate data
      if (!this.validateUserData(userData)) {
        return;
      }
      
      // Send data to model for registration
      const result = await registerUser(userData);
      
      if (result.success) {
        // Show success message
        this.view.showRegisterSuccess();
        
        // Redirect to login page after successful registration
        setTimeout(() => {
          // Menggunakan event navigate yang konsisten
          const event = new CustomEvent('navigate', { detail: { page: 'login' } });
          document.dispatchEvent(event);
        }, 1500);
      } else {
        // Show error message
        this.view.showRegisterError(result.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      this.view.showRegisterError('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
    }
  }

  // Validate user data
  validateUserData(userData) {
    // Validasi tetap sama seperti sebelumnya
    if (!userData.name || !userData.email || !userData.phone || 
        !userData.username || !userData.password || !userData.rePassword) {
      this.view.showRegisterError('Semua field harus diisi!');
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      this.view.showRegisterError('Email tidak valid!');
      return false;
    }
    
    // Validate phone number (digits only)
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(userData.phone)) {
      this.view.showRegisterError('Nomor telepon hanya boleh berisi angka!');
      return false;
    }
    
    // Validate password length (minimum 6 characters)
    if (userData.password.length < 6) {
      this.view.showRegisterError('Password minimal 6 karakter!');
      return false;
    }
    
    // Validate password match
    if (userData.password !== userData.rePassword) {
      this.view.showRegisterError('Konfirmasi password tidak cocok!');
      return false;
    }
    
    return true;
  }
}