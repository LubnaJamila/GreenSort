// src/pages/dashboard-admin/selesaiUserPresenter.js
import SelesaiUserView from "../dashboard-user/selesaiUserView.js";
import SidebarView from "../../views/sidebarView.js";
import { getCurrentUser, logoutUser } from "../../models/authModel.js";
import { getPengajuanByUserIdAndStatus } from "../../models/pengajuan_sampah-model.js";

export default class SelesaiUserPresenter {
  constructor() {
    this.view = new SelesaiUserView();
    this.sidebarView = new SidebarView();
    this.currentUser = null;
    this.handleLogout = this.handleLogout.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  async init() {
    console.log("Initializing SelesaiUserPresenter");
    this.currentUser = getCurrentUser();

    if (!this.currentUser) {
      const event = new CustomEvent("navigate", { detail: { page: "login" } });
      document.dispatchEvent(event);
      return;
    }

    this.view.render();
    this.view.displayUserInfo(this.currentUser);

    await this.loadData();
    this.setupEventListeners();
  }

  async loadData() {
    try {
      this.view.showLoadingState();

      const userId = this.currentUser.id_user || this.currentUser.id;

      if (!userId) {
        console.error("User ID tidak ditemukan:", this.currentUser);
        this.view.showError("ID user tidak valid");
        return;
      }

      console.log("Loading dashboard data for user ID:", userId);
      const allStatuses = [
        "pengajuan",
        "pengajuan diterima",
        "pengajuan ditolak",
        "penawaran diterima",
        "penawaran ditolak",
        "selesai",
      ];

      let allApplications = [];

      for (const stat of allStatuses) {
        try {
          const res = await getPengajuanByUserIdAndStatus(userId, stat);
          if (res.success && res.data && res.data.length > 0) {
            allApplications = [...allApplications, ...res.data];
          }
        } catch (statusError) {
          console.warn(
            `Error fetching data for status '${stat}':`,
            statusError
          );
        }
      }

      if (allApplications.length === 0) {
        console.log("No applications found for user");
        this.view.renderDashboardData([], this.calculateUserStats([]));
        return;
      }

      // Transformasi data
      const applications = allApplications.map((item) => {
        const status = item.status ? item.status.toLowerCase().trim() : "";
        const isSelesai = status === "selesai";
        const isDitolak = status === "penawaran ditolak";

        return {
          id: item.id,
          user_id: item.user_id,
          gambar_sampah: item.gambar_sampah,
          jenisSampah: item.jenis_sampah,
          berat: parseFloat(item.berat) || 0,
          status: item.status || "-",
          total: isSelesai ? item.total || "-" : "-",
          bukti_tf: isSelesai ? item.bukti_tf || "-" : "-",
          alasan: item.alasan_penolakan || "-",
        };
      });

      const stats = this.calculateUserStats(applications);

      // Filter hanya data dengan status 'selesai' atau 'penawaran ditolak'
      const filteredApplications = applications.filter((app) => {
        const status = app.status.toLowerCase().trim();
        return status === "selesai" || status === "penawaran ditolak";
      });

      this.view.renderDashboardData(filteredApplications, stats);
    } catch (err) {
      console.error("Error in loadRejectedApplications:", err);
      this.view.showError("Terjadi kesalahan saat memuat dashboard");
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
        case "pengajuan diterima":
        case "diterima":
          stats.diterima++;
          break;
        case "pengajuan ditolak":
        case "ditolak":
          stats.ditolak++;
          break;
        case "penawaran diterima":
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

  handleRefresh() {
    console.log("Refreshing selesai data");
    this.loadData();
  }

  handleLogout() {
    logoutUser();
    this.view.destroy();
    const event = new CustomEvent("navigate", { detail: { page: "login" } });
    document.dispatchEvent(event);
  }

  setupEventListeners() {
    document.addEventListener("user-logout", this.handleLogout);
    document.addEventListener("selesaiUser-refresh", this.handleRefresh);
  }

  destroy() {
    document.removeEventListener("user-logout", this.handleLogout);
    document.removeEventListener("selesaiUser-refresh", this.handleRefresh);
    this.view.destroy();
  }
}
