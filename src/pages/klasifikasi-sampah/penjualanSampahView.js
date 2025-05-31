//src/pages/klasifikasi-sampah/penjualanSampahView.js
import "../../assets/styles/rekening.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class PenjualanSampahView {
    constructor() {
        this.app = document.getElementById("content");
        this.sidebarView = new SidebarView();
        this.eventListeners = [];
        this.isMobile = window.matchMedia("(max-width: 768px)").matches;
        this.sidebarCollapsed = false;

        this.presenter = null;
        this.formElement = null;
        this.submitButton = null;
        this.classifiedImage = null;
        this.classificationResult = null;
        this.init();
    }

    init() {
        this.bindElements();
        this.bindEvents();
        this.loadClassificationData();
        this.autoFillUserData();
    }

    render() {
        this.sidebarView.render();
    
        this.app.innerHTML = `
                <!-- Mobile Menu Toggle -->
                <button id="mobile-menu-toggle" class="mobile-menu-btn">
                    <i class="bi bi-list"></i>
                </button>
                <div class="sidebar-overlay"></div>
    
                <!-- Main Content -->
                <div class="main-content ${this.isMobile ? "full-width" : ""} ${
            this.sidebarCollapsed ? "collapsed" : ""
            }">
                <header>
                    <div class="header-content">
                        <div class="dashboard-header">
                            <h2>Form Pengajuan Penjualan Sampah</h2>
                            <p class="text-dark mb-4">Ringkasan status pengajuan Anda secara real-time.</p>
                        </div>
                        <div class="user-profile">
                            <img id="user-avatar" src="${userPlaceholder}" alt="User">
                            <span id="user-name">Loading...</span>
                        </div>
                    </div>
                </header>

                <!-- Upload Section -->
                <div class="rekening-section">
                    <div class="content-header">
                        <h3>Data Penjualan Sampah</h3>
                    </div>
                    
                    <div class="content-body">
                        <form id="penjualan-form">
                            <!-- Row untuk gambar sampah yang telah diklasifikasi -->
                            <div class="form-group">
                                <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
                                    <div id="classified-image-container">
                                        <img id="classified-image" src="../assets/images/sample-waste.jpg" alt="Sampah Terklasifikasi" 
                                            style="width: 100px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid #ddd;">
                                    </div>
                                    <div>
                                        <h4 style="margin: 0 0 5px 0; color: var(--text-dark);">Hasil Klasifikasi:</h4>
                                        <p id="classification-result" style="margin: 0; font-weight: 600; color: var(--primary-color);">Plastik PET</p>
                                        <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: var(--text-light);">Dapat didaur ulang</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Form Row 1 -->
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="nama-lengkap" class="form-label">Nama Lengkap</label>
                                    <input type="text" id="nama-lengkap" name="nama-lengkap" class="form-control" 
                                        placeholder="Masukkan nama lengkap Anda" required>
                                </div>
                                <div class="form-group">
                                    <label for="no-hp" class="form-label">No HP</label>
                                    <input type="tel" id="no-hp" name="no-hp" class="form-control" 
                                        placeholder="Masukkan nomor HP Anda" required>
                                </div>
                            </div>

                            <!-- Form Row 2 -->
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="kategori-sampah" class="form-label">Kategori Sampah</label>
                                    <input type="text" id="kategori-sampah" name="kategori-sampah" class="form-control" 
                                        placeholder="Kategori akan terisi otomatis" readonly>
                                </div>
                                <div class="form-group">
                                    <label for="berat-sampah" class="form-label">Berat Sampah (kg)</label>
                                    <input type="number" id="berat-sampah" name="berat-sampah" class="form-control" 
                                        placeholder="Masukkan berat sampah dalam kg" step="0.1" min="0.1" required>
                                </div>
                            </div>

                            <!-- Submit Button -->
                            <div style="display: flex; justify-content: flex-end; margin-top: 30px; gap: 15px;">
                                <a href="#" class="btn btn-outline" onclick="history.back()">
                                    Kembali
                                </a>
                                <a href="#" class="btn btn-primary classify-btn" id="submit-btn" onclick="submitPenjualan(event)">
                                    Ajukan Sampah
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    bindElements() {
        this.formElement = document.getElementById('penjualan-form');
        this.submitButton = document.getElementById('submit-btn');
        this.classifiedImage = document.getElementById('classified-image');
        this.classificationResult = document.getElementById('classification-result');
        
        // Form inputs
        this.namaLengkapInput = document.getElementById('nama-lengkap');
        this.noHpInput = document.getElementById('no-hp');
        this.kategoriSampahInput = document.getElementById('kategori-sampah');
        this.beratSampahInput = document.getElementById('berat-sampah');
    }

    bindEvents() {
        // Submit form event
        if (this.submitButton) {
            this.submitButton.addEventListener('click', (e) => this.handleSubmit(e));
        }

        // Input validation events
        if (this.beratSampahInput) {
            this.beratSampahInput.addEventListener('input', (e) => this.validateBeratSampah(e));
        }

        if (this.noHpInput) {
            this.noHpInput.addEventListener('input', (e) => this.formatNoHp(e));
        }

        // Form validation
        if (this.formElement) {
            this.formElement.addEventListener('input', () => this.validateForm());
        }
    }

    setPresenter(presenter) {
        this.presenter = presenter;
    }

    // Load classification data from previous step
    loadClassificationData() {
        try {
            const classificationData = JSON.parse(localStorage.getItem('classificationData') || '{}');
            
            if (classificationData.image && this.classifiedImage) {
                this.classifiedImage.src = classificationData.image;
            }
            
            if (classificationData.category) {
                if (this.classificationResult) {
                    this.classificationResult.textContent = classificationData.category;
                }
                if (this.kategoriSampahInput) {
                    this.kategoriSampahInput.value = classificationData.category;
                }
            }

            // Set confidence if available
            if (classificationData.confidence && this.classificationResult) {
                const confidence = Math.round(classificationData.confidence * 100);
                this.classificationResult.textContent += ` (${confidence}% confidence)`;
            }
        } catch (error) {
            console.error('Error loading classification data:', error);
            this.showError('Gagal memuat data klasifikasi');
        }
    }

    // Auto-fill user data if available
    autoFillUserData() {
        try {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            
            if (userData.name && this.namaLengkapInput) {
                this.namaLengkapInput.value = userData.name;
            }
            
            if (userData.phone && this.noHpInput) {
                this.noHpInput.value = userData.phone;
            }

            // Update user profile display
            const userNameElement = document.getElementById('user-name');
            if (userData.displayName && userNameElement) {
                userNameElement.textContent = userData.displayName;
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    // Handle form submission
    handleSubmit(event) {
        event.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        const formData = this.getFormData();
        
        if (this.presenter) {
            this.presenter.submitPenjualan(formData);
        } else {
            // Fallback if presenter not available
            this.submitPenjualanDirect(formData);
        }
    }

    // Get form data
    getFormData() {
        return {
            namaLengkap: this.namaLengkapInput?.value || '',
            noHp: this.noHpInput?.value || '',
            kategoriSampah: this.kategoriSampahInput?.value || '',
            beratSampah: parseFloat(this.beratSampahInput?.value || 0),
            gambarSampah: this.classifiedImage?.src || '',
            tanggalPengajuan: new Date().toISOString(),
            status: 'Pending',
            id: Date.now().toString() // Simple ID generation
        };
    }

    // Validate entire form
    validateForm() {
        const requiredFields = [
            this.namaLengkapInput,
            this.noHpInput, 
            this.kategoriSampahInput,
            this.beratSampahInput
        ];

        let isValid = true;

        requiredFields.forEach(field => {
            if (!field || !field.value.trim()) {
                isValid = false;
                this.showFieldError(field, 'Field ini wajib diisi');
            } else {
                this.clearFieldError(field);
            }
        });

        // Validate berat sampah
        if (this.beratSampahInput?.value && parseFloat(this.beratSampahInput.value) <= 0) {
            isValid = false;
            this.showFieldError(this.beratSampahInput, 'Berat sampah harus lebih dari 0');
        }

        // Validate phone number
        if (this.noHpInput?.value && this.noHpInput.value.length < 10) {
            isValid = false;
            this.showFieldError(this.noHpInput, 'Nomor HP minimal 10 digit');
        }

        return isValid;
    }

    // Validate berat sampah input
    validateBeratSampah(event) {
        let value = parseFloat(event.target.value);
        if (value < 0) {
            event.target.value = '';
        }
        if (value > 1000) { // Max 1000kg
            event.target.value = '1000';
        }
    }

    // Format nomor HP
    formatNoHp(event) {
        let value = event.target.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length > 13) {
            value = value.substring(0, 13);
        }
        event.target.value = value;
    }

    // Show field error
    showFieldError(field, message) {
        if (!field) return;
        
        field.style.borderColor = '#dc3545';
        
        // Remove existing error message
        this.clearFieldError(field);
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    // Clear field error
    clearFieldError(field) {
        if (!field) return;
        
        field.style.borderColor = '#ddd';
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // Show loading state
    showLoading() {
        if (this.submitButton) {
            this.submitButton.textContent = 'Mengirim...';
            this.submitButton.style.pointerEvents = 'none';
            this.submitButton.style.opacity = '0.7';
        }
    }

    // Hide loading state
    hideLoading() {
        if (this.submitButton) {
            this.submitButton.textContent = 'Ajukan Sampah';
            this.submitButton.style.pointerEvents = 'auto';
            this.submitButton.style.opacity = '1';
        }
    }

    // Show success message
    showSuccess(message) {
        alert(message || 'Pengajuan penjualan sampah berhasil dikirim!');
    }

    // Show error message
    showError(message) {
        alert('Error: ' + (message || 'Terjadi kesalahan saat mengirim pengajuan'));
    }

    // Reset form
    resetForm() {
        if (this.formElement) {
            this.formElement.reset();
        }
        
        // Clear classification data
        localStorage.removeItem('classificationData');
    }

    // Navigate to pengajuan page
    navigateToPengajuan() {
        window.location.href = '../dashboard-admin/pengajuanView.html';
    }

    // Direct submission without presenter (fallback)
    submitPenjualanDirect(formData) {
        this.showLoading();

        try {
            // Save to localStorage temporarily
            let pengajuanList = JSON.parse(localStorage.getItem('pengajuanSampah') || '[]');
            pengajuanList.push(formData);
            localStorage.setItem('pengajuanSampah', JSON.stringify(pengajuanList));

            // Simulate API delay
            setTimeout(() => {
                this.hideLoading();
                this.showSuccess();
                this.resetForm();
                this.navigateToPengajuan();
            }, 1500);

        } catch (error) {
            this.hideLoading();
            this.showError('Gagal menyimpan data pengajuan');
            console.error('Error saving pengajuan:', error);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PenjualanSampahView;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.penjualanSampahView = new PenjualanSampahView();
});