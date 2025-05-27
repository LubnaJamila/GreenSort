// src/presenters/sidebarPresenter.js
import SidebarView from "../views/sidebarView.js";
import { getCurrentUser } from "../models/authModel.js";

export default class SidebarPresenter {
  constructor(role, initialRoute = 'dashboard') {
    this.view = new SidebarView();
    this.role = role;
    this.initialRoute = initialRoute;
    this.setupNavigationListener();
  }

  init() {
    console.log("Initializing SidebarPresenter with role:", this.role, "and initial route:", this.initialRoute);

    if (!this.role) {
      console.log("Role tidak ditemukan, redirecting to login");
      const event = new CustomEvent("navigate", { detail: { page: "login" } });
      document.dispatchEvent(event);
      return;
    }

    // Set initial route sebelum render
    this.view.initWithRoute(this.initialRoute);
    this.view.render(this.role);

    // Setup logout listener
    document.addEventListener("user-logout", this.handleLogout.bind(this));
  }

  setupNavigationListener() {
    // Listen to navigation events to update sidebar active state
    document.addEventListener("navigate", (e) => {
      if (e.detail && e.detail.page) {
        console.log("Navigation detected in sidebar:", e.detail.page);
        // Update sidebar active state when navigation occurs
        if (this.view) {
          this.view.setActiveRoute(e.detail.page);
        }
      }
    });

    // Also listen for route changes from router
    document.addEventListener("route-changed", (e) => {
      if (e.detail && e.detail.route) {
        console.log("Route change detected in sidebar:", e.detail.route);
        if (this.view) {
          this.view.setActiveRoute(e.detail.route);
        }
      }
    });
  }

  handleLogout() {
    localStorage.removeItem("currentUser");
    const event = new CustomEvent("navigate", { detail: { page: "login" } });
    document.dispatchEvent(event);
  }

  // Method to manually set active route
  setActiveRoute(route) {
    console.log("Setting active route to:", route);
    if (this.view) {
      this.view.setActiveRoute(route);
    }
  }

  // Method to get current active route
  getActiveRoute() {
    return this.view ? this.view.getActiveRoute() : null;
  }

  // Method to update sidebar based on current route
  updateActiveState(currentRoute) {
    console.log("Updating active state to:", currentRoute);
    if (this.view && currentRoute) {
      this.view.setActiveRoute(currentRoute);
    }
  }

  destroy() {
    console.log("Destroying SidebarPresenter");
    // Remove event listeners
    document.removeEventListener("user-logout", this.handleLogout.bind(this));
    
    if (this.view) {
      this.view.destroy();
    }
  }
}