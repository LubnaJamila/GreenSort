//src/pages/dashboard-user/dashboardUserPresenter.js
import DashboardUserView from "./dashboardUserView.js";
import { getCurrentUser, logoutUser } from "../../models/authModel.js";
import DashboardModel from "../../models/dashboard-model.js";
import { getPengajuanByUserId } from "../../models/pengajuan_sampah-model.js";

export default class DashboardUserPresenter {
  constructor() {
    this.view = new DashboardUserView();
    this.dashboardModel = new DashboardModel();
    this.currentUser = null;

    // Bind methods
    this.handleLogout = this.handleLogout.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleViewApplication = this.handleViewApplication.bind(this);
  }

  init() {
    console.log("Initializing DashboardUserPresenter");

    this.currentUser = getCurrentUser();
    if (!this.currentUser) {
      console.log("User not logged in, redirecting to login");
      const event = new CustomEvent("navigate", { detail: { page: "login" } });
      document.dispatchEvent(event);
      return;
    }

    console.log("Current user:", this.currentUser);

    // Render dashboard
    this.view.render();

    // Display user info
    this.view.displayUserInfo(this.currentUser);

    // Load and display dashboard data
    this.loadDashboardData();

    // Setup event listeners
    this.setupEventListeners();
  }

  async loadDashboardData() {
    try {
      // Pastikan menggunakan ID user yang benar
      const userId = this.currentUser.id_user || this.currentUser.id;

      if (!userId) {
        console.error("User ID tidak ditemukan:", this.currentUser);
        this.showErrorMessage("ID user tidak valid");
        return;
      }

      console.log("Loading dashboard data for user ID:", userId);

      const res = await getPengajuanByUserId(userId);

      if (!res.success) {
        console.error("API Error:", res.message);
        this.showErrorMessage(res.message || "Gagal memuat data pengajuan");
        return;
      }

      // Handle empty data
      if (!res.data || res.data.length === 0) {
        console.log("No data found for user");
        this.view.renderDashboardData([], this.calculateUserStats([]));
        return;
      }

      console.log("Raw data from API:", res.data);

      // Transform data sesuai dengan response dari server
      const applications = res.data.map((item) => ({
        id: item.id,
        user_id: item.user_id,
        gambar_sampah: item.gambar_sampah, // Sudah diformat di server
        jenisSampah: item.jenis_sampah,
        berat: parseFloat(item.berat) || 0,
        status: item.status || "pengajuan",
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));

      console.log("Transformed applications:", applications);

      const stats = this.calculateUserStats(applications);
      console.log("Calculated stats:", stats);

      this.view.renderDashboardData(applications, stats);
    } catch (err) {
      console.error("Error in loadDashboardData:", err);
      this.showErrorMessage("Terjadi kesalahan saat memuat dashboard");
    }
  }

  calculateUserStats(applications) {
    const stats = {
      menungguValidasi: 0,
      diterima: 0,
      ditolak: 0,
      penjemputan: 0,
      selesai: 0,
    };

    if (!applications || applications.length === 0) {
      return stats;
    }

    applications.forEach((app) => {
      const status = app.status ? app.status.toLowerCase().trim() : "";

      switch (status) {
        case "pengajuan":
        case "menunggu validasi":
          stats.menungguValidasi++;
          break;
        case "diterima":
          stats.diterima++;
          break;
        case "ditolak":
          stats.ditolak++;
          break;
        case "penjemputan":
          stats.penjemputan++;
          break;
        case "selesai":
          stats.selesai++;
          break;
        default:
          console.warn("Unknown status:", status);
          // Default ke menunggu validasi untuk status yang tidak dikenal
          stats.menungguValidasi++;
          break;
      }
    });

    return stats;
  }

  setupEventListeners() {
    // User logout event
    document.addEventListener("user-logout", this.handleLogout);

    // Dashboard refresh event
    document.addEventListener("dashboard-refresh", this.handleRefresh);

    // Application view event
    document.addEventListener("view-application", this.handleViewApplication);
  }

  handleLogout() {
    console.log("User logout initiated");
    logoutUser();

    // Clean up view
    this.view.destroy();

    // Navigate to login
    const event = new CustomEvent("navigate", { detail: { page: "login" } });
    document.dispatchEvent(event);
  }

  handleRefresh() {
    console.log("Dashboard refresh requested");
    this.loadDashboardData();
    this.showSuccessMessage("Data berhasil diperbarui");
  }

  handleViewApplication(event) {
    const { applicationId } = event.detail;
    console.log("View application:", applicationId);

    try {
      const navEvent = new CustomEvent("navigate", {
        detail: {
          page: "application-detail",
          params: { id: applicationId },
        },
      });
      document.dispatchEvent(navEvent);
    } catch (error) {
      console.error("Error viewing application:", error);
      this.showErrorMessage("Gagal menampilkan detail pengajuan");
    }
  }

  showSuccessMessage(message) {
    console.log("Success:", message);
    this.showToast(message, "success");
  }

  showErrorMessage(message) {
    console.error("Error:", message);
    this.showToast(message, "error");
  }

  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast-message toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 4px;
      color: white;
      font-weight: 500;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    switch (type) {
      case "success":
        toast.style.backgroundColor = "#28a745";
        break;
      case "error":
        toast.style.backgroundColor = "#dc3545";
        break;
      case "warning":
        toast.style.backgroundColor = "#ffc107";
        toast.style.color = "#212529";
        break;
      default:
        toast.style.backgroundColor = "#17a2b8";
    }

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "1";
    }, 100);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  removeEventListeners() {
    document.removeEventListener("user-logout", this.handleLogout);
    document.removeEventListener("dashboard-refresh", this.handleRefresh);
    document.removeEventListener(
      "view-application",
      this.handleViewApplication
    );
  }

  destroy() {
    console.log("Destroying DashboardUserPresenter");
    this.removeEventListeners();
    this.view.destroy();
  }
}
