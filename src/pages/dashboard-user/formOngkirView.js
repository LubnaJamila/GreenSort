// src/pages/dashboard-user/formOngkirView.js
import "../../assets/styles/sidebar.css";
import "../../assets/styles/rekening.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class FormOngkirView {
    constructor() {
        this.app = document.getElementById("content");
        this.sidebar = new SidebarView();
        this.eventListeners = [];
        this.isMobile = window.matchMedia("(max-width: 768px)").matches;
        this.sidebarCollapsed = false;
        this.applicationData = null;
        this.masterAlamat = [];
        this.selectedDeliveryMethod = 'mengantar'; // default
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
                                    <h2>Form Ongkos Kirim</h2>
                                    <p class="text-dark mb-0">Detail pengajuan dan pengaturan pengiriman</p>
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
                        <h2 class="section-title">Detail Ongkos Kirim</h2>
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
                        
                        <!-- Form Pengiriman Card -->
                        <div class="col-md-6 mb-4">
                            <div class="card border-0 shadow-sm">
                                <div class="card-header bg-success text-white">
                                    <h5 class="mb-0"><i class="bi bi-truck me-2"></i>Metode Pengiriman</h5>
                                </div>
                                <div class="card-body">
                                    <form id="ongkir-form">
                                        <!-- Radio Button Pilihan Pengiriman -->
                                        <div class="mb-4">
                                            <label class="form-label fw-bold">Pilih Metode Pengiriman:</label>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="radio" 
                                                       name="delivery-method" id="mengantar" value="mengantar" checked>
                                                <label class="form-check-label" for="mengantar">
                                                    <i class="bi bi-person-walking me-2"></i>Mengantar Sendiri
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" 
                                                       name="delivery-method" id="dijemput" value="dijemput">
                                                <label class="form-check-label" for="dijemput">
                                                    <i class="bi bi-truck me-2"></i>Dijemput
                                                </label>
                                            </div>
                                        </div>
                                        
                                        <!-- Alamat Section -->
                                        <div id="alamat-section">
                                            <!-- Mengantar Sendiri Section -->
                                            <div id="mengantar-section" class="delivery-section">
                                                <div class="alert alert-info">
                                                    <i class="bi bi-info-circle me-2"></i>
                                                    Silakan datang ke alamat berikut untuk mengantar sampah:
                                                </div>
                                                <div class="card bg-light">
                                                    <div class="card-body">
                                                        <div class="d-flex justify-content-between align-items-start">
                                                            <div>
                                                                <h6 class="mb-2">Alamat Tujuan:</h6>
                                                                <p id="alamat-tujuan" class="mb-2">
                                                                    Jl. Contoh Alamat No. 123, Kecamatan ABC, 
                                                                    Kabupaten XYZ, Jawa Timur 12345
                                                                </p>
                                                            </div>
                                                            <a href="#" id="lokasi-link" class="btn btn-outline-primary btn-sm" 
                                                               title="Lihat Lokasi di Peta">
                                                                <i class="bi bi-geo-alt-fill"></i>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <!-- Dijemput Section -->
                                            <div id="dijemput-section" class="delivery-section" style="display: none;">
                                                <div class="mb-3">
                                                    <label class="form-label">Alamat Lengkap Anda:</label>
                                                    <div class="card bg-light">
                                                        <div class="card-body">
                                                            <p id="alamat-user" class="mb-0">Loading alamat...</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div class="mb-3">
                                                    <label for="pilih-alamat" class="form-label">Pilih Alamat Penjemputan:</label>
                                                    <select class="form-select" id="pilih-alamat" name="alamat_id">
                                                        <option value="">-- Pilih Alamat --</option>
                                                    </select>
                                                </div>
                                                
                                                <div class="mb-3">
                                                    <label class="form-label">Estimasi Jarak:</label>
                                                    <div class="input-group">
                                                        <span class="input-group-text"><i class="bi bi-rulers"></i></span>
                                                        <input type="text" class="form-control" id="estimasi-jarak" 
                                                               value="Pilih alamat terlebih dahulu" readonly>
                                                        <span class="input-group-text">km</span>
                                                    </div>
                                                </div>
                                                
                                                <div class="mb-3">
                                                    <label for="ongkir" class="form-label">Ongkos Kirim:</label>
                                                    <div class="input-group">
                                                        <span class="input-group-text">Rp</span>
                                                        <input type="text" class="form-control" id="ongkir" 
                                                               name="ongkir" value="0" disabled>
                                                    </div>
                                                    <small class="text-muted">Ongkos kirim akan dihitung otomatis berdasarkan jarak</small>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- Submit Button -->
                                        <div class="mt-4 text-end">
                                            <button type="button" id="cancel-btn" class="btn btn-secondary me-2">
                                                Batal
                                            </button>
                                            <button type="submit" id="submit-btn" class="btn btn-primary">
                                                <i class="bi bi-check-lg me-2"></i>Konfirmasi
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
    }
    
    populateApplicationData(data) {
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
            sampahImage.src = data.gambarSampah;
        }
        
        // Populate detail info
        document.getElementById('nama-lengkap').textContent = data.namaLengkap || '-';
        document.getElementById('no-hp').textContent = data.noHp || '-';
        document.getElementById('kategori-sampah').textContent = data.kategoriSampah || data.jenisSampah || '-';
        document.getElementById('berat-sampah').textContent = `${data.beratSampah || data.kuantitas || '-'} kg`;
        document.getElementById('harga-sampah').textContent = data.hargaSampah ? formatCurrency(data.hargaSampah) : '-';
    }
    
    populateUserAddress(address) {
        const alamatUser = document.getElementById('alamat-user');
        if (alamatUser) {
            alamatUser.textContent = address || 'Alamat tidak tersedia';
        }
    }
    
    populateMasterAlamat(alamatList) {
        this.masterAlamat = alamatList;
        const selectAlamat = document.getElementById('pilih-alamat');
        
        if (selectAlamat) {
            // Clear existing options except the first one
            selectAlamat.innerHTML = '<option value="">-- Pilih Alamat --</option>';
            
            alamatList.forEach(alamat => {
                const option = document.createElement('option');
                option.value = alamat.id;
                option.textContent = `${alamat.nama} - ${alamat.alamat}`;
                option.dataset.jarak = alamat.jarak || 0;
                selectAlamat.appendChild(option);
            });
        }
    }
    
    updateEstimasiJarak(jarak, ongkir) {
        const estimasiJarakInput = document.getElementById('estimasi-jarak');
        const ongkirInput = document.getElementById('ongkir');
        
        if (estimasiJarakInput) {
            estimasiJarakInput.value = jarak ? `${jarak}` : 'Tidak tersedia';
        }
        
        if (ongkirInput) {
            const formatCurrency = (amount) => {
                return new Intl.NumberFormat('id-ID').format(amount);
            };
            ongkirInput.value = ongkir ? formatCurrency(ongkir) : '0';
        }
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
        
        // Radio button changes
        const deliveryRadios = document.querySelectorAll('input[name="delivery-method"]');
        deliveryRadios.forEach(radio => {
            const handler = (e) => this.handleDeliveryMethodChange(e.target.value);
            radio.addEventListener('change', handler);
            this.eventListeners.push({ element: radio, type: 'change', handler });
        });
        
        // Alamat dropdown change
        const pilihAlamat = document.getElementById('pilih-alamat');
        if (pilihAlamat) {
            const handler = (e) => this.handleAlamatChange(e.target.value);
            pilihAlamat.addEventListener('change', handler);
            this.eventListeners.push({ element: pilihAlamat, type: 'change', handler });
        }
        
        // Form submit
        const form = document.getElementById('ongkir-form');
        if (form) {
            const handler = (e) => this.handleFormSubmit(e);
            form.addEventListener('submit', handler);
            this.eventListeners.push({ element: form, type: 'submit', handler });
        }
    }
    
    handleDeliveryMethodChange(method) {
        this.selectedDeliveryMethod = method;
        
        const mengantarSection = document.getElementById('mengantar-section');
        const dijemputSection = document.getElementById('dijemput-section');
        
        if (method === 'mengantar') {
            mengantarSection.style.display = 'block';
            dijemputSection.style.display = 'none';
        } else {
            mengantarSection.style.display = 'none';
            dijemputSection.style.display = 'block';
        }
        
        // Dispatch event to presenter
        const event = new CustomEvent('delivery-method-changed', {
            detail: { method: method }
        });
        document.dispatchEvent(event);
    }
    
    handleAlamatChange(alamatId) {
        if (!alamatId) {
            this.updateEstimasiJarak(null, null);
            return;
        }
        
        // Dispatch event to presenter
        const event = new CustomEvent('alamat-changed', {
            detail: { alamatId: alamatId }
        });
        document.dispatchEvent(event);
    }
    
    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {
            applicationId: this.applicationData?.id,
            deliveryMethod: this.selectedDeliveryMethod,
            alamatId: formData.get('alamat_id'),
            ongkir: formData.get('ongkir')
        };
        
        // Dispatch event to presenter
        const event = new CustomEvent('form-submit', {
            detail: data
        });
        document.dispatchEvent(event);
    }
    
    handleBack() {
        // Navigate back to diterima page
        window.location.hash = '#/diterima';
    }
    
    handleCancel() {
        if (confirm('Apakah Anda yakin ingin membatalkan? Data yang telah diisi akan hilang.')) {
            this.handleBack();
        }
    }
    
    showLoading(show = true) {
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) {
            if (show) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Memproses...';
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="bi bi-check-lg me-2"></i>Konfirmasi';
            }
        }
    }
    
    showError(message) {
        // Create error alert
        const alertHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        const formSection = document.querySelector('.form-section');
        if (formSection) {
            formSection.insertAdjacentHTML('afterbegin', alertHtml);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                const alert = formSection.querySelector('.alert-danger');
                if (alert) {
                    alert.remove();
                }
            }, 5000);
        }
    }
    
    showSuccess(message) {
        // Create success alert
        const alertHtml = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="bi bi-check-circle me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        const formSection = document.querySelector('.form-section');
        if (formSection) {
            formSection.insertAdjacentHTML('afterbegin', alertHtml);
            
            // Auto remove after 3 seconds then redirect
            setTimeout(() => {
                this.handleBack();
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