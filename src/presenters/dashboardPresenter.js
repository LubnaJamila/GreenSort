// src/presenters/dashboardPresenter.js
import DashboardView from '../views/dashboardView.js';
import { getCurrentUser, logoutUser } from '../models/authModel.js';
import { isAuthenticated, formatCurrency } from '../utils/utils.js';

export default class DashboardPresenter {
  constructor() {
    this.view = new DashboardView();
    this.currentUser = null;
    
    // Binding metode
    this.handleLogout = this.handleLogout.bind(this);
  }

  init() {
    console.log('Initializing DashboardPresenter');
    
    // Check if user is logged in
    this.currentUser = getCurrentUser();
    if (!this.currentUser) {
      console.log('User not logged in, redirecting to login');
      // Redirect to login
      const event = new CustomEvent('navigate', { detail: { page: 'login' } });
      document.dispatchEvent(event);
      return;
    }
    
    // Render dashboard view
    this.view.render();
    
    // Display user information
    this.view.displayUserInfo(this.currentUser);
    
    // Load and display dashboard data
    this.view.renderDashboardData(this.currentUser);
    
    // Setup event listeners
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Listen for logout event
    document.addEventListener('user-logout', this.handleLogout);
  }
  
  handleLogout() {
    console.log('Logout initiated');
    // Call logout function from auth model
    logoutUser();
    
    // Navigate to login page
    const event = new CustomEvent('navigate', { detail: { page: 'login' } });
    document.dispatchEvent(event);
  }
  
  destroy() {
    console.log('Destroying DashboardPresenter');
    // Remove event listeners
    document.removeEventListener('user-logout', this.handleLogout);
    
    // Destroy view
    this.view.destroy();
  }
}