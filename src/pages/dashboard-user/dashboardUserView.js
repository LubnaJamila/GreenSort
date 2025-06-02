// src/pages/dashboard-user/dashboardUserView.js
import "../../assets/styles/sidebar.css";
import "../../assets/styles/dashboard.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class DashboardUserView {
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
      this.sidebarCollapsed ? "collapsed" : ""
    }">
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
            <h3>Data Pengajuan</h3>
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
    const userAvatar = document.getElementById("user-avatar");
    
    if (userNameElement && user) {
      userNameElement.textContent = user.name || user.username;
    }
    
    if (userAvatar && user && user.avatar) {
      userAvatar.src = user.avatar;
    }
  }

  renderApplicationsTable(applicationsData) {
    const tableBody = document.getElementById("applications-table-body");
    if (!tableBody) return;

    const tableHTML = applicationsData
      .map((app) => this.renderApplicationRow(app))
      .join("");
    tableBody.innerHTML = tableHTML;

    this.initDataTable();
    this.setupTableEventListeners();
  }

  renderApplicationRow(app) {
    const { statusClass, statusIcon } = this.getStatusStyles(app.status);

    return `
      <tr>
        <td><input type="checkbox" class="row-checkbox" value="${app.id}"></td>
        <td>${app.jenisSampah}</td>
        <td>${app.tanggalPembelian}</td>
        <td>${app.kuantitas} kg</td>
        <td>Rp ${this.formatCurrency(app.harga)}</td>
        <td>Rp ${this.formatCurrency(app.total)}</td>
        <td>
          <span class="badge ${statusClass}">
            <i class="bi ${statusIcon}"></i>
            ${app.status}
          </span>
        </td>
        <td>
          <div class="btn-group btn-group-sm" role="group">
            <button type="button" class="btn btn-outline-primary btn-sm view-btn" data-id="${app.id}" title="Lihat Detail">
              <i class="bi bi-eye"></i>
            </button>
            ${this.renderActionButtons(app)}
          </div>
        </td>
      </tr>
    `;
  }

  renderActionButtons(app) {
    let buttons = '';
    
    // Tombol edit hanya untuk status tertentu
    if (app.status === 'Menunggu Validasi' || app.status === 'Ditolak') {
      buttons += `
        <button type="button" class="btn btn-outline-warning btn-sm edit-btn" data-id="${app.id}" title="Edit">
          <i class="bi bi-pencil"></i>
        </button>
      `;
    }
    
    // Tombol hapus hanya untuk status tertentu
    if (app.status === 'Menunggu Validasi' || app.status === 'Ditolak') {
      buttons += `
        <button type="button" class="btn btn-outline-danger btn-sm delete-btn" data-id="${app.id}" title="Hapus">
          <i class="bi bi-trash"></i>
        </button>
      `;
    }
    
    return buttons;
  }

  setupTableEventListeners() {
    // Event listeners untuk tombol aksi di tabel
    const tableBody = document.getElementById("applications-table-body");
    if (!tableBody) return;

    // View button
    const viewButtons = tableBody.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
      const handler = (e) => this.handleViewApplication(e.target.closest('button').dataset.id);
      btn.addEventListener('click', handler);
      this.eventListeners.push({ element: btn, type: 'click', handler });
    });

    // Edit button
    const editButtons = tableBody.querySelectorAll('.edit-btn');
    editButtons.forEach(btn => {
      const handler = (e) => this.handleEditApplication(e.target.closest('button').dataset.id);
      btn.addEventListener('click', handler);
      this.eventListeners.push({ element: btn, type: 'click', handler });
    });

    // Delete button
    const deleteButtons = tableBody.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
      const handler = (e) => this.handleDeleteApplication(e.target.closest('button').dataset.id);
      btn.addEventListener('click', handler);
      this.eventListeners.push({ element: btn, type: 'click', handler });
    });
  }

  handleViewApplication(applicationId) {
    const event = new CustomEvent("view-application", { 
      detail: { applicationId } 
    });
    document.dispatchEvent(event);
  }

  handleEditApplication(applicationId) {
    const event = new CustomEvent("edit-application", { 
      detail: { applicationId } 
    });
    document.dispatchEvent(event);
  }

  handleDeleteApplication(applicationId) {
    if (confirm('Apakah Anda yakin ingin menghapus pengajuan ini?')) {
      const event = new CustomEvent("delete-application", { 
        detail: { applicationId } 
      });
      document.dispatchEvent(event);
    }
  }

  getStatusStyles(status) {
    const statusMap = {
      'Menunggu Validasi': { class: "bg-warning bg-opacity-10 text-warning", icon: "bi-hourglass-split" },
      'Diterima': { class: "bg-info bg-opacity-10 text-info", icon: "bi-clipboard-check" },
      'Ditolak': { class: "bg-danger bg-opacity-10 text-danger", icon: "bi-x-circle" },
      'Penjemputan': { class: "bg-primary bg-opacity-10 text-primary", icon: "bi-truck" },
      'Selesai': { class: "bg-success bg-opacity-10 text-success", icon: "bi-check-circle" },
      default: { class: "bg-light text-muted", icon: "bi-hourglass-split" },
    };

    return statusMap[status] || statusMap.default;
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID').format(amount);
  }

  initDataTable() {
    // Destroy existing DataTable if it exists
    if ($.fn.DataTable.isDataTable("#datatable")) {
      $("#datatable").DataTable().destroy();
    }

    // Initialize DataTable with Indonesian language
    $(document).ready(() => {
      $("#datatable").DataTable({
        responsive: true,
        order: [[2, 'desc']], // Sort by date column (index 2) descending
        columnDefs: [
          { orderable: false, targets: [0, 7] }, // Disable sorting for checkbox and actions columns
          { searchable: false, targets: [0, 7] }, // Disable search for checkbox and actions columns
        ],
        language: {
          search: "Cari:",
          lengthMenu: "Tampilkan _MENU_ data per halaman",
          info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
          infoEmpty: "Menampilkan 0 sampai 0 dari 0 data",
          infoFiltered: "(difilter dari _MAX_ total data)",
          loadingRecords: "Memuat...",
          processing: "Memproses...",
          emptyTable: "Tidak ada data yang tersedia",
          zeroRecords: "Tidak ditemukan data yang sesuai",
          paginate: {
            first: "<<",
            last: ">>",
            next: ">",
            previous: "<",
          },
        },
        pageLength: 10,
        lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
      });
    });
  }

  updateStatCards(stats) {
    // Update stat numbers if stats object is provided
    if (!stats) return;
    
    const statCards = document.querySelectorAll('.stat-number');
    if (statCards.length >= 5) {
      statCards[0].textContent = stats.menungguValidasi || '0';
      statCards[1].textContent = stats.diterima || '0';
      statCards[2].textContent = stats.ditolak || '0';
      statCards[3].textContent = stats.penjemputan || '0';
      statCards[4].textContent = stats.selesai || '0';
    }
  }

  renderDashboardData(applicationsData, stats = null) {
    this.renderApplicationsTable(applicationsData);
    this.updateStatCards(stats);
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