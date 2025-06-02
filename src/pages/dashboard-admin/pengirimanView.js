// src/pages/dashboard-admin/pengirimanView.js
import "../../assets/styles/sidebar.css";
import "../../assets/styles/dashboard.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class PengirimanView {
    constructor() {
        this.app = document.getElementById("content");
        this.sidebar = new SidebarView();
        this.eventListeners = [];
        this.isMobile = window.matchMedia("(max-width: 768px)").matches;
        this.sidebarCollapsed = false;
        this.currentFilter = 'pending';
        this.applicationsData = [];
        this.dataTable = null;
    }

    render() {
        this.sidebar.render();
        this.renderMainContent();
        this.setupEventListeners();
        this.checkMobileView();
        this.initializeDefaultFilter(); 
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
                    <h1>Dashboard</h1>
                    <p>Ringkasan status pengiriman Anda secara real-time.</p>
                </div>
                <div class="user-profile">
                    <img id="user-avatar" src="${userPlaceholder}" alt="User">
                    <span id="user-name">Loading...</span>
                </div>
                </div>

                <!-- Stats Grid -->
                <div class="stats-grid">
                    ${this.renderStatCard("80", "Semua", "bi-hourglass-split", "yellow-bg", "#/dashboard")}
                    ${this.renderStatCard("16", "Pengajuan", "bi-clipboard-check", "blue-bg", "#/pengajuan")}
                    ${this.renderStatCard("8", "Penawaran", "bi-x-circle", "red-bg", "#/penawaran")}
                    ${this.renderStatCard("24", "Pengiriman", "bi-truck", "orange-bg", "#/pengiriman")}
                    ${this.renderStatCard("42", "Selesai", "bi-check-circle", "green-bg", "#/selesai")}
                </div>
            </div>
            </header>
            
            <!-- Data Section -->
            <div class="data-section">
            <div class="section-header">
                <h2 class="section-title">Data Pengiriman</h2>
            </div>

            <!-- Filter Tabs -->
            <div class="filter-tabs">
                <button class="filter-tab" data-filter="pending">
                Dijemput <span class="badge bg-light text-dark ms-1" id="badge-pending">0</span>
                </button>
                <button class="filter-tab" data-filter="accepted">
                Diantar <span class="badge bg-light text-dark ms-1" id="badge-accepted">0</span>
                </button>
            </div>

            <!-- Table Container -->
            <div class="table-container">
                <div class="table-responsive">
                <table class="table table-striped" id="datatable" style="width:100%">
                    <thead>
                    <tr>
                        <th><input type="checkbox" id="select-all" class="form-check-input"></th>
                        <th>Nama</th>
                        <th>Kategori Sampah</th>
                        <th>Berat</th>
                        <th>Harga</th>
                        <th>Total Harga</th>
                        <th>Alamat</th>
                        <th>Tanggal Penjemputan</th>
                        <th>Status</th>
                        <th>Aksi</th>
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
                <p>Belum ada Pengiriman dengan status yang dipilih.</p>
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

        const overlay = document.querySelector(".sidebar-overlay");
        if (overlay) {
        const handler = () => this.toggleSidebar(false);
        overlay.addEventListener("click", handler);
        this.eventListeners.push({ element: overlay, type: "click", handler });
        }

        const resizeHandler = () => this.handleResize();
        window.addEventListener("resize", resizeHandler);
        this.eventListeners.push({
        element: window,
        type: "resize",
        handler: resizeHandler,
        });

        const refreshBtn = document.getElementById("refresh-btn");
        if (refreshBtn) {
        const handler = () => this.handleRefresh();
        refreshBtn.addEventListener("click", handler);
        this.eventListeners.push({ element: refreshBtn, type: "click", handler });
        }

        const selectAll = document.getElementById("select-all");
        if (selectAll) {
        const handler = (e) => this.toggleSelectAll(e.target.checked);
        selectAll.addEventListener("change", handler);
        this.eventListeners.push({ element: selectAll, type: "change", handler });
        }

        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
        const handler = (e) => this.handleFilterTab(e);
        tab.addEventListener('click', handler);
        this.eventListeners.push({ element: tab, type: 'click', handler });
        });

        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
        const handler = () => this.handleStatCardClick(card);
        card.addEventListener('click', handler);
        this.eventListeners.push({ element: card, type: 'click', handler });
        });
    }

handleFilterTab(e) {
    e.preventDefault();
    
    // Remove active class from all tabs
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    
    // Add active class to clicked tab
    e.target.classList.add('active');
    
    // Update current filter
    const filter = e.target.dataset.filter;
    this.currentFilter = filter;
    
    console.log('Filter tab clicked:', filter);
    
    // Apply filter to DataTable
    this.applyDataTableFilter();
}

