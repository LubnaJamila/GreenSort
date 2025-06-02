// src/pages/dashboard-admin/pengirimanPresenter.js - FIXED VERSION
import PengirimanView from "./pengirimanView.js"; 
import { getCurrentUser } from "../../models/authModel.js";
import SidebarView from "../../views/sidebarView.js";
import PengirimanModel from "../../models/pengiriman-model.js";

export default class PengirimanPresenter {
    constructor() {
        this.view = new PengirimanView();
        this.currentUser = null;
        this.pengirimanModel = new PengirimanModel();
        this.sidebarView = new SidebarView();
        this.applications = []; // Store applications data

        // Bind methods
        this.handleLogout = this.handleLogout.bind(this);
        this.handleAddPengiriman = this.handleAddPengiriman.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleStatusUpdate = this.handleStatusUpdate.bind(this);
        this.handleCompleteShipment = this.handleCompleteShipment.bind(this);
        this.handleShowDetail = this.handleShowDetail.bind(this);
    }

    async init() {
    console.log("Initializing PengirimanPresenter");

    this.currentUser = getCurrentUser();
    if (!this.currentUser) {
        console.log("User not logged in, redirecting to login");
        const event = new CustomEvent("navigate", { detail: { page: "login" } });
        document.dispatchEvent(event);
        return;
    }

    try {
        // Render view first
        this.view.render();
        this.view.displayUserInfo(this.currentUser);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load data with proper timing
        await this.loadApplications();
        
        // Bind event handlers
        this.view.bindAddPengiriman(this.handleAddPengiriman);
        this.view.bindFilterChange(this.handleFilterChange);
        this.view.bindStatusUpdate(this.handleStatusUpdate);
        
        console.log("PengirimanPresenter initialized successfully");
        
    } catch (error) {
        console.error("Error initializing PengirimanPresenter:", error);
        this.view.showError("Gagal menginisialisasi halaman");
    }
}
    async loadApplications() {
    try {
        console.log("Loading applications data...");
        
        // Get data from model dengan error handling
        this.applications = this.pengirimanModel.getApplicationsWithErrorHandling();
        
        console.log(`Loaded ${this.applications.length} applications`);
        
        // Debug: Tampilkan contoh data pertama jika ada
        if (this.applications.length > 0) {
            console.log("Contoh data pertama:", this.applications[0]);
            console.log("Status yang tersedia:", [...new Set(this.applications.map(app => app.status))]);
        }
        
        // Wait for DOM to be ready before rendering
        setTimeout(() => {
            this.view.renderApplicationsTable(this.applications);
            this.updateStatistics();
        }, 100);
        
    } catch (error) {
        console.error("Error loading applications:", error);
        this.view.showError("Gagal memuat data pengiriman");
        
        // Set empty data sebagai fallback
        this.applications = [];
        this.view.renderApplicationsTable(this.applications);
    }
}

    updateStatistics() {
    try {
        const stats = this.calculateStatistics(this.applications);
        console.log("Calculated statistics:", stats);
        this.view.displayStatistics(stats);
    } catch (error) {
        console.error("Error updating statistics:", error);
    }
}

    calculateStatistics(applications) {
    if (!applications || !Array.isArray(applications)) {
        return {
            total: 0,
            pending: 0,
            accepted: 0,
            shipped: 0,
            completed: 0,
            totalValue: 'Rp. 0',
            wasteTypes: {}
        };
    }

    const total = applications.length;
    const pending = applications.filter(app => 
        app.status === "pending" || app.status === "Dijemput"
    ).length;
    const accepted = applications.filter(app => 
        app.status === "accepted" || app.status === "Diantar"
    ).length;
    const shipped = applications.filter(app => 
        app.status === "shipped" || app.status === "Dikirim"
    ).length;
    const completed = applications.filter(app => 
        app.status === "completed" || app.status === "Selesai"
    ).length;
    
    // Calculate total value
    const totalValue = applications.reduce((sum, app) => {
        return sum + (app.totalHarga || 0);
    }, 0);

    // Calculate waste type distribution
    const wasteTypes = {};
    applications.forEach(app => {
        const wasteType = app.kategoriSampah || app.jenisSampah || 'Unknown';
        wasteTypes[wasteType] = (wasteTypes[wasteType] || 0) + 1;
    });

    return {
        total,
        pending,
        accepted,
        shipped,
        completed,
        totalValue: `Rp. ${totalValue.toLocaleString('id-ID')}`,
        wasteTypes
    };
}

debugApplicationData() {
    console.log('=== DEBUGGING APPLICATION DATA ===');
    console.log('Applications count:', this.applications?.length || 0);
    console.log('First application:', this.applications?.[0]);
    console.log('Available statuses:', [...new Set(this.applications?.map(app => app.status) || [])]);
    console.log('Model data count:', this.pengirimanModel.getAllPengiriman().length);
    console.log('===================================');
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
            (app.kategoriSampah || app.jenisSampah) === filterValue
        );
        } else if (filterType === 'search' && filterValue.trim() !== '') {
        const searchTerm = filterValue.toLowerCase();
        filteredApplications = filteredApplications.filter(app => 
            (app.nama || '').toLowerCase().includes(searchTerm) ||
            (app.kategoriSampah || app.jenisSampah || '').toLowerCase().includes(searchTerm) ||
            (app.alamat || '').toLowerCase().includes(searchTerm)
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
        
        // Update in model
        this.pengirimanModel.updateStatusPengiriman(applicationId, newStatus);
        
        // Refresh display
        this.view.displayApplications(this.applications);
        this.updateStatistics();
        
        this.view.showSuccess(`Status berhasil diperbarui menjadi "${newStatus}"`);
        } else {
        this.view.showError("Pengiriman tidak ditemukan");
        }
    }

    handleCompleteShipment(e) {
        const applicationId = e.detail.id;
        console.log(`Completing shipment for application ${applicationId}`);
        
        // Update status to completed
        this.handleStatusUpdate(applicationId, 'completed');
    }

    handleShowDetail(e) {
        const applicationId = e.detail.id;
        this.showApplicationDetail(applicationId);
    }

    setupEventListeners() {
        document.addEventListener("user-logout", this.handleLogout);
        
        // Listen untuk dashboard refresh event
        document.addEventListener("dashboard-refresh", async () => {
        await this.refresh();
        });
        
        // Listen untuk application detail event
        document.addEventListener("show-application-detail", this.handleShowDetail);
        
        // Listen untuk complete shipment event
        document.addEventListener("complete-shipment", this.handleCompleteShipment);
    }

    showApplicationDetail(applicationId) {
        const application = this.getApplicationById(applicationId);
        if (application) {
        // Dispatch event untuk navigasi ke detail page
        const event = new CustomEvent("navigate", { 
            detail: { 
            page: "pengiriman-detail", 
            data: application 
            } 
        });
        document.dispatchEvent(event);
        }
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
    console.log("Refreshing pengiriman data...");
    try {
        await this.loadApplications();
        this.view.showSuccess("Data berhasil diperbarui");
    } catch (error) {
        console.error("Error refreshing data:", error);
        this.view.showError("Gagal memperbarui data");
    }
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
        document.removeEventListener("dashboard-refresh", this.refresh);
        document.removeEventListener("show-application-detail", this.handleShowDetail);
        document.removeEventListener("complete-shipment", this.handleCompleteShipment);
        
        // Destroy view
        if (this.view && this.view.destroy) {
        this.view.destroy();
        }
        
        // Clear data
        this.applications = [];
        this.currentUser = null;
    }
}