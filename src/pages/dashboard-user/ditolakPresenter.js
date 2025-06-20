// src/pages/dashboard-user/ditolakPresenter.js
import DitolakView from "./ditolakView.js";
import { getCurrentUser } from "../../models/authModel.js";
import { getPengajuanByUserIdAndStatus } from "../../models/pengajuan_sampah-model.js";


export default class DitolakPresenter {
  constructor() {
    this.view = new DitolakView();
    
    this.currentUser = null;

    
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleDataUpdate = this.handleDataUpdate.bind(this);
  }

  init() {
    console.log("Initializing DitolakPresenter");

    
    this.currentUser = getCurrentUser();
    if (!this.currentUser) {
      console.log("User not logged in, redirecting to login");
      const event = new CustomEvent("navigate", { detail: { page: "login" } });
      document.dispatchEvent(event);
      return;
    }

    
    this.view.render();
    this.view.displayUserInfo(this.currentUser);

    
    this.loadRejectedApplications();

    
    this.setupEventListeners();
  }

  async loadRejectedApplications() {
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

      
      const applications = allApplications.map((item) => ({
        id: item.id,
        user_id: item.user_id,
        gambar_sampah: item.gambar_sampah,
        jenisSampah: item.jenis_sampah,
        berat: parseFloat(item.berat) || 0,
        status: item.status || "pengajuan ditolak",
        alasan: item.alasan_penolakan,
      }));

      console.log("Transformed applications:", applications);

      const stats = this.calculateUserStats(applications);
      console.log("Calculated stats:", stats);

      const pengajuanDiterimaOnly = applications.filter(
        (app) => app.status.toLowerCase().trim() === "pengajuan ditolak"
      );

      this.view.renderDashboardData(pengajuanDiterimaOnly, stats);
    } catch (err) {
      console.error("Error in loadAcceptedApplications:", err);
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
        case "penawaran ditolak":
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

  
  getSampleRejectedData() {
    return [
      {
        id: 1,
        jenisSampah: "Plastik PET",
        tanggalPembelian: "2024-12-01",
        kuantitas: "5 kg",
        harga: "Rp 3,000/kg",
        total: "Rp 15,000",
        status: "Ditolak",
        keterangan: "Kualitas plastik tidak sesuai standar",
      },
      {
        id: 2,
        jenisSampah: "Kardus",
        tanggalPembelian: "2024-11-28",
        kuantitas: "10 kg",
        harga: "Rp 2,500/kg",
        total: "Rp 25,000",
        status: "Ditolak",
        keterangan: "Kardus dalam kondisi basah",
      },
      {
        id: 3,
        jenisSampah: "Logam",
        tanggalPembelian: "2024-11-25",
        kuantitas: "3 kg",
        harga: "Rp 8,000/kg",
        total: "Rp 24,000",
        status: "Ditolak",
        keterangan: "Berat tidak sesuai dengan yang dilaporkan",
      },
    ];
  }

  setupEventListeners() {
    
    document.addEventListener("dashboard-refresh", this.handleRefresh);

   
    document.addEventListener("rejected-data-update", this.handleDataUpdate);
  }

  handleRefresh() {
    console.log("Refreshing rejected applications data");
    this.loadRejectedApplications();
  }

  handleDataUpdate(event) {
    const { data } = event.detail;
    if (data) {
      this.view.updateRejectedData(data);
    }
  }

  showError(message) {
    
    console.error(message);

    
    if (window.showToast) {
      window.showToast(message, "error");
    } else {
      alert(message);
    }
  }

  showSuccess(message) {
   
    console.log(message);

    if (window.showToast) {
      window.showToast(message, "success");
    } else {
      alert(message);
    }
  }

  
  async handleBulkAction(action) {
    const selectedIds = this.view.getSelectedRows();

    if (selectedIds.length === 0) {
      this.showError("Pilih setidaknya satu item");
      return;
    }

    try {
      switch (action) {
        case "delete":
          await this.handleBulkDelete(selectedIds);
          break;
        case "resubmit":
          await this.handleBulkResubmit(selectedIds);
          break;
        default:
          console.log(`Unknown action: ${action}`);
      }
    } catch (error) {
      console.error(`Error performing bulk action ${action}:`, error);
      this.showError(`Gagal melakukan aksi ${action}`);
    }
  }

  async handleBulkDelete(ids) {
    if (confirm(`Apakah Anda yakin ingin menghapus ${ids.length} item?`)) {
      
      this.showSuccess(`Berhasil menghapus ${ids.length} item`);
      this.loadRejectedApplications();
      this.view.clearSelection();
    }
  }

  async handleBulkResubmit(ids) {
    if (
      confirm(`Apakah Anda yakin ingin mengajukan ulang ${ids.length} item?`)
    ) {
      
      this.showSuccess(`Berhasil mengajukan ulang ${ids.length} item`);
      this.loadRejectedApplications();
      this.view.clearSelection();
    }
  }

  removeEventListeners() {
    document.removeEventListener("dashboard-refresh", this.handleRefresh);
    document.removeEventListener("rejected-data-update", this.handleDataUpdate);
  }

  destroy() {
    console.log("Destroying DitolakPresenter");
    this.removeEventListeners();
    this.view.destroy();
  }
}
