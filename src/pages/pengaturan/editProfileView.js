//src/pages/pengaturan/editProfilView.js
import "../../assets/styles/editProfile.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class EditProfileView {
    constructor() {
        this.app = document.getElementById("content");
        this.sidebarView = new SidebarView();
        this.eventListeners = [];
        this.isMobile = window.matchMedia("(max-width: 768px)").matches;
        this.sidebarCollapsed = false;
        this.profileData = {
            namaLengkap: "Nazira Ayu",
            username: "Jeje",
            email: "Jeje@gmail.com",
            noTelepon: "081703023782"
        };
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
            <div class="main-content ${this.isMobile ? 'full-width' : ''} ${this.sidebarCollapsed ? 'collapsed' : ''}">
                <header>
                    <div class="header-content">
                        <div class="dashboard-header">
                            <h2>Pengaturan Akun</h2>
                            <p class="text-dark mb-4">Edit Profile Kamu</p>
                        </div>
                        <div class="user-profile">
                            <img id="user-avatar" src="${userPlaceholder}" alt="User">
                            <span id="user-name">Loading...</span>
                        </div>
                    </div>
                    <div class="table-actions">
                        <a href="#/detail-profile" class="classify-btn" data-route="detailProfile">
                            <i class="bi bi-person-circle"></i>
                            <span class="nav-text">Detail Profile</span>
                        </a>
                        <a href="#/edit-profile" class="classify-btn active" data-route="editProfile">
                            <i class="bi bi-pencil-square"></i>
                            <span class="nav-text">Edit Profile</span>
                        </a>
                        <a href="#/ubah-password" class="classify-btn" data-route="ubahPassword">
                            <i class="bi bi-key"></i>
                            <span class="nav-text">Ubah Password</span>
                        </a>
                    </div>
                </header>

                <div class="content-section">
                    <div class="content-header">
                        <h3>Edit Profile</h3>
                    </div>

                    <form id="edit-profile-form" class="needs-validation" novalidate>
                        <div class="row">
                            <!-- Profile Image Card -->
                            <div class="col-md-4 mb-4">
                                <div class="card h-100">
                                    <div class="card-body text-center">
                                        <div class="user-avatar mb-3 position-relative">
                                            <img id="profile-image" src="${userPlaceholder}" alt="Profile Image" class="rounded-circle" style="width: 120px; height: 120px; object-fit: cover;">
                                            <div class="image-overlay">
                                                <button type="button" class="btn btn-primary btn-sm upload-btn" id="upload-image-btn">
                                                    <i class="bi bi-camera"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="profile-info">
                                            <h4 class="card-title" id="preview-name">Nazira Ayu</h4>
                                            <p class="text-muted mb-3">User</p>
                                            <input type="file" id="image-input" accept="image/*" style="display: none;">
                                            <small class="text-muted d-block">
                                                Ukuran maksimal: 2MB<br>
                                                Format: JPG, PNG, GIF
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Edit Form -->
                            <div class="col-md-8 mb-4">
                                <div class="card h-100">
                                    <div class="card-header">
                                        <h5 class="card-title mb-0">
                                            <i class="bi bi-pencil-square me-2"></i>
                                            Edit Informasi Profile
                                        </h5>
                                    </div>
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <label for="nama-lengkap" class="form-label fw-bold">
                                                    Nama Lengkap <span class="text-danger">*</span>
                                                </label>
                                                <input type="text" class="form-control" id="nama-lengkap" 
                                                       name="namaLengkap" value="${this.profileData.namaLengkap}" 
                                                       required>
                                                <div class="invalid-feedback">
                                                    Nama lengkap harus diisi.
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label for="username" class="form-label fw-bold">
                                                    Username <span class="text-danger">*</span>
                                                </label>
                                                <input type="text" class="form-control" id="username" 
                                                       name="username" value="${this.profileData.username}" 
                                                       required>
                                                <div class="invalid-feedback">
                                                    Username harus diisi.
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <label for="email" class="form-label fw-bold">
                                                    Email <span class="text-danger">*</span>
                                                </label>
                                                <input type="email" class="form-control" id="email" 
                                                       name="email" value="${this.profileData.email}" 
                                                       required>
                                                <div class="invalid-feedback">
                                                    Email harus valid.
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label for="no-telepon" class="form-label fw-bold">
                                                    No. Telepon <span class="text-danger">*</span>
                                                </label>
                                                <input type="tel" class="form-control" id="no-telepon" 
                                                       name="noTelepon" value="${this.profileData.noTelepon}" 
                                                       required>
                                                <div class="invalid-feedback">
                                                    Nomor telepon harus diisi.
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row mt-4">
                                            <div class="col-12">
                                                <div class="d-flex gap-2 justify-content-end">
                                                    <button type="button" class="btn btn-outline-secondary" id="cancel-btn">
                                                        <i class="bi bi-x-circle me-2"></i>
                                                        Batal
                                                    </button>
                                                    <button type="submit" class="btn btn-primary" id="save-btn">
                                                        <i class="bi bi-check-circle me-2"></i>
                                                        Simpan Perubahan
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Loading Modal -->
            <div class="modal fade" id="loadingModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-body text-center p-4">
                            <div class="spinner-border text-primary mb-3" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            <p class="mb-0">Menyimpan perubahan...</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Success Modal -->
            <div class="modal fade" id="successModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-body text-center p-4">
                            <div class="text-success mb-3">
                                <i class="bi bi-check-circle-fill" style="font-size: 3rem;"></i>
                            </div>
                            <h5 class="mb-2">Berhasil!</h5>
                            <p class="mb-3">Profile berhasil diperbarui.</p>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
        this.displayUserInfo();
    }

    setupEventListeners() {
        this.removeEventListeners();

        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
        if (mobileMenuBtn) {
            const handler = () => this.toggleSidebar();
            mobileMenuBtn.addEventListener('click', handler);
            this.eventListeners.push({ element: mobileMenuBtn, type: 'click', handler });
        }

        // Sidebar overlay
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            const handler = () => this.toggleSidebar(false);
            overlay.addEventListener('click', handler);
            this.eventListeners.push({ element: overlay, type: 'click', handler });
        }

        // Resize handler
        const resizeHandler = () => this.handleResize();
        window.addEventListener('resize', resizeHandler);
        this.eventListeners.push({ element: window, type: 'resize', handler: resizeHandler });

        // Upload image button
        const uploadBtn = document.getElementById('upload-image-btn');
        const imageInput = document.getElementById('image-input');
        if (uploadBtn && imageInput) {
            const uploadHandler = () => imageInput.click();
            uploadBtn.addEventListener('click', uploadHandler);
            this.eventListeners.push({ element: uploadBtn, type: 'click', handler: uploadHandler });

            const imageHandler = (e) => this.handleImageUpload(e);
            imageInput.addEventListener('change', imageHandler);
            this.eventListeners.push({ element: imageInput, type: 'change', handler: imageHandler });
        }

        // Form submission
        const form = document.getElementById('edit-profile-form');
        if (form) {
            const submitHandler = (e) => this.handleFormSubmit(e);
            form.addEventListener('submit', submitHandler);
            this.eventListeners.push({ element: form, type: 'submit', handler: submitHandler });
        }

        // Cancel button
        const cancelBtn = document.getElementById('cancel-btn');
        if (cancelBtn) {
            const cancelHandler = () => this.handleCancel();
            cancelBtn.addEventListener('click', cancelHandler);
            this.eventListeners.push({ element: cancelBtn, type: 'click', handler: cancelHandler });
        }

        // Real-time name preview
        const namaInput = document.getElementById('nama-lengkap');
        if (namaInput) {
            const nameHandler = (e) => this.updateNamePreview(e.target.value);
            namaInput.addEventListener('input', nameHandler);
            this.eventListeners.push({ element: namaInput, type: 'input', handler: nameHandler });
        }

        // Form validation
        this.setupFormValidation();
    }

    setupFormValidation() {
        const form = document.getElementById('edit-profile-form');
        const inputs = form.querySelectorAll('input[required]');

        inputs.forEach(input => {
            const blurHandler = () => this.validateField(input);
            const inputHandler = () => this.clearFieldError(input);
            
            input.addEventListener('blur', blurHandler);
            input.addEventListener('input', inputHandler);
            
            this.eventListeners.push({ element: input, type: 'blur', handler: blurHandler });
            this.eventListeners.push({ element: input, type: 'input', handler: inputHandler });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        if (field.hasAttribute('required') && !value) {
            isValid = false;
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
        }

        if (isValid) {
            field.classList.remove('is-invalid');
        } else {
            field.classList.add('is-invalid');
        }

        return isValid;
    }

    clearFieldError(field) {
        if (field.value.trim()) {
            field.classList.remove('is-invalid');
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran file terlalu besar. Maksimal 2MB.');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('File harus berupa gambar.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const profileImage = document.getElementById('profile-image');
            if (profileImage) {
                profileImage.src = e.target.result;
            }
        };
        reader.readAsDataURL(file);
    }

    updateNamePreview(name) {
        const previewName = document.getElementById('preview-name');
        if (previewName) {
            previewName.textContent = name || 'Nama Lengkap';
        }
    }

    handleFormSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const inputs = form.querySelectorAll('input[required]');
        
        let isFormValid = true;
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            return;
        }

        // Show loading modal
        const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
        loadingModal.show();

        // Simulate API call
        setTimeout(() => {
            this.saveProfile(formData);
            loadingModal.hide();
            
            // Show success modal
            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();
        }, 2000);
    }

    saveProfile(formData) {
        // Update local profile data
        this.profileData = {
            namaLengkap: formData.get('namaLengkap'),
            username: formData.get('username'),
            email: formData.get('email'),
            noTelepon: formData.get('noTelepon')
        };

        console.log('Profile saved:', this.profileData);
        // Here you would typically send the data to your API
    }

    handleCancel() {
        if (confirm('Apakah Anda yakin ingin membatalkan perubahan?')) {
            // Reset form to original values
            document.getElementById('nama-lengkap').value = this.profileData.namaLengkap;
            document.getElementById('username').value = this.profileData.username;
            document.getElementById('email').value = this.profileData.email;
            document.getElementById('no-telepon').value = this.profileData.noTelepon;
            
            // Reset image
            document.getElementById('profile-image').src = userPlaceholder;
            document.getElementById('image-input').value = '';
            
            // Clear validation
            const form = document.getElementById('edit-profile-form');
            form.classList.remove('was-validated');
            form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
            
            // Update name preview
            this.updateNamePreview(this.profileData.namaLengkap);
        }
    }

    toggleSidebar(show = null) {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');

        if (show === null) {
            show = !sidebar.classList.contains('mobile-open');
        }

        if (show) {
            sidebar.classList.add('mobile-open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
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
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;

        if (this.isMobile) {
            mainContent.classList.add('full-width');
            mainContent.classList.remove('collapsed');
        } else {
            mainContent.classList.remove('full-width');
            if (this.sidebarCollapsed) {
                mainContent.classList.add('collapsed');
            }
        }
    }

    displayUserInfo(user = null) {
        const userNameElement = document.getElementById("user-name");
        if (userNameElement) {
            if (user) {
                userNameElement.textContent = user.name || user.username;
            } else {
                userNameElement.textContent = this.profileData.namaLengkap;
            }
        }
    }

    // Method untuk bind dengan router
    bindSaveProfile(handler) {
        this.saveProfileHandler = handler;
    }

    removeEventListeners() {
        this.eventListeners.forEach(({ element, type, handler }) => {
            if (element) {
                element.removeEventListener(type, handler);
            }
        });
        this.eventListeners = [];
    }

    destroy() {
        console.log("Destroying EditProfileView");
        this.removeEventListeners();

        if (this.sidebarView && this.sidebarView.destroy) {
            this.sidebarView.destroy();
        }
    }
}