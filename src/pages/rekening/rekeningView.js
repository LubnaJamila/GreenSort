//src/views/rekeningView.js
import "../../assets/styles/content.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class DataRekeningView {
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
                            <h2>Data Master - Rekening</h2>
                            <p class="text-dark mb-4">Kelola data rekening untuk sistem pembayaran.</p>
                        </div>
                        <div class="user-profile">
                            <img id="user-avatar" src="${userPlaceholder}" alt="User">
                            <span id="user-name">Loading...</span>
                        </div>
                    </div>
                    <div class="table-actions">
                        <a href="#/rekening/tambah" class="classify-btn" data-route="tambahRekeningBtn">
                            <i class="bi bi-plus-circle"></i>
                            <span class="nav-text">Tambah Rekening</span>
                        </a>
                    </div>
                </header>

                <div class="content-section">
                    <div class="content-header">
                        <h3>Daftar Rekening</h3>
                    </div>

                    <div class="table-responsive">
                        <table id="rekening-datatable" class="table table-striped" style="width:100%">
                            <thead>
                                <tr>
                                    <th>Nama Pemilik</th>
                                    <th>No Rekening</th>
                                    <th>Bank</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody id="rekening-table-body"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        this.initDataTable();
        this.setupEventListeners();
        // this.renderRekeningData();
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

        const searchInput = document.getElementById("search-input");
        if (searchInput) {
        const searchHandler = (e) => this.handleSearch(e.target.value);
        searchInput.addEventListener("input", searchHandler);
        this.eventListeners.push({ element: searchInput, type: "input", handler: searchHandler });
        }
    }

    bindAddRekening(handler) {
        const tambahBtn = document.querySelector('[data-route="tambahRekeningBtn"]');
        if (tambahBtn) {
        const clickHandler = (e) => {
            e.preventDefault();
            handler();
        };
        tambahBtn.addEventListener('click', clickHandler);
        this.eventListeners.push({
            element: tambahBtn,
            type: 'click',
            handler: clickHandler,
        });
        } else {
        console.warn("Button Tambah Rekening tidak ditemukan di DOM");
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

    displayUserInfo(user) {
        const userNameElement = document.getElementById("user-name");
        if (userNameElement && user) {
        userNameElement.textContent = user.name || user.username;
        }
    }

    renderRekeningTable(rekeningData) {
        const tableBody = document.getElementById("rekening-table-body");
        if (!tableBody) return;
        const tableHTML = rekeningData.map(rekening => this.renderRekeningRow(rekening)).join('');
        tableBody.innerHTML = tableHTML;
        this.setupActionButtons();
    }

    renderRekeningRow(rekening) {
        return `
        <tr>
            <td>${rekening.nama_pemilik}</td>
            <td>${rekening.no_rek}</td>
            <td>${rekening.nama_bank}</td>
            <td>
            <div class="btn-group" role="group">
                <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${rekening.id}">
                <i class="bi bi-pencil"></i> Edit
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${rekening.id_rekening}">
                <i class="bi bi-trash"></i> Hapus
                </button>
            </div>
            </td>
        </tr>
        `;
    }
    setupActionButtons() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
        const id = btn.dataset.id;

        const konfirmasi = confirm("Yakin ingin menghapus rekening ini?");
        if (!konfirmasi) return;

        // Kirim event ke presenter
        const event = new CustomEvent("delete-rekening", {
        detail: { id_rekening: id, targetRow: btn.closest("tr") }});
        document.dispatchEvent(event);
        });
    });
    }

    initDataTable() {
        if ($.fn.DataTable.isDataTable('#rekening-datatable')) {
        $('#rekening-datatable').DataTable().destroy();
        }

        $(document).ready(() => {
        $('#rekening-datatable').DataTable({
            responsive: true,
            language: {
            search: "Cari:",
            lengthMenu: "Tampilkan _MENU_ data per halaman",
            info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
            paginate: {
                first: "<<",
                last: ">>",
                next: ">",
                previous: "<"
            }
            }
        });
        });
    }

    handleSearch(searchTerm) {
        console.log("Search:", searchTerm);
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
        console.log("Destroying DataRekeningView");
        this.removeEventListeners();

        if ($.fn.DataTable.isDataTable('#rekening-datatable')) {
        $('#rekening-datatable').DataTable().destroy();
        }

        if (this.sidebarView && this.sidebarView.destroy) {
        this.sidebarView.destroy();
        }
    }
}
