//src/pages/dashboard-user/penjemputanView.js
import "../../assets/styles/sidebar.css";
import "../../assets/styles/dashboard.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class PenjemputanView {
    constructor() {
        this.app = document.getElementById("content");
        this.sidebar = new SidebarView();
        this.eventListeners = [];
        this.isMobile = window.matchMedia("(max-width: 768px)").matches;
        this.sidebarCollapsed = false;
        this.currentFilter = 'all';
        this.applicationsData = [];
        this.dataTable = null;
        this.statsData = {
            dijemput: 0,
            diantar: 0,
            total: 0
        };
    }
    
    render() {
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
                <!-- Header Section -->
                <header>
                    <div class="header-section">
                        <div class="dashboard-title">
                            <div class="title-content">
                                <h1>Dashboard Penjemputan</h1>
                                <p>Kelola status penjemputan sampah Anda secara real-time.</p>
                            </div>
                            <div class="user-profile">
                                <img id="user-avatar" src="${userPlaceholder}" alt="User">
                                <span id="user-name">Loading...</span>
                            </div>
                        </div>
            
                        <!-- Stats Grid -->
                        <div class="stats-grid">
                            ${this.renderStatCard("80", "Menunggu Validasi", "bi-hourglass-split", "yellow-bg", "#/dashboardUser")}
                            ${this.renderStatCard("16", "Diterima", "bi-clipboard-check", "blue-bg", "#/diterima")}
                            ${this.renderStatCard("8", "Ditolak", "bi-x-circle", "red-bg", "#/ditolak")}
                            ${this.renderStatCard("24", "Penjemputan", "bi-truck", "orange-bg", "#/penjemputan")}
                            ${this.renderStatCard("42", "Selesai", "bi-check-circle", "green-bg", "#/selesaiUser")}
                        </div>
                    </div>
                </header>
                
                <!-- Data Section -->
                <div class="data-section">
                    <div class="section-header">
                        <h2 class="section-title">Data Penjemputan</h2>
                    </div>
            
                    <!-- Filter Tabs -->
                    <div class="filter-tabs">
                        <button class="filter-tab active" data-filter="all">
                            Semua <span class="badge bg-light text-dark ms-1" id="badge-all">0</span>
                        </button>
                        <button class="filter-tab" data-filter="dijemput">
                            Dijemput <span class="badge bg-light text-dark ms-1" id="badge-dijemput">0</span>
                        </button>
                        <button class="filter-tab" data-filter="diantar">
                            Diantar <span class="badge bg-light text-dark ms-1" id="badge-diantar">0</span>
                        </button>
                    </div>
            
                    <!-- Table Container -->
                    <div class="table-container">
                        <div class="table-responsive">
                            <table class="table table-striped" id="datatable" style="width:100%">
                                <thead>
                                    <tr>
                                        <th><input type="checkbox" id="select-all" class="form-check-input"></th>
                                        <th>Kategori Sampah</th>
                                        <th>Berat (kg)</th>
                                        <th>Harga (Rp/kg)</th>
                                        <th>Total Harga (Rp)</th>
                                        <th>Tanggal Penjemputan</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody id="applications-table-body">
                                    <!-- Dynamic content will be inserted here -->
                                </tbody>
                            </table>
                        </div>
                    </div>
            
                    <!-- Empty State -->
                    <div class="empty-state" id="empty-state" style="display: none;">
                        <i class="bi bi-inbox"></i>
                        <h4>Tidak ada data</h4>
                        <p>Belum ada penjemputan dengan status yang dipilih.</p>
                    </div>
                    
                    <!-- Loading State -->
                    <div class="loading-state" id="loading-state" style="display: none;">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p>Memuat data...</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderStatCard(number, label, icon, colorClass, link) {
        return `
            <div class="stat-card">
                <div class="stat-content">
                    <div class="stat-number">${number}</div>
                    <div class="stat-label">${label}</div>
                </div>
                <div class="stat-icon ${colorClass}">
                    <i class="bi ${icon}"></i>
                </div>
                <a href="${link}" class="stat-more" aria-label="View more ${label} items">
                <i class="bi bi-arrow-down"></i>
                </a>
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

        // Refresh button
        const refreshBtn = document.getElementById("refresh-btn");
        if (refreshBtn) {
            const handler = () => this.handleRefresh();
            refreshBtn.addEventListener("click", handler);
            this.eventListeners.push({ element: refreshBtn, type: "click", handler });
        }

        // Select all checkbox
        const selectAll = document.getElementById("select-all");
        if (selectAll) {
            const handler = (e) => this.toggleSelectAll(e.target.checked);
            selectAll.addEventListener("change", handler);
            this.eventListeners.push({ element: selectAll, type: "change", handler });
        }

        // Filter tabs
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            const handler = (e) => this.handleFilterTab(e);
            tab.addEventListener('click', handler);
            this.eventListeners.push({ element: tab, type: 'click', handler });
        });
    }

    handleFilterTab(e) {
        e.preventDefault();
        
        // Remove active class from all tabs
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        e.target.classList.add('active');
        
        // Get filter value and apply to DataTable
        const filter = e.target.dataset.filter;
        this.currentFilter = filter;
        this.applyDataTableFilter();
    }

    applyDataTableFilter() {
        if (!this.dataTable) return;
        
        if (this.currentFilter === 'all') {
            this.dataTable.search('').columns().search('').draw();
        } else {
            // Apply filter to status column (index 6)
            const statusText = this.getFilterStatusText(this.currentFilter);
            this.dataTable.column(6).search(statusText).draw();
        }
        
        this.checkEmptyState();
    }

    getFilterStatusText(filter) {
        const filterMap = {
            'dijemput': 'Dijemput',
            'diantar': 'Diantar'
        };
        return filterMap[filter] || '';
    }

    checkEmptyState() {
        setTimeout(() => {
            if (!this.dataTable) return;
            
            const visibleRows = this.dataTable.rows({ filter: 'applied' }).count();
            const emptyState = document.getElementById('empty-state');
            const tableContainer = document.querySelector('.table-container');
            
            if (visibleRows === 0) {
                emptyState.style.display = 'block';
                tableContainer.style.display = 'none';
            } else {
                emptyState.style.display = 'none';
                tableContainer.style.display = 'block';
            }
        }, 100);
    }

    showLoading(show = true) {
        const loadingState = document.getElementById('loading-state');
        const tableContainer = document.querySelector('.table-container');
        const emptyState = document.getElementById('empty-state');
        
        if (show) {
            loadingState.style.display = 'block';
            tableContainer.style.display = 'none';
            emptyState.style.display = 'none';
        } else {
            loadingState.style.display = 'none';
            tableContainer.style.display = 'block';
        }
    }

    renderApplicationsTable(applicationsData) {
        this.applicationsData = applicationsData || [];
        this.showLoading(false);
        
        const tableBody = document.getElementById("applications-table-body");
        if (!tableBody) return;

        const tableHTML = this.applicationsData
            .map((app) => this.renderApplicationRow(app))
            .join("");
        tableBody.innerHTML = tableHTML;

        this.updateStats();
        this.updateTabBadges();
        this.initDataTable();
    }

    renderApplicationRow(app) {
        const formattedDate = this.formatDate(app.date || app.tanggal || new Date());
        const formattedPrice = this.formatCurrency(app.price || 0);
        const formattedTotalPrice = this.formatCurrency(app.totalPrice || 0);

        return `
        <tr>
            <td>${app.category || app.jenisSampah || app.kategori || 'N/A'}</td>
            <td>${app.weight || app.berat || 0}</td>
            <td>${formattedPrice}</td>
            <td>${formattedTotalPrice}</td>
            <td>${formattedDate}</td>
            <td>
                <button class="btn btn-primary btn-sm detail-btn" data-id="${app.id}">
                    <i class="bi bi-eye"></i> Detail
                </button>
            </td>
        </tr>
        `;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount).replace('Rp', 'Rp ');
    }

    normalizeStatus(status) {
        const statusMap = {
            'shipped': 'dijemput',
            'completed': 'diantar',
            'Dikirim': 'dijemput',
            'Selesai': 'diantar'
        };
        return statusMap[status] || status;
    }

    getStatusStyles(status) {
        const statusMap = {
            'dijemput': { 
                class: 'status-shipped', 
                icon: 'bi-truck', 
                label: 'Dijemput' 
            },
            'diantar': { 
                class: 'status-completed', 
                icon: 'bi-check-circle', 
                label: 'Diantar' 
            }
        };

        return statusMap[status] || { 
            class: 'status-pending', 
            icon: 'bi-hourglass-split', 
            label: status || 'Unknown' 
        };
    }

    formatDate(date) {
        if (!date) return 'N/A';
        
        const d = new Date(date);
        if (isNaN(d.getTime())) return 'N/A';
        
        return d.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    initDataTable() {
        if (this.dataTable) {
            this.dataTable.destroy();
        }

        if (typeof $ === 'undefined' || typeof $.fn.DataTable === 'undefined') {
            console.error('jQuery DataTables is not loaded');
            return;
        }

        try {
            this.dataTable = $("#datatable").DataTable({
                responsive: true,
                pageLength: 10,
                lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Semua"]],
                language: {
                    search: "Cari:",
                    lengthMenu: "Tampilkan _MENU_ data per halaman",
                    info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
                    infoEmpty: "Menampilkan 0 sampai 0 dari 0 data",
                    infoFiltered: "(difilter dari _MAX_ total data)",
                    paginate: {
                        first: "<<",
                        last: ">>",
                        next: ">",
                        previous: "<",
                    },
                    emptyTable: "Tidak ada data tersedia",
                    zeroRecords: "Tidak ada data yang cocok dengan pencarian"
                },
                columnDefs: [
                    { orderable: false, targets: [5] }, // Action column
                    { 
                        type: 'currency', 
                        targets: [2, 3] // Harga dan Total Harga columns
                    },
                    { 
                        type: 'date', 
                        targets: [4], // Tanggal column
                        render: function(data) {
                            return new Date(data).toLocaleDateString('id-ID');
                        }
                    }
                ],
                order: [[4, 'desc']], // Sort by tanggal column (newest first)
                drawCallback: () => {
                    this.setupRowEventListeners();
                    this.checkEmptyState();
                }
            });

            setTimeout(() => {
                this.applyDataTableFilter();
            }, 100);

        } catch (error) {
            console.error('Error initializing DataTable:', error);
        }
    }


    setupRowEventListeners() {
        // Detail button event listeners
        const detailBtns = document.querySelectorAll('.detail-btn');
        detailBtns.forEach(btn => {
            // Remove existing listeners to prevent duplicates
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleDetailClick(e);
            });
        });

        // Row checkbox event listeners
        const rowCheckboxes = document.querySelectorAll('.row-checkbox');
        rowCheckboxes.forEach(checkbox => {
            const newCheckbox = checkbox.cloneNode(true);
            checkbox.parentNode.replaceChild(newCheckbox, checkbox);
            
            newCheckbox.addEventListener('change', () => this.updateSelectAllState());
        });
    }

    handleDetailClick(e) {
        const id = e.target.closest('.detail-btn').dataset.id;
        console.log('Detail clicked for ID:', id);
        
        // Dispatch custom event for detail view
        const event = new CustomEvent('show-application-detail', { 
            detail: { id: id } 
        });
        document.dispatchEvent(event);
    }

    updateStats() {
        if (!this.applicationsData) return;

        this.statsData = {
            total: this.applicationsData.length,
            dijemput: this.applicationsData.filter(item => 
                this.normalizeStatus(item.status) === 'dijemput'
            ).length,
            diantar: this.applicationsData.filter(item => 
                this.normalizeStatus(item.status) === 'diantar'
            ).length
        };

        // Update stat cards
        const totalStat = document.getElementById('stat-total-penjemputan');
        const dijemputStat = document.getElementById('stat-dijemput');
        const diantarStat = document.getElementById('stat-diantar');

        if (totalStat) totalStat.textContent = this.statsData.total;
        if (dijemputStat) dijemputStat.textContent = this.statsData.dijemput;
        if (diantarStat) diantarStat.textContent = this.statsData.diantar;
    }

    updateTabBadges() {
        if (!this.applicationsData) return;

        const counts = {
            all: this.applicationsData.length,
            dijemput: this.applicationsData.filter(item => 
                this.normalizeStatus(item.status) === 'dijemput'
            ).length,
            diantar: this.applicationsData.filter(item => 
                this.normalizeStatus(item.status) === 'diantar'
            ).length
        };

        // Update tab badges
        Object.keys(counts).forEach(status => {
            const badge = document.getElementById(`badge-${status}`);
            if (badge) badge.textContent = counts[status];
        });
    }

    updateSelectAllState() {
        const selectAll = document.getElementById('select-all');
        const checkboxes = document.querySelectorAll('.row-checkbox');
        const visibleCheckboxes = Array.from(checkboxes).filter(cb => 
            cb.closest('tr').style.display !== 'none'
        );
        const checkedBoxes = visibleCheckboxes.filter(cb => cb.checked);
        
        if (selectAll && visibleCheckboxes.length > 0) {
            selectAll.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < visibleCheckboxes.length;
            selectAll.checked = checkedBoxes.length === visibleCheckboxes.length;
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

    toggleSelectAll(checked) {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        const visibleCheckboxes = Array.from(checkboxes).filter(cb => 
            cb.closest('tr').style.display !== 'none'
        );
        
        visibleCheckboxes.forEach((checkbox) => {
            checkbox.checked = checked;
        });
    }

    handleRefresh() {
        const event = new CustomEvent("dashboard-refresh");
        document.dispatchEvent(event);
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

    renderDashboardData(applicationsData) {
        this.renderApplicationsTable(applicationsData);
    }

    getSelectedApplications() {
        const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
        return Array.from(checkedBoxes).map(checkbox => checkbox.value);
    }

    clearSelection() {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        const selectAll = document.getElementById('select-all');
        
        checkboxes.forEach(checkbox => checkbox.checked = false);
        if (selectAll) {
            selectAll.checked = false;
            selectAll.indeterminate = false;
        }
    }

    setFilter(filter) {
        const tab = document.querySelector(`[data-filter="${filter}"]`);
        if (tab) {
            tab.click();
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
        if (this.dataTable) {
            this.dataTable.destroy();
            this.dataTable = null;
        }
    }
}