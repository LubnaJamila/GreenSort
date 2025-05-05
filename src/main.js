// src/main.js
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs5';
import 'datatables.net-responsive';
import 'datatables.net-responsive-bs5';

// CSS
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Presenters
import IndexPresenter from './presenters/indexPresenter.js';
import RegisterPresenter from './presenters/registerPresenter.js';
import LoginPresenter from './presenters/loginPresenter.js';
import DashboardPresenter from './presenters/dashboardPresenter.js';
import Router from './routes/router.js';

class App {
  constructor() {
    this.router = new Router();
    this.currentPresenter = null;
    
    // Listen for navigate events
    document.addEventListener('navigate', this.handleNavigateEvent.bind(this));
    
    // Register route handlers
    this.setupRouteHandlers();
  }
  
  setupRouteHandlers() {
    // Handle route changes
    this.router.onRouteChange(({ page }) => {
      console.log(`Route changed to: ${page}`);
      this.loadPage(page);
    });
    
    // Initial page load
    const initialPage = this.router.getCurrentRoute();
    console.log(`Initial page: ${initialPage}`);
    this.loadPage(initialPage);
  }
  
  handleNavigateEvent(event) {
    if (event.detail && event.detail.page) {
      console.log('Navigation event received:', event.detail);
      this.router.navigateTo(event.detail.page);
    }
  }
  
  loadPage(page) {
    // Clean up previous presenter if exists
    if (this.currentPresenter) {
      this.currentPresenter.destroy();
      this.currentPresenter = null;
    }
    
    // Create and initialize the appropriate presenter
    switch (page) {
      case 'index':
        this.currentPresenter = new IndexPresenter();
        break;
      case 'register':
        this.currentPresenter = new RegisterPresenter();
        break;
      case 'login':
        this.currentPresenter = new LoginPresenter();
        break;
      case 'dashboard':
        this.currentPresenter = new DashboardPresenter();
        break;
      default:
        // Default to index if page not found
        this.currentPresenter = new IndexPresenter();
    }
    
    // Initialize the new presenter
    if (this.currentPresenter) {
      this.currentPresenter.init();
    }
  }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
});