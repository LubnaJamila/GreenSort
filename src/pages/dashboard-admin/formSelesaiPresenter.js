// src/pages/dashboard-admin/formSelesaiPresenter.js
import FormSelesaiView from "./formSelesaiView.js";
import AlamatModel from "../../models/alamat-model.js";
import { getCurrentUser } from "../../models/authModel.js";
import PengajuanModel from "../../models/pengajuan-model.js";
import { fetchSelesaiById, updateSelesai } from "../../models/selesaiModel.js";

export default class FormSelesaiPresenter {
    constructor() {
        this.view = new FormSelesaiView();
        this.model = new AlamatModel();
        this.pengajuanModel = new PengajuanModel();
        this.user = null;
        this.currentApplicationId = null;
        this.setupEventListeners();
    }

    async init(applicationId = null) {
        try {
            this.user = getCurrentUser();
            
            if (!applicationId) {
                applicationId = this.getApplicationIdFromUrl();
            }
            
            this.view.render(applicationId);
            
            if (this.user) {
                this.view.displayUserInfo(this.user);
            }
            
            if (applicationId) {
                this.currentApplicationId = applicationId;
                await this.loadApplicationDetail(applicationId);
            } else {
                this.view.showError('ID pengajuan tidak ditemukan dalam URL.');
            }
            
        } catch (error) {
            console.error('Error initializing form selesai:', error);
            this.view.showError('Terjadi kesalahan saat memuat halaman.');
        }
    }

    getApplicationIdFromUrl() {
        const hash = window.location.hash;
        
        const match = hash.match(/\/selesai\/(\d+)/) || hash.match(/[?&]id=(\d+)/);
        return match ? match[1] : null;
    }

    setupEventListeners() {
         const form = document.getElementById('selesai-form');
        document.addEventListener('form-submit', (event) => { 
        this.handleFormSubmit(event.detail);
        });
        
        document.addEventListener('load-application-detail', (event) => {
            this.handleLoadApplicationDetail(event.detail);
        });

       
        document.addEventListener('submit-completion', (event) => {
            this.handleSubmitCompletion(event.detail);
        });

        
        document.addEventListener('request-user-info', () => {
            this.loadUserInfo();
        });
    }
    async handleFormSubmit(detail) {
    try {
        const { formData, applicationId } = detail;
        if (!formData || !applicationId) {
            throw new Error('Data form tidak lengkap');
        }

        const result = await updateSelesai(applicationId, formData); 

        if (result.success) {
            this.view.showSuccess('Transaksi berhasil diselesaikan.');
        } else {
            this.view.showError(result.message || 'Gagal menyelesaikan transaksi.');
        }
    } catch (error) {
        console.error('Error submitting form selesai:', error);
        this.view.showError('Terjadi kesalahan saat mengirim data.');
    }
}


    async handleLoadApplicationDetail(detail) {
        if (!detail || !detail.id) {
            this.view.showError('ID pengajuan tidak valid.');
            return;
        }

        await this.loadApplicationDetail(detail.id);
    }

    async loadApplicationDetail(applicationId) {
    try {
        console.log('🔍 Ambil data detail dari API untuk ID:', applicationId);

        const applicationData = await fetchSelesaiById(applicationId);

        if (!applicationData) {
            throw new Error('Data pengajuan tidak ditemukan.');
        }

        
        const formattedData = {
            id: applicationData.id,
            namaLengkap: applicationData.name,
            noHp: applicationData.phone,
            kategoriSampah: applicationData.category,
            beratSampah: applicationData.weight,
            hargaSampah: applicationData.price,
            metodePengiriman: applicationData.metode,
            ongkosKirim: applicationData.totalBayar,
            gambarSampah: applicationData.image,
        };

        // Kirim ke View
        this.view.populateApplicationData(formattedData);

    } catch (error) {
        console.error('❌ Error loadApplicationDetail:', error);
        this.view.showError(error.message || 'Terjadi kesalahan saat ambil detail.');
    }
}


    canCompleteApplication(application) {
        
        const allowedStatuses = ['Diterima', 'accepted', 'in_process', 'ready_pickup'];
        const currentStatus = application.status || application.statusOriginal;
        
        return allowedStatuses.includes(currentStatus);
    }

    async handleSubmitCompletion(completionData) {
        try {
            console.log('Submitting completion:', completionData);

            
            if (!completionData.applicationId && this.currentApplicationId) {
                completionData.applicationId = this.currentApplicationId;
            }

            
            if (!this.validateCompletionData(completionData)) {
                return;
            }

            
            completionData.completedBy = this.user?.id || this.user?.username || 'admin';
            completionData.completedAt = new Date().toISOString();

            
            const result = await this.pengajuanModel.completeApplication(completionData);
            
            if (result && result.success) {
                this.view.showSuccess('Pengajuan berhasil diselesaikan.');
                
                
                if (completionData.notifyUser) {
                    await this.sendCompletionNotification(completionData);
                }
                
                
                await this.logCompletionActivity(completionData);
                
                
                setTimeout(() => {
                    window.location.hash = '#/pengajuan';
                }, 2000);
                
            } else {
                throw new Error(result?.message || 'Gagal menyelesaikan pengajuan.');
            }
            
        } catch (error) {
            console.error('Error submitting completion:', error);
            this.view.showError(error.message || 'Terjadi kesalahan saat memproses penyelesaian.');
        }
    }

