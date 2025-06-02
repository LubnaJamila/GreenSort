// src/pages/dashboard-user/ditolakPresenter.js
import DitolakView from "./ditolakView.js";
import { getCurrentUser } from "../../models/authModel.js";
// Import model untuk data aplikasi (sesuaikan dengan struktur project Anda)
// import ApplicationModel from "../../models/applicationModel.js";

export default class DitolakPresenter {
    constructor() {
        this.view = new DitolakView();
        // this.applicationModel = new ApplicationModel();
        this.currentUser = null;
        
        // Bind methods
        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleDataUpdate = this.handleDataUpdate.bind(this);
    }
  
    init() {
        console.log("Initializing DitolakPresenter");
        
        // Get current user
        this.currentUser = getCurrentUser();
        if (!this.currentUser) {
            console.log("User not logged in, redirecting to login");
            const event = new CustomEvent("navigate", { detail: { page: "login" } });
            document.dispatchEvent(event);
            return;
        }

        // Render view
        this.view.render();
        this.view.displayUserInfo(this.currentUser);
        
        // Load initial data
        this.loadRejectedApplications();
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    async loadRejectedApplications() {
        try {
            this.view.showLoading(true);
            
            // Simulasi data (ganti dengan pemanggilan API atau model yang sesuai)
            const sampleData = this.getSampleRejectedData();
            
            // Atau jika menggunakan model:
            // const applications = await this.applicationModel.getRejectedApplications(this.currentUser.id);
            
            this.view.updateRejectedData(sampleData);
            
        } catch (error) {
            console.error("Error loading rejected applications:", error);
            this.showError("Gagal memuat data pengajuan ditolak");
        }
    }
    
    // Sample data untuk testing (hapus ketika sudah terintegrasi dengan backend)
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
                keterangan: "Kualitas plastik tidak sesuai standar"
            },
            {
                id: 2,
                jenisSampah: "Kardus",
                tanggalPembelian: "2024-11-28",
                kuantitas: "10 kg",
                harga: "Rp 2,500/kg",
                total: "Rp 25,000",
                status: "Ditolak",
                keterangan: "Kardus dalam kondisi basah"
            },
            {
                id: 3,
                jenisSampah: "Logam",
                tanggalPembelian: "2024-11-25",
                kuantitas: "3 kg",
                harga: "Rp 8,000/kg",
                total: "Rp 24,000",
                status: "Ditolak",
                keterangan: "Berat tidak sesuai dengan yang dilaporkan"
            }
        ];
    }
    
    setupEventListeners() {
        // Listen for refresh events
        document.addEventListener("dashboard-refresh", this.handleRefresh);
        
        // Listen for data updates
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
        // Implementasi notifikasi error
        console.error(message);
        
        // Contoh menggunakan toast notification (sesuaikan dengan library yang digunakan)
        if (window.showToast) {
            window.showToast(message, 'error');
        } else {
            alert(message);
        }
    }
    
    showSuccess(message) {
        // Implementasi notifikasi sukses
        console.log(message);
        
        if (window.showToast) {
            window.showToast(message, 'success');
        } else {
            alert(message);
        }
    }
    
    // Method untuk handle bulk actions (jika diperlukan)
    async handleBulkAction(action) {
        const selectedIds = this.view.getSelectedRows();
        
        if (selectedIds.length === 0) {
            this.showError("Pilih setidaknya satu item");
            return;
        }
        
        try {
            switch (action) {
                case 'delete':
                    await this.handleBulkDelete(selectedIds);
                    break;
                case 'resubmit':
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
            // Implementasi delete
            // await this.applicationModel.deleteApplications(ids);
            this.showSuccess(`Berhasil menghapus ${ids.length} item`);
            this.loadRejectedApplications();
            this.view.clearSelection();
        }
    }
    
    async handleBulkResubmit(ids) {
        if (confirm(`Apakah Anda yakin ingin mengajukan ulang ${ids.length} item?`)) {
            // Implementasi resubmit
            // await this.applicationModel.resubmitApplications(ids);
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