// src/pages/dashboard-admin/selesaiPresenter.js
import SelesaiView from "../dashboard-admin/selesaiView.js";
import SidebarView from "../../views/sidebarView.js";
// import DashboardModel from "../../models/dashboard-model.js"; // Uncomment ketika model sudah ada
import { getCurrentUser, logoutUser } from "../../models/authModel.js";

export default class SelesaiPresenter {
  constructor() {
    this.view = new SelesaiView(); // ✅ Perbaikan: gunakan 'view' bukan 'selesaiView'
    this.sidebarView = new SidebarView();
    // this.dashboardModel = new DashboardModel(); // ✅ Comment dulu sampai model ada
    this.currentUser = null;
    this.handleLogout = this.handleLogout.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this); // ✅ Tambahkan binding untuk refresh
  }

  init() {
    console.log("Initializing SelesaiPresenter");
    this.currentUser = getCurrentUser();
    
    if (!this.currentUser) {
      console.log("User not logged in, redirecting to login");
      const event = new CustomEvent("navigate", { detail: { page: "login" } });
      document.dispatchEvent(event);
      return;
    }

    // ✅ Perbaikan: Render view yang benar
    this.view.render(); // Ini akan render sidebar dan main content sekaligus
    
    // Tampilkan info user di dashboard
    this.view.displayUserInfo(this.currentUser);
    
    // ✅ Perbaikan: Gunakan data dummy sementara sampai model ready
    const applications = this.getDummySelesaiData();
    
    // Render data ke tabel
    this.view.renderSelesaiData(applications);
    
    this.setupEventListeners();
  }

  // ✅ Tambahkan method untuk data dummy sementara
  getDummySelesaiData() {
    return [
      {
        id: 1,
        jenisSampah: "Plastik Botol",
        tanggalPembelian: "2024-01-15",
        kuantitas: "5 kg",
        harga: "Rp 2.000",
        total: "Rp 10.000",
        status: "Selesai"
      },
      {
        id: 2,
        jenisSampah: "Kertas Bekas",
        tanggalPembelian: "2024-01-14",
        kuantitas: "3 kg",
        harga: "Rp 1.500",
        total: "Rp 4.500",
        status: "Selesai"
      },
      {
        id: 3,
        jenisSampah: "Kaleng Aluminium",
        tanggalPembelian: "2024-01-13",
        kuantitas: "2 kg",
        harga: "Rp 5.000",
        total: "Rp 10.000",
        status: "Selesai"
      }
    ];
  }

  setupEventListeners() {
    // ✅ Event listener untuk logout
    document.addEventListener("user-logout", this.handleLogout);
    
    // ✅ Event listener untuk refresh yang dipicu dari view
    document.addEventListener("selesai-refresh", this.handleRefresh);
  }

  // ✅ Tambahkan method untuk handle refresh
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
    console.log("Destroying SelesaiPresenter");
    document.removeEventListener("user-logout", this.handleLogout);
    document.removeEventListener("selesai-refresh", this.handleRefresh); // ✅ Remove refresh listener
    this.view.destroy();
  }
}