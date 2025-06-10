// src/pages/dashboard-user/penjemputanPresenter.js
import PenjemputanView from "./penjemputanView.js";
import { getCurrentUser } from "../../models/authModel.js";
import { loadPengirimanData } from "../../models/pengirimanModel.js";

export default class PenjemputanPresenter {
  constructor() {
    this.view = new PenjemputanView();
    this.isLoading = false;
    this.currentData = [];
    this.setupEventListeners();
  }

  async init() {
    try {
      console.log("Initializing penjemputan dashboard...");

      // Render view terlebih dahulu
      this.view.render();

      // Tunggu render selesai
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Aktivasi tab default
      this.view.activateDefaultTab();

      // Load dan display user info
      const user = getCurrentUser();
      this.view.displayUserInfo(user);

      // Load data penjemputan
      await this.loadPenjemputanData(user.id_user);
    } catch (error) {
      console.error("Error initializing penjemputan dashboard:", error);
      this.handleError("Gagal memuat dashboard penjemputan");
    }
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
