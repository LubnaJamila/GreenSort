// src/presenters/dashboardPresenter.js
import DashboardView from "../dashboard-admin/dashboardView.js";
import SidebarView from "../../views/sidebarView.js";
import { getDataPenjualanSampah,getDashboardStats } from "../../models/penjualanModel.js";
import { getCurrentUser, logoutUser } from "../../models/authModel.js";

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

    this.sidebarView.render();
    this.dashboardView.render();
    this.dashboardView.displayUserInfo(this.currentUser);

    
    getDashboardStats().then((stats) => {
      if (stats) {
        const counts = {
          total: stats.total,
          pengajuan: stats.pengajuan,
          penawaran: stats.penawaran,
          pengiriman: stats.pengiriman,
          selesai: stats.selesai
        };
        this.dashboardView.updateStatCards(counts);
      } else {
        console.warn("Gagal mengambil data statistik dari server");
      }
    });

    
    getDataPenjualanSampah().then((applications) => {
      this.dashboardView.renderDashboardData(applications);
    });

    this.setupEventListeners();
}

  setupEventListeners() {
    document.addEventListener("user-logout", this.handleLogout);
  }

  handleLogout() {
    console.log("Logout initiated");
    logoutUser();

    this.dashboardView.destroy();
    this.sidebarView.destroy();

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
