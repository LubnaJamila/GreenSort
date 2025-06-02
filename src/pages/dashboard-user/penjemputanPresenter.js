//src/pages/dashboard-user/penjemputanPresenter.js
import PenjemputanView from "./penjemputanView.js";
import { getCurrentUser } from "../../models/authModel.js";
// Import model untuk data penjemputan (sesuaikan dengan struktur project)
// import { getPenjemputanData } from "../../models/penjemputanModel.js";

export default class PenjemputanPresenter {
    constructor() {
        this.view = new PenjemputanView();
        this.isLoading = false;
        this.currentData = [];
        this.setupEventListeners();
    }
    
    async init() {
        try {
            console.log('Initializing penjemputan dashboard...');
            
            // Render view terlebih dahulu
            this.view.render();
            
            // Load dan display user info
            const user = getCurrentUser();
            this.view.displayUserInfo(user);
            
            // Load dan display data penjemputan
            await this.loadPenjemputanData();
            
        } catch (error) {
            console.error('Error initializing penjemputan dashboard:', error);
            this.handleError('Gagal memuat dashboard penjemputan');
        }
    }
    
    async loadPenjemputanData() {
        if (this.isLoading) return;
        
        try {
            this.isLoading = true;
            this.view.showLoading(true);
            
            // TODO: Implementasikan sesuai dengan API/model yang digunakan
            // const applicationsData = await getPenjemputanData();
            
            // Simulasi delay loading untuk demonstrasi
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Sementara menggunakan mock data untuk demonstrasi
            const applicationsData = this.getMockData();
            
            // Filter hanya data dengan status dijemput atau diantar
            const filteredData = applicationsData.filter(item => {
                const status = this.normalizeStatus(item.status);
                return status === 'dijemput' || status === 'diantar';
            });
            
            this.currentData = filteredData;
            
            // Render data ke view
            this.view.renderDashboardData(this.currentData);
            
            console.log('Data loaded successfully:', this.currentData.length, 'items');
            
        } catch (error) {
            console.error('Error loading penjemputan data:', error);
            this.handleError('Gagal memuat data penjemputan');
        } finally {
            this.isLoading = false;
            this.view.showLoading(false);
        }
    }
    
    normalizeStatus(status) {
        const statusMap = {
            'shipped': 'dijemput',
            'completed': 'diantar',
            'Dikirim': 'dijemput',
            'Selesai': 'diantar'
        };
        return statusMap[status] || status;
    }
    
    setupEventListeners() {
        // Handle detail view request
        document.addEventListener('show-application-detail', (e) => {
            this.handleShowDetail(e.detail.id);
        });
        
        // Handle dashboard refresh
        document.addEventListener('dashboard-refresh', () => {
            this.handleRefresh();
        });
        
        // Handle filter changes
        document.addEventListener('penjemputan-filter-changed', (e) => {
            this.handleFilterChange(e.detail.filter);
        });
    }
    
    handleShowDetail(applicationId) {
        try {
            console.log('Showing detail for application:', applicationId);
            
            // Cari data aplikasi berdasarkan ID
            const application = this.currentData.find(app => app.id == applicationId);
            
            if (!application) {
                console.error('Application not found:', applicationId);
                this.showNotification('Data tidak ditemukan', 'error');
                return;
            }
            
            // Navigate to detail page atau show modal
            // Contoh implementasi:
            if (typeof window !== 'undefined') {
                window.location.hash = `#/penjemputan-detail/${applicationId}`;
            }
            
            // Atau dispatch event untuk router
            const event = new CustomEvent('navigate', {
                detail: { 
                    route: 'penjemputan-detail', 
                    params: { id: applicationId },
                    data: application
                }
            });
            document.dispatchEvent(event);
            
        } catch (error) {
            console.error('Error showing detail:', error);
            this.showNotification('Gagal membuka detail', 'error');
        }
    }
    
    async handleRefresh() {
        try {
            console.log('Refreshing penjemputan data...');
            
            // Clear selection before refresh
            this.view.clearSelection();
            
            // Reload data
            await this.loadPenjemputanData();
            
            // Show success message
            this.showNotification('Data berhasil diperbarui', 'success');
            
        } catch (error) {
            console.error('Error refreshing data:', error);
            this.showNotification('Gagal memperbarui data', 'error');
        }
    }
    
