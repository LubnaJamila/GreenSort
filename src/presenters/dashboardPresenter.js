import DashboardView from "../views/dashboardView.js";
import SidebarView from "../views/sidebarView.js";
import { getCurrentUser, logoutUser } from "../models/authModel.js";

export default class DashboardPresenter {
  constructor() {
    this.dashboardView = new DashboardView();
    this.sidebarView = new SidebarView();
    this.currentUser = null;

    this.handleLogout = this.handleLogout.bind(this);
  }

  init() {
    console.log("Initializing DashboardPresenter");

    this.currentUser = getCurrentUser();
    if (!this.currentUser) {
      console.log("User not logged in, redirecting to login");
      const event = new CustomEvent("navigate", { detail: { page: "login" } });
      document.dispatchEvent(event);
      return;
    }

    // Render sidebar dan dashboard
    this.sidebarView.render();
    this.dashboardView.render();

    // Tampilkan info user di dashboard (contoh)
    this.dashboardView.displayUserInfo(this.currentUser);
    this.dashboardView.renderDashboardData(this.currentUser);

    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener("user-logout", this.handleLogout);
  }

  handleLogout() {
    console.log("Logout initiated");
    logoutUser();

    // Bersihkan tampilan dashboard dan sidebar
    this.dashboardView.destroy();
    this.sidebarView.destroy();

    // Navigasi ke halaman login
    const event = new CustomEvent("navigate", { detail: { page: "login" } });
    document.dispatchEvent(event);
  }

  destroy() {
    console.log("Destroying DashboardPresenter");
    document.removeEventListener("user-logout", this.handleLogout);
    this.dashboardView.destroy();
    this.sidebarView.destroy();
  }
}
