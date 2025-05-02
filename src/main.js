// src/main.js
import IndexPresenter from './presenters/indexPresenter.js';
import RegisterPresenter from './presenters/registerPresenter.js';
import LoginPresenter from './presenters/loginPresenter.js';
import Router from './routes/router.js';

class App {
  constructor() {
    this.router = new Router();
    this.currentPresenter = null;
    this.setupRoutes();
    this.setupNavigationListeners();
  }

  setupRoutes() {
    // Initial route setup based on URL
    this.handleRouteChange();
    
    // Listen for URL changes
    window.addEventListener('popstate', () => {
      this.handleRouteChange();
    });
    
    // Listen for internal page change events
    document.addEventListener('pageChanged', (event) => {
      const page = event.detail.page;
      console.log('Page changed to:', page);
      this.loadPresenter(page);
    });
  }
  
  // DITAMBAHKAN: Listen for navigation requests
  setupNavigationListeners() {
    document.addEventListener('navigate', (event) => {
      const page = event.detail.page;
      console.log('Navigation request to:', page);
      
      // Update browser history and trigger page change
      window.history.pushState({}, '', page);
      const pageChangedEvent = new CustomEvent('pageChanged', { detail: { page } });
      document.dispatchEvent(pageChangedEvent);
    });
  }
  
  handleRouteChange() {
    // Get current path
    const path = window.location.pathname;
    console.log('Current path:', path);
    
    // Determine which page to load
    if (path.includes('register')) {
      this.loadPresenter('register');
    } 
    else if (path.includes('login')) {
      this.loadPresenter('login');
    }
    else {
      this.loadPresenter('index');
    }
  }
  
  loadPresenter(page) {
    console.log('Loading presenter for page:', page);
    
    // Clear current presenter
    if (this.currentPresenter) {
      // Any cleanup if needed
    }
    
    // Initialize appropriate presenter
    switch(page) {
      case 'register':
        this.currentPresenter = new RegisterPresenter();
        break;
      case 'login':
        this.currentPresenter = new LoginPresenter();
        break;
      case 'index':
      default:
        this.currentPresenter = new IndexPresenter();
        break;
    }
    
    // Initialize the presenter
    if (this.currentPresenter) {
      this.currentPresenter.init();
    }
  }
}

// Initialize app when document is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Document loaded, initializing app');
  const app = new App();
});

// Export for use in other files if needed
export default App;