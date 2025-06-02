// src/pages/dashboard-user/formSelesaiPresenter.js
import FormSelesaiView from './formSelesaiView.js';
// import ApiService from '../../utils/apiService.js';
// import { showAlert } from '../../utils/alert.js';

export default class FormSelesaiPresenter {
    constructor() {
        this.view = new FormSelesaiView();
        // this.apiService = new ApiService();
        this.applicationId = null;
        this.applicationData = null;
        this.eventListeners = [];
    }
    
    async init(applicationId = null) {
        this.applicationId = applicationId;
        
        try {
            // Setup event listeners first
            this.setupEventListeners();
            
            // Load application data if ID is provided
            if (applicationId) {
                await this.loadApplicationData();
            } else {
                // Use mock data if no ID provided
                this.applicationData = this.getMockData();
            }
            
            // Render view with data
            this.view.render(this.applicationData);
            
            // Populate view with data
            this.view.populateApplicationData(this.applicationData);
            
            // Load user info
            await this.loadUserInfo();
            
        } catch (error) {
            console.error('Error initializing FormSelesaiPresenter:', error);
            
            // Still render view even if data loading fails
            this.view.render();
            this.view.showError('Terjadi kesalahan saat memuat data. Silakan coba lagi.');
        }
    }
    
    getMockData() {
        // Mock data for testing when API is not available
        return {
            id: 'mock-001',
            namaLengkap: 'John Doe',
            noHp: '081234567890',
            kategoriSampah: 'Plastik',
            jenisSampah: 'Plastik',
            beratSampah: 5,
            kuantitas: 5,
            hargaSampah: 15000,
            metodePengiriman: 'dijemput',
            alamatPengiriman: 'Jl. Sudirman No. 123, Jakarta',
            jarakPengiriman: 2.5,
            ongkosKirim: 5000,
            status: 'proses',
            gambarSampah: 'https://via.placeholder.com/300x200?text=Sampah+Plastik'
        };
    }
    
    setupEventListeners() {
        this.removeEventListeners();
        
        // Form submit event
        const formSubmitHandler = (e) => this.handleFormSubmit(e.detail);
        document.addEventListener('form-submit', formSubmitHandler);
        this.eventListeners.push({
            element: document,
            type: 'form-submit',
            handler: formSubmitHandler
        });
    }
    
    async loadUserInfo() {
        try {
            // Mock user data when API is not available
            const mockUser = {
                name: 'John Doe',
                username: 'johndoe',
                avatar: null
            };
            
            // Uncomment when API is available
            // const user = await this.apiService.getCurrentUser();
            this.view.displayUserInfo(mockUser);
        } catch (error) {
            console.error('Error loading user info:', error);
            // Don't show error for user info, it's not critical
        }
    }
    
    async loadApplicationData() {
        if (!this.applicationId) {
            console.warn('No application ID provided, using mock data');
            this.applicationData = this.getMockData();
            return;
        }
        
        try {
            // Simulate API call with mock data
            console.log(`Loading application data for ID: ${this.applicationId}`);
            
            // Mock API response
            const mockResponse = {
                success: true,
                data: {
                    id: this.applicationId,
                    namaLengkap: 'Jane Smith',
                    noHp: '081987654321',
                    kategoriSampah: 'Kertas',
                    jenisSampah: 'Kertas',
                    beratSampah: 3,
                    kuantitas: 3,
                    hargaSampah: 9000,
                    metodePengiriman: 'mengantar',
                    alamatPengiriman: 'Jl. Gatot Subroto No. 456, Jakarta',
                    jarakPengiriman: 1.2,
                    ongkosKirim: 0,
                    status: 'diterima',
                    gambarSampah: 'https://via.placeholder.com/300x200?text=Sampah+Kertas'
                }
            };
            
            // Uncomment when API is available
            // const response = await this.apiService.get(`/applications/${this.applicationId}`);
            
            if (mockResponse.success) {
                this.applicationData = mockResponse.data;
            } else {
                throw new Error(mockResponse.message || 'Gagal memuat data aplikasi');
            }
            
        } catch (error) {
            console.error('Error loading application data:', error);
            // Use fallback mock data
            this.applicationData = this.getMockData();
            this.view.showError('Gagal memuat data aplikasi. Menggunakan data contoh.');
        }
    }
    
