// src/pages/dashboard-user/diterimaPresenter.js
import DiterimaView from "./diterimaView.js";
import { getCurrentUser } from "../../models/authModel.js";
import {
  getPengajuanByUserIdAndStatus,
  rejectPenawaranTanpaAlasan,
} from "../../models/pengajuan_sampah-model.js";

export default class DiterimaPresenter {
  constructor() {
    this.view = new DiterimaView();
    this.currentUser = null;

    // Bind event handlers
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleDiterimaRefresh = this.handleDiterimaRefresh.bind(this);
    this.handleApplicationAction = this.handleApplicationAction.bind(this);
  }

  async init() {
    console.log("Initializing DiterimaPresenter");

    // Get current user
    this.currentUser = getCurrentUser();
    if (!this.currentUser) {
      console.log("User not logged in, redirecting to login");
      const event = new CustomEvent("navigate", { detail: { page: "login" } });
      document.dispatchEvent(event);
      return;
    }

    // Render the view
    this.view.render();
    this.view.displayUserInfo(this.currentUser);

    // Load initial data
    await this.loadAcceptedApplications();

    // Setup event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen for refresh events
    document.addEventListener("dashboard-refresh", this.handleRefresh);
    document.addEventListener("diterima-refresh", this.handleDiterimaRefresh);
    document.addEventListener(
      "application-action",
      this.handleApplicationAction
    );
  }

  async loadAcceptedApplications() {
    try {
      this.view.showLoadingState();

      // Gunakan model untuk mengambil data pengajuan dengan status 'diterima'
      const userId = this.currentUser.id_user || this.currentUser.id;

      if (!userId) {
        console.error("User ID tidak ditemukan:", this.currentUser);
        this.view.showError("ID user tidak valid");
        return;
      }

      console.log("Loading dashboard data for user ID:", userId);

      // Ganti sesuai status yang diinginkan, bisa juga dynamic
      const status = "pengajuan diterima";
      const res = await getPengajuanByUserIdAndStatus(userId, status);

      if (!res.success) {
        console.error("API Error:", res.message);
        this.view.showError(res.message || "Gagal memuat data pengajuan");
        return;
      }

      // Handle empty data
      if (!res.data || res.data.length === 0) {
        console.log("No data found for user with status:", status);
        this.view.renderDashboardData([], this.calculateUserStats([]));
        return;
      }

      console.log("Raw data from API:", res.data);

      // Transformasi data
      const applications = res.data.map((item) => ({
        id: item.id,
        user_id: item.user_id,
        gambar_sampah: item.gambar_sampah,
        jenisSampah: item.jenis_sampah,
        berat: parseFloat(item.berat) || 0,
        harga: item.harga_tawaran !== null ? parseFloat(item.harga_tawaran) : 0,
        status: item.status || "pengajuan diterima",
      }));

      console.log("Transformed applications:", applications);

      const stats = this.calculateUserStats(applications);
      console.log("Calculated stats:", stats);

      this.view.renderDashboardData(applications, stats);
    } catch (err) {
      console.error("Error in loadAcceptedApplications:", err);
      this.view.showError("Terjadi kesalahan saat memuat dashboard");
    }
  }

  calculateUserStats(applications) {
    const stats = {
      totalApplications: applications.length,
      totalWeight: applications.reduce((sum, app) => sum + (app.berat || 0), 0),
      totalValue: applications.reduce((sum, app) => sum + (app.harga || 0), 0),
      averageWeight: 0,
    };

    if (stats.totalApplications > 0) {
      stats.averageWeight = stats.totalWeight / stats.totalApplications;
    }

    return stats;
  }

  async handleApplicationAction(event) {
    const { id, action } = event.detail;

    try {
      if (action === "accept") {
        await this.acceptApplication(id);
      } else if (action === "reject") {
        await this.rejectApplication(id);
      }
    } catch (error) {
      console.error(`Error handling ${action} action:`, error);
      this.view.showError(
        `Gagal ${action === "accept" ? "menerima" : "menolak"} pengajuan`
      );
    }
  }

  async acceptApplication(applicationId) {
    // Konfirmasi sebelum melakukan aksi
    if (!confirm("Apakah Anda yakin ingin menerima pengajuan ini?")) {
      return;
    }

    try {
      // TODO: Implementasi API call untuk menerima pengajuan
      // const response = await fetch(`${BASE_URL}/api/pengajuan/${applicationId}/accept`, {
      //     method: 'PUT',
      //     headers: { 'Content-Type': 'application/json' }
      // });

      // Sementara simulasi berhasil
      this.view.showSuccess("Pengajuan berhasil diterima");

      // Refresh data
      await this.loadAcceptedApplications();
    } catch (error) {
      console.error("Error accepting application:", error);
      throw error;
    }
  }

  async rejectApplication(applicationId) {
    const confirmed = confirm("Apakah Anda yakin ingin menolak tawaran ini?");
    if (!confirmed) return;

    try {
      await rejectPenawaranTanpaAlasan(applicationId);
      this.view.showSuccess("Penawaran berhasil ditolak");
      setTimeout(() => {
        window.location.hash = "#/diterima";
      }, 1000);
    } catch (error) {
      console.error("Error rejecting penawaran:", error);
      this.view.showError("Gagal menolak penawaran: " + error.message);
    }
  }

  async handleRefresh() {
    console.log("Refreshing accepted applications data");
    await this.loadAcceptedApplications();
  }

  async handleDiterimaRefresh() {
    console.log("Specific refresh for accepted applications");
    await this.loadAcceptedApplications();
  }

  // Method to get selected applications
  getSelectedApplications() {
    return this.view.getSelectedRows();
  }

  // Method to export data (if needed)
  exportData() {
    const selectedRows = this.getSelectedApplications();
    if (selectedRows.length === 0) {
      alert("Pilih data yang ingin diekspor");
      return;
    }

    // Implement export logic here
    console.log("Exporting selected applications:", selectedRows);
    // You can implement CSV/Excel export here
  }

  // Method to handle bulk actions (if needed)
  handleBulkAction(action) {
    const selectedRows = this.getSelectedApplications();
    if (selectedRows.length === 0) {
      alert("Pilih data untuk diproses");
      return;
    }

    switch (action) {
      case "export":
        this.exportData();
        break;
      case "print":
        this.printSelected();
        break;
      default:
        console.log(`Unknown bulk action: ${action}`);
    }
  }

  printSelected() {
    const selectedRows = this.getSelectedApplications();
    if (selectedRows.length === 0) {
      alert("Pilih data yang ingin dicetak");
      return;
    }

    // Implement print logic here
    console.log("Printing selected applications:", selectedRows);
    window.print();
  }

  removeEventListeners() {
    document.removeEventListener("dashboard-refresh", this.handleRefresh);
    document.removeEventListener(
      "diterima-refresh",
      this.handleDiterimaRefresh
    );
    document.removeEventListener(
      "application-action",
      this.handleApplicationAction
    );
  }

  destroy() {
    console.log("Destroying DiterimaPresenter");
    this.removeEventListeners();
    this.view.destroy();
  }
}
