// src/views/rekeningView.js
import "../assets/styles/dashboard.css";
import userPlaceholder from "../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "./sidebarView";

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
            <!-- Header -->
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
            </header>

            <!-- Data Rekening Section -->
            <div class="data-section">
                <div class="data-header">
                    <h3>Daftar Rekening</h3>
                    <div class="table-actions">
                        <button style="cursor: pointer;" class="btn btn-sm btn-outline-primary" id="tambahRekeningBtn">Tambah Rekening</button>
                    </div>
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
                        <tbody id="rekening-table-body">
                            <!-- Data rows will be inserted here -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        `;


        // Setup event listeners after rendering
        this.initDataTable();
        this.setupEventListeners();
        this.renderRekeningData();
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

        // Search input
        const searchInput = document.getElementById("search-input");
        if (searchInput) {
            const searchHandler = (e) => this.handleSearch(e.target.value);
            searchInput.addEventListener("input", searchHandler);
            this.eventListeners.push({ element: searchInput, type: "input", handler: searchHandler });
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

    renderRekeningData() {
        const rekeningData = [
            {
                id: 1,
                namaPemilik: "John Doe",
                noRekening: "1234567890",
                bank: "BCA",
            },
            {
                id: 2,
                namaPemilik: "Jane Smith", 
                noRekening: "0987654321",
                bank: "Mandiri",
            },
            {
                id: 3,
                namaPemilik: "Robert Johnson",
                noRekening: "1122334455",
                bank: "BRI",
            },
            {
                id: 4,
                namaPemilik: "Sarah Wilson",
                noRekening: "5566778899",
                bank: "BNI",
            }
        ];

        this.renderRekeningTable(rekeningData);
    }

    renderRekeningTable(rekeningData) {
        const tableBody = document.getElementById("rekening-table-body");
        if (!tableBody) return;

        const tableHTML = rekeningData.map(rekening => this.renderRekeningRow(rekening)).join('');
        tableBody.innerHTML = tableHTML;
    }

    renderRekeningRow(rekening) {
        return `
        <tr>
            <td>${rekening.namaPemilik}</td>
            <td>${rekening.noRekening}</td>
            <td>${rekening.bank}</td>
            <td>
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${rekening.id}">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${rekening.id}">
                        <i class="bi bi-trash"></i> Hapus
                    </button>
                </div>
            </td>
        </tr>
        `;
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

    bindAddRekening(handler) {
    const tambahBtn = document.getElementById('tambahRekeningBtn');
    if (tambahBtn) {
      tambahBtn.addEventListener('click', handler);
      this.eventListeners.push({ 
        element: tambahBtn, 
        type: 'click', 
        handler 
      });
    }
  }
}