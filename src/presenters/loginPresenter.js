// src/presenters/loginPresenter.js
import { loginUser } from '../models/authModel.js';
import LoginView from '../views/loginView.js';

export default class LoginPresenter {
  constructor() {
    this.view = new LoginView();
    this.loginForm = null;
  }

  init() {
    // Render the view
    this.view.render();
    
    // Setup form event listener setelah view di-render
    this.setupFormListener();
    
    // Listen for navigation events
    this.setupNavigationListener();
  }

  // DIPISAHKAN: untuk menghindari masalah DOMContentLoaded
  setupFormListener() {
    // Get login form element
    this.loginForm = document.getElementById('loginForm');
    
    if (this.loginForm) {
      // Pastikan event listener hanya ditambahkan sekali
      this.loginForm.removeEventListener('submit', this.handleLoginSubmit.bind(this));
      this.loginForm.addEventListener('submit', this.handleLoginSubmit.bind(this));
    } else {
      console.error('Login form not found in the DOM');
    }
  }
  
  // DIPISAHKAN: untuk kejelasan kode
  setupNavigationListener() {
    // Remove any existing event listeners to prevent duplication
    document.removeEventListener('navigate', this.handleNavigate);
    
    // Add new event listener
    this.handleNavigate = (event) => {
      if (event.detail.page === 'register') {
        // Navigate to register page melalui custom event
        const navEvent = new CustomEvent('navigate', { detail: { page: 'register' } });
        document.dispatchEvent(navEvent);
      }
    };
    
    document.addEventListener('navigate', this.handleNavigate);
  }

  // Handle form submit for login
  async handleLoginSubmit(event) {
    event.preventDefault();
    
    try {
      // Get data from form using view method
      const credentials = this.view.getLoginFormData();
      
      // Validate data
      if (!this.validateCredentials(credentials)) {
        return;
      }
      
      // Send data to model for login
      const result = await loginUser(credentials);
      
      if (result.success) {
        // Show success message
        this.view.showLoginSuccess();
        
        // Redirect to main page after successful login
        setTimeout(() => {
          // Menggunakan event navigate yang konsisten
          const event = new CustomEvent('navigate', { detail: { page: 'dashboard' } });
          document.dispatchEvent(event);
        }, 1500);
      } else {
        // Show error message
        this.view.showLoginError(result.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      this.view.showLoginError('Terjadi kesalahan saat login. Silakan coba lagi.');
    }
  }
  
  // Validate login credentials
  validateCredentials(credentials) {
    // Validasi tetap sama seperti sebelumnya
    if (!credentials.emailOrUsername || !credentials.password) {
      this.view.showLoginError('Email/Username dan Password harus diisi!');
      return false;
    }
    
    if (credentials.password.length < 6) {
      this.view.showLoginError('Password minimal 6 karakter!');
      return false;
    }
    
    return true;
  }
}