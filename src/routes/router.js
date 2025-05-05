// src/routes/router.js

export default class Router {
  constructor() {
    // Define routes with hash
    this.routes = {
      'index': '#/',
      'register': '#/register',
      'login': '#/login', 
      'dashboard': '#/dashboard'
    };
    
    // Handle initial route
    this.initialRoute = this.getCurrentRoute();

    // Setup hash change listener
    window.addEventListener('hashchange', () => {
      this.checkAuthAndRedirect();
      this.dispatchRouteChange();
    });
    
    // Check initial route auth
    this.checkAuthAndRedirect();
  }

  // Get current route name
  getCurrentRoute() {
    const hash = window.location.hash || '#/';
    
    // Find matching route (more efficient with find)
    const routeName = Object.entries(this.routes).find(
      ([name, route]) => hash === route
    )?.[0];
    
    return routeName || 'index';
  }

  // Get current full path (hash)
  getCurrentPath() {
    return window.location.hash || '#/';
  }

  // Navigate to route
  navigateTo(page, options = {}) {
    // Determine target hash
    let targetHash;
    
    if (page.startsWith('#')) {
      targetHash = page;
    } else if (page.includes('/')) {
      targetHash = `#${page}`;
    } else {
      targetHash = this.routes[page] || '#/';
    }

    // Skip if already on the same page
    if (targetHash === this.getCurrentPath() && !options.force) {
      return;
    }

    // Update hash
    if (options.replace) {
      window.location.replace(targetHash);
    } else {
      window.location.hash = targetHash;
    }

    // Dispatch event
    this.dispatchRouteChange();
  }

  // Dispatch route change event
  dispatchRouteChange() {
    const pageChangedEvent = new CustomEvent('routeChanged', {
      detail: {
        page: this.getCurrentRoute(),
        path: this.getCurrentPath()
      }
    });
    document.dispatchEvent(pageChangedEvent);
  }

  // Subscribe to route changes
  onRouteChange(callback) {
    const handler = (e) => callback(e.detail);
    document.addEventListener('routeChanged', handler);
    
    // Return unsubscribe function
    return () => document.removeEventListener('routeChanged', handler);
  }
  
  // Check authentication status and redirect if needed
  checkAuthAndRedirect() {
    const currentRoute = this.getCurrentRoute();
    const isLoggedIn = localStorage.getItem('currentUser');
    
    // Jika mencoba mengakses dashboard tanpa login, redirect ke login
    if (currentRoute === 'dashboard' && !isLoggedIn) {
      console.log('Access to dashboard denied - not logged in');
      this.navigateTo('login', { replace: true });
      return false;
    }
    
    // Jika sudah login dan mencoba mengakses register/login, redirect ke dashboard
    if ((currentRoute === 'register' || currentRoute === 'login') && isLoggedIn) {
      console.log('Already logged in - redirecting to dashboard');
      this.navigateTo('dashboard', { replace: true });
      return false;
    }
    
    return true;
  }
}