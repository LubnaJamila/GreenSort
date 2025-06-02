// src/pages/dashboard-user/diterimaView.js
import "../../assets/styles/sidebar.css";
import "../../assets/styles/dashboard.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class DiterimaView {
    constructor() {
        this.app = document.getElementById("content");
        this.sidebar = new SidebarView();
        this.eventListeners = [];
        this.isMobile = window.matchMedia("(max-width: 768px)").matches;
        this.sidebarCollapsed = false;
        this.dataTable = null; // Store DataTable instance
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
                        <h3>Data Pengajuan Diterima</h3>
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
                                <th>Aksi</th>
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

    renderApplicationsTable(applicationsData) {
        const tableBody = document.getElementById("applications-table-body");
        if (!tableBody) return;

        // Filter only accepted applications
        const acceptedApplications = applicationsData.filter(app => 
            app.status === 'Diterima' || app.status === 'diterima' || app.status === 'accepted'
        );

        const tableHTML = acceptedApplications
            .map((app) => this.renderApplicationRow(app))
            .join("");
        tableBody.innerHTML = tableHTML;

        this.initDataTable();
    }
    
    renderApplicationRow(app) {
        // Format currency for Indonesian Rupiah
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
            }).format(amount);
        };

        return `
            <tr>
                <td><input type="checkbox" class="row-checkbox" value="${app.id}"></td>
                <td>${app.jenisSampah || '-'}</td>
                <td>${app.tanggalPembelian || '-'}</td>
                <td>${app.kuantitas || app.berat || '-'} kg</td>
                <td>${app.harga ? formatCurrency(app.harga) : '-'}</td>
                <td>${app.total ? formatCurrency(app.total) : '-'}</td>
                <td>
                    <div class="action-buttons">
                        <a href="#/form-ongkir" class="btn btn-success btn-sm me-1 action-accept" 
                        data-id="${app.id}" data-action="accept" title="Terima">
                            <i class="bi bi-check-circle"></i> Terima
                        </a>
                        <a href="#" class="btn btn-danger btn-sm action-reject" 
                        data-id="${app.id}" data-action="reject" title="Tolak">
                            <i class="bi bi-x-circle"></i> Tolak
                        </a>
                    </div>
                </td>
            </tr>
        `;
    }
    
    setupEventListeners() {
        // Listen for application actions
        document.addEventListener("application-action", this.handleApplicationAction.bind(this));
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
    
        // Select all checkbox - Enhanced with DataTable support
        const selectAll = document.getElementById("select-all");
        if (selectAll) {
            const handler = (e) => this.toggleSelectAll(e.target.checked);
            selectAll.addEventListener("change", handler);
            this.eventListeners.push({ element: selectAll, type: "change", handler });
        }
    }

    setupActionListeners() {
        // Delegated event listener untuk action buttons
        const tableBody = document.getElementById("applications-table-body");
        if (tableBody) {
            const actionHandler = (e) => {
                e.preventDefault();
                const target = e.target.closest('.action-accept, .action-reject');
                if (!target) return;
                
                const applicationId = target.dataset.id;
                const action = target.dataset.action;
                
                // Dispatch custom event untuk presenter
                const actionEvent = new CustomEvent("application-action", {
                    detail: { id: applicationId, action: action }
                });
                document.dispatchEvent(actionEvent);
            };
            
            tableBody.addEventListener("click", actionHandler);
            this.eventListeners.push({
                element: tableBody,
                type: "click",
                handler: actionHandler,
            });
        }
    }

    async handleApplicationAction(event) {
        const { id, action } = event.detail;
        
        try {
            if (action === 'accept') {
                await this.acceptApplication(id);
            } else if (action === 'reject') {
                await this.rejectApplication(id);
            }
        } catch (error) {
            console.error(`Error handling ${action} action:`, error);
            this.showError(`Gagal ${action === 'accept' ? 'menerima' : 'menolak'} pengajuan`);
        }
    }

    async acceptApplication(applicationId) {
        // Konfirmasi sebelum melakukan aksi
        if (!confirm('Apakah Anda yakin ingin menerima pengajuan ini?')) {
            return;
        }
        
        try {
            // Panggil method dari model untuk menerima pengajuan
            await this.diterimaModel.acceptApplication(applicationId);
            
            // Tampilkan pesan sukses
            this.showSuccess('Pengajuan berhasil diterima');
            
            // Refresh data
            await this.loadAcceptedApplications();
            
        } catch (error) {
            console.error('Error accepting application:', error);
            throw error;
        }
    }

    async rejectApplication(applicationId) {
        // Konfirmasi sebelum melakukan aksi
        const reason = prompt('Masukkan alasan penolakan (opsional):');
        if (reason === null) return; // User cancelled
        
        try {
            // Panggil method dari model untuk menolak pengajuan
            await this.diterimaModel.rejectApplication(applicationId, reason);
            
            // Tampilkan pesan sukses
            this.showSuccess('Pengajuan berhasil ditolak');
            
            // Refresh data
            await this.loadAcceptedApplications();
            
        } catch (error) {
            console.error('Error rejecting application:', error);
            throw error;
        }
    }

    showSuccess(message) {
        // Tampilkan notifikasi sukses (bisa menggunakan toast atau alert)
        // Untuk sementara gunakan alert, nanti bisa diganti dengan toast yang lebih baik
        alert(message);
        
        // Atau bisa menampilkan di dalam tabel sementara
        const tableBody = document.getElementById("applications-table-body");
        if (tableBody) {
            const successRow = document.createElement('tr');
            successRow.innerHTML = `
                <td colspan="7" class="text-center py-2 text-success">
                    <i class="bi bi-check-circle me-2"></i>
                    ${message}
                </td>
            `;
            tableBody.insertBefore(successRow, tableBody.firstChild);
            
            // Hapus pesan setelah 3 detik
            setTimeout(() => {
                successRow.remove();
            }, 3000);
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
        
        // Refresh DataTable on resize for responsive behavior
        if (this.dataTable) {
            this.dataTable.columns.adjust().responsive.recalc();
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
        // Handle both visible and paginated rows in DataTable
        if (this.dataTable) {
            // Get all checkboxes in the current page
            const visibleCheckboxes = document.querySelectorAll(
                '#applications-table-body input[type="checkbox"]:visible'
            );
            visibleCheckboxes.forEach((checkbox) => {
                checkbox.checked = checked;
            });
            
            // Also handle checkboxes in other pages if needed
            this.dataTable.rows().every(function() {
                const checkbox = this.node().querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = checked;
                }
            });
        } else {
            // Fallback for when DataTable is not initialized
            const checkboxes = document.querySelectorAll(
                '#applications-table-body input[type="checkbox"]'
            );
            checkboxes.forEach((checkbox) => {
                checkbox.checked = checked;
            });
        }
    }
    
    
    showLoadingState() {
        const tableBody = document.getElementById("applications-table-body");
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4">
                        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                        Memuat data...
                    </td>
                </tr>
            `;
        }
    }
    
    displayUserInfo(user) {
        const userNameElement = document.getElementById("user-name");
        const userAvatarElement = document.getElementById("user-avatar");
        
        if (userNameElement && user) {
            userNameElement.textContent = user.name || user.username;
        }
        
        // Update avatar if user has profile picture
        if (userAvatarElement && user && user.avatar) {
            userAvatarElement.src = user.avatar;
        }
    }
    
    getStatusStyles(status) {
        const statusMap = {
          Diterima: { class: "bg-info bg-opacity-10", icon: "bi-clipboard-check" },
          Ditolak: { class: "bg-danger bg-opacity-10", icon: "bi-x-circle" },
          Dikirim: { class: "bg-warning bg-opacity-10", icon: "bi-truck" },
          Selesai: { class: "bg-success bg-opacity-10", icon: "bi-check-circle" },
          default: { class: "bg-light", icon: "bi-hourglass-split" },
        };
    
        return statusMap[status] || statusMap.default;
    }
    
    initDataTable() {
        // Destroy existing DataTable if it exists
        if (this.dataTable) {
            this.dataTable.destroy();
            this.dataTable = null;
        }

        // Wait for DOM to be ready
        $(document).ready(() => {
            this.dataTable = $("#datatable").DataTable({
                responsive: true,
                pageLength: 10,
                lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Semua"]],
                order: [[2, 'desc']], // Sort by date column (index 2) descending
                columnDefs: [
                    {
                        targets: 0, // Checkbox column
                        orderable: false,
                        searchable: false,
                        responsivePriority: 1
                    },
                    {
                        targets: [3, 4, 5], // Numeric columns (Berat, Harga, Total)
                        className: 'text-end'
                    },
                    {
                        targets: 6, // Action column
                        orderable: false,
                        searchable: false,
                        responsivePriority: 2,
                        className: 'text-center'
                    }
                ],
                language: {
                    search: "Cari:",
                    lengthMenu: "Tampilkan _MENU_ data per halaman",
                    info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
                    infoEmpty: "Tidak ada data yang tersedia",
                    infoFiltered: "(difilter dari _MAX_ total data)",
                    emptyTable: "Tidak ada data pengajuan yang diterima",
                    zeroRecords: "Tidak ditemukan data yang sesuai",
                    paginate: {
                        first: "<<",
                        last: ">>",
                        next: ">",
                        previous: "<",
                    },
                },
                drawCallback: () => {
                    // Re-attach event listeners for checkboxes after table redraw
                    this.attachRowCheckboxListeners();
                }
            });
        });
    }
    
    attachRowCheckboxListeners() {
        // Add event listeners for individual row checkboxes
        const checkboxes = document.querySelectorAll('#applications-table-body input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateSelectAllState();
            });
        });
    }
    
    updateSelectAllState() {
        const selectAllCheckbox = document.getElementById('select-all');
        const rowCheckboxes = document.querySelectorAll('#applications-table-body input[type="checkbox"]:visible');
        
        if (selectAllCheckbox && rowCheckboxes.length > 0) {
            const checkedCount = Array.from(rowCheckboxes).filter(cb => cb.checked).length;
            
            if (checkedCount === 0) {
                selectAllCheckbox.indeterminate = false;
                selectAllCheckbox.checked = false;
            } else if (checkedCount === rowCheckboxes.length) {
                selectAllCheckbox.indeterminate = false;
                selectAllCheckbox.checked = true;
            } else {
                selectAllCheckbox.indeterminate = true;
            }
        }
    }
    
    getSelectedRows() {
        const selectedCheckboxes = document.querySelectorAll(
            '#applications-table-body input[type="checkbox"]:checked'
        );
        return Array.from(selectedCheckboxes).map(cb => cb.value);
    }
    
    refreshTable(applicationsData) {
        // Method to refresh table data without full re-render
        if (this.dataTable) {
            this.dataTable.clear();
            
            const acceptedApplications = applicationsData.filter(app => 
                app.status === 'Diterima' || app.status === 'diterima' || app.status === 'accepted'
            );
            
            acceptedApplications.forEach(app => {
                const formatCurrency = (amount) => {
                    return new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR'
                    }).format(amount);
                };
                
                const rowData = [
                    `<input type="checkbox" class="row-checkbox" value="${app.id}">`,
                    app.jenisSampah || '-',
                    app.tanggalPembelian || '-',
                    `${app.kuantitas || app.berat || '-'} kg`,
                    app.harga ? formatCurrency(app.harga) : '-',
                    app.total ? formatCurrency(app.total) : '-',
                    `<div class="action-buttons">
                        <a href="#" class="btn btn-success btn-sm me-1 action-accept" 
                        data-id="${app.id}" data-action="accept" title="Terima">
                            <i class="bi bi-check-circle"></i> Terima
                        </a>
                        <a href="#" class="btn btn-danger btn-sm action-reject" 
                        data-id="${app.id}" data-action="reject" title="Tolak">
                            <i class="bi bi-x-circle"></i> Tolak
                        </a>
                    </div>`
                ];
                this.dataTable.row.add(rowData);
            });
            
            this.dataTable.draw();
        } else {
            this.renderApplicationsTable(applicationsData);
        }
    }
    
    renderDashboardData(applicationsData) {
        this.renderApplicationsTable(applicationsData);
    }
    
    removeEventListeners() {
        this.eventListeners.forEach(({ element, type, handler }) => {
          element.removeEventListener(type, handler);
        });
        this.eventListeners = [];
    }
    
    destroy() {
        this.removeEventListeners();
        
        // Properly destroy DataTable
        if (this.dataTable) {
            this.dataTable.destroy();
            this.dataTable = null;
        }
        
        // Clean up sidebar
        if (this.sidebar) {
            this.sidebar.destroy();
        }
    }
}