    async handleFormSubmit(data) {
        const { formData, applicationId, catatan } = data;
        
        console.log('Form submitted:', { applicationId, catatan });
        console.log('Form data:', formData);
        
        if (!applicationId && !this.applicationId) {
            this.view.showError('ID aplikasi tidak valid.');
            return;
        }
        
        // Validate required data
        const buktiTransaksiFile = formData.get('bukti_transaksi');
        if (!buktiTransaksiFile || buktiTransaksiFile.size === 0) {
            this.view.showError('Silakan upload bukti transaksi terlebih dahulu.');
            return;
        }
        
        // Validate file
        const validation = this.validateFileUpload(buktiTransaksiFile);
        if (!validation.valid) {
            this.view.showError(validation.message);
            return;
        }
        
        this.view.showLoading(true);
        
        try {
            // Simulate file upload
            console.log('Uploading bukti transaksi...');
            await this.simulateDelay(2000); // Simulate upload time
            
            // Mock upload response
            const mockUploadResponse = {
                success: true,
                data: {
                    file_url: 'https://example.com/uploads/bukti-transaksi-' + Date.now() + '.jpg'
                }
            };
            
            // Uncomment when API is available
            // const uploadResponse = await this.apiService.uploadFile('/upload/bukti-transaksi', formData);
            
            if (!mockUploadResponse.success) {
                throw new Error(mockUploadResponse.message || 'Gagal mengupload bukti transaksi');
            }
            
            console.log('File uploaded successfully:', mockUploadResponse.data.file_url);
            
            // Update application status
            const updateData = {
                status: 'selesai',
                bukti_transaksi: mockUploadResponse.data.file_url,
                catatan_selesai: catatan || null,
                tanggal_selesai: new Date().toISOString()
            };
            
            console.log('Updating application status...');
            await this.simulateDelay(1000); // Simulate API call time
            
            // Mock completion response
            const mockCompleteResponse = {
                success: true,
                message: 'Transaksi berhasil diselesaikan'
            };
            
            // Uncomment when API is available
            // const completeResponse = await this.apiService.put(`/applications/${applicationId || this.applicationId}/complete`, updateData);
            
            if (mockCompleteResponse.success) {
                console.log('Transaction completed successfully');
                
                // Log activity
                this.logActivity('transaction_completed', {
                    bukti_transaksi: mockUploadResponse.data.file_url,
                    catatan: catatan || null
                });
                
                this.view.showSuccess('Transaksi berhasil diselesaikan! Anda akan diarahkan ke halaman selesai.');
                
                // Send notification if available
                this.sendCompletionNotification(applicationId || this.applicationId);
                
            } else {
                throw new Error(mockCompleteResponse.message || 'Gagal menyelesaikan transaksi');
            }
            
        } catch (error) {
            console.error('Error completing transaction:', error);
            this.handleError(error, 'Terjadi kesalahan saat menyelesaikan transaksi.');
        } finally {
            this.view.showLoading(false);
        }
    }
    
    async simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async sendCompletionNotification(applicationId) {
        try {
            console.log('Sending completion notification for application:', applicationId);
            
            // Mock notification
            const notificationData = {
                application_id: applicationId,
                message: 'Transaksi telah diselesaikan oleh user',
                type: 'transaction_completed'
            };
            
            // Uncomment when API is available
            // await this.apiService.post('/notifications/transaction-completed', notificationData);
            
            console.log('Notification sent successfully');
        } catch (error) {
            console.error('Error sending completion notification:', error);
            // Don't show error to user, notification failure shouldn't block the process
        }
    }
    
    async refreshApplicationData() {
        if (this.applicationId) {
            await this.loadApplicationData();
            if (this.applicationData) {
                this.view.populateApplicationData(this.applicationData);
            }
        }
    }
    
