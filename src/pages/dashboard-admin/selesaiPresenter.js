// src/pages/dashboard-admin/selesaiPresenter.js
import SelesaiView from "../dashboard-admin/selesaiView.js";
import SidebarView from "../../views/sidebarView.js";
import { getCurrentUser, logoutUser } from "../../models/authModel.js";
import { fetchSelesaiData,fetchSelesaiStats } from "../../models/selesaiModel.js";

export default class SelesaiPresenter {
  constructor() {
    this.view = new SelesaiView(); 
    this.sidebarView = new SidebarView();
    this.currentUser = null;
    this.handleLogout = this.handleLogout.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this); 
  }

  async init() {
  this.currentUser = getCurrentUser();

  if (!this.currentUser) {
    document.dispatchEvent(new CustomEvent("navigate", { detail: { page: "login" } }));
    return;
  }

  this.view.render();
  this.view.displayUserInfo(this.currentUser);

  const applications = await fetchSelesaiData();
  this.view.renderSelesaiData(applications);

  await this.updateStatistics(); 

  this.setupEventListeners();
}
async updateStatistics() {
  try {
    const stats = await fetchSelesaiStats();
    if (stats) {
      this.view.displayStatistics({
        total: stats.total,
        pending: stats.pengajuan,
        rejected: stats.penawaran,
        shipped: stats.pengiriman,
        completed: stats.selesai
      });
    }
  } catch (error) {
    console.error("❌ Error updateStatistics:", error);
  }
}
getDummySelesaiData() {
  return [
    {
      id: 1,
      nama: "John Doe",
      jenisSampah: "Plastik Botol",
      berat: "5 kg",
      harga: "Rp 2.000",
      totalHarga: "Rp 10.000",
      gambarSampah: "https://via.placeholder.com/100x100?text=Plastik",
      status: "Selesai",
      tanggalPembelian: "2024-01-15"
    },
    {
      id: 2,
      nama: "Jane Smith",
      jenisSampah: "Kertas Bekas",
      berat: "3 kg", 
      harga: "Rp 1.500",
      totalHarga: "Rp 4.500",
      gambarSampah: "https://via.placeholder.com/100x100?text=Kertas",
      status: "Selesai",
      tanggalPembelian: "2024-01-14"
    },
    {
      id: 3,
      nama: "Bob Wilson",
      jenisSampah: "Kaleng Aluminium",
      berat: "2 kg",
      harga: "Rp 5.000", 
      totalHarga: "Rp 10.000",
      gambarSampah: "https://via.placeholder.com/100x100?text=Kaleng",
      status: "Selesai",
      tanggalPembelian: "2024-01-13"
    },
    {
      id: 4,
      nama: "Alice Brown",
      jenisSampah: "Kardus",
      berat: "7 kg",
      harga: "Rp 1.000",
      totalHarga: "Rp 7.000", 
      gambarSampah: null, 
      status: "Selesai",
      tanggalPembelian: "2024-01-12"
    }
  ];
}

  setupEventListeners() {
    document.addEventListener("user-logout", this.handleLogout);
    document.addEventListener("selesai-refresh", this.handleRefresh);
  }
  async handleRefresh() {
  const applications = await fetchSelesaiData();
  this.view.renderSelesaiData(applications);
}

  handleLogout() {
    console.log("Logout initiated");
    logoutUser();
    
    
    this.view.destroy();
    
    
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