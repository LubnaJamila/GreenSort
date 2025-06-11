// src/pages/dashboard-admin/pengajuanView.js
import "../../assets/styles/sidebar.css";
import "../../assets/styles/dashboard.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class PengajuanView {
  
  constructor() {
    this.app = document.getElementById("content");
    this.sidebar = new SidebarView();
    this.eventListeners = [];
    this.isMobile = window.matchMedia("(max-width: 768px)").matches;
    this.sidebarCollapsed = false;
    this.currentFilter = 'pending'; 
    this.applicationsData = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
  }

  render() {
    this.sidebar.render();
    this.renderMainContent();
    this.setupEventListeners();
    this.checkMobileView();

    setTimeout(() => {
      const defaultTab = document.querySelector('[data-filter="pending"]');
      if (defaultTab) {
        defaultTab.classList.add('active');
      }
    }, 100);
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
              ${this.renderStatCard("0", "Semua", "bi-hourglass-split", "yellow-bg", "#/dashboard")}
              ${this.renderStatCard("0", "Pengajuan", "bi-clipboard-check", "blue-bg", "#/pengajuan")}
              ${this.renderStatCard("0", "Penawaran", "bi-x-circle", "red-bg", "#/penawaran")}
              ${this.renderStatCard("0", "Pengiriman", "bi-truck", "orange-bg", "#/pengiriman")}
              ${this.renderStatCard("0", "Selesai", "bi-check-circle", "green-bg", "#/selesai")}
            </div>
          </div>
        </header>
        
        <!-- Data Section -->
        <div class="data-section">
          <div class="section-header">
            <h2 class="section-title">Data Pengajuan</h2>
          </div>
          <div class="d-flex justify-content-end mb-2">
          <button id="refresh-btn" class="btn btn-outline-success">
            <i class="bi bi-arrow-clockwise"></i> Refresh Data
          </button>
        </div>
          <!-- Filter Tabs -->
          <div class="filter-tabs">
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
                    <th id="action-header">Action</th>
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
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));

  const clickedTab = e.target.closest('.filter-tab');
  if (clickedTab) {
    clickedTab.classList.add('active');
    const filter = clickedTab.dataset.filter;

    this.currentFilter = filter;
    this.currentPage = 1;

    const filterEvent = new CustomEvent("filter-change", {
      detail: { filterType: "status", filterValue: filter }
    });
    document.dispatchEvent(filterEvent);
  }
}


  getCurrentDisplayData() {
    if (!this.applicationsData || this.applicationsData.length === 0) {
      return [];
    }

    let filteredData;
    if (this.currentFilter === 'all') {
      filteredData = this.applicationsData;
    } else {
      filteredData = this.applicationsData.filter(item => {
        const matchesOriginal = item.statusOriginal === this.currentFilter;
        const matchesMapped = this.mapStatusToOriginal(item.status) === this.currentFilter;
        return matchesOriginal || matchesMapped;
      });
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
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

  searchApplications(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
      this.renderFilteredTable();
      return;
    }

    const tableBody = document.getElementById('applications-table-body');
    const emptyState = document.getElementById('empty-state');
    
    const searchLower = searchTerm.toLowerCase();
    
    let filteredData = this.applicationsData.filter(item => {
      let statusMatches = true;
      if (this.currentFilter !== 'all') {
        const matchesOriginal = item.statusOriginal === this.currentFilter;
        const matchesMapped = this.mapStatusToOriginal(item.status) === this.currentFilter;
        statusMatches = matchesOriginal || matchesMapped;
      }
      
      const textMatches = 
        (item.name && item.name.toLowerCase().includes(searchLower)) ||
        (item.phone && item.phone.toLowerCase().includes(searchLower)) ||
        (item.category && item.category.toLowerCase().includes(searchLower));
      
      return statusMatches && textMatches;
    });
    
    if (filteredData.length === 0) {
      if (tableBody) tableBody.innerHTML = '';
      if (emptyState) {
        emptyState.style.display = 'block';
        emptyState.querySelector('p').textContent = `Tidak ada data yang cocok dengan pencarian "${searchTerm}"`;
      }
      this.hidePagination();
      return;
    }
    
    if (emptyState) {
      emptyState.style.display = 'none';
      emptyState.querySelector('p').textContent = 'Belum ada pengajuan dengan status yang dipilih.';
    }
    
    this.currentPage = 1;
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    const tableHTML = paginatedData
      .map((app) => this.renderApplicationRow(app))
      .join("");
    
    if (tableBody) {
      tableBody.innerHTML = tableHTML;
    }
    
    this.setupRowEventListeners();
    this.renderPagination(filteredData.length);
  }

  renderFilteredTable() {
  const tableBody = document.getElementById('applications-table-body');
  const emptyState = document.getElementById('empty-state');

  console.log("Rendering filtered table. Current filter:", this.currentFilter);
  console.log("Applications data:", this.applicationsData);

  if (!this.applicationsData || this.applicationsData.length === 0) {
    if (tableBody) tableBody.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    this.hidePagination();
    return;
  }

  let filterValue = this.currentFilter;
  if (filterValue === 'pending') filterValue = 'pengajuan';
  else if (filterValue === 'accepted') filterValue = 'pengajuan diterima';
  else if (filterValue === 'rejected') filterValue = 'pengajuan ditolak';

  let filteredData = this.applicationsData.filter(item => item.statusOriginal === filterValue);

  const isPendingTab = this.currentFilter === 'pending';
  const actionHeader = document.getElementById('action-header');
  if (actionHeader) {
    actionHeader.style.display = isPendingTab ? '' : 'none';
  }

  console.log("Filtered data length:", filteredData.length);

  if (filteredData.length === 0) {
    if (tableBody) tableBody.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    this.hidePagination();
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const tableHTML = paginatedData.map(app => this.renderApplicationRow(app)).join("");

  if (tableBody) {
    tableBody.innerHTML = tableHTML;
  }

  this.setupRowEventListeners();
  this.renderPagination(filteredData.length);
}
 mapStatusToOriginal(displayStatus) {
  const reverseStatusMap = {
    'Menunggu Validasi': 'pengajuan',
    'Diterima': 'pengajuan diterima',
    'Ditolak': 'pengajuan ditolak'
  };
  return reverseStatusMap[displayStatus] || displayStatus;
}

  renderApplicationRow(app) {
  const { statusClass, statusIcon, statusLabel } = this.getStatusStyles(app.status);
  const isPending = app.status === 'Menunggu Validasi';

  return `
    <tr>
      <td><input type="checkbox" class="form-check-input row-checkbox" value="${app.id}"></td>
      <td>${app.name || 'N/A'}</td>
      <td>${app.phone || 'N/A'}</td>
      <td>${app.category || 'N/A'}</td>
      <td><img src="${app.image || 'https://via.placeholder.com/50'}" alt="Sampah" class="waste-img"></td>
      <td>${app.weight || 0} kg</td>
      ${isPending ? `
        <td>
          <a href="#/form-penawaran?id=${app.id}" 
            class="btn btn-success action-btn btn-sm accept-btn" 
            data-id="${app.id}">
            <i class="bi bi-check-circle"></i> Diterima
          </a>
          <a href="#/form-penolakan?id=${app.id}" class="btn btn-danger action-btn btn-sm reject-btn" data-id="${app.id}">
            <i class="bi bi-x-circle"></i> Ditolak
          </a>
        </td>
      ` : ''}
    </tr>
  `;
}
  getStatusStyles(status) {
      const statusMap = {
        'Menunggu Validasi': { 
          class: 'pending', 
          icon: 'bi-hourglass-split', 
          label: 'Menunggu Validasi' 
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
        }
      };

      return statusMap[status] || { 
        class: 'pending', 
        icon: 'bi-hourglass-split', 
        label: status || 'Unknown' 
      };
  }

  setupRowEventListeners() {
 
  const detailBtns = document.querySelectorAll('.detail-btn');
  detailBtns.forEach(btn => {
    const handler = (e) => this.handleDetailClick(e);
    btn.addEventListener('click', handler);
    this.eventListeners.push({ element: btn, type: 'click', handler });
  });

  
  const rowCheckboxes = document.querySelectorAll('.row-checkbox');
  rowCheckboxes.forEach(checkbox => {
    const handler = () => this.updateSelectAllState();
    checkbox.addEventListener('change', handler);
    this.eventListeners.push({ element: checkbox, type: 'change', handler });
  });

  // Tombol "Diterima"
  const acceptBtns = document.querySelectorAll('.accept-btn');
  acceptBtns.forEach((btn) => {
    const handler = (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      if (!id) {
        alert("ID pengajuan tidak ditemukan.");
        return;
      }
      window.location.href = `#/form-penawaran?id=${id}`;
    };
    btn.addEventListener('click', handler);
    this.eventListeners.push({ element: btn, type: 'click', handler });
  });
}


  handleDetailClick(e) {
    const id = e.target.closest('.detail-btn').dataset.id;
    const event = new CustomEvent('show-application-detail', { 
      detail: { id: id } 
    });
    document.dispatchEvent(event);
  }

  renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    const paginationList = document.getElementById('pagination-list');
    const paginationContainer = document.getElementById('pagination-container');
    
    if (!paginationList || !paginationContainer) {
      console.warn('Pagination elements not found');
      return;
    }
    
    if (totalPages <= 1 || totalItems === 0) {
      paginationContainer.style.display = 'none';
      return;
    }
    
    paginationContainer.style.display = 'flex';
    
    let paginationHTML = '';
    
    paginationHTML += `
      <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${this.currentPage - 1}">
          <i class="bi bi-chevron-left"></i>
        </a>
      </li>
    `;
    
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
    
    paginationHTML += `
      <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${this.currentPage + 1}">
          <i class="bi bi-chevron-right"></i>
        </a>
      </li>
    `;
    
    paginationList.innerHTML = paginationHTML;
    
    const pageLinks = paginationList.querySelectorAll('a.page-link');
    pageLinks.forEach(link => {
      const handler = (e) => this.handlePaginationClick(e);
      link.addEventListener('click', handler);
      this.eventListeners.push({ element: link, type: 'click', handler });
    });
  }

  handlePaginationClick(e) {
    e.preventDefault();
    const pageLink = e.target.closest('a');
    if (!pageLink || !pageLink.dataset.page) return;
    
    const page = parseInt(pageLink.dataset.page);
    if (isNaN(page) || page < 1 || page === this.currentPage) return;
    
    this.currentPage = page;
    this.renderFilteredTable();
  }

  hidePagination() {
    const paginationContainer = document.getElementById('pagination-container');
    if (paginationContainer) {
      paginationContainer.style.display = 'none';
    }
  }

  updateTabBadges(allData) {
  if (!Array.isArray(allData)) return;

  const counts = {
    pending: 0,
    accepted: 0,
    rejected: 0
  };

  allData.forEach(item => {
    const original = item.statusOriginal?.toLowerCase();
    if (original === 'pengajuan') counts.pending++;
    else if (original === 'pengajuan diterima') counts.accepted++;
    else if (original === 'pengajuan ditolak') counts.rejected++;
  });

  const pendingBadge = document.getElementById('badge-pending');
  const acceptedBadge = document.getElementById('badge-accepted');
  const rejectedBadge = document.getElementById('badge-rejected');

  if (pendingBadge) pendingBadge.textContent = counts.pending;
  if (acceptedBadge) acceptedBadge.textContent = counts.accepted;
  if (rejectedBadge) rejectedBadge.textContent = counts.rejected;
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

  displayApplications(applicationsData) {
    this.renderApplicationsTable(applicationsData);
  }

  displayStatistics(stats) {
  if (stats) {
    const statCards = document.querySelectorAll('.stat-number');
    if (statCards.length >= 5) {
      statCards[0].textContent = stats.total || '0';        
      statCards[1].textContent = stats.pending || '0';      
      statCards[2].textContent = stats.rejected || '0';     
      statCards[3].textContent = stats.shipped || '0';     
      statCards[4].textContent = stats.completed || '0';    
    }
  }
}

  showError(message) {
    console.error(message);
    alert(message);
  }

  showSuccess(message) {
    const alertHtml = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const cardBody = document.querySelector('.card-body');
    if (cardBody) {
        cardBody.insertAdjacentHTML('afterbegin', alertHtml);
    }

    
    window.location.href = '#/selesai';
}


  renderApplicationsTable(applicationsData) {
    console.log("Rendering applications table with data:", applicationsData);
    
    if (!Array.isArray(applicationsData)) {
      console.warn("Applications data is not an array:", applicationsData);
      this.applicationsData = [];
    } else {
      this.applicationsData = applicationsData.map(app => ({
        ...app,
        statusOriginal: app.statusOriginal || this.mapStatusToOriginal(app.status) || 'pending'
      }));
    }
    
    console.log("Applications data set to:", this.applicationsData.length, "items");
    
    this.currentPage = 1;
    
    this.updateTabBadges();
    this.renderFilteredTable();
    console.log("Table rendered successfully");
  }

  resetFilters() {
    this.currentFilter = 'pending';
    this.currentPage = 1;
    
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    
    const defaultTab = document.querySelector('[data-filter="pending"]');
    if (defaultTab) {
      defaultTab.classList.add('active');
    }
    
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