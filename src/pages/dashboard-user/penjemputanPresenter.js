// src/pages/dashboard-user/penjemputanPresenter.js
import PenjemputanView from "./penjemputanView.js";
import { getCurrentUser } from "../../models/authModel.js";
import { loadPengirimanData,getUserDashboardStats } from "../../models/pengirimanModel.js";


export default class PenjemputanPresenter {
  constructor() {
    this.view = new PenjemputanView();
    this.isLoading = false;
    this.currentData = [];
    this.setupEventListeners();
  }

  async init() {
  this.currentUser = getCurrentUser();
  console.log("Current User:", this.currentUser); // Tambahkan debug ini

  if (!this.currentUser) {
    const event = new CustomEvent("navigate", { detail: { page: "login" } });
    document.dispatchEvent(event);
    return;
  }

  this.view.render();
  this.view.displayUserInfo(this.currentUser);

  // Perbaikan disini
  await this.loadUserDashboardStats(this.currentUser.id_user); // Pastikan id_user valid
  
 await this.loadPenjemputanData(this.currentUser.id_user);

  this.setupEventListeners();
}


  async loadPenjemputanData(userId) {
    if (this.isLoading) return;

    this.isLoading = true;
    this.view.showTableLoading(true);

    try {
      const data = await loadPengirimanData(userId);

      this.currentData = data;
      this.view.renderDashboardData(this.currentData);
    } catch (error) {
      console.error("Error loading pengiriman:", error);
      this.handleError("Gagal memuat data pengiriman");
    } finally {
      this.isLoading = false;
      this.view.showTableLoading(false);
    }
  }
  async loadUserDashboardStats(userId) {
  try {
    console.log("Fetching stats for User ID:", userId); // Debug tambahan
    const stats = await getUserDashboardStats(userId);
    this.view.updateDashboardStats(stats);
  } catch (error) {
    console.error("Error loading user dashboard stats:", error);
    alert("Error: Gagal memuat dashboard penjemputan");
  }
}

  normalizeStatus(status) {
    const statusMap = {
      shipped: "dijemput",
      completed: "diantar",
      Dikirim: "dijemput",
      Selesai: "diantar",
    };
    return statusMap[status] || status;
  }

  setupEventListeners() {
    // Tambahkan event listener jika dibutuhkan
  }

  handleError(message) {
    console.error("PenjemputanPresenter Error:", message);
    this.showNotification(message, "error");
    this.view.renderDashboardData([]);
  }

  showNotification(message, type = "info") {
    console.log(`[${type.toUpperCase()}] ${message}`);

    if (typeof window !== "undefined" && window.showNotification) {
      window.showNotification(message, type);
    } else if (type === "error") {
      alert(`Error: ${message}`);
    }
  }

  destroy() {
    console.log("Destroying PenjemputanPresenter...");

    if (this.view) {
      this.view.destroy();
    }

    this.currentData = [];
    this.isLoading = false;
  }
}
