// src/pages/dashboard-admin/FormPenawaranView.js
import "../../assets/styles/sidebar.css";
import "../../assets/styles/rekening.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class FormPenawaranView {
    constructor() {
        this.app = document.getElementById("content");
        this.sidebar = new SidebarView();
        this.eventListeners = [];
        this.isMobile = window.matchMedia("(max-width: 768px)").matches;
        this.sidebarCollapsed = false;
        this.applicationData = null;
        this.addressOptions = [];
    }

    render(applicationId = null) {
        this.sidebar.render();
        this.renderMainContent();
        this.setupEventListeners();
        this.checkMobileView();
        
        // Load application data if ID is provided
        if (applicationId) {
        this.loadApplicationData(applicationId);
        }
    }

    renderMainContent() {
        this.app.innerHTML = `
        <button id="mobile-menu-toggle" class="mobile-menu-btn">
            <i class="bi bi-list"></i>
        </button>
        <div class="sidebar-overlay"></div>
        
        <div class="main-content ${this.isMobile ? "full-width" : ""} ${
        this.sidebarCollapsed ? "collapsed" : ""
        }">
            <!-- Header Section -->
            <header>
                <div class="header-section">
                    <div class="dashboard-title">
                    <div class="title-content">
                        <h1>Form Penawaran Harga</h1>
                        <p>Buat penawaran harga untuk pengajuan sampah yang diterima.</p>
                    </div>
                    <div class="user-profile">
                        <img id="user-avatar" src="${userPlaceholder}" alt="User">
                        <span id="user-name">Loading...</span>
                    </div>
                    </div>
                </div>
            </header>
            
            <!-- Form Section -->
            <div class="rekening-section">
                <div class="section-header">
                    <h2 class="section-title">Informasi Penawaran</h2>
                    <button class="btn btn-secondary" id="back-btn">
                        <i class="bi bi-arrow-left"></i> Kembali
                    </button>
                </div>

                <!-- Form Container -->
                <div class="form-container">
                    <form id="penawaran-form" class="penawaran-form">
                        <!-- Image Display -->
                        <div class="form-group image-display">
                            <div class="image-container">
                                <img id="waste-image" src="" alt="Gambar Sampah" class="waste-display-image">
                            </div>
                        </div>

                        <!-- Form Fields -->
                        <div class="form-fields">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="nama-lengkap" class="form-label">Nama Lengkap</label>
                                        <div class="form-control-static" id="nama-lengkap">-</div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="no-hp" class="form-label">No HP</label>
                                        <div class="form-control-static" id="no-hp">-</div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="kategori-sampah" class="form-label">Kategori Sampah</label>
                                        <div class="form-control-static" id="kategori-sampah">-</div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="berat-sampah" class="form-label">Berat Sampah</label>
                                        <div class="form-control-static" id="berat-sampah">- kg</div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="harga-sampah" class="form-label">Harga Sampah <span class="text-danger">*</span></label>
                                        <div class="input-group">
                                            <span class="input-group-text">Rp</span>
                                            <input 
                                            type="number" 
                                            class="form-control" 
                                            id="harga-sampah" 
                                            name="harga-sampah"
                                            placeholder="Masukkan harga per kg"
                                            min="0"
                                            step="100"
                                            required
                                            >
                                            <span class="input-group-text">/ kg</span>
                                        </div>
                                        <div class="form-text">Harga akan dikalikan dengan berat sampah</div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="pilih-alamat" class="form-label">Pilih Alamat (dropdown) <span class="text-danger">*</span></label>
                                        <select class="form-select" id="pilih-alamat" name="pilih-alamat" required>
                                            <option value="">Pilih alamat pickup...</option>
                                            <!-- Options will be populated dynamically -->
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Total Calculation Display -->
                            <div class="total-section">
                                <div class="total-card">
                                    <div class="total-info">
                                        <h5>Perhitungan Total</h5>
                                        <div class="calculation-details">
                                            <div class="calc-row">
                                                <span>Berat Sampah:</span>
                                                <span id="calc-weight">0 kg</span>
                                            </div>
                                            <div class="calc-row">
                                                <span>Harga per kg:</span>
                                                <span id="calc-price">Rp 0</span>
                                            </div>
                                            <div class="calc-row total-row">
                                                <span><strong>Total Harga:</strong></span>
                                                <span id="calc-total"><strong>Rp 0</strong></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="form-actions">
                                <button type="button" class="btn btn-secondary" id="cancel-btn">
                                    <i class="bi bi-x-circle"></i> Batal
                                </button>
                                <button type="submit" class="btn btn-success" id="submit-btn">
                                    <i class="bi bi-check-circle"></i> Terima Pengajuan
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Loading State -->
                <div class="loading-state" id="loading-state" style="display: none;">
                    <div class="text-center">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-2">Memuat data pengajuan...</p>
                    </div>
                </div>

                <!-- Error State -->
                <div class="error-state" id="error-state" style="display: none;">
                    <div class="text-center">
                        <i class="bi bi-exclamation-triangle-fill text-warning"></i>
                        <h4>Gagal Memuat Data</h4>
                        <p id="error-message">Terjadi kesalahan saat memuat data pengajuan.</p>
                        <button class="btn btn-primary" id="retry-btn">
                            <i class="bi bi-arrow-clockwise"></i> Coba Lagi
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
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

        // Back button
        const backBtn = document.getElementById("back-btn");
        if (backBtn) {
        const handler = () => this.handleBack();
        backBtn.addEventListener("click", handler);
        this.eventListeners.push({ element: backBtn, type: "click", handler });
        }

        // Cancel button
        const cancelBtn = document.getElementById("cancel-btn");
        if (cancelBtn) {
        const handler = () => this.handleCancel();
        cancelBtn.addEventListener("click", handler);
        this.eventListeners.push({ element: cancelBtn, type: "click", handler });
        }

        // Form submission
        const form = document.getElementById("penawaran-form");
        if (form) {
        const handler = (e) => this.handleFormSubmit(e);
        form.addEventListener("submit", handler);
        this.eventListeners.push({ element: form, type: "submit", handler });
        }

        // Price input change for calculation
        const hargaInput = document.getElementById("harga-sampah");
        if (hargaInput) {
        const handler = () => this.updateCalculation();
        hargaInput.addEventListener("input", handler);
        this.eventListeners.push({ element: hargaInput, type: "input", handler });
        }

        // Retry button
        const retryBtn = document.getElementById("retry-btn");
        if (retryBtn) {
        const handler = () => this.handleRetry();
        retryBtn.addEventListener("click", handler);
        this.eventListeners.push({ element: retryBtn, type: "click", handler });
        }
    }

    loadApplicationData(applicationId) {
        this.showLoading();
        
        // Dispatch event to request application data
        const event = new CustomEvent('load-application-data', {
        detail: { applicationId }
        });
        document.dispatchEvent(event);
    }

    displayApplicationData(data) {
        this.applicationData = data;
        this.hideLoading();
        this.populateForm(data);
        this.updateCalculation();
    }

    populateForm(data) {
        // Populate static fields
        const namaLengkap = document.getElementById("nama-lengkap");
        const noHp = document.getElementById("no-hp");
        const kategoriSampah = document.getElementById("kategori-sampah");
        const beratSampah = document.getElementById("berat-sampah");
        const wasteImage = document.getElementById("waste-image");

        if (namaLengkap) namaLengkap.textContent = data.name || 'N/A';
        if (noHp) noHp.textContent = data.phone || 'N/A';
        if (kategoriSampah) kategoriSampah.textContent = data.category || 'N/A';
        if (beratSampah) beratSampah.textContent = `${data.weight || 0} kg`;
        if (wasteImage) {
        wasteImage.src = data.image || 'https://via.placeholder.com/400x300';
        wasteImage.alt = `Gambar ${data.category || 'Sampah'}`;
        }

        // Update calculation display
        const calcWeight = document.getElementById("calc-weight");
        if (calcWeight) calcWeight.textContent = `${data.weight || 0} kg`;
    }

    displayAddressOptions(addresses) {
        this.addressOptions = addresses;
        const selectElement = document.getElementById("pilih-alamat");
        
        if (selectElement && Array.isArray(addresses)) {
        // Clear existing options except the first one
        selectElement.innerHTML = '<option value="">Pilih alamat pickup...</option>';
        
        // Add address options
        addresses.forEach(address => {
            const option = document.createElement('option');
            option.value = address.id;
            option.textContent = `${address.name} - ${address.address}`;
            selectElement.appendChild(option);
        });
        }
    }

    updateCalculation() {
        const hargaInput = document.getElementById("harga-sampah");
        const calcPrice = document.getElementById("calc-price");
        const calcTotal = document.getElementById("calc-total");
        
        if (!hargaInput || !calcPrice || !calcTotal || !this.applicationData) return;
        
        const hargaPerKg = parseFloat(hargaInput.value) || 0;
        const berat = parseFloat(this.applicationData.weight) || 0;
        const total = hargaPerKg * berat;
        
        calcPrice.textContent = `Rp ${hargaPerKg.toLocaleString('id-ID')}`;
        calcTotal.innerHTML = `<strong>Rp ${total.toLocaleString('id-ID')}</strong>`;
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const hargaSampah = formData.get('harga-sampah');
        const pilihAlamat = formData.get('pilih-alamat');
        
        // Validation
        if (!hargaSampah || hargaSampah <= 0) {
        this.showError('Harga sampah harus diisi dan lebih dari 0');
        return;
        }
        
        if (!pilihAlamat) {
        this.showError('Alamat pickup harus dipilih');
        return;
        }
        
        // Calculate total
        const berat = parseFloat(this.applicationData?.weight) || 0;
        const total = parseFloat(hargaSampah) * berat;
        
        // Prepare submission data
        const submissionData = {
        applicationId: this.applicationData?.id,
        hargaPerKg: parseFloat(hargaSampah),
        alamatId: pilihAlamat,
        totalHarga: total,
        berat: berat
        };
        
        // Dispatch submission event
        const event = new CustomEvent('submit-penawaran', {
        detail: submissionData
        });
        document.dispatchEvent(event);
    }

    handleBack() {
        window.history.back();
    }

    handleCancel() {
        if (confirm('Apakah Anda yakin ingin membatalkan? Data yang sudah diisi akan hilang.')) {
        window.location.hash = '#/pengajuan';
        }
    }

    handleRetry() {
        if (this.applicationData?.id) {
        this.loadApplicationData(this.applicationData.id);
        }
    }

    showLoading() {
        const loadingState = document.getElementById("loading-state");
        const formContainer = document.querySelector(".form-container");
        const errorState = document.getElementById("error-state");
        
        if (loadingState) loadingState.style.display = 'block';
        if (formContainer) formContainer.style.display = 'none';
        if (errorState) errorState.style.display = 'none';
    }

    hideLoading() {
        const loadingState = document.getElementById("loading-state");
        const formContainer = document.querySelector(".form-container");
        
        if (loadingState) loadingState.style.display = 'none';
        if (formContainer) formContainer.style.display = 'block';
    }

    showError(message) {
        const errorState = document.getElementById("error-state");
        const errorMessage = document.getElementById("error-message");
        const loadingState = document.getElementById("loading-state");
        const formContainer = document.querySelector(".form-container");
        
        if (errorMessage) errorMessage.textContent = message;
        if (errorState) errorState.style.display = 'block';
        if (loadingState) loadingState.style.display = 'none';
        if (formContainer) formContainer.style.display = 'none';
    }

    showSuccess(message) {
        alert(message); // You can replace this with a proper toast/notification
    }

    displayUserInfo(user) {
        const userNameElement = document.getElementById("user-name");
        const userAvatar = document.getElementById("user-avatar");
        
        if (userNameElement && user) {
        userNameElement.textContent = user.name || user.username || 'User';
        }
        
        if (userAvatar && user && user.avatar) {
        userAvatar.src = user.avatar;
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
    }
}