// src/presenters/dashboardPresenter.js
import DashboardView from "../dashboard-admin/dashboardView.js";
import SidebarView from "../../views/sidebarView.js";
import { getDataPenjualanSampah } from "../../models/penjualanModel.js";
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

    getDataPenjualanSampah().then((applications) => {
    this.dashboardView.renderDashboardData(applications);

    const counts = {
      total: applications.length,
      pengajuan: 0,
      penawaran: 0,
      pengiriman: 0,
      selesai: 0,
    };

    applications.forEach(app => {
      const status = app.status?.toLowerCase();

      if (status === 'pengajuan') counts.pengajuan++;
      else if (status === 'penawaran diterima' || status === 'penawaran ditolak') counts.penawaran++;

      // pengiriman hanya dihitung dari "penawaran diterima" saja
      if (status === 'penawaran diterima') counts.pengiriman++;

      if (status === 'selesai') counts.selesai++;
  });

    this.dashboardView.updateStatCards(counts);
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
