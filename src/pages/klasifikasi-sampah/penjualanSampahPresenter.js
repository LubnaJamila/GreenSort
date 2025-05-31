//src/pages/klasifikasi-sampah/penjualanSampahPresenter.js
import PenjualanSampahView from "./klasifikasiSampahView.js";
import { getCurrentUser } from "../../models/authModel.js";

export default class PenjualanSampahPresenter {
    constructor() {
        this.view = new PenjualanSampahView();
        // this.model = model;
        // this.init();
    }
    
    init() {
        this.view.render();
        const user = getCurrentUser();
        this.view.displayUserInfo(user);
    }
    
    destroy() {
        this.view.destroy();
    }

    // Submit pengajuan penjualan sampah
    async submitPenjualan(formData) {
        try {
            this.view.showLoading();

            // Validasi data sebelum submit
            const validationResult = this.validatePenjualanData(formData);
            if (!validationResult.isValid) {
                this.view.hideLoading();
                this.view.showError(validationResult.message);
                return;
            }

            // Prepare data untuk dikirim
            const processedData = this.processFormData(formData);

            // Submit ke model/API
            let result;
            if (this.model && typeof this.model.submitPenjualan === 'function') {
                result = await this.model.submitPenjualan(processedData);
            } else {
                // Fallback ke localStorage jika model tidak tersedia
                result = await this.submitToLocalStorage(processedData);
            }

            if (result.success) {
                this.view.hideLoading();
                this.view.showSuccess(result.message);
                
                // Clear form dan navigation
                setTimeout(() => {
                    this.view.resetForm();
                    this.view.navigateToPengajuan();
                }, 1500);

                // Log activity
                this.logPenjualanActivity(processedData);

            } else {
                this.view.hideLoading();
                this.view.showError(result.message || 'Gagal mengirim pengajuan');
            }

        } catch (error) {
            console.error('Error submitting penjualan:', error);
            this.view.hideLoading();
            this.view.showError('Terjadi kesalahan sistem. Silakan coba lagi.');
        }
    }

    // Validasi data penjualan
    validatePenjualanData(data) {
        // Check required fields
        const requiredFields = ['namaLengkap', 'noHp', 'kategoriSampah', 'beratSampah'];
        
        for (let field of requiredFields) {
            if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
                return {
                    isValid: false,
                    message: `${this.getFieldDisplayName(field)} tidak boleh kosong`
                };
            }
        }

        // Validate berat sampah
        if (data.beratSampah <= 0) {
            return {
                isValid: false,
                message: 'Berat sampah harus lebih dari 0 kg'
            };
        }

        if (data.beratSampah > 1000) {
            return {
                isValid: false,
                message: 'Berat sampah tidak boleh lebih dari 1000 kg'
            };
        }

        // Validate phone number
        if (data.noHp.length < 10 || data.noHp.length > 13) {
            return {
                isValid: false,
                message: 'Nomor HP harus 10-13 digit'
            };
        }

        // Validate phone number format (harus angka)
        if (!/^\d+$/.test(data.noHp)) {
            return {
                isValid: false,
                message: 'Nomor HP hanya boleh berisi angka'
            };
        }

