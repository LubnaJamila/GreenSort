// src/presenters/formPenolakanPresenter.js
import FormPenolakanView from "./formPenolakanView.js";
import AlamatModel from "../../models/alamat-model.js";
import { getCurrentUser } from "../../models/authModel.js";
import PengajuanModel from "../../models/pengajuan-model.js";

export default class FormPenolakanPresenter {
    constructor() {
        this.view = new FormPenolakanView();
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
            console.error('Error initializing form penolakan:', error);
            this.view.showError('Terjadi kesalahan saat memuat halaman.');
        }
    }

    getApplicationIdFromUrl() {
        const hash = window.location.hash;
        
        const match = hash.match(/\/penolakan\/(\d+)/) || hash.match(/[?&]id=(\d+)/);
        return match ? match[1] : null;
    }

    setupEventListeners() {
        
        document.addEventListener('load-application-detail', (event) => {
            this.handleLoadApplicationDetail(event.detail);
        });

       
        document.addEventListener('submit-rejection', (event) => {
            this.handleSubmitRejection(event.detail);
        });

        
        document.addEventListener('request-user-info', () => {
            this.loadUserInfo();
        });
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
        console.log('Loading application detail for ID:', applicationId);

        const applicationData = await this.pengajuanModel.getApplicationById(applicationId); 

        if (!applicationData) {
            throw new Error('Data pengajuan tidak ditemukan.');
        }

        
        this.currentApplicationId = applicationId;
        this.view.renderApplicationDetail(applicationData); 
    } catch (error) {
        console.error('Error loading application detail:', error);
        this.view.showError(error.message || 'Terjadi kesalahan saat memuat data pengajuan.');
    }
}


    canRejectApplication(application) {
        
        const allowedStatuses = ['pending', 'Menunggu Validasi'];
        const currentStatus = application.status || application.statusOriginal;
        
        return allowedStatuses.includes(currentStatus);
    }

    async handleSubmitRejection(rejectionData) {
        try {
            console.log('Submitting rejection:', rejectionData);

            
            if (!rejectionData.applicationId && this.currentApplicationId) {
                rejectionData.applicationId = this.currentApplicationId;
            }

            
            if (!this.validateRejectionData(rejectionData)) {
                return;
            }

           
            rejectionData.rejectedBy = this.user?.id || this.user?.username || 'admin';
            rejectionData.rejectedAt = new Date().toISOString();

            
            const result = await this.pengajuanModel.rejectApplication(rejectionData);
            
            if (result && result.success) {
                this.view.showSuccess('Pengajuan berhasil ditolak.');
                
                
                if (rejectionData.notifyUser) {
                    await this.sendRejectionNotification(rejectionData);
                }
                
                
                await this.logRejectionActivity(rejectionData);
                
                
                setTimeout(() => {
                    window.location.hash = '#/pengajuan';
                }, 2000);
                
            } else {
                throw new Error(result?.message || 'Gagal menolak pengajuan.');
            }
            
        } catch (error) {
            console.error('Error submitting rejection:', error);
            this.view.showError(error.message || 'Terjadi kesalahan saat memproses penolakan.');
        }
    }

    validateRejectionData(data) {
        
        if (!data.applicationId) {
            this.view.showError('ID pengajuan tidak valid.');
            return false;
        }

        if (!data.reason || data.reason.trim().length < 10) {
            this.view.showError('Alasan penolakan minimal 10 karakter.');
            return false;
        }

        if (data.reason.trim().length > 500) {
            this.view.showError('Alasan penolakan maksimal 500 karakter.');
            return false;
        }

        return true;
    }

    async sendRejectionNotification(rejectionData) {
        try {
            console.log('Sending rejection notification...');
            
            const notificationData = {
                applicationId: rejectionData.applicationId,
                type: 'rejection',
                title: 'Pengajuan Ditolak',
                message: `Pengajuan Anda telah ditolak. Alasan: ${rejectionData.reason}`,
                category: rejectionData.category,
                timestamp: new Date().toISOString()
            };

           
            if (typeof this.model.sendNotification === 'function') {
                await this.model.sendNotification(notificationData);
                console.log('Rejection notification sent successfully');
            } else {
                console.log('Notification method not available in model');
            }
            
        } catch (error) {
            console.error('Error sending rejection notification:', error);
            
        }
    }

    async logRejectionActivity(rejectionData) {
        try {
            console.log('Logging rejection activity...');
            
            const activityData = {
                type: 'application_rejected',
                applicationId: rejectionData.applicationId,
                adminId: await this.getCurrentUserId(),
                details: {
                    reason: rejectionData.reason,
                    category: rejectionData.category,
                    notificationSent: rejectionData.notifyUser
                },
                timestamp: new Date().toISOString()
            };

            
            if (typeof this.model.logActivity === 'function') {
                await this.model.logActivity(activityData);
                console.log('Rejection activity logged successfully');
            } else {
                console.log('Activity logging method not available in model');
            }
            
        } catch (error) {
            console.error('Error logging rejection activity:', error);
            
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

    
    formatRejectionReason(reason) {
        return reason.trim().charAt(0).toUpperCase() + reason.trim().slice(1);
    }

    sanitizeInput(input) {
        return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }

    
    async getRejectionStats() {
        try {
            if (typeof this.model.getRejectionStatistics === 'function') {
                return await this.model.getRejectionStatistics();
            }
            return null;
        } catch (error) {
            console.error('Error getting rejection stats:', error);
            return null;
        }
    }

    
    async getRejectionHistory(applicationId) {
        try {
            if (typeof this.model.getApplicationRejectionHistory === 'function') {
                return await this.model.getApplicationRejectionHistory(applicationId);
            }
            return [];
        } catch (error) {
            console.error('Error getting rejection history:', error);
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
        document.removeEventListener('submit-rejection', this.handleSubmitRejection);
        document.removeEventListener('request-user-info', this.loadUserInfo);
        
        if (this.view && typeof this.view.destroy === 'function') {
            this.view.destroy();
        }
    }
}