refreshData() {
    console.log('Refreshing table data...');
    if (this.applicationsData && this.applicationsData.length > 0) {
        this.renderApplicationsTable(this.applicationsData);
    }
}

    handleStatCardClick(card) {
        const status = card.dataset.status;
        if (status) {
        const tab = document.querySelector(`[data-filter="${status}"]`);
        if (tab) {
            tab.click();
        }
        }
    }

    applyDataTableFilter() {
    if (!this.dataTable) {
        console.log('DataTable not initialized, cannot apply filter');
        return;
    }

    try {
        // Clear previous search
        this.dataTable.search('').columns().search('');

        // Apply filter based on current filter
        if (this.currentFilter === 'pending') {
            // Filter for "Dijemput" status
            this.dataTable.column(8).search('^(pending|Dijemput)$', true, false);
        } else if (this.currentFilter === 'accepted') {
            // Filter for "Diantar" status  
            this.dataTable.column(8).search('^(accepted|Diantar)$', true, false);
        } else {
            // Show all data
            this.dataTable.column(8).search('');
        }

        this.dataTable.draw();
        console.log('Filter applied:', this.currentFilter);
    } catch (error) {
        console.error('Error applying DataTable filter:', error);
    }
}


    getFilterStatusLabel(filter) {
        const filterMap = {
        'pending': 'Dijemput',
        'accepted': 'Diantar'
        };
        return filterMap[filter] || '';
    }

    renderApplicationRow(app) {
        const { statusClass, statusIcon, statusLabel } = this.getStatusStyles(app.status);
        
        return `
        <tr>
            <td><input type="checkbox" class="form-check-input row-checkbox" value="${app.id}"></td>
            <td>${app.nama || app.name || 'N/A'}</td>
            <td>${app.kategoriSampah || app.category || 'N/A'}</td>
            <td>${app.berat || app.weight || 0} kg</td>
            <td>Rp ${(app.harga || 0).toLocaleString('id-ID')}</td>
            <td>Rp ${(app.totalHarga || 0).toLocaleString('id-ID')}</td>
            <td class="text-truncate" style="max-width: 150px;" title="${app.alamat || 'N/A'}">${app.alamat || 'N/A'}</td>
            <td>${app.tanggalPenjemputan || 'N/A'}</td>
            <td>
            <span class="badge ${statusClass}">
                <i class="bi ${statusIcon}"></i> ${statusLabel}
            </span>
            </td>
            <td>
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-sm btn-outline-primary detail-btn" data-id="${app.id}" title="Detail">
                <i class="bi bi-eye"></i>
                </button>
                <button type="button" class="btn btn-sm btn-success complete-btn" data-id="${app.id}" title="Selesai">
                <i class="bi bi-check-circle"></i>
                </button>
            </div>
            </td>
        </tr>
        `;
    }

    getStatusStyles(status) {
        const statusMap = {
        'pending': { 
            class: 'bg-warning text-dark', 
            icon: 'bi-hourglass-split', 
            label: 'Dijemput' 
        },
        'accepted': { 
            class: 'bg-info text-white', 
            icon: 'bi-truck', 
            label: 'Diantar' 
        },
        'rejected': { 
            class: 'bg-danger text-white', 
            icon: 'bi-x-circle', 
            label: 'Ditolak' 
        },
        'shipped': { 
            class: 'bg-primary text-white', 
            icon: 'bi-truck', 
            label: 'Dikirim' 
        },
        'completed': { 
            class: 'bg-success text-white', 
            icon: 'bi-check-circle', 
            label: 'Selesai' 
        },
        'Dijemput': { 
            class: 'bg-warning text-dark', 
            icon: 'bi-hourglass-split', 
            label: 'Dijemput' 
        },
        'Diantar': { 
            class: 'bg-info text-white', 
            icon: 'bi-truck', 
            label: 'Diantar' 
        },
        'Ditolak': { 
            class: 'bg-danger text-white', 
            icon: 'bi-x-circle', 
            label: 'Ditolak' 
        },
        'Dikirim': { 
            class: 'bg-primary text-white', 
            icon: 'bi-truck', 
            label: 'Dikirim' 
        },
        'Selesai': { 
            class: 'bg-success text-white', 
            icon: 'bi-check-circle', 
            label: 'Selesai' 
        }
        };

        return statusMap[status] || { 
        class: 'bg-secondary text-white', 
        icon: 'bi-hourglass-split', 
        label: status || 'Unknown' 
        };
    }

    initDataTable() {
    // Wait for DOM to be ready
    if (!document.getElementById('datatable')) {
        setTimeout(() => this.initDataTable(), 100);
        return;
    }

    // Destroy existing DataTable if exists
    if ($.fn.DataTable.isDataTable("#datatable")) {
        $("#datatable").DataTable().destroy();
    }

    try {
        this.dataTable = $("#datatable").DataTable({
            responsive: true,
            pageLength: 10,
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
            order: [[7, 'desc']], // Sort by date column
            language: {
                search: "Cari:",
                lengthMenu: "Tampilkan _MENU_ data per halaman",
                info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
                infoEmpty: "Tidak ada data yang tersedia",
                infoFiltered: "(difilter dari _MAX_ total data)",
                zeroRecords: "Tidak ada data yang cocok",
                emptyTable: "Tidak ada data yang tersedia",
                paginate: {
                    first: "<<",
                    last: ">>",
                    next: ">",
                    previous: "<",
                },
            },
            columnDefs: [
                {
                    targets: [0, 9], // Checkbox and Action columns
                    orderable: false,
                    searchable: false
                },
                {
                    targets: [6], // Alamat column
                    render: function(data, type, row) {
                        if (type === 'display' && data && data.length > 30) {
                            return '<span title="' + data + '">' + data.substr(0, 30) + '...</span>';
                        }
                        return data || '';
                    }
                }
            ],
            drawCallback: () => {
                this.setupRowEventListeners();
                this.updateSelectAllState();
            }
        });

        // Apply current filter after DataTable is initialized
        setTimeout(() => {
            this.applyDataTableFilter();
        }, 100);

        console.log('DataTable initialized successfully');
    } catch (error) {
        console.error('Error initializing DataTable:', error);
    }
}


    initializeDefaultFilter() {
    // Set default tab aktif ke 'pending' (Dijemput)
    setTimeout(() => {
        const pendingTab = document.querySelector('[data-filter="pending"]');
        if (pendingTab) {
            // Remove active class from all tabs
            document.querySelectorAll('.filter-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Add active class to pending tab
            pendingTab.classList.add('active');
            
            // Set current filter
            this.currentFilter = 'pending';
            
            console.log('Default filter set to pending');
        }
    }, 200);
}

    setupRowEventListeners() {
        document.querySelectorAll('.detail-btn, .complete-btn, .row-checkbox').forEach(el => {
        const clone = el.cloneNode(true);
        el.parentNode.replaceChild(clone, el);
        });

        document.querySelectorAll('.detail-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleDetailClick(e));
        });

        document.querySelectorAll('.complete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleCompleteClick(e));
        });

        const rowCheckboxes = document.querySelectorAll('.row-checkbox');
        rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => this.updateSelectAllState());
        });
    }

    handleDetailClick(e) {
        const id = e.target.closest('.detail-btn').dataset.id;
        const event = new CustomEvent('show-application-detail', { 
        detail: { id: id } 
        });
        document.dispatchEvent(event);
    }

    handleCompleteClick(e) {
        const id = e.target.closest('.complete-btn').dataset.id;
        const event = new CustomEvent('complete-shipment', { 
        detail: { id: id } 
        });
        document.dispatchEvent(event);
    }

    updateTabBadges() {
    if (!this.applicationsData || !Array.isArray(this.applicationsData)) {
        console.warn('No applications data available for badge update');
        return;
    }

    const counts = {
        pending: this.applicationsData.filter(item => 
            item.status === 'pending' || item.status === 'Dijemput'
        ).length,
        accepted: this.applicationsData.filter(item => 
            item.status === 'accepted' || item.status === 'Diantar'
        ).length
    };

    console.log('Badge counts:', counts);

    const badgePending = document.getElementById('badge-pending');
    const badgeAccepted = document.getElementById('badge-accepted');
    
    if (badgePending) badgePending.textContent = counts.pending;
    if (badgeAccepted) badgeAccepted.textContent = counts.accepted;
}

    updateSelectAllState() {
        const selectAll = document.getElementById('select-all');
        const checkboxes = document.querySelectorAll('.row-checkbox');
        const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
        
        if (selectAll) {
        selectAll.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < checkboxes.length;
        selectAll.checked = checkboxes.length > 0 && checkedBoxes.length === checkboxes.length;
        }
    }

    toggleSidebar(show = null) {
        const sidebar = document.querySelector(".sidebar");
        const overlay = document.querySelector(".sidebar-overlay");
        const mainContent = document.querySelector(".main-content");

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
        checkboxes.forEach((checkbox) => {
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

    displayStatistics(stats) {
        const statAll = document.querySelector('.stat-card:nth-child(1) .stat-number');
        const statPending = document.querySelector('.stat-card:nth-child(2) .stat-number');
        const statAccepted = document.querySelector('.stat-card:nth-child(3) .stat-number');
        const statShipped = document.querySelector('.stat-card:nth-child(4) .stat-number');
        const statCompleted = document.querySelector('.stat-card:nth-child(5) .stat-number');
        
        if (statAll) statAll.textContent = stats.total || '0';
        if (statPending) statPending.textContent = stats.pending || '0';  
        if (statAccepted) statAccepted.textContent = stats.accepted || '0';
        if (statShipped) statShipped.textContent = stats.shipped || '0';
        if (statCompleted) statCompleted.textContent = stats.completed || '0';
    }

    displayApplications(applications) {
        this.renderApplicationsTable(applications);
    }

    renderApplicationsTable(applicationsData) {
    console.log('Rendering applications table with data:', applicationsData);
    
    this.applicationsData = applicationsData || [];
    
    const tableBody = document.getElementById("applications-table-body");
    if (!tableBody) {
        console.error('Table body element not found');
        return;
    }

    // Destroy existing DataTable first
    if ($.fn.DataTable.isDataTable("#datatable")) {
        $("#datatable").DataTable().destroy();
        this.dataTable = null;
    }

    // Clear table body
    tableBody.innerHTML = '';

    // Render data
    if (this.applicationsData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="10" class="text-center">Tidak ada data tersedia</td></tr>';
        this.showEmptyState(true);
    } else {
        const tableHTML = this.applicationsData
            .map((app) => this.renderApplicationRow(app))
            .join("");
        tableBody.innerHTML = tableHTML;
        this.showEmptyState(false);
    }

    // Update badges before initializing DataTable
    this.updateTabBadges();

    // Initialize DataTable after a short delay
    setTimeout(() => {
        this.initDataTable();
    }, 150);
}

    getFilteredData(filter = this.currentFilter) {
        if (!this.applicationsData) return [];
        
        return this.applicationsData.filter(item => {
        switch(filter) {
            case 'pending':
            return item.status === 'pending' || item.status === 'Dijemput';
            case 'accepted':
            return item.status === 'accepted' || item.status === 'Diantar';
            default:
            return true;
        }
        });
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
        if (selectAll) selectAll.checked = false;
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

    showError(message) {
        const toast = document.createElement('div');
        toast.className = 'toast position-fixed top-0 end-0 m-3 bg-danger text-white';
        toast.innerHTML = `
        <div class="toast-body">
            <i class="bi bi-exclamation-circle me-2"></i>
            ${message}
        </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
        }, 3000);
    }

    showSuccess(message) {
        const toast = document.createElement('div');
        toast.className = 'toast position-fixed top-0 end-0 m-3 bg-success text-white';
        toast.innerHTML = `
        <div class="toast-body">
            <i class="bi bi-check-circle me-2"></i>
            ${message}
        </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
        }, 3000);
    }

    bindAddPengiriman(handler) {
        this.addPengirimanHandler = handler;
    }

    bindFilterChange(handler) {
        this.filterChangeHandler = handler;
    }

    bindStatusUpdate(handler) {
        this.statusUpdateHandler = handler;
    }

    showEmptyState(show) {
    const emptyState = document.getElementById('empty-state');
    const tableContainer = document.querySelector('.table-container');
    
    if (emptyState && tableContainer) {
        if (show) {
            emptyState.style.display = 'block';
            tableContainer.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            tableContainer.style.display = 'block';
        }
    }
}

    ensureProperInitialization() {
        // Check if required elements exist
        const requiredElements = [
        'applications-table-body',
        'badge-pending', 
        'badge-accepted',
        'datatable'
        ];
        
        const missingElements = requiredElements.filter(id => !document.getElementById(id));
        
        if (missingElements.length > 0) {
        console.warn('Missing required elements:', missingElements);
        return false;
        }
        
        return true;
    }


    debugApplicationsData() {
        console.log('=== DEBUGGING APPLICATIONS DATA ===');
        console.log('Current applications count:', this.applicationsData?.length || 0);
        console.log('Applications data:', this.applicationsData);
        console.log('Current filter:', this.currentFilter);
        console.log('Table body exists:', !!document.getElementById('applications-table-body'));
        console.log('DataTable initialized:', !!this.dataTable);
    }

    destroy() {
        this.removeEventListeners();
        
        if (this.dataTable) {
        this.dataTable.destroy();
        this.dataTable = null;
        }
        
        if ($.fn.DataTable.isDataTable("#datatable")) {
        $("#datatable").DataTable().destroy();
        }
    }
}