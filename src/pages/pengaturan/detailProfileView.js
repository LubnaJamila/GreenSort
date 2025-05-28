//src/pages/pengaturan/detailProfilView.js
import "../../assets/styles/content.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class DetailProfileView {
    constructor() {
        this.app = document.getElementById("content");
        this.sidebarView = new SidebarView();
        this.eventListeners = [];
        this.isMobile = window.matchMedia("(max-width: 768px)").matches;
        this.sidebarCollapsed = false;
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
                            <p class="text-dark mb-4">Atur Profile Kamu</p>
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
                        <a href="#/edit-profile" class="classify-btn" data-route="editProfile">
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
                        <h3>Detail Profile</h3>
                    </div>

                    <div class="row">
                        <!-- Profile Card -->
                        <div class="col-md-4 mb-4">
                            <div class="card h-100">
                                <div class="card-body text-center">
                                    <div class="user-avatar mb-3">
                                        <img src="${userPlaceholder}" alt="foto profile" class="rounded-circle" style="width: 120px; height: 120px; object-fit: cover;">
                                    </div>
                                    <div class="profile-info">
                                        <h4 class="card-title"></h4>
                                        <p class="text-muted mb-3"></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Profile Details -->
                        <div class="col-md-8 mb-4">
                            <div class="card h-100">
                                <div class="card-header">
                                    <h5 class="card-title mb-0">
                                        <i class="bi bi-person-vcard me-2"></i>
                                        Informasi Profile
                                    </h5>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-borderless">
                                            <tbody>
                                                <tr>
                                                    <td class="fw-bold" style="width: 30%;">Nama Lengkap</td>
                                                    <td>:</td>
                                                    <td id="detail-nama"></td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Username</td>
                                                    <td>:</td>
                                                    <td id="detail-username"></td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Email</td>
                                                    <td>:</td>
                                                    <td id="detail-email"></td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">No. Telepon</td>
                                                    <td>:</td>
                                                    <td id="detail-phone"></td>
                                                </tr> 
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
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

        // Event listener untuk edit foto
        const editPhotoBtn = document.getElementById('edit-photo-btn');
        if (editPhotoBtn) {
            const photoHandler = () => this.handleEditPhoto();
            editPhotoBtn.addEventListener('click', photoHandler);
            this.eventListeners.push({ element: editPhotoBtn, type: 'click', handler: photoHandler });
        }
    }

    // Bind method untuk edit profile
    bindEditProfile(handler) {
        const editProfileBtn = document.querySelector('[data-route="editProfileBtn"]');
        if (editProfileBtn) {
            const clickHandler = (e) => {
                e.preventDefault();
                handler();
            };
            editProfileBtn.addEventListener('click', clickHandler);
            this.eventListeners.push({
                element: editProfileBtn,
                type: 'click',
                handler: clickHandler,
            });
        } else {
            console.warn("Button Edit Profile tidak ditemukan di DOM");
        }
    }

    // Bind method untuk ubah password
    bindUbahPassword(handler) {
        const ubahPasswordBtn = document.querySelector('[data-route="ubahPasswordBtn"]');
        if (ubahPasswordBtn) {
            const clickHandler = (e) => {
                e.preventDefault();
                handler();
            };
            ubahPasswordBtn.addEventListener('click', clickHandler);
            this.eventListeners.push({
                element: ubahPasswordBtn,
                type: 'click',
                handler: clickHandler,
            });
        } else {
            console.warn("Button Ubah Password tidak ditemukan di DOM");
        }
    }

    // Method untuk handle edit foto
    handleEditPhoto() {
        console.log("Edit foto clicked");
        // Implementasi upload foto bisa ditambahkan di sini
        // Misalnya membuka file picker atau modal upload
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
                // Default user info jika tidak ada data user
                userNameElement.textContent = "Sevri Vendrian";
            }
        }
    }
        updateProfileData(profileData) {
        this.displayUserInfo(profileData);

        const nameElement = document.querySelector(".profile-info .card-title");
        const roleElement = document.querySelector(".profile-info .text-muted");

        if (nameElement) nameElement.textContent = profileData.nama_lengkap;
        if (roleElement) roleElement.textContent = profileData.role;

        document.getElementById("detail-nama").textContent = profileData.nama_lengkap;
        document.getElementById("detail-username").textContent = profileData.username;
        document.getElementById("detail-email").textContent = profileData.email;
        document.getElementById("detail-phone").textContent = profileData.no_hp;
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
        console.log("Destroying DetailProfilView");
        this.removeEventListeners();

        if (this.sidebarView && this.sidebarView.destroy) {
            this.sidebarView.destroy();
        }
    }
}