    getApplicationData() {
        return this.applicationData;
    }
    
    validateFileUpload(file) {
        const maxSize = 5 * 1024 * 1024; // 5MB
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
        
        // For pickup service, subtract shipping cost from waste price
        // For self-delivery, no shipping cost
        return Math.max(0, harga - ongkir);
    }
    
    getStatusText(status) {
        const statusMap = {
            'pending': 'Menunggu Konfirmasi',
            'confirmed': 'Dikonfirmasi',
            'in_process': 'Sedang Diproses',
            'ready_pickup': 'Siap Dijemput',
            'picked_up': 'Sudah Dijemput',
            'delivered': 'Sudah Diantar',
            'payment_pending': 'Menunggu Pembayaran',
            'completed': 'Selesai',
            'cancelled': 'Dibatalkan',
            'proses': 'Sedang Diproses',
            'diterima': 'Diterima',
            'selesai': 'Selesai'
        };
        
        return statusMap[status] || status || 'Tidak Diketahui';
    }
    
    getDeliveryMethodText(method) {
        const methodMap = {
            'mengantar': 'Mengantar Sendiri',
            'dijemput': 'Dijemput',
            'pickup': 'Dijemput',
            'self_delivery': 'Mengantar Sendiri'
        };
        
        return methodMap[method] || method || 'Tidak Diketahui';
    }
    
    async handleError(error, defaultMessage = 'Terjadi kesalahan yang tidak terduga.') {
        console.error('FormSelesaiPresenter Error:', error);
        
        let message = defaultMessage;
        
        if (error.response) {
            // API error response
            if (error.response.data && error.response.data.message) {
                message = error.response.data.message;
            } else if (error.response.status === 401) {
                message = 'Sesi Anda telah berakhir. Silakan login kembali.';
                // Redirect to login
                setTimeout(() => {
                    window.location.href = '#/login';
                }, 2000);
            } else if (error.response.status === 403) {
                message = 'Anda tidak memiliki akses untuk melakukan aksi ini.';
            } else if (error.response.status === 404) {
                message = 'Data tidak ditemukan.';
            } else if (error.response.status >= 500) {
                message = 'Terjadi kesalahan server. Silakan coba lagi nanti.';
            }
        } else if (error.message) {
            message = error.message;
        }
        
        this.view.showError(message);
        return message;
    }
    
    async retryOperation(operation, maxRetries = 3, delay = 1000) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await operation();
            } catch (error) {
                console.error(`Operation failed, attempt ${i + 1}/${maxRetries}:`, error);
                
                if (i === maxRetries - 1) {
                    throw error;
                }
                
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
            }
        }
    }
    
    validateApplicationData(data) {
        if (!data) {
            throw new Error('Data aplikasi tidak tersedia.');
        }
        
        const requiredFields = ['id', 'namaLengkap', 'kategoriSampah', 'beratSampah'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Data tidak lengkap: ${missingFields.join(', ')}`);
        }
        
        return true;
    }
    
    logActivity(action, data = {}) {
        const logData = {
            timestamp: new Date().toISOString(),
            action: action,
            application_id: this.applicationId,
            user_action: true,
            ...data
        };
        
        console.log('Activity logged:', logData);
        
        // Send to logging service if available
        // this.apiService.post('/logs/user-activity', logData).catch(error => {
        //     console.error('Failed to log activity:', error);
        // });
    }
    
    removeEventListeners() {
        this.eventListeners.forEach(({ element, type, handler }) => {
            element.removeEventListener(type, handler);
        });
        this.eventListeners = [];
    }
    
    destroy() {
        // Log destroy action
        this.logActivity('form_selesai_destroyed');
        
        // Remove event listeners
        this.removeEventListeners();
        
        // Destroy view
        if (this.view) {
            this.view.destroy();
        }
        
        // Clear references
        this.applicationData = null;
        this.applicationId = null;
        this.view = null;
        // this.apiService = null;
    }
}