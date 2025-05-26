// src/presenters/registerPresenter.js
import { registerUser } from '../../models/authModel.js';
import RegisterView from './registerView.js';

export default class RegisterPresenter {
  constructor() {
    this.view = new RegisterView();
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    this.handleNavigate = this.handleNavigate.bind(this);
  }

  init() {
    console.log('Initializing RegisterPresenter');
    // Render the view
    this.view.render();
    
    // Setup form event listener setelah view di-render
    this.setupFormListener();
    
    // Listen for navigation events
    this.setupNavigationListener();
  }

  setupFormListener() {
    // Get register form element
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
      // Pastikan event listener hanya ditambahkan sekali
      registerForm.removeEventListener('submit', this.handleRegisterSubmit);
      registerForm.addEventListener('submit', this.handleRegisterSubmit);
      console.log('Register form event listener added');
    } else {
      console.error('Register form not found in the DOM');
    }
  }
  
  setupNavigationListener() {
    // Remove any existing event listeners to prevent duplication
    document.removeEventListener('navigate', this.handleNavigate);
    
    // Add new event listener
    document.addEventListener('navigate', this.handleNavigate);
  }
  
  handleNavigate(event) {
    console.log('Navigation event received:', event.detail);
    // We don't handle the navigation here, just let it propagate to main.js
  }

  // Handle form submit for registration
  async handleRegisterSubmit(event) {
    event.preventDefault();
    console.log('Register form submitted');
    
    try {
      // Get data from form using view method
      const userData = this.view.getRegisterFormData();
      console.log('Form data:', userData);
      
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
  
  // Untuk membersihkan event listener dan view saat berpindah halaman
  destroy() {
    console.log('Destroying RegisterPresenter');
    document.removeEventListener('navigate', this.handleNavigate);
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.removeEventListener('submit', this.handleRegisterSubmit);
    }
    
    // Bersihkan view
    this.view.destroy();
  }
}