    handleFilterChange(filterType) {
        console.log('Filter changed to:', filterType);
        this.view.setFilter(filterType);
    }
    
    handleError(message) {
        console.error('PenjemputanPresenter Error:', message);
        this.showNotification(message, 'error');
        
        // Show empty state jika perlu
        this.view.renderDashboardData([]);
    }
    
    showNotification(message, type = 'info') {
        // Implementasi sederhana untuk notifikasi
        // Bisa diganti dengan library notifikasi yang lebih canggih
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // Jika ada sistem notifikasi global, gunakan di sini
        if (typeof window !== 'undefined' && window.showNotification) {
            window.showNotification(message, type);
        } else {
            // Fallback ke alert untuk sementara (bisa dihapus di production)
            if (type === 'error') {
                alert(`Error: ${message}`);
            }
        }
    }
    
    // Method untuk filter data (jika diperlukan dari presenter level)
    filterData(filterType) {
        this.view.setFilter(filterType);
    }
    
    // Method untuk mendapatkan selected applications
    getSelectedApplications() {
        return this.view.getSelectedApplications();
    }
    
    // Method untuk clear selection
    clearSelection() {
        this.view.clearSelection();
    }
    
    // Method untuk mendapatkan data saat ini
    getCurrentData() {
        return this.currentData;
    }
    
    // Method untuk mendapatkan statistik
    getStats() {
        if (!this.currentData || this.currentData.length === 0) {
            return {
                total: 0,
                dijemput: 0,
                diantar: 0
            };
        }
        
        return {
            total: this.currentData.length,
            dijemput: this.currentData.filter(item => 
                this.normalizeStatus(item.status) === 'dijemput'
            ).length,
            diantar: this.currentData.filter(item => 
                this.normalizeStatus(item.status) === 'diantar'
            ).length
        };
    }
    
    // Method untuk update status penjemputan
    async updatePenjemputanStatus(applicationId, newStatus) {
        try {
            console.log('Updating status for application:', applicationId, 'to:', newStatus);
            
            // TODO: Implementasikan API call untuk update status
            // await updatePenjemputanStatusAPI(applicationId, newStatus);
            
            // Update data lokal
            const application = this.currentData.find(app => app.id == applicationId);
            if (application) {
                application.status = newStatus;
                
                // Re-render data
                this.view.renderDashboardData(this.currentData);
                
                this.showNotification('Status berhasil diperbarui', 'success');
            } else {
                throw new Error('Application not found');
            }
            
        } catch (error) {
            console.error('Error updating status:', error);
            this.showNotification('Gagal memperbarui status', 'error');
        }
    }
    
    // Method untuk bulk actions
    async performBulkAction(action, selectedIds) {
        try {
            if (!selectedIds || selectedIds.length === 0) {
                this.showNotification('Pilih data terlebih dahulu', 'warning');
                return;
            }
            
            console.log('Performing bulk action:', action, 'on:', selectedIds);
            
            switch (action) {
                case 'mark_as_dijemput':
                    await this.bulkUpdateStatus(selectedIds, 'dijemput');
                    break;
                case 'mark_as_diantar':
                    await this.bulkUpdateStatus(selectedIds, 'diantar');
                    break;
                case 'delete':
                    await this.bulkDelete(selectedIds);
                    break;
                default:
                    throw new Error('Unknown bulk action: ' + action);
            }
            
            // Clear selection after action
            this.view.clearSelection();
            
        } catch (error) {
            console.error('Error performing bulk action:', error);
            this.showNotification('Gagal melakukan aksi bulk', 'error');
        }
    }
    
    async bulkUpdateStatus(selectedIds, newStatus) {
        try {
            // TODO: Implementasikan API call untuk bulk update
            // await bulkUpdateStatusAPI(selectedIds, newStatus);
            
            // Update data lokal
            selectedIds.forEach(id => {
                const application = this.currentData.find(app => app.id == id);
                if (application) {
                    application.status = newStatus;
                }
            });
            
            // Re-render data
            this.view.renderDashboardData(this.currentData);
            
            this.showNotification(`${selectedIds.length} data berhasil diperbarui`, 'success');
            
        } catch (error) {
            throw error;
        }
    }
    