        return { isValid: true };
    }

    // Process form data sebelum submit
    processFormData(formData) {
        return {
            id: this.generateId(),
            namaLengkap: formData.namaLengkap.trim(),
            noHp: formData.noHp.trim(),
            kategoriSampah: formData.kategoriSampah.trim(),
            beratSampah: parseFloat(formData.beratSampah),
            gambarSampah: formData.gambarSampah,
            tanggalPengajuan: new Date().toISOString(),
            status: 'Pending',
            estimasiHarga: this.calculateEstimatedPrice(formData.kategoriSampah, formData.beratSampah),
            userId: this.getCurrentUserId(),
            createdAt: Date.now()
        };
    }

    // Generate unique ID
    generateId() {
        return 'PJL_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Get current user ID
    getCurrentUserId() {
        try {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            return userData.id || userData.userId || 'anonymous';
        } catch {
            return 'anonymous';
        }
    }

    // Calculate estimated price based on category and weight
    calculateEstimatedPrice(kategori, berat) {
        const pricePerKg = {
            'Plastik PET': 3000,
            'Plastik HDPE': 2500,
            'Plastik PP': 2000,
            'Kertas': 1500,
            'Kardus': 1800,
            'Kaleng Aluminium': 8000,
            'Kaleng Besi': 1000,
            'Kaca': 500,
            'Botol Kaca': 800
        };

        const defaultPrice = 1000; // Default price per kg
        const unitPrice = pricePerKg[kategori] || defaultPrice;
        
        return Math.round(unitPrice * berat);
    }

    // Submit to localStorage (fallback method)
    async submitToLocalStorage(data) {
        return new Promise((resolve, reject) => {
            try {
                // Get existing data
                let pengajuanList = JSON.parse(localStorage.getItem('pengajuanSampah') || '[]');
                
                // Add new data
                pengajuanList.push(data);
                
                // Save back to localStorage
                localStorage.setItem('pengajuanSampah', JSON.stringify(pengajuanList));
                
                // Also save to user's submissions
                this.saveToUserSubmissions(data);
                
                resolve({
                    success: true,
                    message: 'Pengajuan penjualan sampah berhasil dikirim!',
                    data: data
                });
                
            } catch (error) {
                reject({
                    success: false,
                    message: 'Gagal menyimpan data pengajuan',
                    error: error
                });
            }
        });
    }

    // Save to user's personal submissions
    saveToUserSubmissions(data) {
        try {
            const userId = this.getCurrentUserId();
            const userSubmissionsKey = `userSubmissions_${userId}`;
            
            let userSubmissions = JSON.parse(localStorage.getItem(userSubmissionsKey) || '[]');
            userSubmissions.push(data);
            
            localStorage.setItem(userSubmissionsKey, JSON.stringify(userSubmissions));
            
            // Update user stats
            this.updateUserStats(data);
            
        } catch (error) {
            console.error('Error saving to user submissions:', error);
        }
    }

    // Update user statistics
    updateUserStats(data) {
        try {
            const userId = this.getCurrentUserId();
            const userStatsKey = `userStats_${userId}`;
            
            let userStats = JSON.parse(localStorage.getItem(userStatsKey) || '{}');
            
            // Initialize stats if not exists
            if (!userStats.totalSubmissions) userStats.totalSubmissions = 0;
            if (!userStats.totalWeight) userStats.totalWeight = 0;
            if (!userStats.totalEstimatedValue) userStats.totalEstimatedValue = 0;
            if (!userStats.categoryCounts) userStats.categoryCounts = {};
            
            // Update stats
            userStats.totalSubmissions += 1;
            userStats.totalWeight += data.beratSampah;
            userStats.totalEstimatedValue += data.estimasiHarga;
            userStats.lastSubmission = data.tanggalPengajuan;
            
            // Update category count
            if (!userStats.categoryCounts[data.kategoriSampah]) {
                userStats.categoryCounts[data.kategoriSampah] = 0;
            }
            userStats.categoryCounts[data.kategoriSampah] += 1;
            
            localStorage.setItem(userStatsKey, JSON.stringify(userStats));
            
        } catch (error) {
            console.error('Error updating user stats:', error);
        }
    }

    // Log activity for audit trail
    logPenjualanActivity(data) {
        try {
            const activityLog = {
                type: 'PENJUALAN_SUBMISSION',
                userId: this.getCurrentUserId(),
                submissionId: data.id,
                timestamp: new Date().toISOString(),
                details: {
                    kategori: data.kategoriSampah,
                    berat: data.beratSampah,
                    estimasiHarga: data.estimasiHarga
                }
            };

            let logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
            logs.push(activityLog);
            
            // Keep only last 100 logs
            if (logs.length > 100) {
                logs = logs.slice(-100);
            }
            
            localStorage.setItem('activityLogs', JSON.stringify(logs));
            
        } catch (error) {
            console.error('Error logging activity:', error);
        }
    }

    // Get field display name for validation messages
    getFieldDisplayName(fieldName) {
        const displayNames = {
            'namaLengkap': 'Nama Lengkap',
            'noHp': 'Nomor HP',
            'kategoriSampah': 'Kategori Sampah',
            'beratSampah': 'Berat Sampah'
        };
        
        return displayNames[fieldName] || fieldName;
    }

    // Get user submission history
    getUserSubmissionHistory() {
        try {
            const userId = this.getCurrentUserId();
            const userSubmissionsKey = `userSubmissions_${userId}`;
            return JSON.parse(localStorage.getItem(userSubmissionsKey) || '[]');
        } catch (error) {
            console.error('Error getting user submission history:', error);
            return [];
        }
    }

    // Get user statistics
    getUserStats() {
        try {
            const userId = this.getCurrentUserId();
            const userStatsKey = `userStats_${userId}`;
            return JSON.parse(localStorage.getItem(userStatsKey) || '{}');
        } catch (error) {
            console.error('Error getting user stats:', error);
            return {};
        }
    }

    // Cancel submission (if needed)
    cancelSubmission() {
        try {
            // Clear any temporary data
            localStorage.removeItem('classificationData');
            
            // Navigate back to classification page
            window.location.href = '../klasifikasi-sampah/klasifikasiSampah.html';
            
        } catch (error) {
            console.error('Error canceling submission:', error);
        }
    }

    // Validate image from classification
    validateClassificationImage() {
        try {
            const classificationData = JSON.parse(localStorage.getItem('classificationData') || '{}');
            
            if (!classificationData.image || !classificationData.category) {
                return {
                    isValid: false,
                    message: 'Data klasifikasi tidak ditemukan. Silakan lakukan klasifikasi ulang.'
                };
            }

            return { isValid: true };
            
        } catch (error) {
            return {
                isValid: false,
                message: 'Error validating classification data'
            };
        }
    }

    // Format currency for display
    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Format date for display
    formatDate(dateString) {
        return new Intl.DateTimeFormat('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateString));
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PenjualanSampahPresenter;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize presenter with view
    if (window.penjualanSampahView) {
        window.penjualanSampahPresenter = new PenjualanSampahPresenter(
            window.penjualanSampahView,
            window.pengajuanModel // Will be null if model not loaded, that's ok
        );
    }
});