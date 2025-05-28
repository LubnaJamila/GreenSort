// src/pages/rekening/tambahRekeningView.js
import "../../assets/styles/rekening.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";
import { getBankList } from "../../models/authModel";

export default class TambahRekeningView {
    constructor() {
        this.app = document.getElementById("content");
        this.sidebarView = new SidebarView();
        this.isMobile = window.matchMedia("(max-width: 768px)").matches;
        this.sidebarCollapsed = false;
        this.eventListeners = [];
    }

    render() {
        this.sidebarView.render();
        this.renderMainContent();
        this.populateBankDropdown();
        this.setupEventListeners();
        this.checkMobileView();
    }

    renderMainContent() {
        this.app.innerHTML = `
        <button id="mobile-menu-toggle" class="mobile-menu-btn">
            <i class="bi bi-list"></i>
        </button>
        <div class="sidebar-overlay"></div>
        
        <div class="main-content ${this.isMobile ? 'full-width' : ''} ${this.sidebarCollapsed ? 'collapsed' : ''}">
            <header>
                <div class="header-content">
                    <div class="dashboard-header">
                        <h2>Tambah Rekening</h2>
                        <p class="text-dark mb-4">Masukkan data rekening baru ke sistem.</p>
                    </div>
                    
                    <div class="user-profile">
                        <img id="user-avatar" src="${userPlaceholder}" alt="User">
                        <span id="user-name">Loading...</span>
                    </div>
                </div>
            </header>

            <div class="rekening-section">
                <div class="form-section">
                    <form id="form-tambah-rekening" class="form">
                        <div class="form-group">
                            <label for="nama-pemilik">Nama Pemilik</label>
                            <input type="text" id="nama-pemilik" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="no-rekening">Nomor Rekening</label>
                            <input type="text" id="no-rekening" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="bank">Bank</label>
                            <select id="bank" class="form-control" required>
                                <option value="">Memuat daftar bank...</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">Simpan</button>
                            <button type="button" id="btn-kembali" class="btn btn-secondary">Kembali</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        `;
    }

    async populateBankDropdown() {
    const select = document.getElementById("bank");
    try {
        const banks = await getBankList();

        select.innerHTML = `<option value="">-- Pilih Bank --</option>`;
        banks.forEach(bank => {
        const option = document.createElement("option");
        option.value = bank.nama;
        option.textContent = `${bank.nama} (${bank.kode})`;
        select.appendChild(option);
        });
    } catch (err) {
        select.innerHTML = `<option value="">Gagal memuat bank</option>`;
    }
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

        // Sidebar overlay click
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            const handler = () => this.toggleSidebar(false);
            overlay.addEventListener('click', handler);
            this.eventListeners.push({ element: overlay, type: 'click', handler });
        }

        // Window resize
        const resizeHandler = () => this.handleResize();
        window.addEventListener('resize', resizeHandler);
        this.eventListeners.push({ element: window, type: 'resize', handler: resizeHandler });
    }

    toggleSidebar(show = null) {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        const mainContent = document.querySelector('.main-content');
        
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

    displayUserInfo(user) {
        const userNameElement = document.getElementById("user-name");
        if (userNameElement && user) {
            userNameElement.textContent = user.name || user.username;
        }
    }

    removeEventListeners() {
        this.eventListeners.forEach(({ element, type, handler }) => {
            element.removeEventListener(type, handler);
        });
        this.eventListeners = [];
    }

    bindFormSubmit(handler) {
    const form = document.getElementById("form-tambah-rekening");

    if (form) {
        const formHandler = (e) => {
            e.preventDefault();

            const namaPemilik = document.getElementById("nama-pemilik")?.value.trim();
            const noRekening = document.getElementById("no-rekening")?.value.trim();
            const bank = document.getElementById("bank")?.value;
            const data = {
                namaPemilik,
                noRekening,
                bank,
            };

            handler(data);
        };

        form.addEventListener("submit", formHandler);
        this.eventListeners.push({ element: form, type: 'submit', handler: formHandler });
    } else {
        console.error("❌ Form tidak ditemukan!");
    }
}

    bindBackButton(handler) {
        const btn = document.getElementById("btn-kembali");
        if (btn) {
            const clickHandler = handler;
            btn.addEventListener("click", clickHandler);
            this.eventListeners.push({ element: btn, type: 'click', handler: clickHandler });
        }
    }

    destroy() {
        this.removeEventListeners();
    }
}