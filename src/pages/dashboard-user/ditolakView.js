// src/pages/dashboard-user/ditolakView.js
import "../../assets/styles/sidebar.css";
import "../../assets/styles/dashboard.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class DitolakView {
    constructor() {
        this.app = document.getElementById("content");
        this.sidebar = new SidebarView();
        this.eventListeners = [];
        this.isMobile = window.matchMedia("(max-width: 768px)").matches;
        this.sidebarCollapsed = false;
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
                <header>
                    <div class="header-content">
                        <div class="dashboard-header">
                        <h2>Dashboard</h2>
                        <p class="text-dark mb-4">Ringkasan status pengajuan Anda secara real-time.</p>
                        </div>
                        
                        <div class="user-profile">
                        <img id="user-avatar" src="${userPlaceholder}" alt="User">
                        <span id="user-name">Loading...</span>
                        </div>
                    </div>
            
                    <div class="stats-grid">
                        ${this.renderStatCard("80", "Menunggu Validasi", "bi-hourglass-split", "yellow-bg", "#/dashboardUser")}
                        ${this.renderStatCard("16", "Diterima", "bi-clipboard-check", "blue-bg", "#/diterima")}
                        ${this.renderStatCard("8", "Ditolak", "bi-x-circle", "red-bg", "#/ditolak")}
                        ${this.renderStatCard("24", "Penjemputan", "bi-truck", "orange-bg", "#/penjemputan")}
                        ${this.renderStatCard("42", "Selesai", "bi-check-circle", "green-bg", "#/selesaiUser")}
                    </div>
                </header>
        
                <div class="data-section">
                    <div class="data-header">
                        <h3>Data Pengajuan Ditolak</h3>
                    </div>
            
                    <div class="table-responsive">
                        <table id="datatable" class="table table-striped" style="width:100%">
                        <thead>
                            <tr>
                            <th><input type="checkbox" id="select-all"></th>
                            <th>Jenis Sampah</th>
                            <th>Tanggal Pembelian</th>
                            <th>Berat</th>
                            <th>Harga</th>
                            <th>Total Harga</th>
                            <th>Status</th>
                            <th>Keterangan</th>
                            </tr>
                        </thead>
                        <tbody id="applications-table-body">
                            <!-- Dynamic content will be inserted here -->
                        </tbody>
                        </table>
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
        const checkboxes = document.querySelectorAll(
          '#applications-table-body input[type="checkbox"]'
        );
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
        if (userNameElement && user) {
          userNameElement.textContent = user.name || user.username;
        }
    }
    
    renderApplicationsTable(applicationsData) {
        const tableBody = document.getElementById("applications-table-body");
        if (!tableBody) return;
    
        // Filter hanya data yang ditolak
        const rejectedApplications = applicationsData.filter(app => 
            app.status === "Ditolak" || app.status === "ditolak"
        );
    
        const tableHTML = rejectedApplications
          .map((app) => this.renderApplicationRow(app))
          .join("");
        tableBody.innerHTML = tableHTML;
    
        this.initDataTable();
    }
    
    renderApplicationRow(app) {
        const { statusClass, statusIcon } = this.getStatusStyles(app.status);
    
        return `
          <tr>
            <td><input type="checkbox" class="row-checkbox" value="${app.id}"></td>
            <td>${app.jenisSampah || '-'}</td>
            <td>${app.tanggalPembelian || '-'}</td>
            <td>${app.kuantitas || app.berat || '-'}</td>
            <td>${app.harga || '-'}</td>
            <td>${app.total || '-'}</td>
            <td>
                <span class="badge ${statusClass}">
                    <i class="bi ${statusIcon}"></i> ${app.status}
                </span>
            </td>
            <td>
                <span class="text-muted small">${app.keterangan || app.reason || 'Tidak ada keterangan'}</span>
            </td>
          </tr>
        `;
    }
    
    getStatusStyles(status) {
        const statusMap = {
          Diterima: { class: "bg-info bg-opacity-10 text-info", icon: "bi-clipboard-check" },
          Ditolak: { class: "bg-danger bg-opacity-10 text-danger", icon: "bi-x-circle" },
          Dikirim: { class: "bg-warning bg-opacity-10 text-warning", icon: "bi-truck" },
          Penjemputan: { class: "bg-warning bg-opacity-10 text-warning", icon: "bi-truck" },
          Selesai: { class: "bg-success bg-opacity-10 text-success", icon: "bi-check-circle" },
          "Menunggu Validasi": { class: "bg-secondary bg-opacity-10 text-secondary", icon: "bi-hourglass-split" },
          default: { class: "bg-light text-muted", icon: "bi-hourglass-split" },
        };
    
        return {
            statusClass: statusMap[status]?.class || statusMap.default.class,
            statusIcon: statusMap[status]?.icon || statusMap.default.icon
        };
    }
    
    initDataTable() {
        // Destroy existing DataTable if it exists
        if ($.fn.DataTable.isDataTable("#datatable")) {
          $("#datatable").DataTable().destroy();
        }
    
        // Initialize DataTable with proper configuration
        $(document).ready(() => {
          $("#datatable").DataTable({
            responsive: true,
            pageLength: 10,
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
            order: [[2, 'desc']], // Sort by date column (index 2) descending
            columnDefs: [
                {
                    targets: 0, // Checkbox column
                    orderable: false,
                    searchable: false,
                    className: 'text-center'
                },
                {
                    targets: 6, // Status column
                    className: 'text-center'
                },
                {
                    targets: 7, // Keterangan column
                    className: 'text-wrap',
                    width: '200px'
                }
            ],
            language: {
              search: "Cari:",
              lengthMenu: "Tampilkan _MENU_ data per halaman",
              info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data ditolak",
              infoEmpty: "Tidak ada data ditolak",
              infoFiltered: "(difilter dari _MAX_ total data)",
              emptyTable: "Tidak ada pengajuan yang ditolak",
              zeroRecords: "Tidak ditemukan data yang sesuai",
              paginate: {
                first: "<<",
                last: ">>",
                next: ">",
                previous: "<",
              },
            },
            dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>' +
                 '<"row"<"col-sm-12"tr>>' +
                 '<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
          });
        });
    }
    
    renderDashboardData(applicationsData) {
        this.renderApplicationsTable(applicationsData);
    }
    
    // Method khusus untuk update data ditolak
    updateRejectedData(applicationsData) {
        this.renderApplicationsTable(applicationsData);
    }
    
    // Method untuk mendapatkan data yang dipilih
    getSelectedRows() {
        const selectedCheckboxes = document.querySelectorAll(
            '#applications-table-body input[type="checkbox"]:checked'
        );
        return Array.from(selectedCheckboxes).map(checkbox => checkbox.value);
    }
    
    // Method untuk clear selection
    clearSelection() {
        const selectAll = document.getElementById("select-all");
        const checkboxes = document.querySelectorAll(
            '#applications-table-body input[type="checkbox"]'
        );
        
        if (selectAll) selectAll.checked = false;
        checkboxes.forEach(checkbox => checkbox.checked = false);
    }
    
    // Method untuk show/hide loading state
    showLoading(show = true) {
        const tableBody = document.getElementById("applications-table-body");
        if (!tableBody) return;
        
        if (show) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-4">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <div class="mt-2">Memuat data...</div>
                    </td>
                </tr>
            `;
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
        if ($.fn.DataTable.isDataTable("#datatable")) {
          $("#datatable").DataTable().destroy();
        }
    }
}