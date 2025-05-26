// src/pages/dashboard-admin/penawaranView.js
import "../../assets/styles/sidebar.css";
import "../../assets/styles/dashboard.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class PenawaranView {
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
              <h2>Penawaran</h2>
              <p class="text-dark mb-4">Kelola dan pantau semua penawaran harga sampah.</p>
            </div>
            
            <div class="user-profile">
              <img id="user-avatar" src="${userPlaceholder}" alt="User">
              <span id="user-name">Loading...</span>
            </div>
          </div>

          <div class="stats-grid">
            ${this.renderStatCard("80", "Semua", "bi-hourglass-split", "yellow-bg", "#/dashboard")}
            ${this.renderStatCard("16", "Pengajuan", "bi-clipboard-check", "blue-bg", "#/pengajuan")}
            ${this.renderStatCard("8", "Penawaran", "bi-x-circle", "red-bg", "#/penawaran")}
            ${this.renderStatCard("24", "Pengiriman", "bi-truck", "orange-bg", "#/pengiriman")}
            ${this.renderStatCard("42", "Selesai", "bi-check-circle", "green-bg", "#/selesai")}
          </div>
        </header>

        <div class="data-section">
          <div class="data-header">
            <h3>Data Penawaran</h3>
            <div class="table-actions">
              <button id="refresh-btn" class="btn btn-sm btn-outline-secondary">
                <i class="bi bi-arrow-clockwise"></i> Refresh
              </button>
            </div>
          </div>

          <div class="table-responsive">
            <table id="datatable" class="table table-striped" style="width:100%">
              <thead>
                <tr>
                  <th><input type="checkbox" id="select-all"></th>
                  <th>Nama</th>
                  <th>Kategori Sampah</th>
                  <th>Berat</th>
                  <th>Harga</th>
                  <th>Total Harga</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody id="offers-table-body">
                <!-- Dynamic content will be inserted here -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  renderStatCard(number, label, icon, colorClass, link = "#") {
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

    // Add offer button
    const addOfferBtn = document.getElementById("add-offer-btn");
    if (addOfferBtn) {
      const handler = () => this.handleAddOffer();
      addOfferBtn.addEventListener("click", handler);
      this.eventListeners.push({ element: addOfferBtn, type: "click", handler });
    }

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
      '#offers-table-body input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = checked;
    });
  }

  handleAddOffer() {
    // Dispatch custom event for adding new offer
    const event = new CustomEvent("add-offer");
    document.dispatchEvent(event);
  }

  handleRefresh() {
    // Dispatch custom event for refreshing offers data
    const event = new CustomEvent("penawaran-refresh");
    document.dispatchEvent(event);
  }

  handleEditOffer(offerId) {
    // Dispatch custom event for editing offer
    const event = new CustomEvent("edit-offer", { detail: { offerId } });
    document.dispatchEvent(event);
  }

  handleDeleteOffer(offerId) {
    if (confirm("Apakah Anda yakin ingin menghapus penawaran ini?")) {
      // Dispatch custom event for deleting offer
      const event = new CustomEvent("delete-offer", { detail: { offerId } });
      document.dispatchEvent(event);
    }
  }

  handleApproveOffer(offerId) {
    // Dispatch custom event for approving offer
    const event = new CustomEvent("approve-offer", { detail: { offerId } });
    document.dispatchEvent(event);
  }

  handleRejectOffer(offerId) {
    if (confirm("Apakah Anda yakin ingin menolak penawaran ini?")) {
      // Dispatch custom event for rejecting offer
      const event = new CustomEvent("reject-offer", { detail: { offerId } });
      document.dispatchEvent(event);
    }
  }

  displayUserInfo(user) {
    const userNameElement = document.getElementById("user-name");
    if (userNameElement && user) {
      userNameElement.textContent = user.name || user.username;
    }
  }

  renderOffersTable(offersData) {
    const tableBody = document.getElementById("offers-table-body");
    if (!tableBody) return;

    const tableHTML = offersData
      .map((offer) => this.renderOfferRow(offer))
      .join("");
    tableBody.innerHTML = tableHTML;

    this.initDataTable();
    this.setupTableActions();
  }

  renderOfferRow(offer) {
    const { statusClass, statusText } = this.getStatusStyles(offer.status);
    const isExpired = new Date(offer.tanggalBerakhir) < new Date();
    
    //ini diperbaiki sesuai dengan data yang ada
    return `
      <tr ${isExpired ? 'class="table-warning"' : ''}>
        <td><input type="checkbox" class="row-checkbox" value="${offer.id}"></td>
        <td>${offer.id}</td>
        <td>${offer.jenisSampah}</td>
        <td>Rp ${offer.hargaPerKg.toLocaleString('id-ID')}</td>
        <td>${offer.beratMinimum} kg</td>
        <td>${this.formatDate(offer.tanggalBerlaku)}</td>
        <td>${this.formatDate(offer.tanggalBerakhir)}</td>
        <td>
          <span class="badge ${statusClass}">
            ${isExpired ? 'Kadaluarsa' : statusText}
          </span>
        </td>
        <td>
          <div class="btn-group btn-group-sm" role="group">
            <button class="btn btn-outline-primary btn-edit" data-offer-id="${offer.id}" title="Edit">
              <i class="bi bi-pencil"></i>
            </button>
            ${offer.status === 'Menunggu' ? `
              <button class="btn btn-outline-success btn-approve" data-offer-id="${offer.id}" title="Setujui">
                <i class="bi bi-check"></i>
              </button>
              <button class="btn btn-outline-danger btn-reject" data-offer-id="${offer.id}" title="Tolak">
                <i class="bi bi-x"></i>
              </button>
            ` : ''}
            <button class="btn btn-outline-danger btn-delete" data-offer-id="${offer.id}" title="Hapus">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  setupTableActions() {
    // Edit buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
      const handler = (e) => {
        const offerId = e.currentTarget.getAttribute('data-offer-id');
        this.handleEditOffer(offerId);
      };
      btn.addEventListener('click', handler);
      this.eventListeners.push({ element: btn, type: 'click', handler });
    });

    // Approve buttons
    document.querySelectorAll('.btn-approve').forEach(btn => {
      const handler = (e) => {
        const offerId = e.currentTarget.getAttribute('data-offer-id');
        this.handleApproveOffer(offerId);
      };
      btn.addEventListener('click', handler);
      this.eventListeners.push({ element: btn, type: 'click', handler });
    });

    // Reject buttons
    document.querySelectorAll('.btn-reject').forEach(btn => {
      const handler = (e) => {
        const offerId = e.currentTarget.getAttribute('data-offer-id');
        this.handleRejectOffer(offerId);
      };
      btn.addEventListener('click', handler);
      this.eventListeners.push({ element: btn, type: 'click', handler });
    });

    // Delete buttons
    document.querySelectorAll('.btn-delete').forEach(btn => {
      const handler = (e) => {
        const offerId = e.currentTarget.getAttribute('data-offer-id');
        this.handleDeleteOffer(offerId);
      };
      btn.addEventListener('click', handler);
      this.eventListeners.push({ element: btn, type: 'click', handler });
    });
  }

  getStatusStyles(status) {
    const statusMap = {
      'Menunggu': { class: 'bg-warning', text: 'Menunggu' },
      'Diterima': { class: 'bg-success', text: 'Diterima' },
      'Ditolak': { class: 'bg-danger', text: 'Ditolak' },
      'Aktif': { class: 'bg-info', text: 'Aktif' },
      'Tidak Aktif': { class: 'bg-secondary', text: 'Tidak Aktif' },
      default: { class: 'bg-light text-dark', text: 'Unknown' }
    };

    return statusMap[status] || statusMap.default;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  initDataTable() {
    if ($.fn.DataTable.isDataTable("#datatable")) {
      $("#datatable").DataTable().destroy();
    }

    $(document).ready(() => {
      $("#datatable").DataTable({
        responsive: true,
        order: [[1, 'desc']], // Sort by ID descending
        language: {
          search: "Cari:",
          lengthMenu: "Tampilkan _MENU_ penawaran per halaman",
          info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ penawaran",
          infoEmpty: "Tidak ada penawaran yang ditemukan",
          infoFiltered: "(difilter dari _MAX_ total penawaran)",
          zeroRecords: "Tidak ada penawaran yang cocok ditemukan",
          paginate: {
            first: "<<",
            last: ">>",
            next: ">",
            previous: "<",
          },
        },
      });
    });
  }

  updateStatistics(stats) {
    // Update stat cards with new data
    const statCards = document.querySelectorAll('.stat-number');
    if (statCards.length >= 5 && stats) {
      statCards[0].textContent = stats.total || '0';
      statCards[1].textContent = stats.menunggu || '0';
      statCards[2].textContent = stats.diterima || '0';
      statCards[3].textContent = stats.ditolak || '0';
      statCards[4].textContent = stats.kadaluarsa || '0';
    }
  }

  renderPenawaranData(offersData, stats = null) {
    this.renderOffersTable(offersData);
    if (stats) {
      this.updateStatistics(stats);
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