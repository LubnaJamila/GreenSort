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
      const rawApplications = this.pengajuanModel.getApplications();
      console.log("Raw applications from model:", rawApplications);
      
      this.rawApplications = rawApplications;
      
      this.applications = rawApplications.map(app => ({
        ...app,
        id: app.id || Math.random().toString(36).substr(2, 9), // Generate ID jika tidak ada
        status: this.mapStatus(app.status), // Status untuk display (Indonesian)
        statusOriginal: app.status || 'pending', // Status asli (English) untuk filtering
        name: app.name || app.userName || 'N/A',
        phone: app.phone || app.phoneNumber || 'N/A',
        category: app.category || app.wasteCategory || 'N/A',
        weight: app.weight || app.wasteWeight || 0,
        image: app.image || app.wasteImage || 'https://via.placeholder.com/50'
      }));
      
      console.log("Processed applications:", this.applications);
      
      this.view.renderApplicationsTable(this.applications);
      this.updateStatistics();
    } catch (error) {
      console.error("Error loading applications:", error);
      this.applications = [];
      this.view.renderApplicationsTable([]);
      this.view.showError(`Gagal memuat data pengajuan: ${error.message}`);
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
      'pending': 'Menunggu Validasi',
      'accepted': 'Diterima',
      'rejected': 'Ditolak'
    };
    return statusMap[status] || status;
  }

  updateStatistics() {
    const stats = {
      total: this.applications.length,
      pending: this.applications.filter(app => 
        app.statusOriginal === 'pending' || app.status === 'Menunggu Validasi'
      ).length,
      verified: this.applications.filter(app => 
        app.statusOriginal === 'accepted' || app.status === 'Diterima'
      ).length,
      rejected: this.applications.filter(app => 
        app.statusOriginal === 'rejected' || app.status === 'Ditolak'
      ).length
    };
    
    console.log("Statistics updated:", stats);
    this.view.displayStatistics(stats);
  }

  handleFilterChange(filterType, filterValue) {
    console.log("Filter change:", filterType, filterValue);
    
    if (filterType === 'status') {
      // Update filter di view
      this.view.currentFilter = filterValue;
      this.view.currentPage = 1; // Reset ke halaman pertama
      
      // Render ulang table dengan filter baru
      this.view.renderFilteredTable();
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