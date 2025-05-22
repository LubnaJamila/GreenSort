// src/presenters/loginPresenter.js
import { loginUser } from '../models/authModel.js';
import LoginView from '../views/loginView.js';

export default class LoginPresenter {
  constructor() {
    this.view = new LoginView();
    // Binding fungsi untuk event handler
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleNavigate = this.handleNavigate.bind(this);
  }

  init() {
    console.log('Initializing LoginPresenter');
    // Render the view
    this.view.render();
    
    // Setup form event listener setelah view di-render
    this.setupFormListener();
    
    // Listen for navigation events
    this.setupNavigationListener();
  }

  setupFormListener() {
    // Get login form element
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
      // Pastikan event listener hanya ditambahkan sekali
      loginForm.removeEventListener('submit', this.handleLoginSubmit);
      loginForm.addEventListener('submit', this.handleLoginSubmit);
      console.log('Login form event listener added');
    } else {
      console.error('Login form not found in the DOM');
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

  // Handle form submit for login
  async handleLoginSubmit(event) {
    event.preventDefault();
    console.log('Login form submitted');
    
    try {
      // Get data from form using view method
      const credentials = this.view.getLoginFormData();
      console.log('Form data:', credentials);
      
      // Validate data
      if (!this.validateCredentials(credentials)) {
        return;
      }
      
      // Send data to model for login
      const result = await loginUser(credentials);
      
      if (result.success) {
      const user = result.user;
      const targetPage = user.role === 'admin' ? 'dashboard' : 'dashboardUser';
      const event = new CustomEvent('navigate', { detail: { page: targetPage } });
      document.dispatchEvent(event);
    }
    else {
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
  
  // Untuk membersihkan event listener dan view saat berpindah halaman
  destroy() {
    console.log('Destroying LoginPresenter');
    document.removeEventListener('navigate', this.handleNavigate);
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.removeEventListener('submit', this.handleLoginSubmit);
    }
    
    // Bersihkan view
    this.view.destroy();
  }
}