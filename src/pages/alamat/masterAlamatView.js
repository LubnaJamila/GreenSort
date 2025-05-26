//src/pages/alamat/masterAlamatView.js
import "../../assets/styles/content.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class MasterAlamatView {
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
                            <h2>Data Master - Alamat</h2>
                            <p class="text-dark mb-4">Input Alamat Pengiriman</p>
                        </div>
                        <div class="user-profile">
                            <img id="user-avatar" src="${userPlaceholder}" alt="User">
                            <span id="user-name">Loading...</span>
                        </div>
                    </div>
                    <div class="table-actions">
                        <a href="#/master-alamat/tambah" class="classify-btn" data-route="tambahAlamat">
                            <i class="bi bi-plus-circle"></i>
                            <span class="nav-text">Tambah Alamat</span>
                        </a>
                    </div>
                </header>

                <div class="content-section">
                    <div class="content-header">
                        <h3>Daftar Alamat</h3>
                    </div>

                    <div class="table-responsive">
                        <table id="alamat-datatable" class="table table-striped" style="width:100%">
                            <thead>
                                <tr>
                                    <th>Nama Pemilik</th>
                                    <th>Alamat Lengkap</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody id="alamat-table-body"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        this.initDataTable();
        this.setupEventListeners();
        this.renderAlamatData();
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

    bindAddAlamat(handler) {
        // Mendapatkan tombol tambah alamat
        const tambahBtn = document.querySelector('[data-route="tambahAlamat"]');
        // Jika tombol ada
        if (tambahBtn) {
            // Definisikan fungsi handler untuk klik
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
            console.warn("Button Tambah Alamat tidak ditemukan di DOM");
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

    renderAlamatData() {
        const alamatData = [
            { id: 1, namaPemilik: "John Doe", alamatLengkap: "Jl. Merdeka No. 123, Jakarta Pusat, DKI Jakarta 10110" },
            { id: 2, namaPemilik: "Jane Smith", alamatLengkap: "Jl. Sudirman No. 456, Bandung, Jawa Barat 40123" },
            { id: 3, namaPemilik: "Robert Johnson", alamatLengkap: "Jl. Malioboro No. 789, Yogyakarta, DIY 55213" },
            { id: 4, namaPemilik: "Sarah Wilson", alamatLengkap: "Jl. Diponegoro No. 321, Surabaya, Jawa Timur 60234" }
        ];
        this.renderAlamatTable(alamatData);
    }

    renderAlamatTable(alamatData) {
        const tableBody = document.getElementById("alamat-table-body");
        if (!tableBody) return;
        const tableHTML = alamatData.map(alamat => this.renderAlamatRow(alamat)).join('');
        tableBody.innerHTML = tableHTML;
    }

    renderAlamatRow(alamat) {
        return `
            <tr>
                <td>${alamat.namaPemilik}</td>
                <td>${alamat.alamatLengkap}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${alamat.id}">
                            <i class="bi bi-pencil"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${alamat.id}">
                            <i class="bi bi-trash"></i> Hapus
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    initDataTable() {
        if ($.fn.DataTable.isDataTable('#alamat-datatable')) {
            $('#alamat-datatable').DataTable().destroy();
        }

        $(document).ready(() => {
            $('#alamat-datatable').DataTable({
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
        console.log("Destroying MasterAlamatView");
        this.removeEventListeners();

        if ($.fn.DataTable.isDataTable('#alamat-datatable')) {
            $('#alamat-datatable').DataTable().destroy();
        }

        if (this.sidebarView && this.sidebarView.destroy) {
            this.sidebarView.destroy();
        }
    }
}