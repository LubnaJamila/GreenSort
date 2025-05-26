// src/pages/dashboard-admin/pengajuanView.js
import "../../assets/styles/sidebar.css";
import "../../assets/styles/dashboard.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class DashboardPengajuanView {
  constructor() {
    this.app = document.getElementById("content");
    this.sidebar = new SidebarView();
    this.eventListeners = [];
    this.isMobile = window.matchMedia("(max-width: 768px)").matches;
    this.sidebarCollapsed = false;
    this.currentFilter = 'all';
    this.applicationsData = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
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
        <!-- Header Section -->
        <header>
          <div class="header-section">
            <div class="dashboard-title">
              <div class="title-content">
                <h1>Dashboard</h1>
                <p>Ringkasan status pengajuan Anda secara real-time.</p>
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
            <h2 class="section-title">Data Pengajuan</h2>
            <button id="refresh-btn" class="btn btn-outline-secondary btn-sm">
              <i class="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>

          <!-- Filter Tabs -->
          <div class="filter-tabs">
            <button class="filter-tab active" data-filter="all">
              Semua <span class="badge bg-light text-dark ms-1" id="badge-all">80</span>
            </button>
            <button class="filter-tab" data-filter="pending">
              Menunggu Validasi <span class="badge bg-light text-dark ms-1" id="badge-pending">16</span>
            </button>
            <button class="filter-tab" data-filter="accepted">
              Diterima <span class="badge bg-light text-dark ms-1" id="badge-accepted">8</span>
            </button>
            <button class="filter-tab" data-filter="rejected">
              Ditolak <span class="badge bg-light text-dark ms-1" id="badge-rejected">12</span>
            </button>
          </div>

          <!-- Table Container -->
          <div class="table-container">
            <div class="table-responsive">
              <table class="table" id="datatable">
                <thead>
                  <tr>
                    <th><input type="checkbox" id="select-all" class="form-check-input"></th>
                    <th>Nama</th>
                    <th>No HP</th>
                    <th>Kategori Sampah</th>
                    <th>Gambar</th>
                    <th>Berat</th>
                    <th>Status</th>
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
            <p>Belum ada pengajuan dengan status yang dipilih.</p>
          </div>

          <!-- Pagination -->
          <div class="pagination-container" id="pagination-container">
            <nav>
              <ul class="pagination" id="pagination-list">
                <!-- Pagination will be generated dynamically -->
              </ul>
            </nav>
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

    // Stat cards click handlers
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
    
    // Get filter value and render table
    const filter = e.target.dataset.filter;
    this.currentFilter = filter;
    this.currentPage = 1; // Reset to first page
    this.renderFilteredTable();
  }

  handleStatCardClick(card) {
    const status = card.dataset.status;
    if (status) {
      // Find corresponding tab and trigger click
      const tab = document.querySelector(`[data-filter="${status}"]`);
      if (tab) {
        tab.click();
      }
    }
  }

  renderFilteredTable() {
    const tableBody = document.getElementById('applications-table-body');
    const emptyState = document.getElementById('empty-state');
    
    if (!this.applicationsData || this.applicationsData.length === 0) {
      tableBody.innerHTML = '';
      emptyState.style.display = 'block';
      this.hidePagination();
      return;
    }

    // Filter data based on current filter
    let filteredData = this.currentFilter === 'all' 
      ? this.applicationsData 
      : this.applicationsData.filter(item => item.status === this.currentFilter);
    
    if (filteredData.length === 0) {
      tableBody.innerHTML = '';
      emptyState.style.display = 'block';
      this.hidePagination();
      return;
    }
    
    emptyState.style.display = 'none';
    
    // Implement pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    // Render table rows
    const tableHTML = paginatedData
      .map((app) => this.renderApplicationRow(app))
      .join("");
    tableBody.innerHTML = tableHTML;
    
    // Setup row event listeners
    this.setupRowEventListeners();
    
    // Render pagination
    this.renderPagination(filteredData.length);
  }

  renderApplicationRow(app) {
    const { statusClass, statusIcon, statusLabel } = this.getStatusStyles(app.status);

    //ini diperbaiki sesuai dengan data yang ada
    return `
      <tr>
        <td><input type="checkbox" class="form-check-input row-checkbox" value="${app.id}"></td>
        <td>${app.name || app.nama || 'N/A'}</td>
        <td>${app.phone || app.noHp || app.no_hp || 'N/A'}</td>
        <td>${app.category || app.jenisSampah || app.kategori || 'N/A'}</td>
        <td><img src="${app.image || app.imageUrl || 'https://via.placeholder.com/50'}" alt="Sampah" class="waste-img"></td>
        <td>${app.weight || app.berat || app.kuantitas || 0} kg</td>
        <td>
          <span class="status-badge ${statusClass}">
            <i class="bi ${statusIcon}"></i>
            ${statusLabel}
          </span>
        </td>
        <td>
          <button class="btn btn-primary action-btn btn-sm detail-btn" data-id="${app.id}">
            <i class="bi bi-eye"></i> Detail
          </button>
        </td>
      </tr>
    `;
  }

  getStatusStyles(status) {
    const statusMap = {
      'pending': { 
        class: 'pending', 
        icon: 'bi-hourglass-split', 
        label: 'Menunggu Validasi' 
      },
      'accepted': { 
        class: 'accepted', 
        icon: 'bi-clipboard-check', 
        label: 'Diterima' 
      },
      'rejected': { 
        class: 'rejected', 
        icon: 'bi-x-circle', 
        label: 'Ditolak' 
      },
      'shipped': { 
        class: 'shipped', 
        icon: 'bi-truck', 
        label: 'Dikirim' 
      },
      'completed': { 
        class: 'completed', 
        icon: 'bi-check-circle', 
        label: 'Selesai' 
      },
      'Diterima': { 
        class: 'accepted', 
        icon: 'bi-clipboard-check', 
        label: 'Diterima' 
      },
      'Ditolak': { 
        class: 'rejected', 
        icon: 'bi-x-circle', 
        label: 'Ditolak' 
      },
      'Dikirim': { 
        class: 'shipped', 
        icon: 'bi-truck', 
        label: 'Dikirim' 
      },
      'Selesai': { 
        class: 'completed', 
        icon: 'bi-check-circle', 
        label: 'Selesai' 
      }
    };

    return statusMap[status] || { 
      class: 'pending', 
      icon: 'bi-hourglass-split', 
      label: status || 'Unknown' 
    };
  }

  setupRowEventListeners() {
    // Detail button event listeners
    const detailBtns = document.querySelectorAll('.detail-btn');
    detailBtns.forEach(btn => {
      const handler = (e) => this.handleDetailClick(e);
      btn.addEventListener('click', handler);
      this.eventListeners.push({ element: btn, type: 'click', handler });
    });

    // Row checkbox event listeners
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    rowCheckboxes.forEach(checkbox => {
      const handler = () => this.updateSelectAllState();
      checkbox.addEventListener('change', handler);
      this.eventListeners.push({ element: checkbox, type: 'change', handler });
    });
  }

  handleDetailClick(e) {
    const id = e.target.closest('.detail-btn').dataset.id;
    // Dispatch custom event for detail view
    const event = new CustomEvent('show-application-detail', { 
      detail: { id: id } 
    });
    document.dispatchEvent(event);
  }

  renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    const paginationList = document.getElementById('pagination-list');
    const paginationContainer = document.getElementById('pagination-container');
    
    if (totalPages <= 1) {
      paginationContainer.style.display = 'none';
      return;
    }
    
    paginationContainer.style.display = 'flex';
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
      <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${this.currentPage - 1}">
          <i class="bi bi-chevron-left"></i>
        </a>
      </li>
    `;
    
    // Page numbers
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(totalPages, this.currentPage + 2);
    
    if (startPage > 1) {
      paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>`;
      if (startPage > 2) {
        paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
        <li class="page-item ${i === this.currentPage ? 'active' : ''}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>
      `;
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
      }
      paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>`;
    }
    
    // Next button
    paginationHTML += `
      <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${this.currentPage + 1}">
          <i class="bi bi-chevron-right"></i>
        </a>
      </li>
    `;
    
    paginationList.innerHTML = paginationHTML;
    
    // Add pagination event listeners
    const pageLinks = paginationList.querySelectorAll('a.page-link');
    pageLinks.forEach(link => {
      const handler = (e) => this.handlePaginationClick(e);
      link.addEventListener('click', handler);
      this.eventListeners.push({ element: link, type: 'click', handler });
    });
  }

  handlePaginationClick(e) {
    e.preventDefault();
    const page = parseInt(e.target.closest('a').dataset.page);
    if (page && page !== this.currentPage) {
      this.currentPage = page;
      this.renderFilteredTable();
    }
  }

  hidePagination() {
    const paginationContainer = document.getElementById('pagination-container');
    if (paginationContainer) {
      paginationContainer.style.display = 'none';
    }
  }

  updateTabBadges() {
    if (!this.applicationsData) return;

    const counts = {
      all: this.applicationsData.length,
      pending: this.applicationsData.filter(item => 
        item.status === 'pending' || item.status === 'Menunggu Validasi'
      ).length,
      accepted: this.applicationsData.filter(item => 
        item.status === 'accepted' || item.status === 'Diterima'
      ).length,
      rejected: this.applicationsData.filter(item => 
        item.status === 'rejected' || item.status === 'Ditolak'
      ).length,
      shipped: this.applicationsData.filter(item => 
        item.status === 'shipped' || item.status === 'Dikirim'
      ).length,
      completed: this.applicationsData.filter(item => 
        item.status === 'completed' || item.status === 'Selesai'
      ).length
    };

    // Update tab badges
    Object.keys(counts).forEach(status => {
      const badge = document.getElementById(`badge-${status}`);
      const stat = document.getElementById(`stat-${status}`);
      if (badge) badge.textContent = counts[status];
      if (stat) stat.textContent = counts[status];
    });
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

  renderApplicationsTable(applicationsData) {
    this.applicationsData = applicationsData || [];
    this.updateTabBadges();
    this.renderFilteredTable();
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

  destroy() {
    this.removeEventListeners();
  }
}