    async bulkDelete(selectedIds) {
        try {
            // Konfirmasi penghapusan
            const confirmed = confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} data?`);
            if (!confirmed) return;
            
            // TODO: Implementasikan API call untuk bulk delete
            // await bulkDeleteAPI(selectedIds);
            
            // Update data lokal
            this.currentData = this.currentData.filter(app => !selectedIds.includes(app.id.toString()));
            
            // Re-render data
            this.view.renderDashboardData(this.currentData);
            
            this.showNotification(`${selectedIds.length} data berhasil dihapus`, 'success');
            
        } catch (error) {
            throw error;
        }
    }
    
    // Method untuk export data
    exportData(format = 'csv') {
        try {
            const selectedIds = this.getSelectedApplications();
            const dataToExport = selectedIds.length > 0 
                ? this.currentData.filter(app => selectedIds.includes(app.id.toString()))
                : this.currentData;
            
            if (dataToExport.length === 0) {
                this.showNotification('Tidak ada data untuk diekspor', 'warning');
                return;
            }
            
            switch (format) {
                case 'csv':
                    this.exportToCSV(dataToExport);
                    break;
                case 'excel':
                    this.exportToExcel(dataToExport);
                    break;
                default:
                    throw new Error('Format export tidak didukung: ' + format);
            }
            
            this.showNotification('Data berhasil diekspor', 'success');
            
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showNotification('Gagal mengekspor data', 'error');
        }
    }
    
    exportToCSV(data) {
        const headers = ['ID', 'Nama', 'No HP', 'Kategori', 'Berat', 'Status', 'Tanggal'];
        const csvContent = [
            headers.join(','),
            ...data.map(app => [
                app.id,
                `"${app.name || app.nama || ''}"`,
                app.phone || app.noHp || '',
                `"${app.category || app.kategori || ''}"`,
                app.weight || app.berat || 0,
                `"${app.status || ''}"`,
                `"${this.formatDate(app.date || app.tanggal)}"`
            ].join(','))
        ].join('\n');
        
        this.downloadFile(csvContent, 'penjemputan-data.csv', 'text/csv');
    }
    
    exportToExcel(data) {
        // Implementasi sederhana untuk export Excel
        // Untuk implementasi yang lebih lengkap, gunakan library seperti xlsx
        console.log('Excel export not implemented yet. Using CSV as fallback.');
        this.exportToCSV(data);
    }
    
    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
    
    formatDate(date) {
        if (!date) return '';
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        return d.toLocaleDateString('id-ID');
    }
    
    // Mock data untuk demonstrasi - hapus ketika implementasi dengan API real
    getMockData() {
        return [
            {
                id: 1,
                category: "Plastik",
                weight: 5.5,
                price: 2000, // harga per kg
                totalPrice: 11000, // berat * harga
                date: new Date('2024-06-01'),
                address: "Jl. Merdeka No. 123, Jakarta"
            },
            {
                id: 2,
                category: "Kertas",
                weight: 3.2,
                price: 1500,
                totalPrice: 4800,
                date: new Date('2024-05-28'),
                address: "Jl. Sudirman No. 456, Jakarta"
            },
            {
                id: 3,
                category: "Logam",
                weight: 8.7,
                price: 5000,
                totalPrice: 43500,
                date: new Date('2024-05-30'),
                address: "Jl. Thamrin No. 789, Jakarta"
            },
            {
                id: 4,
                category: "Organik",
                weight: 2.1,
                price: 1000,
                totalPrice: 2100,
                date: new Date('2024-05-29'),
                address: "Jl. Gatot Subroto No. 101, Jakarta"
            }
        ];
    }
    
    // Event listener cleanup
    removeEventListeners() {
        // Remove custom event listeners
        document.removeEventListener('show-application-detail', this.handleShowDetail);
        document.removeEventListener('dashboard-refresh', this.handleRefresh);
        document.removeEventListener('penjemputan-filter-changed', this.handleFilterChange);
    }
    
    // Cleanup method
    destroy() {
        console.log('Destroying PenjemputanPresenter...');
        
        // Cleanup event listeners
        this.removeEventListeners();
        
        // Cleanup view
        if (this.view) {
            this.view.destroy();
        }
        
        // Clear data
        this.currentData = [];
        this.isLoading = false;
    }
}