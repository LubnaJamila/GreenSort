// src/pages/dashboard-admin/formPenolakanView.js
import "../../assets/styles/sidebar.css";
import "../../assets/styles/rekening.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class FormPenolakanView {
    constructor() {
        this.app = document.getElementById("content");
        this.sidebar = new SidebarView();
        this.eventListeners = [];
        this.isMobile = window.matchMedia("(max-width: 768px)").matches;
        this.sidebarCollapsed = false;
        this.applicationData = null;
        this.isSubmitting = false;
    }

    render(applicationId = null) {
        this.sidebar.render();
        this.renderMainContent();
        this.setupEventListeners();
        this.checkMobileView();
        
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
                            <h1>Form Penolakan</h1>
                            <p>Tolak pengajuan dengan memberikan alasan yang jelas.</p>
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
                    <h2 class="section-title">Detail Pengajuan & Form Penolakan</h2>
                </div>

                <div class="row">
                    <!-- Detail Pengajuan -->
                    <div class="col-lg-6 mb-4">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="bi bi-info-circle"></i> Detail Pengajuan
                                </h5>
                            </div>
                            <div class="card-body" id="application-detail">
                                <div class="text-center">
                                    <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                    </div>
                                    <p class="mt-2">Memuat data pengajuan...</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Form Penolakan -->
                    <div class="col-lg-6 mb-4">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="bi bi-x-circle text-danger"></i> Form Penolakan
                                </h5>
                            </div>
                            <div class="card-body">
                                <form id="rejection-form">
                                    <div class="mb-3">
                                        <label for="rejection-reason" class="form-label">
                                            Alasan Penolakan <span class="text-danger">*</span>
                                        </label>
                                        <textarea 
                                            class="form-control" 
                                            id="rejection-reason" 
                                            name="rejectionReason"
                                            rows="5" 
                                            placeholder="Masukkan alasan mengapa pengajuan ini ditolak..."
                                            required>
                                        </textarea>
                                        <div class="form-text">
                                            Berikan alasan yang jelas dan konstruktif untuk membantu user memahami penolakan.
                                        </div>
                                        <div class="invalid-feedback" id="reason-error">
                                            Alasan penolakan wajib diisi.
                                        </div>
                                    </div>

                                    <div class="d-flex gap-2">
                                        <button 
                                            type="submit" 
                                            class="btn btn-danger flex-fill" 
                                            id="submit-rejection"
                                            disabled
                                        >
                                            <i class="bi bi-x-circle"></i>
                                            <span class="btn-text">Tolak Pengajuan</span>
                                            <span class="spinner-border spinner-border-sm d-none" role="status"></span>
                                        </button>
                                        <button 
                                            type="button" 
                                            class="btn btn-secondary" 
                                            id="cancel-rejection"
                                        >
                                            <i class="bi bi-arrow-left"></i> Kembali
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Success/Error Messages -->
                <div id="message-container"></div>
            </div>
        </div>
        `;
    }

    renderApplicationDetail(application) {
    const detailContainer = document.getElementById('application-detail');
    if (!detailContainer || !application) return;

    const { statusClass, statusIcon, statusLabel } = this.getStatusStyles(application.status);

    detailContainer.innerHTML = `
    <div class="application-info">
        <div class="row">
            <div class="col-md-6 mb-3">
                <div class="info-group">
                    <label class="info-label">Nama Lengkap</label>
                    <div class="info-value">${application.name || 'N/A'}</div>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <div class="info-group">
                    <label class="info-label">No. HP</label>
                    <div class="info-value">${application.phone || 'N/A'}</div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6 mb-3">
                <div class="info-group">
                    <label class="info-label">Kategori Sampah</label>
                    <div class="info-value">${application.category || 'N/A'}</div>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <div class="info-group">
                    <label class="info-label">Berat</label>
                    <div class="info-value">${application.weight || 0} kg</div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12 mb-3">
                <div class="info-group">
                    <label class="info-label">Foto Sampah</label>
                    <div class="info-value">
                        <div class="image-container">
                        <img 
                            src="${application.image || 'https://via.placeholder.com/300x200'}" 
                            alt="Foto Sampah" 
                            class="img-thumbnail waste-detail-img"
                            style="max-width: 100%; height: auto; cursor: pointer;"
                            onclick="this.requestFullscreen()"
                        >
                        </div>
                    </div>
                </div>
            </div>
        </div>

        ${application.description ? `
        <div class="row">
            <div class="col-12 mb-3">
                <div class="info-group">
                    <label class="info-label">Deskripsi</label>
                    <div class="info-value">${application.description}</div>
                </div>
            </div>
        </div>
        ` : ''}
    </div>
    `;

    const submitBtn = document.getElementById('submit-rejection');
    if (submitBtn) {
        submitBtn.disabled = false;
    }

    // ✅ Fix penting — simpan data ke state
    this.applicationData = application;
}


    getStatusStyles(status) {
        const statusMap = {
        'Menunggu Validasi': { 
            class: 'pending', 
            icon: 'bi-hourglass-split', 
            label: 'Menunggu Validasi' 
        },
        'Diterima': { 
            class: 'accepted', 
            icon: 'bi-clipboard-check', 
            label: 'Diterima' 
        },
        'Ditolak': { 
            class: 'rejected', 
            icon: 'bi-x-circle', 
            label: 'Ditolak' 
        },
        'pending': { 
            class: 'pending', 
            icon: 'bi-hourglass-split', 
            label: 'Menunggu Validasi' 
        },
        'accepted': { 
            class: 'accepted', 
            icon: 'bi-clipboard-check', 
            label: 'Diterima' 
        },
        'rejected': { 
            class: 'rejected', 
            icon: 'bi-x-circle', 
            label: 'Ditolak' 
        }
        };

        return statusMap[status] || { 
        class: 'pending', 
        icon: 'bi-hourglass-split', 
        label: status || 'Unknown' 
        };
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        
        try {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        } catch (error) {
        return dateString;
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

        // Form submission
        const rejectionForm = document.getElementById('rejection-form');
        if (rejectionForm) {
        const handler = (e) => this.handleFormSubmit(e);
        rejectionForm.addEventListener('submit', handler);
        this.eventListeners.push({ element: rejectionForm, type: 'submit', handler });
        }

        // Cancel button
        const cancelBtn = document.getElementById('cancel-rejection');
        if (cancelBtn) {
        const handler = () => this.handleCancel();
        cancelBtn.addEventListener('click', handler);
        this.eventListeners.push({ element: cancelBtn, type: 'click', handler });
        }

        // Form validation
        const reasonTextarea = document.getElementById('rejection-reason');
        if (reasonTextarea) {
        const handler = () => this.validateForm();
        reasonTextarea.addEventListener('input', handler);
        this.eventListeners.push({ element: reasonTextarea, type: 'input', handler });
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        const form = e.target;
        const formData = new FormData(form);
        const rejectionData = {
        applicationId: this.applicationData?.id,
        reason: formData.get('rejectionReason').trim(),
        category: formData.get('rejectionCategory'),
        notifyUser: formData.has('notifyUser'),
        rejectedAt: new Date().toISOString(),
        rejectedBy: 'admin' // Should come from auth
        };

        if (!this.validateFormData(rejectionData)) {
        return;
        }

        this.submitRejection(rejectionData);
    }

    validateForm() {
        const reasonTextarea = document.getElementById('rejection-reason');
        const submitBtn = document.getElementById('submit-rejection');
        
        if (reasonTextarea && submitBtn) {
        const isValid = reasonTextarea.value.trim().length >= 10;
        submitBtn.disabled = !isValid || this.isSubmitting;
        
        if (reasonTextarea.value.trim().length > 0 && reasonTextarea.value.trim().length < 10) {
            reasonTextarea.classList.add('is-invalid');
            document.getElementById('reason-error').textContent = 'Alasan penolakan minimal 10 karakter.';
        } else {
            reasonTextarea.classList.remove('is-invalid');
        }
        }
    }

    validateFormData(data) {
        if (!data.reason || data.reason.length < 10) {
        this.showError('Alasan penolakan minimal 10 karakter.');
        return false;
        }
        
        if (!data.applicationId) {
        this.showError('Data pengajuan tidak valid.');
        return false;
        }
        
        return true;
    }

    submitRejection(rejectionData) {
        this.isSubmitting = true;
        this.updateSubmitButton(true);
        
        // Dispatch event for presenter to handle
        const event = new CustomEvent('submit-rejection', { 
        detail: rejectionData 
        });
        document.dispatchEvent(event);
    }

    updateSubmitButton(loading) {
        const submitBtn = document.getElementById('submit-rejection');
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = submitBtn.querySelector('.spinner-border');
        
        if (loading) {
        submitBtn.disabled = true;
        btnText.textContent = 'Memproses...';
        spinner.classList.remove('d-none');
        } else {
        submitBtn.disabled = false;
        btnText.textContent = 'Tolak Pengajuan';
        spinner.classList.add('d-none');
        this.isSubmitting = false;
        }
    }

    handleCancel() {
        if (confirm('Apakah Anda yakin ingin membatalkan proses penolakan?')) {
        window.history.back();
        }
    }

    loadApplicationData(applicationId) {
        // Dispatch event for presenter to load data
        const event = new CustomEvent('load-application-detail', { 
        detail: { id: applicationId } 
        });
        document.dispatchEvent(event);
    }

    displayApplicationData(application) {
        this.applicationData = application;
        this.renderApplicationDetail(application);
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

    showMessage(message, type = 'success') {
        const container = document.getElementById('message-container');
        if (!container) return;

        const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        const icon = type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle';

        container.innerHTML = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            <i class="bi ${icon}"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
        `;

        // Auto hide after 5 seconds
        setTimeout(() => {
        const alert = container.querySelector('.alert');
        if (alert) {
            alert.remove();
        }
        }, 5000);
    }

    showError(message) {
        this.showMessage(message, 'error');
        this.updateSubmitButton(false);
    }

    showSuccess(message) {
    this.updateSubmitButton(false);
    alert(message); 
    window.location.hash = '#/pengajuan'; 
    }


    // Mobile and responsive methods
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