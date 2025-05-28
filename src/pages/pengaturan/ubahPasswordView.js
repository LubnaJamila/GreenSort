//src/pages/pengaturan/ubahPasswordView.js
import "../../assets/styles/ubahPassword.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class UbahPasswordView {
    constructor() {
        this.app = document.getElementById("content");
        this.sidebarView = new SidebarView();
        this.eventListeners = [];
        this.isMobile = window.matchMedia("(max-width: 768px)").matches;
        this.sidebarCollapsed = false;
        this.passwordStrength = {
            score: 0,
            feedback: []
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
                            <p class="text-dark mb-4">Ubah Password Kamu</p>
                        </div>
                        <div class="user-profile">
                            <img id="user-avatar" src="${userPlaceholder}" alt="User">
                            <span id="user-name">Sevri Vendrian</span>
                        </div>
                    </div>
                    <div class="table-actions">
                        <a href="#/detail-profile" class="classify-btn" data-route="detailProfile">
                            <i class="bi bi-person-circle"></i>
                            <span class="nav-text">Detail Profile</span>
                        </a>
                        <a href="#/edit-profile" class="classify-btn" data-route="editProfile">
                            <i class="bi bi-pencil-square"></i>
                            <span class="nav-text">Edit Profile</span>
                        </a>
                        <a href="#/ubah-password" class="classify-btn active" data-route="ubahPassword">
                            <i class="bi bi-key"></i>
                            <span class="nav-text">Ubah Password</span>
                        </a>
                    </div>
                </header>

                <div class="content-section">
                    <div class="content-header">
                        <h3>Ubah Password</h3>
                    </div>

                    <div class="row justify-content-center">
                        <!-- Password Change Form -->
                        <div class="col-lg-8 col-md-10">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="card-title mb-0">
                                        <i class="bi bi-shield-lock me-2"></i>
                                        Keamanan Password
                                    </h5>
                                </div>
                                <div class="card-body">
                                    <form id="change-password-form" class="needs-validation" novalidate>
                                        <!-- Current Password -->
                                        <div class="mb-4">
                                            <label for="current-password" class="form-label fw-bold">
                                                Password Saat Ini <span class="text-danger">*</span>
                                            </label>
                                            <div class="input-group">
                                                <input type="password" class="form-control" id="current-password" 
                                                       name="currentPassword" required>
                                                <button class="btn btn-outline-secondary" type="button" id="toggle-current">
                                                    <i class="bi bi-eye"></i>
                                                </button>
                                            </div>
                                            <div class="invalid-feedback">
                                                Password saat ini harus diisi.
                                            </div>
                                        </div>

                                        <!-- New Password -->
                                        <div class="mb-3">
                                            <label for="new-password" class="form-label fw-bold">
                                                Password Baru <span class="text-danger">*</span>
                                            </label>
                                            <div class="input-group">
                                                <input type="password" class="form-control" id="new-password" 
                                                       name="newPassword" required>
                                                <button class="btn btn-outline-secondary" type="button" id="toggle-new">
                                                    <i class="bi bi-eye"></i>
                                                </button>
                                            </div>
                                            <div class="invalid-feedback">
                                                Password baru harus diisi.
                                            </div>
                                        </div>

                                        <!-- Password Strength Indicator -->
                                        <div class="mb-4">
                                            <div class="password-strength-container">
                                                <div class="d-flex justify-content-between align-items-center mb-2">
                                                    <small class="text-muted">Kekuatan Password:</small>
                                                    <small id="strength-text" class="fw-bold">Sangat Lemah</small>
                                                </div>
                                                <div class="progress password-strength-bar">
                                                    <div class="progress-bar" id="strength-bar" role="progressbar" 
                                                         style="width: 0%" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                                <div id="password-feedback" class="mt-2">
                                                    <small class="text-muted">
                                                        Password harus mengandung minimal 8 karakter
                                                    </small>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Confirm Password -->
                                        <div class="mb-4">
                                            <label for="confirm-password" class="form-label fw-bold">
                                                Konfirmasi Password Baru <span class="text-danger">*</span>
                                            </label>
                                            <div class="input-group">
                                                <input type="password" class="form-control" id="confirm-password" 
                                                       name="confirmPassword" required>
                                                <button class="btn btn-outline-secondary" type="button" id="toggle-confirm">
                                                    <i class="bi bi-eye"></i>
                                                </button>
                                            </div>
                                            <div class="invalid-feedback">
                                                Konfirmasi password tidak cocok.
                                            </div>
                                        </div>

                                        <!-- Password Requirements -->
                                        <div class="alert alert-info mb-4">
                                            <h6 class="alert-heading">
                                                <i class="bi bi-info-circle me-2"></i>
                                                Persyaratan Password:
                                            </h6>
                                            <ul class="mb-0 password-requirements">
                                                <li id="req-length" class="requirement">
                                                    <i class="bi bi-x-circle text-danger me-2"></i>
                                                    Minimal 8 karakter
                                                </li>
                                                <li id="req-uppercase" class="requirement">
                                                    <i class="bi bi-x-circle text-danger me-2"></i>
                                                    Minimal 1 huruf besar
                                                </li>
                                                <li id="req-lowercase" class="requirement">
                                                    <i class="bi bi-x-circle text-danger me-2"></i>
                                                    Minimal 1 huruf kecil
                                                </li>
                                                <li id="req-number" class="requirement">
                                                    <i class="bi bi-x-circle text-danger me-2"></i>
                                                    Minimal 1 angka
                                                </li>
                                                <li id="req-special" class="requirement">
                                                    <i class="bi bi-x-circle text-danger me-2"></i>
                                                    Minimal 1 karakter khusus (!@#$%^&*)
                                                </li>
                                            </ul>
                                        </div>

                                        <!-- Action Buttons -->
                                        <div class="row">
                                            <div class="col-12">
                                                <div class="d-flex gap-2 justify-content-end">
                                                    <button type="button" class="btn btn-outline-secondary" id="cancel-btn">
                                                        <i class="bi bi-x-circle me-2"></i>
                                                        Batal
                                                    </button>
                                                    <button type="submit" class="btn btn-primary" id="save-btn">
                                                        <i class="bi bi-check-circle me-2"></i>
                                                        Ubah Password
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <!-- Security Tips Card -->
                            <div class="card mt-4">
                                <div class="card-header">
                                    <h5 class="card-title mb-0">
                                        <i class="bi bi-shield-check me-2"></i>
                                        Tips Keamanan
                                    </h5>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <div class="d-flex">
                                                <i class="bi bi-check-circle-fill text-success me-3 mt-1"></i>
                                                <div>
                                                    <h6 class="mb-1">Gunakan Password Unik</h6>
                                                    <small class="text-muted">Jangan gunakan password yang sama untuk akun lain</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <div class="d-flex">
                                                <i class="bi bi-check-circle-fill text-success me-3 mt-1"></i>
                                                <div>
                                                    <h6 class="mb-1">Kombinasi Karakter</h6>
                                                    <small class="text-muted">Campurkan huruf, angka, dan simbol</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <div class="d-flex">
                                                <i class="bi bi-check-circle-fill text-success me-3 mt-1"></i>
                                                <div>
                                                    <h6 class="mb-1">Hindari Informasi Pribadi</h6>
                                                    <small class="text-muted">Jangan gunakan nama, tanggal lahir, atau info pribadi</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <div class="d-flex">
                                                <i class="bi bi-check-circle-fill text-success me-3 mt-1"></i>
                                                <div>
                                                    <h6 class="mb-1">Update Berkala</h6>
                                                    <small class="text-muted">Ubah password secara berkala untuk keamanan</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                            <p class="mb-0">Mengubah password...</p>
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
                                <i class="bi bi-shield-check-fill" style="font-size: 3rem;"></i>
                            </div>
                            <h5 class="mb-2">Password Berhasil Diubah!</h5>
                            <p class="mb-3">Password Anda telah berhasil diperbarui. Silakan login dengan password baru.</p>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Error Modal -->
            <div class="modal fade" id="errorModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-body text-center p-4">
                            <div class="text-danger mb-3">
                                <i class="bi bi-x-circle-fill" style="font-size: 3rem;"></i>
                            </div>
                            <h5 class="mb-2" id="errorModalTitle">Gagal Mengubah Password</h5>
                            <p class="mb-3" id="errorModalMessage">Password lama salah.</p>
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Tutup</button>
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

        const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
        if (mobileMenuBtn) {
            const handler = () => this.toggleSidebar();
            mobileMenuBtn.addEventListener('click', handler);
            this.eventListeners.push({ element: mobileMenuBtn, type: 'click', handler });
        }

        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            const handler = () => this.toggleSidebar(false);
            overlay.addEventListener('click', handler);
            this.eventListeners.push({ element: overlay, type: 'click', handler });
        }

        const resizeHandler = () => this.handleResize();
        window.addEventListener('resize', resizeHandler);
        this.eventListeners.push({ element: window, type: 'resize', handler: resizeHandler });

        this.setupPasswordToggles();

        const form = document.getElementById('change-password-form');
        if (form) {
            const submitHandler = (e) => this.handleFormSubmit(e);
            form.addEventListener('submit', submitHandler);
            this.eventListeners.push({ element: form, type: 'submit', handler: submitHandler });
        }

        const cancelBtn = document.getElementById('cancel-btn');
        if (cancelBtn) {
            const cancelHandler = () => this.handleCancel();
            cancelBtn.addEventListener('click', cancelHandler);
            this.eventListeners.push({ element: cancelBtn, type: 'click', handler: cancelHandler });
        }

        const newPasswordInput = document.getElementById('new-password');
        if (newPasswordInput) {
            const strengthHandler = (e) => this.checkPasswordStrength(e.target.value);
            newPasswordInput.addEventListener('input', strengthHandler);
            this.eventListeners.push({ element: newPasswordInput, type: 'input', handler: strengthHandler });
        }

        const confirmPasswordInput = document.getElementById('confirm-password');
        if (confirmPasswordInput) {
            const confirmHandler = () => this.validatePasswordMatch();
            confirmPasswordInput.addEventListener('input', confirmHandler);
            this.eventListeners.push({ element: confirmPasswordInput, type: 'input', handler: confirmHandler });
        }

        this.setupFormValidation();
    }

    setupPasswordToggles() {
        const toggles = [
            { btn: 'toggle-current', input: 'current-password' },
            { btn: 'toggle-new', input: 'new-password' },
            { btn: 'toggle-confirm', input: 'confirm-password' }
        ];

        toggles.forEach(({ btn, input }) => {
            const toggleBtn = document.getElementById(btn);
            const inputField = document.getElementById(input);
            
            if (toggleBtn && inputField) {
                const handler = () => this.togglePasswordVisibility(inputField, toggleBtn);
                toggleBtn.addEventListener('click', handler);
                this.eventListeners.push({ element: toggleBtn, type: 'click', handler });
            }
        });
    }

    togglePasswordVisibility(input, button) {
        const icon = button.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'bi bi-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'bi bi-eye';
        }
    }

    setupFormValidation() {
        const form = document.getElementById('change-password-form');
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
        }

        if (field.id === 'confirm-password') {
            isValid = this.validatePasswordMatch();
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

    validatePasswordMatch() {
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const confirmField = document.getElementById('confirm-password');

        if (confirmPassword && newPassword !== confirmPassword) {
            confirmField.classList.add('is-invalid');
            return false;
        } else if (confirmPassword) {
            confirmField.classList.remove('is-invalid');
            return true;
        }
        return true;
    }

    checkPasswordStrength(password) {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        Object.keys(requirements).forEach(req => {
            const element = document.getElementById(`req-${req}`);
            if (element) {
                if (requirements[req]) {
                    element.classList.add('met');
                } else {
                    element.classList.remove('met');
                }
            }
        });

        const score = Object.values(requirements).filter(Boolean).length;
        this.updatePasswordStrengthIndicator(score, password.length);
    }

    updatePasswordStrengthIndicator(score, length) {
        const strengthBar = document.getElementById('strength-bar');
        const strengthText = document.getElementById('strength-text');
        
        let strengthClass = '';
        let strengthLabel = '';
        let percentage = 0;

        if (length === 0) {
            strengthLabel = 'Sangat Lemah';
            percentage = 0;
            strengthClass = 'strength-very-weak';
        } else if (score < 2) {
            strengthLabel = 'Sangat Lemah';
            percentage = 20;
            strengthClass = 'strength-very-weak';
        } else if (score < 3) {
            strengthLabel = 'Lemah';
            percentage = 40;
            strengthClass = 'strength-weak';
        } else if (score < 4) {
            strengthLabel = 'Cukup';
            percentage = 60;
            strengthClass = 'strength-fair';
        } else if (score < 5) {
            strengthLabel = 'Bagus';
            percentage = 80;
            strengthClass = 'strength-good';
        } else {
            strengthLabel = 'Sangat Kuat';
            percentage = 100;
            strengthClass = 'strength-strong';
        }

        strengthBar.style.width = percentage + '%';
        strengthBar.className = `progress-bar ${strengthClass}`;
        strengthText.textContent = strengthLabel;
        strengthText.className = `fw-bold text-${strengthClass.split('-')[1]}`;
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

        const newPassword = formData.get('newPassword');
        if (newPassword.length < 8) {
            isFormValid = false;
            document.getElementById('new-password').classList.add('is-invalid');
        }

        if (!isFormValid) {
            return;
        }

        const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
        loadingModal.show();

        setTimeout(() => {
        const newPassword = formData.get("newPassword");
        const confirmPassword = formData.get("confirmPassword");

        if (newPassword !== confirmPassword) {
            // Tambahkan class is-invalid dan tampilkan feedback
            const confirmField = document.getElementById('confirm-password');
            confirmField.classList.add('is-invalid');

            const feedback = confirmField.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.textContent = "Konfirmasi password tidak cocok.";
            }

            loadingModal.hide();
            return;
        }

        this.changePassword(formData);
        loadingModal.hide();
    }, 2000);
    }

    changePassword(formData) {
    const passwordData = {
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword")
    };

    if (this.changePasswordHandler) {
        this.changePasswordHandler(passwordData);
    }
    }

    handleCancel() {
        if (confirm('Apakah Anda yakin ingin membatalkan perubahan password?')) {
            const form = document.getElementById('change-password-form');
            form.reset();
            
            form.classList.remove('was-validated');
            form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
            
            this.updatePasswordStrengthIndicator(0, 0);
            
            document.querySelectorAll('.requirement').forEach(req => {
                req.classList.remove('met');
            });

            document.querySelectorAll('input[type="text"]').forEach(input => {
                if (input.id.includes('password')) {
                    input.type = 'password';
                }
            });
            document.querySelectorAll('.bi-eye-slash').forEach(icon => {
                icon.className = 'bi bi-eye';
            });
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
                userNameElement.textContent = "Sevri Vendrian";
            }
        }
    }

    bindChangePassword(handler) {
        this.changePasswordHandler = handler;
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
        console.log("Destroying UbahPasswordView");
        this.removeEventListeners();

        if (this.sidebarView && this.sidebarView.destroy) {
            this.sidebarView.destroy();
        }
    }
}