// src/pages/dashboard-admin/selesaiUserPresenter.js
import SelesaiUserView from "../dashboard-user/selesaiUserView.js";
import SidebarView from "../../views/sidebarView.js";
// import DashboardModel from "../../models/dashboard-model.js"; // Uncomment ketika model sudah ada
import { getCurrentUser, logoutUser } from "../../models/authModel.js";

export default class SelesaiUserPresenter {
  constructor() {
    this.view = new SelesaiUserView();
    this.sidebarView = new SidebarView();
    // this.dashboardModel = new DashboardModel(); // Comment dulu sampai model ada
    this.currentUser = null;
    this.handleLogout = this.handleLogout.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  init() {
    console.log("Initializing SelesaiUserPresenter");
    this.currentUser = getCurrentUser();
    
    if (!this.currentUser) {
      console.log("User not logged in, redirecting to login");
      const event = new CustomEvent("navigate", { detail: { page: "login" } });
      document.dispatchEvent(event);
      return;
    }

    // Render view yang benar
    this.view.render(); // Ini akan render sidebar dan main content sekaligus
    
    // Tampilkan info user di dashboard
    this.view.displayUserInfo(this.currentUser);
    
    // ✅ PERBAIKAN: Gunakan data dummy dengan struktur yang sesuai
    const applications = this.getDummySelesaiData();
    
    // Render data ke tabel
    this.view.renderSelesaiData(applications);
    
    this.setupEventListeners();
  }

  // ✅ PERBAIKAN: Update struktur data sesuai dengan kolom tabel
  getDummySelesaiData() {
    return [
      {
        id: 1,
        jenisSampah: "Plastik Botol",
        tanggalPembelian: "2024-01-15",
        berat: "5 kg",
        harga: "Rp 2.000/kg",
        totalHarga: "Rp 10.000",
        status: "Selesai"
      },
      {
        id: 2,
        jenisSampah: "Kertas Bekas",
        tanggalPembelian: "2024-01-14",
        berat: "3 kg",
        harga: "Rp 1.500/kg",
        totalHarga: "Rp 4.500",
        status: "Selesai"
      },
      {
        id: 3,
        jenisSampah: "Kaleng Aluminium",
        tanggalPembelian: "2024-01-13",
        berat: "2 kg",
        harga: "Rp 5.000/kg",
        totalHarga: "Rp 10.000",
        status: "Selesai"
      },
      {
        id: 4,
        jenisSampah: "Kardus Bekas",
        tanggalPembelian: "2024-01-12",
        berat: "8 kg",
        harga: "Rp 800/kg",
        totalHarga: "Rp 6.400",
        status: "Selesai"
      },
      {
        id: 5,
        jenisSampah: "Botol Kaca",
        tanggalPembelian: "2024-01-11",
        berat: "4 kg",
        harga: "Rp 1.200/kg",
        totalHarga: "Rp 4.800",
        status: "Selesai"
      }
    ];
  }

  setupEventListeners() {
    // Event listener untuk logout
    document.addEventListener("user-logout", this.handleLogout);
    
    // ✅ PERBAIKAN: Event listener sesuai dengan yang ada di view
    document.addEventListener("selesaiUser-refresh", this.handleRefresh);
  }

  // Method untuk handle refresh
  handleRefresh() {
    console.log("Refreshing selesai data");
    const applications = this.getDummySelesaiData();
    this.view.renderSelesaiData(applications);
  }

  handleLogout() {
    console.log("Logout initiated");
    logoutUser();
    
    // Bersihkan tampilan dashboard dan sidebar
    this.view.destroy();
    
    // Navigasi ke halaman login
    const event = new CustomEvent("navigate", { detail: { page: "login" } });
    document.dispatchEvent(event);
  }

  destroy() {
    console.log("Destroying SelesaiUserPresenter");
    document.removeEventListener("user-logout", this.handleLogout);
    document.removeEventListener("selesaiUser-refresh", this.handleRefresh);
    this.view.destroy();
  }
}