    validateCompletionData(data) {
        
        if (!data.applicationId) {
            this.view.showError('ID pengajuan tidak valid.');
            return false;
        }

        if (!data.buktiTransaksi) {
            this.view.showError('Bukti transaksi wajib diupload.');
            return false;
        }

        
        if (data.buktiTransaksiFile) {
            const validation = this.validateFileUpload(data.buktiTransaksiFile);
            if (!validation.valid) {
                this.view.showError(validation.message);
                return false;
            }
        }

        if (data.catatan && data.catatan.trim().length > 500) {
            this.view.showError('Catatan maksimal 500 karakter.');
            return false;
        }

        return true;
    }

    validateFileUpload(file) {
        const maxSize = 5 * 1024 * 1024; 
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        
        if (!file) {
            return { valid: false, message: 'Silakan pilih file terlebih dahulu.' };
        }
        
        if (!allowedTypes.includes(file.type)) {
            return { 
                valid: false, 
                message: 'Format file tidak didukung. Silakan pilih file JPG, PNG, atau PDF.' 
            };
        }
        
        if (file.size > maxSize) {
            return { 
                valid: false, 
                message: 'Ukuran file terlalu besar. Maksimal 5MB.' 
            };
        }
        
        return { valid: true };
    }

    async sendCompletionNotification(completionData) {
        try {
            console.log('Sending completion notification...');
            
            const notificationData = {
                applicationId: completionData.applicationId,
                type: 'completion',
                title: 'Pengajuan Diselesaikan',
                message: `Pengajuan Anda telah diselesaikan. ${completionData.catatan ? 'Catatan: ' + completionData.catatan : ''}`,
                category: completionData.category,
                timestamp: new Date().toISOString()
            };

            
            if (typeof this.model.sendNotification === 'function') {
                await this.model.sendNotification(notificationData);
                console.log('Completion notification sent successfully');
            } else {
                console.log('Notification method not available in model');
            }
            
        } catch (error) {
            console.error('Error sending completion notification:', error);
            
        }
    }

    async logCompletionActivity(completionData) {
        try {
            console.log('Logging completion activity...');
            
            const activityData = {
                type: 'application_completed',
                applicationId: completionData.applicationId,
                adminId: await this.getCurrentUserId(),
                details: {
                    buktiTransaksi: completionData.buktiTransaksi,
                    catatan: completionData.catatan,
                    totalBayar: completionData.totalBayar,
                    notificationSent: completionData.notifyUser
                },
                timestamp: new Date().toISOString()
            };

            
            if (typeof this.model.logActivity === 'function') {
                await this.model.logActivity(activityData);
                console.log('Completion activity logged successfully');
            } else {
                console.log('Activity logging method not available in model');
            }
            
        } catch (error) {
            console.error('Error logging completion activity:', error);
            
        }
    }

    async loadUserInfo() {
        try {
            
            let userInfo = null;
            
            if (typeof this.model.getCurrentUser === 'function') {
                userInfo = await this.model.getCurrentUser();
            } else {
                
                userInfo = getCurrentUser();
            }
            
            if (userInfo) {
                this.user = userInfo;
                this.view.displayUserInfo(userInfo);
            }
        } catch (error) {
            console.error('Error loading user info:', error);
            
        }
    }

    async getCurrentUserId() {
        try {
            let userInfo = null;
            
            if (typeof this.model.getCurrentUser === 'function') {
                userInfo = await this.model.getCurrentUser();
            } else {
                userInfo = getCurrentUser();
            }
            
            return userInfo?.id || userInfo?.username || 'unknown';
        } catch (error) {
            console.error('Error getting current user ID:', error);
            return 'unknown';
        }
    }

    
    formatCurrency(amount) {
        if (!amount) return 'Rp 0';
        
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    calculateTotalPayment(hargaSampah, ongkosKirim) {
        const harga = parseFloat(hargaSampah) || 0;
        const ongkir = parseFloat(ongkosKirim) || 0;
        
        
        return Math.max(0, harga - ongkir);
    }

    sanitizeInput(input) {
        return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }

    
    async getCompletionStats() {
        try {
            if (typeof this.model.getCompletionStatistics === 'function') {
                return await this.model.getCompletionStatistics();
            }
            return null;
        } catch (error) {
            console.error('Error getting completion stats:', error);
            return null;
        }
    }

    
    async getCompletionHistory(applicationId) {
        try {
            if (typeof this.model.getApplicationCompletionHistory === 'function') {
                return await this.model.getApplicationCompletionHistory(applicationId);
            }
            return [];
        } catch (error) {
            console.error('Error getting completion history:', error);
            return [];
        }
    }

    
    async refreshApplicationData() {
        if (this.currentApplicationId) {
            await this.loadApplicationDetail(this.currentApplicationId);
        }
    }

    
    destroy() {
        
        document.removeEventListener('load-application-detail', this.handleLoadApplicationDetail);
        document.removeEventListener('submit-completion', this.handleSubmitCompletion);
        document.removeEventListener('request-user-info', this.loadUserInfo);
        
        
        if (this.view && typeof this.view.destroy === 'function') {
            this.view.destroy();
        }
    }
}