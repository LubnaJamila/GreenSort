// src/pages/dashboard-admin/pengajuanPresenter.js
import PengajuanView from "./pengajuanView"; 
import { getCurrentUser } from "../../models/authModel";
import SidebarView from "../../views/sidebarView.js";
import PengajuanModel from "../../models/pengajuan-model.js";

export default class PengajuanPresenter {
  constructor() {
    this.view = new PengajuanView();
    this.pengajuanModel = new PengajuanModel();
    this.currentUser = null;
    this.sidebarView = new SidebarView();
    this.applications = [];

    // Bind methods
    this.handleLogout = this.handleLogout.bind(this);
    this.handleStatusUpdate = this.handleStatusUpdate.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  async init() {
    this.currentUser = getCurrentUser();
    if (!this.currentUser) {
      const event = new CustomEvent("navigate", { detail: { page: "login" } });
      document.dispatchEvent(event);
      return;
    }

    this.view.render();
    this.view.displayUserInfo(this.currentUser);
    await this.loadApplications();
    this.setupEventListeners();
  }

  async loadApplications() {
  try {
    const allStatuses = ['pengajuan', 'pengajuan diterima', 'pengajuan ditolak','penawaran diterima','penawaran ditolak','selesai'];
    let allApplications = [];

    for (const status of allStatuses) {
      const data = await this.pengajuanModel.getApplicationsByStatus(status);
      allApplications = [...allApplications, ...data.map(app => ({
        ...app,
        statusOriginal: status,
        status: this.mapStatus(status)
      }))];
    }

    this.allApplications = allApplications;

    this.view.updateTabBadges(allApplications);

    let filterStatus = 'pengajuan';
    if (this.view.currentFilter === 'accepted') {
      filterStatus = 'pengajuan diterima';
    } else if (this.view.currentFilter === 'rejected') {
      filterStatus = 'pengajuan ditolak';
    }

    const filteredApps = allApplications.filter(app => app.statusOriginal === filterStatus);
    this.applications = filteredApps;

    this.view.renderApplicationsTable(this.applications);

    this.updateStatistics();

  } catch (error) {
    console.error("Error loading applications:", error);
    this.applications = [];
    this.view.renderApplicationsTable([]);
    this.view.showError("Gagal memuat data.");
  }
}

  async refreshApplications() {
    console.log("Refreshing applications...");
    await this.loadApplications();
  }

  async updateApplicationStatus(id, newStatus) {
    try {
      if (this.pengajuanModel.updateApplicationStatus) {
        await this.pengajuanModel.updateApplicationStatus(id, newStatus);
      }
      
      const applicationIndex = this.applications.findIndex(app => app.id === id);
      if (applicationIndex !== -1) {
        this.applications[applicationIndex].statusOriginal = newStatus;
        this.applications[applicationIndex].status = this.mapStatus(newStatus);
        
        this.view.renderApplicationsTable(this.applications);
        this.updateStatistics();
        this.view.showSuccess(`Status berhasil diperbarui menjadi "${this.mapStatus(newStatus)}"`);
      } else {
        throw new Error("Pengajuan tidak ditemukan");
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      this.view.showError(`Gagal memperbarui status: ${error.message}`);
    }
  }

 mapStatus(status) {
  const statusMap = {
    'pengajuan': 'Menunggu Validasi',
    'pengajuan diterima': 'Diterima',
    'pengajuan ditolak': 'Ditolak'
  };
  return statusMap[status] || status;
}
  updateStatistics() {
  const stats = {
    total: this.allApplications.length,
    pending: 0,
    accepted: 0,
    rejected: 0,
    shipped: 0,     
    completed: 0    
  };

  this.allApplications.forEach(item => {
    const status = item.statusOriginal.toLowerCase();
    if (status === 'pengajuan') stats.pending++;
    if (status === 'pengajuan diterima') stats.accepted++;
    if (status === 'penawaran diterima'|| status === 'penawaran ditolak') stats.rejected++;
    if (status === 'penawaran diterima') stats.shipped++;
    if (status === 'selesai') stats.completed++;
  });

  this.view.displayStatistics(stats);
}
  handleFilterChange(filterType, filterValue) {
  if (filterType === 'status') {
    this.view.currentFilter = filterValue;
    this.view.currentPage = 1;
    this.loadApplications(); 
  }
}


  handleStatusUpdate(applicationId, newStatus) {
    const applicationIndex = this.applications.findIndex(app => app.id === applicationId);
    if (applicationIndex !== -1) {
      this.applications[applicationIndex].status = newStatus;
      this.view.displayApplications(this.applications);
      this.updateStatistics();
      this.view.showSuccess(`Status berhasil diperbarui menjadi "${newStatus}"`);
    } else {
      this.view.showError("Pengajuan tidak ditemukan");
    }
  }

  getApplicationById(id) {
    return this.applications.find(app => app.id === id);
  }

  setupEventListeners() {
    document.removeEventListener("user-logout", this.handleLogout);
    document.removeEventListener("filter-change", this.handleFilterChangeEvent);
    document.removeEventListener("status-update", this.handleStatusUpdateEvent);
    document.removeEventListener("refresh-applications", this.handleRefreshApplications);
    
    this.handleFilterChangeEvent = (e) => {
      this.handleFilterChange(e.detail.filterType, e.detail.filterValue);
    };
    
    this.handleStatusUpdateEvent = (e) => {
      this.handleStatusUpdate(e.detail.id, e.detail.status);
    };
    
    this.handleRefreshApplications = () => {
      this.refreshApplications();
    };
    
    document.addEventListener("user-logout", this.handleLogout);
    document.addEventListener("filter-change", this.handleFilterChangeEvent);
    document.addEventListener("status-update", this.handleStatusUpdateEvent);
    document.addEventListener("refresh-applications", this.handleRefreshApplications);
    document.addEventListener("dashboard-refresh", this.handleRefreshApplications);
  }

  handleLogout() {
    this.destroy();
    const event = new CustomEvent("navigate", { detail: { page: "login" } });
    document.dispatchEvent(event);
  }

  destroy() {
    document.removeEventListener("user-logout", this.handleLogout);
    if (this.handleFilterChangeEvent) {
      document.removeEventListener("filter-change", this.handleFilterChangeEvent);
    }
    if (this.handleStatusUpdateEvent) {
      document.removeEventListener("status-update", this.handleStatusUpdateEvent);
    }
    if (this.handleRefreshApplications) {
      document.removeEventListener("refresh-applications", this.handleRefreshApplications);
    }
    
    if (this.view && this.view.destroy) {
      this.view.destroy();
    }
    
    this.applications = [];
    this.rawApplications = [];
    this.currentUser = null;
  }
}