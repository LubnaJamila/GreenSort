// src/presenters/FormPenawaranPresenter.js
import FormPenawaranView from './formPenawaranView.js';
import AlamatModel from "../../models/alamat-model.js";
import { getCurrentUser } from "../../models/authModel.js";

export default class FormPenawaranPresenter {
    constructor() {
        this.view = new FormPenawaranView();
        this.model = new AlamatModel();
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
            
            // Load address options
            await this.loadAddressOptions();
            
            if (applicationId) {
                this.currentApplicationId = applicationId;
                await this.loadApplicationData(applicationId);
            } else {
                this.view.showError('ID pengajuan tidak ditemukan dalam URL.');
            }
            
        } catch (error) {
            console.error('Error initializing FormPenawaranPresenter:', error);
            this.view.showError('Terjadi kesalahan saat memuat halaman.');
        }
    }

    getApplicationIdFromUrl() {
        const hash = window.location.hash;
        // Expected format: #/penawaran/:id or #/penawaran?id=123
        const match = hash.match(/\/penawaran\/(\d+)/) || hash.match(/[?&]id=(\d+)/);
        return match ? match[1] : null;
    }

    setupEventListeners() {
        // Bind methods to preserve 'this' context
        this.boundLoadApplicationData = this.loadApplicationData.bind(this);
        this.boundSubmitPenawaran = this.submitPenawaran.bind(this);
        this.boundLoadUserInfo = this.loadUserInfo.bind(this);

        // Listen for application data load request
        document.addEventListener('load-application-data', (e) => {
            this.handleLoadApplicationData(e.detail);
        });

        // Listen for form submission
        document.addEventListener('submit-penawaran', (e) => {
            this.handleSubmitPenawaran(e.detail);
        });

        // Listen for user info request
        document.addEventListener('request-user-info', () => {
            this.loadUserInfo();
        });

        // Listen for address options request
        document.addEventListener('load-address-options', () => {
            this.loadAddressOptions();
        });
    }

    async handleLoadApplicationData(detail) {
        const applicationId = detail?.applicationId || detail?.id;
        if (!applicationId) {
            this.view.showError('ID pengajuan tidak valid.');
            return;
        }

        await this.loadApplicationData(applicationId);
    }

    async loadApplicationData(applicationId) {
        try {
            console.log('Loading application data for ID:', applicationId);
            
            // Show loading state
            this.view.showLoading();
            
            // Call model to get application data
            const applicationData = await this.model.getApplicationById(applicationId);
            
            if (!applicationData) {
                throw new Error('Data pengajuan tidak ditemukan.');
            }

            // Check if application can receive offer
            if (!this.canOfferApplication(applicationData)) {
                this.view.showError('Pengajuan ini tidak dapat diberi penawaran. Status sudah berubah.');
                setTimeout(() => {
                    window.location.hash = '#/pengajuan';
                }, 2000);
                return;
            }

            // Store current application ID and display data
            this.currentApplicationId = applicationId;
            this.view.displayApplicationData(applicationData);
            
        } catch (error) {
            console.error('Error loading application data:', error);
            this.view.showError(error.message || 'Terjadi kesalahan saat memuat data pengajuan.');
        }
    }

    canOfferApplication(application) {
        // Check if application status allows offer
        const allowedStatuses = ['pending', 'Menunggu Validasi', 'validated'];
        const currentStatus = application.status || application.statusOriginal;
        
        return allowedStatuses.includes(currentStatus);
    }

    async loadAddressOptions() {
        try {
            console.log('Loading address options...');
            
            // Call model to get address options
            const addressData = await this.model.getAddresses();
            
            if (addressData && addressData.length > 0) {
                this.view.displayAddressOptions(addressData);
            } else {
                console.warn('No address options found');
                this.view.displayAddressOptions([]);
            }
            
        } catch (error) {
            console.error('Error loading address options:', error);
            // Continue with empty address options
            this.view.displayAddressOptions([]);
        }
    }

    async loadUserInfo() {
        try {
            // Try to get user info from model first
            let userInfo = null;
            
            if (typeof this.model.getCurrentUser === 'function') {
                userInfo = await this.model.getCurrentUser();
            } else {
                // Fallback to auth model
                userInfo = getCurrentUser();
            }
            
            if (userInfo) {
                this.user = userInfo;
                this.view.displayUserInfo(userInfo);
            }
        } catch (error) {
            console.error('Error loading user info:', error);
            // Don't show error for user info as it's not critical
        }
    }

    async handleSubmitPenawaran(submissionData) {
        try {
            console.log('Submitting penawaran:', submissionData);

            // Add current application ID if not present
            if (!submissionData.applicationId && this.currentApplicationId) {
                submissionData.applicationId = this.currentApplicationId;
            }

            // Validate submission data
            if (!this.validateSubmissionData(submissionData)) {
                return;
            }

            // Add additional data
            submissionData.offeredBy = this.user?.id || this.user?.username || 'admin';
            submissionData.offeredAt = new Date().toISOString();

            // Call model to submit penawaran
            const result = await this.model.submitOffer(submissionData);
            
            if (result && result.success) {
                this.view.showSuccess('Penawaran berhasil diterima!');
                
                // If notification is enabled, send notification
                if (submissionData.notifyUser !== false) {
                    await this.sendOfferNotification(submissionData);
                }
                
                // Log the offer activity
                await this.logOfferActivity(submissionData);
                
                // Redirect after success
                setTimeout(() => {
                    window.location.hash = '#/pengajuan';
                }, 1500);
                
            } else {
                throw new Error(result?.message || 'Gagal menyimpan penawaran.');
            }
            
        } catch (error) {
            console.error('Error submitting penawaran:', error);
            this.view.showError(error.message || 'Terjadi kesalahan saat memproses penawaran.');
        }
    }

    async submitPenawaran(submissionData) {
        return await this.handleSubmitPenawaran(submissionData);
    }

    validateSubmissionData(data) {
        // Validate required fields based on what view sends
        if (!data.applicationId) {
            this.view.showError('ID pengajuan tidak valid');
            return false;
        }

        if (!data.hargaPerKg || data.hargaPerKg <= 0) {
            this.view.showError('Harga per kg harus diisi dan lebih dari 0');
            return false;
        }

        if (!data.alamatId) {
            this.view.showError('Alamat pickup harus dipilih');
            return false;
        }

        if (!data.berat || data.berat <= 0) {
            this.view.showError('Berat sampah tidak valid');
            return false;
        }

        // Additional validation for totalHarga if needed
        if (data.totalHarga !== undefined && data.totalHarga <= 0) {
            this.view.showError('Total harga tidak valid');
            return false;
        }

        // Validate price range (optional business logic)
        if (data.hargaPerKg > 50000) {
            this.view.showError('Harga per kg terlalu tinggi (maksimal Rp 50.000)');
            return false;
        }

        return true;
    }

    async sendOfferNotification(offerData) {
        try {
            console.log('Sending offer notification...');
            
            const notificationData = {
                applicationId: offerData.applicationId,
                type: 'offer',
                title: 'Penawaran Diterima',
                message: `Anda mendapat penawaran Rp ${offerData.hargaPerKg.toLocaleString()}/kg untuk sampah ${offerData.category || 'Anda'}`,
                category: offerData.category,
                pricePerKg: offerData.hargaPerKg,
                totalPrice: offerData.totalHarga,
                timestamp: new Date().toISOString()
            };

            // Check if model has sendNotification method
            if (typeof this.model.sendNotification === 'function') {
                await this.model.sendNotification(notificationData);
                console.log('Offer notification sent successfully');
            } else {
                console.log('Notification method not available in model');
            }
            
        } catch (error) {
            console.error('Error sending offer notification:', error);
            // Don't show error to user as this is not critical
        }
    }

    async logOfferActivity(offerData) {
        try {
            console.log('Logging offer activity...');
            
            const activityData = {
                type: 'offer_submitted',
                applicationId: offerData.applicationId,
                adminId: await this.getCurrentUserId(),
                details: {
                    pricePerKg: offerData.hargaPerKg,
                    totalPrice: offerData.totalHarga,
                    weight: offerData.berat,
                    category: offerData.category,
                    addressId: offerData.alamatId,
                    notificationSent: offerData.notifyUser !== false
                },
                timestamp: new Date().toISOString()
            };

            // Check if model has logActivity method
            if (typeof this.model.logActivity === 'function') {
                await this.model.logActivity(activityData);
                console.log('Offer activity logged successfully');
            } else {
                console.log('Activity logging method not available in model');
            }
            
        } catch (error) {
            console.error('Error logging offer activity:', error);
            // Don't show error to user as this is not critical
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

    // Utility methods for formatting and validation
    formatPrice(price) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    }

    calculateTotalPrice(weight, pricePerKg) {
        return weight * pricePerKg;
    }

    sanitizeInput(input) {
        return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }

    // Method to get offer statistics (if needed for dashboard)
    async getOfferStats() {
        try {
            if (typeof this.model.getOfferStatistics === 'function') {
                return await this.model.getOfferStatistics();
            }
            return null;
        } catch (error) {
            console.error('Error getting offer stats:', error);
            return null;
        }
    }

    // Method to get offer history for an application
    async getOfferHistory(applicationId) {
        try {
            if (typeof this.model.getApplicationOfferHistory === 'function') {
                return await this.model.getApplicationOfferHistory(applicationId);
            }
            return [];
        } catch (error) {
            console.error('Error getting offer history:', error);
            return [];
        }
    }

    // Method to refresh application data
    async refreshApplicationData() {
        if (this.currentApplicationId) {
            await this.loadApplicationData(this.currentApplicationId);
        }
    }

    // Legacy methods for backward compatibility (fallback to mock data if model doesn't have them)
    async fetchApplicationData(applicationId) {
        try {
            return await this.model.getApplicationById(applicationId);
        } catch (error) {
            console.warn('Model method not available, using mock data');
            // Fallback to mock data
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const mockData = {
                id: applicationId,
                name: 'John Doe',
                phone: '081234567890',
                category: 'Plastik PET',
                weight: 5.5,
                image: 'https://via.placeholder.com/400x300?text=Plastik+PET',
                status: 'Menunggu Validasi',
                createdAt: new Date().toISOString()
            };

            return {
                success: true,
                data: mockData
            };
        }
    }

    async fetchAddressOptions() {
        try {
            const addresses = await this.model.getAddresses();
            return {
                success: true,
                data: addresses
            };
        } catch (error) {
            console.warn('Model method not available, using mock data');
            // Fallback to mock data
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const mockAddresses = [
                {
                    id: '1',
                    name: 'Gudang Utama',
                    address: 'Jl. Industri No. 123, Jakarta Timur'
                },
                {
                    id: '2',
                    name: 'Cabang Bekasi',
                    address: 'Jl. Raya Bekasi No. 456, Bekasi'
                },
                {
                    id: '3',
                    name: 'Cabang Depok',
                    address: 'Jl. Margonda Raya No. 789, Depok'
                }
            ];

            return {
                success: true,
                data: mockAddresses
            };
        }
    }

    async fetchUserInfo() {
        try {
            const userInfo = await this.loadUserInfo();
            return {
                success: true,
                data: userInfo
            };
        } catch (error) {
            console.warn('User info not available, using mock data');
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const mockUser = {
                id: '1',
                name: 'Admin User',
                username: 'admin',
                avatar: null
            };

            return {
                success: true,
                data: mockUser
            };
        }
    }

    async sendPenawaranData(submissionData) {
        try {
            return await this.model.submitOffer(submissionData);
        } catch (error) {
            console.warn('Model method not available, using mock response');
            // Fallback to mock response
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            console.log('Sending penawaran data to API:', submissionData);
            
            return {
                success: true,
                message: 'Penawaran berhasil diterima',
                data: {
                    id: Date.now().toString(),
                    ...submissionData,
                    status: 'accepted',
                    createdAt: new Date().toISOString()
                }
            };
        }
    }

    // Public methods for external usage
    getView() {
        return this.view;
    }

    getCurrentApplicationId() {
        return this.currentApplicationId;
    }

    // Method to handle retry from view
    handleRetry() {
        if (this.currentApplicationId) {
            this.loadApplicationData(this.currentApplicationId);
        }
    }

    // Cleanup method
    destroy() {
        // Remove event listeners with proper binding
        document.removeEventListener('load-application-data', this.boundLoadApplicationData);
        document.removeEventListener('submit-penawaran', this.boundSubmitPenawaran);
        document.removeEventListener('request-user-info', this.boundLoadUserInfo);
        document.removeEventListener('load-address-options', this.loadAddressOptions);
        
        // Destroy view
        if (this.view && typeof this.view.destroy === 'function') {
            this.view.destroy();
        }
    }
}