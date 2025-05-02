// src/routes/router.js
export default class Router {
  constructor() {
    this.routes = {};
  }

  // Add a route
  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  // Navigate to a specific page
  navigateTo(path) {
    window.location.href = path;
  }

  // Navigate to a page with parameters
  navigateWithParams(path, params) {
    const url = new URL(path, window.location.origin);
    
    // Add parameters to URL
    if (params && typeof params === 'object') {
      Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
      });
    }
    
    window.location.href = url.toString();
  }

  // Method to initialize router and handle URL changes
  init() {
    // Handle initial load
    this.handleRouteChange();
    
    // Listen for popstate events (when the user navigates back/forward)
    window.addEventListener('popstate', () => {
      this.handleRouteChange();
    });
  }

  // Method to handle route changes
  handleRouteChange() {
    const path = window.location.pathname;
    const handler = this.routes[path] || this.routes['*']; // Default handler if route not found
    
    if (handler && typeof handler === 'function') {
      handler();
    }
  }
  
  // Get query parameters from URL
  getQueryParams() {
    const params = {};
    const searchParams = new URLSearchParams(window.location.search);
    
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    
    return params;
  }
}