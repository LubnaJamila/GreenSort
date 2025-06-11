// src/pages/dashboard-user/formSelesaiView.js
import "../../assets/styles/sidebar.css";
import "../../assets/styles/rekening.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class FormSelesaiView {
    constructor() {
        this.app = document.getElementById("content");
        this.sidebar = new SidebarView();
        this.eventListeners = [];
        this.isMobile = window.matchMedia("(max-width: 768px)").matches;
        this.sidebarCollapsed = false;
        this.applicationData = null;
        this.uploadedFile = null;
    }
    
    render(applicationData = null) {
        this.applicationData = applicationData;
        this.sidebar.render();
        this.renderMainContent();
        this.setupEventListeners();
        this.checkMobileView();
    }
    
    renderMainContent() {
        this.app.innerHTML = `
            <button id="mobile-menu-toggle" class="mobile-menu-btn">
                <i class="bi bi-list"></i>
            </button>
            <div class="sidebar-overlay"></div>
            
            <div class="main-content ${this.isMobile ? "full-width" : ""} ${
                this.sidebarCollapsed ? "collapsed" : ""}">
                <header>
                    <div class="header-content">
                        <div class="dashboard-header">
                            <div class="d-flex align-items-center mb-3">    
                                <div>
                                    <h2>Form Selesaikan Transaksi</h2>
                                    <p class="text-dark mb-0">Upload bukti transaksi untuk menyelesaikan proses</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="user-profile">
                            <img id="user-avatar" src="${userPlaceholder}" alt="User">
                            <span id="user-name">Loading...</span>
                        </div>
                    </div>
                </header>
        
                <div class="rekening-section">
                    <div class="section-header">
                        <h2 class="section-title">Detail Transaksi</h2>
                    </div>

                    <div class="row">
                        <!-- Detail Sampah Card -->
                        <div class="col-md-6 mb-4">
                            <div class="card border-0 shadow-sm">
                                <div class="card-header bg-primary text-white">
                                    <h5 class="mb-0"><i class="bi bi-recycle me-2"></i>Detail Sampah</h5>
                                </div>
                                <div class="card-body">
                                    <div class="text-center mb-3">
                                        <img id="sampah-image" src="" alt="Gambar Sampah" 
                                             class="img-fluid rounded shadow-sm" 
                                             style="max-height: 200px; object-fit: cover;">
                                    </div>
                                    
                                    <div class="detail-info">
                                        <div class="row mb-2">
                                            <div class="col-5"><strong>Nama Lengkap:</strong></div>
                                            <div class="col-7" id="nama-lengkap">-</div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-5"><strong>No. HP:</strong></div>
                                            <div class="col-7" id="no-hp">-</div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-5"><strong>Kategori Sampah:</strong></div>
                                            <div class="col-7" id="kategori-sampah">-</div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-5"><strong>Berat Sampah:</strong></div>
                                            <div class="col-7" id="berat-sampah">-</div>
                                        </div>
                                        <div class="row mb-0">
                                            <div class="col-5"><strong>Harga Sampah:</strong></div>
                                            <div class="col-7" id="harga-sampah">-</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Detail Pengiriman Card -->
                        <div class="col-md-6 mb-4">
                            <div class="card border-0 shadow-sm">
                                <div class="card-header bg-success text-white">
                                    <h5 class="mb-0"><i class="bi bi-truck me-2"></i>Detail Pengiriman</h5>
                                </div>
                                <div class="card-body">
                                    <div class="detail-info">
                                        <div class="row mb-2">
                                            <div class="col-5"><strong>Metode:</strong></div>
                                            <div class="col-7" id="metode-pengiriman">-</div>
                                        </div>
                                        <div class="row mb-0">
                                            <div class="col-5"><strong>Total Bayar:</strong></div>
                                            <div class="col-7">
                                                <strong class="text-success" id="total-bayar">-</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Upload Bukti Transaksi Card -->
                    <div class="row">
                        <div class="col-12">
                            <div class="card border-0 shadow-sm">
                                <div class="card-header bg-info text-white">
                                    <h5 class="mb-0"><i class="bi bi-cloud-upload me-2"></i>Upload Bukti Transaksi</h5>
                                </div>
                                <div class="card-body">
                                    <form id="selesai-form">
                                        <div class="mb-4">
                                            <label for="bukti-transaksi" class="form-label">
                                                <strong>Bukti Transaksi/Pembayaran</strong>
                                            </label>
                                            <div class="upload-area" id="upload-area">
                                                <div class="upload-placeholder">
                                                    <i class="bi bi-cloud-upload display-4 text-muted mb-3"></i>
                                                    <p class="text-muted mb-2">Klik untuk upload atau drag & drop file di sini</p>
                                                    <p class="text-muted small">Format: JPG, PNG, PDF (Max 5MB)</p>
                                                </div>
                                                <input type="file" id="bukti-transaksi" name="bukti_transaksi" 
                                                       accept="image/jpeg,image/jpg,image/png,application/pdf" 
                                                       style="display: none;">
                                            </div>
                                            
                                            <!-- Preview Area -->
                                            <div id="preview-area" class="mt-3" style="display: none;">
                                                <div class="alert alert-success">
                                                    <div class="d-flex align-items-center">
                                                        <i class="bi bi-check-circle me-2"></i>
                                                        <div class="flex-grow-1">
                                                            <strong>File berhasil dipilih:</strong>
                                                            <br>
                                                            <span id="file-name" class="text-muted"></span>
                                                        </div>
                                                        <button type="button" class="btn btn-sm btn-outline-danger" id="remove-file">
                                                            <i class="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                <!-- Image Preview -->
                                                <div id="image-preview" class="text-center mt-3" style="display: none;">
                                                    <img id="preview-image" src="" alt="Preview" 
                                                         class="img-fluid rounded shadow-sm" 
                                                         style="max-height: 300px; object-fit: contain;">
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- Action Buttons -->
                                        <div class="d-flex justify-content-between align-items-center">
                                            <button type="button" id="cancel-btn" class="btn btn-secondary">
                                                <i class="bi bi-arrow-left me-2"></i>Kembali
                                            </button>
                                            <button type="submit" id="submit-btn" class="btn btn-success btn-lg">
                                                <i class="bi bi-check-circle me-2"></i>Kirim Bukti Transfer
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.setupUploadArea();
    }
    
    setupUploadArea() {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('bukti-transaksi');
        
        // Style the upload area
        uploadArea.style.cssText = `
            border: 2px dashed #dee2e6;
            border-radius: 8px;
            padding: 40px 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background-color: #f8f9fa;
        `;
        
        // Hover effects
        uploadArea.addEventListener('mouseenter', () => {
            uploadArea.style.borderColor = '#007bff';
            uploadArea.style.backgroundColor = '#e3f2fd';
        });
        
        uploadArea.addEventListener('mouseleave', () => {
            uploadArea.style.borderColor = '#dee2e6';
            uploadArea.style.backgroundColor = '#f8f9fa';
        });
        
        // Click to open file picker
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Drag and drop events
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#007bff';
            uploadArea.style.backgroundColor = '#e3f2fd';
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#dee2e6';
            uploadArea.style.backgroundColor = '#f8f9fa';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#dee2e6';
            uploadArea.style.backgroundColor = '#f8f9fa';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelect(files[0]);
            }
        });
    }
    
    populateApplicationData(data) {
        console.log("🖼 Menampilkan data ke UI:", data);

        if (!data) return;
        
        this.applicationData = data;
        
        // Format currency
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
            }).format(amount);
        };
        
        // Populate sampah image
        const sampahImage = document.getElementById('sampah-image');
        if (sampahImage && data.gambarSampah) {
            sampahImage.src =
              "https://greenshort-production.up.railway.app" + data.gambarSampah;
        }

        
        // Populate detail sampah
        document.getElementById('nama-lengkap').textContent = data.namaLengkap || '-';
        document.getElementById('no-hp').textContent = data.noHp || '-';
        document.getElementById('kategori-sampah').textContent = data.kategoriSampah || data.jenisSampah || '-';
        document.getElementById('berat-sampah').textContent = `${data.beratSampah || data.kuantitas || '-'} kg`;
        document.getElementById('harga-sampah').textContent = data.hargaSampah ? formatCurrency(data.hargaSampah) : '-';
        
        // ✅ Detail Pengiriman (hanya 2 data)
        document.getElementById('metode-pengiriman').textContent = data.metodePengiriman ?? '-';
        document.getElementById('total-bayar').textContent = data.ongkosKirim ? formatCurrency(data.ongkosKirim) : '-';


        
        // Update status
        const statusElement = document.getElementById('status-pengiriman');
        if (data.status) {
            statusElement.textContent = data.status;
            statusElement.className = `badge ${this.getStatusBadgeClass(data.status)}`;
        }
    }
    
    getStatusBadgeClass(status) {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-warning text-dark';
            case 'proses':
                return 'bg-info text-white';
            case 'selesai':
                return 'bg-success text-white';
            case 'dibatalkan':
                return 'bg-danger text-white';
            default:
                return 'bg-secondary text-white';
        }
    }
    
    handleFileSelect(file) {
        // Validate file
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        
        if (!allowedTypes.includes(file.type)) {
            this.showError('Format file tidak didukung. Silakan pilih file JPG, PNG, atau PDF.');
            return;
        }
        
        if (file.size > maxSize) {
            this.showError('Ukuran file terlalu besar. Maksimal 5MB.');
            return;
        }
        
        this.uploadedFile = file;
        this.showFilePreview(file);
    }
    
    showFilePreview(file) {
        const previewArea = document.getElementById('preview-area');
        const imagePreview = document.getElementById('image-preview');
        const previewImage = document.getElementById('preview-image');
        const fileName = document.getElementById('file-name');
        
        fileName.textContent = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
        previewArea.style.display = 'block';
        
        // Show image preview for image files
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.style.display = 'none';
        }
    }
    
    removeFile() {
        this.uploadedFile = null;
        document.getElementById('preview-area').style.display = 'none';
        document.getElementById('bukti-transaksi').value = '';
    }
    
    setupEventListeners() {
        this.removeEventListeners();
    
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById("mobile-menu-toggle");
        if (mobileMenuBtn) {
            const handler = () => this.toggleSidebar();
            mobileMenuBtn.addEventListener("click", handler);
            this.eventListeners.push({
                element: mobileMenuBtn,
                type: "click",
                handler,
            });
        }
    
        // Sidebar overlay click
        const overlay = document.querySelector(".sidebar-overlay");
        if (overlay) {
            const handler = () => this.toggleSidebar(false);
            overlay.addEventListener("click", handler);
            this.eventListeners.push({ element: overlay, type: "click", handler });
        }
    
        // Window resize
        const resizeHandler = () => this.handleResize();
        window.addEventListener("resize", resizeHandler);
        this.eventListeners.push({
            element: window,
            type: "resize",
            handler: resizeHandler,
        });
        
        // File input change
        const fileInput = document.getElementById('bukti-transaksi');
        if (fileInput) {
            const handler = (e) => {
                if (e.target.files.length > 0) {
                    this.handleFileSelect(e.target.files[0]);
                }
            };
            fileInput.addEventListener('change', handler);
            this.eventListeners.push({ element: fileInput, type: 'change', handler });
        }
        
        // Remove file button
        const removeFileBtn = document.getElementById('remove-file');
        if (removeFileBtn) {
            const handler = () => this.removeFile();
            removeFileBtn.addEventListener('click', handler);
            this.eventListeners.push({ element: removeFileBtn, type: 'click', handler });
        }
        
        // Cancel button
        const cancelBtn = document.getElementById("cancel-btn");
        if (cancelBtn) {
            const handler = () => this.handleCancel();
            cancelBtn.addEventListener("click", handler);
            this.eventListeners.push({ element: cancelBtn, type: "click", handler });
        }
        
        // Form submit
        const form = document.getElementById('selesai-form');
        if (form) {
            const handler = (e) => this.handleFormSubmit(e);
            form.addEventListener('submit', handler);
            this.eventListeners.push({ element: form, type: 'submit', handler });
        }
    }
    
    handleFormSubmit(e) {
        e.preventDefault();
        
        if (!this.uploadedFile) {
            this.showError('Silakan upload bukti transaksi terlebih dahulu.');
            return;
        }
        
        const formData = new FormData(e.target);
        formData.append('application_id', this.applicationData?.id);
        
        // Dispatch event to presenter
        const event = new CustomEvent('form-submit', {
            detail: {
                formData: formData,
                applicationId: this.applicationData?.id,
                catatan: formData.get('catatan')
            }
        });
        document.dispatchEvent(event);
    }
    
    handleCancel() {
        if (this.uploadedFile || document.getElementById('catatan').value.trim()) {
            if (confirm('Apakah Anda yakin ingin kembali? Data yang telah diisi akan hilang.')) {
                this.handleBack();
            }
        } else {
            this.handleBack();
        }
    }
    
    handleBack() {
        // Navigate back to previous page
        window.location.hash = '#/diterima';
    }
    
    showLoading(show = true) {
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) {
            if (show) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Memproses...';
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Selesaikan Transaksi';
            }
        }
    }
    
    showError(message) {
        const alertHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        const cardBody = document.querySelector('.card-body');
        if (cardBody) {
            cardBody.insertAdjacentHTML('afterbegin', alertHtml);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                const alert = cardBody.querySelector('.alert-danger');
                if (alert) {
                    alert.remove();
                }
            }, 5000);
        }
    }
    
    showSuccess(message) {
        const alertHtml = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="bi bi-check-circle me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        const cardBody = document.querySelector('.card-body');
        if (cardBody) {
            cardBody.insertAdjacentHTML('afterbegin', alertHtml);
            
            // Auto redirect after 3 seconds
            setTimeout(() => {
                window.location.href = '#/selesai';
            }, 3000);
        }
    }
    
    displayUserInfo(user) {
        const userNameElement = document.getElementById("user-name");
        const userAvatarElement = document.getElementById("user-avatar");
        
        if (userNameElement && user) {
            userNameElement.textContent = user.name || user.username;
        }
        
        if (userAvatarElement && user && user.avatar) {
            userAvatarElement.src = user.avatar;
        }
    }
    
    toggleSidebar(show = null) {
        const sidebar = document.querySelector(".sidebar");
        const overlay = document.querySelector(".sidebar-overlay");
    
        if (show === null) {
            show = !sidebar.classList.contains("mobile-open");
        }
    
        if (show) {
            sidebar.classList.add("mobile-open");
            overlay.classList.add("active");
            document.body.style.overflow = "hidden";
        } else {
            sidebar.classList.remove("mobile-open");
            overlay.classList.remove("active");
            document.body.style.overflow = "";
        }
    }
    
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.matchMedia("(max-width: 768px)").matches;
    
        if (wasMobile !== this.isMobile) {
            this.checkMobileView();
        }
    }
    
    checkMobileView() {
        const mainContent = document.querySelector(".main-content");
        if (!mainContent) return;
    
        if (this.isMobile) {
            mainContent.classList.add("full-width");
            mainContent.classList.remove("collapsed");
        } else {
            mainContent.classList.remove("full-width");
            if (this.sidebarCollapsed) {
                mainContent.classList.add("collapsed");
            }
        }
    }
    
    removeEventListeners() {
        this.eventListeners.forEach(({ element, type, handler }) => {
            element.removeEventListener(type, handler);
        });
        this.eventListeners = [];
    }
    
    destroy() {
        this.removeEventListeners();
        
        if (this.sidebar) {
            this.sidebar.destroy();
        }
    }
}