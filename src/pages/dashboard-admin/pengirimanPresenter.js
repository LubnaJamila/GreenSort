//src/pages/dashboard-admin/pengirimanPresenter.js
import PengirimanView from "./pengirimanView.js"; 
import { getCurrentUser } from "../../models/authModel";
import SidebarView from "../../views/sidebarView.js";
// import PengajuanModel from "../../models/pengajuan-model.js";

export default class PengirimanPresenter {
  constructor() {
    this.view = new PengirimanView();
    this.currentUser = null;
    // this.pengajuanModel = new PengajuanModel(); // Fixed naming consistency
    this.sidebarView = new SidebarView();
    this.applications = []; // Store applications data

    // Bind methods
    this.handleLogout = this.handleLogout.bind(this);
    this.handleAddPengiriman = this.handleAddPengiriman.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleStatusUpdate = this.handleStatusUpdate.bind(this);
  }

  async init() {
    console.log("Initializing PengirimanPresenter");

    // Check user authentication
    this.currentUser = getCurrentUser();
    if (!this.currentUser) {
      console.log("User not logged in, redirecting to login");
      const event = new CustomEvent("navigate", { detail: { page: "login" } });
      document.dispatchEvent(event);
      return;
    }

    // Render view
    this.view.render();
    
    // Display user info
    this.view.displayUserInfo(this.currentUser);
    
    // Load and display applications data
    await this.loadApplications();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Bind event handlers
    this.view.bindAddPengiriman(this.handleAddPengiriman);
    this.view.bindFilterChange(this.handleFilterChange);
    this.view.bindStatusUpdate(this.handleStatusUpdate);
  }

  async loadApplications() {
    try {
      console.log("Loading applications data...");
      
      // Get applications from model
      this.applications = this.pengirimanModel.getApplications();
      
      // Display applications in view
      this.view.displayApplications(this.applications);
      
      // Update statistics
      this.updateStatistics();
      
      console.log(`Loaded ${this.applications.length} applications`);
    } catch (error) {
      console.error("Error loading applications:", error);
      this.view.showError("Gagal memuat data pengiriman");
    }
  }

  updateStatistics() {
    const stats = this.calculateStatistics(this.applications);
    this.view.displayStatistics(stats);
  }

  calculateStatistics(applications) {
    const total = applications.length;
    const pending = applications.filter(app => app.status === "Menunggu Validasi").length;
    const verified = applications.filter(app => app.status === "Sudah Diverifikasi").length;
    
    // Calculate total value
    const totalValue = applications.reduce((sum, app) => {
      const value = parseInt(app.total.replace(/[Rp.,\s]/g, ''));
      return sum + value;
    }, 0);

    // Calculate waste type distribution
    const wasteTypes = {};
    applications.forEach(app => {
      wasteTypes[app.jenisSampah] = (wasteTypes[app.jenisSampah] || 0) + 1;
    });

    return {
      total,
      pending,
      verified,
      totalValue: `Rp. ${totalValue.toLocaleString('id-ID')}`,
      wasteTypes
    };
  }

  handleFilterChange(filterType, filterValue) {
    console.log(`Filtering by ${filterType}:`, filterValue);
    
    let filteredApplications = [...this.applications];
    
    if (filterType === 'status' && filterValue !== 'all') {
      filteredApplications = filteredApplications.filter(app => 
        app.status === filterValue
      );
    } else if (filterType === 'wasteType' && filterValue !== 'all') {
      filteredApplications = filteredApplications.filter(app => 
        app.jenisSampah === filterValue
      );
    } else if (filterType === 'search' && filterValue.trim() !== '') {
      const searchTerm = filterValue.toLowerCase();
      filteredApplications = filteredApplications.filter(app => 
        app.name.toLowerCase().includes(searchTerm) ||
        app.jenisSampah.toLowerCase().includes(searchTerm)
      );
    }
    
    this.view.displayApplications(filteredApplications);
    this.view.displayStatistics(this.calculateStatistics(filteredApplications));
  }

  handleStatusUpdate(applicationId, newStatus) {
    console.log(`Updating status for application ${applicationId} to ${newStatus}`);
    
    // Find and update application
    const applicationIndex = this.applications.findIndex(app => app.id === applicationId);
    if (applicationIndex !== -1) {
      this.applications[applicationIndex].status = newStatus;
      
      // In a real app, you would send this to the backend
      // await this.pengajuanModel.updateApplicationStatus(applicationId, newStatus);
      
      // Refresh display
      this.view.displayApplications(this.applications);
      this.updateStatistics();
      
      this.view.showSuccess(`Status berhasil diperbarui menjadi "${newStatus}"`);
    } else {
      this.view.showError("Pengiriman tidak ditemukan");
    }
  }

  setupEventListeners() {
    document.addEventListener("user-logout", this.handleLogout);
  }

  handleLogout() {
    console.log("Logout initiated from PengirimanPresenter");
    
    this.destroy();
    
    const event = new CustomEvent("navigate", { detail: { page: "login" } });
    document.dispatchEvent(event);
  }

  handleAddPengiriman() {
    console.log("Navigating to add pengiriman form");
    const event = new CustomEvent("navigate", { 
      detail: { page: "add-pengiriman" } 
    });
    document.dispatchEvent(event);
  }

  // Method to refresh data
  async refresh() {
    await this.loadApplications();
  }

  // Method to get application by ID
  getApplicationById(id) {
    return this.applications.find(app => app.id === id);
  }

  // Method to export data (if needed)
  exportApplications(format = 'json') {
    if (format === 'json') {
      return JSON.stringify(this.applications, null, 2);
    }
    // Add other export formats as needed
  }

  destroy() {
    console.log("Destroying PengirimanPresenter");
    
    // Remove event listeners
    document.removeEventListener("user-logout", this.handleLogout);
    
    // Destroy view
    if (this.view && this.view.destroy) {
      this.view.destroy();
    }
    
    // Clear data
    this.applications = [];
    this.currentUser = null;
  }
}