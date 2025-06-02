// src/pages/dashboard-user/diterimaPresenter.js
import DiterimaView from "./diterimaView.js";
import { getCurrentUser } from "../../models/authModel.js";
import DiterimaModel from "../../models/diterima-model.js"; // Assuming you have this model

export default class DiterimaPresenter {
    constructor() {
        this.view = new DiterimaView();
        this.diterimaModel = new DiterimaModel(); // Add model for data management
        this.currentUser = null;
        
        // Bind event handlers
        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleDiterimaRefresh = this.handleDiterimaRefresh.bind(this);
    }

 
    async init() {
        console.log("Initializing DiterimaPresenter");
        
        // Get current user
        this.currentUser = getCurrentUser();
        if (!this.currentUser) {
            console.log("User not logged in, redirecting to login");
            const event = new CustomEvent("navigate", { detail: { page: "login" } });
            document.dispatchEvent(event);
            return;
        }

        // Render the view
        this.view.render();
        this.view.displayUserInfo(this.currentUser);
        
        // Load initial data
        await this.loadAcceptedApplications();
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Listen for refresh events
        document.addEventListener("dashboard-refresh", this.handleRefresh);
        document.addEventListener("diterima-refresh", this.handleDiterimaRefresh);
    }
    
    async loadAcceptedApplications() {
        try {
            // Gunakan method yang benar dari model
            const applications = await this.diterimaModel.getAllAcceptedApplications();
            
            // Hapus filter userId atau tambahkan userId ke data dummy
            const acceptedApplications = applications.filter(app => {
                const isAccepted = app.status === 'Diterima' || 
                                app.status === 'diterima' || 
                                app.status === 'accepted';
                // Hapus pengecekan userId atau tambahkan ke data dummy
                return isAccepted;
            });
            
            console.log(`Loaded ${acceptedApplications.length} accepted applications`);
            
            // Render the data
            this.view.renderDashboardData(acceptedApplications);
            
        } catch (error) {
            console.error("Error loading accepted applications:", error);
            this.showError("Gagal memuat data pengajuan yang diterima");
        }
    }
    
    async handleRefresh() {
        console.log("Refreshing accepted applications data");
        await this.loadAcceptedApplications();
    }
    
    async handleDiterimaRefresh() {
        console.log("Specific refresh for accepted applications");
        await this.loadAcceptedApplications();
    }
    
    showError(message) {
        // Display error message to user
        const tableBody = document.getElementById("applications-table-body");
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4 text-danger">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        ${message}
                    </td>
                </tr>
            `;
        }
    }
    
    // Method to get selected applications
    getSelectedApplications() {
        return this.view.getSelectedRows();
    }
    
    // Method to export data (if needed)
    exportData() {
        const selectedRows = this.getSelectedApplications();
        if (selectedRows.length === 0) {
            alert("Pilih data yang ingin diekspor");
            return;
        }
        
        // Implement export logic here
        console.log("Exporting selected applications:", selectedRows);
        // You can implement CSV/Excel export here
    }
    
    // Method to handle bulk actions (if needed)
    handleBulkAction(action) {
        const selectedRows = this.getSelectedApplications();
        if (selectedRows.length === 0) {
            alert("Pilih data untuk diproses");
            return;
        }
        
        switch (action) {
            case 'export':
                this.exportData();
                break;
            case 'print':
                this.printSelected();
                break;
            default:
                console.log(`Unknown bulk action: ${action}`);
        }
    }
    
    printSelected() {
        const selectedRows = this.getSelectedApplications();
        if (selectedRows.length === 0) {
            alert("Pilih data yang ingin dicetak");
            return;
        }
        
        // Implement print logic here
        console.log("Printing selected applications:", selectedRows);
        window.print();
    }
    
    removeEventListeners() {
        document.removeEventListener("dashboard-refresh", this.handleRefresh);
        document.removeEventListener("diterima-refresh", this.handleDiterimaRefresh);
    }
 
    destroy() {
        console.log("Destroying DiterimaPresenter");
        this.removeEventListeners();
        this.view.destroy();
    }
}