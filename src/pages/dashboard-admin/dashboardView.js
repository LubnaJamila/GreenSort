// src/pages/dashboard-admin/dashboardView.js
import "../../assets/styles/sidebar.css";
import "../../assets/styles/dashboard.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class DashboardView {
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
  updateStatCards(counts) {
  const statNumbers = document.querySelectorAll(".stat-number");

  if (statNumbers.length >= 5) {
    statNumbers[0].textContent = counts.total || '0';           // Semua
    statNumbers[1].textContent = counts.pengajuan || '0';       // Pengajuan
    statNumbers[2].textContent = counts.penawaran || '0';       // Penawaran
    statNumbers[3].textContent = counts.pengiriman || '0';      // Pengiriman
    statNumbers[4].textContent = counts.selesai || '0';         // Selesai
  }
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
            ${this.renderStatCard("0", "Semua", "bi-hourglass-split", "yellow-bg", "#/dashboard")}
            ${this.renderStatCard("0", "Pengajuan", "bi-clipboard-check", "blue-bg", "#/pengajuan")}
            ${this.renderStatCard("0", "Penawaran", "bi-x-circle", "red-bg", "#/penawaran")}
            ${this.renderStatCard("0", "Pengiriman", "bi-truck", "orange-bg", "#/pengiriman")}
            ${this.renderStatCard("0", "Selesai", "bi-check-circle", "green-bg", "#/selesai")}
          </div>
        </header>

        <div class="data-section">
          <div class="data-header">
            <h3>Semua Data</h3>
          </div>

          <div class="table-responsive">
            <table id="datatable" class="table table-striped" style="width:100%">
              <thead>
              <tr>
                <th><input type="checkbox" id="select-all"></th>
                <th>Jenis Sampah</th>
                <th>Tanggal Pengajuan</th>
                <th>Berat</th>
                <th>Harga</th>
                <th>Status</th>
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
  getStatusBadge(status) {
  const map = {
    'pengajuan': {
      label: 'Pengajuan',
      class: 'badge bg-warning text-dark',
      icon: 'bi-hourglass'
    },
    'pengajuan diterima': {
      label: 'Pengajuan Diterima',
      class: 'badge bg-success text-white',
      icon: 'bi-check-circle'
    },
    'pengajuan ditolak': {
      label: 'Pengajuan Ditolak',
      class: 'badge bg-danger text-white',
      icon: 'bi-x-circle'
    }
  };

  const data = map[status.toLowerCase()] || {
    label: status,
    class: 'badge bg-secondary',
    icon: 'bi-question-circle'
  };

  return `<span class="${data.class}"><i class="bi ${data.icon} me-1"></i> ${data.label}</span>`;
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

    const tableHTML = applicationsData
      .map((app) => this.renderApplicationRow(app))
      .join("");
    tableBody.innerHTML = tableHTML;

    this.initDataTable();
  }

  renderApplicationRow(app) {
  const showHargaStatuses = ["pengajuan diterima", "penawaran diterima", "penawaran ditolak","selesai"];
  const harga = showHargaStatuses.includes(app.status)
    ? `Rp. ${this.formatRupiah(app.harga_tawaran)}`
    : "-";

  return `
    <tr>
      <td><input type="checkbox" class="row-checkbox" value="${app.id}"></td>
      <td>${app.jenis_sampah || "-"}</td>
      <td>${this.formatTanggal(app.created_at)}</td>
      <td>${app.berat} kg</td>
      <td>${harga}</td>
      <td>${this.getStatusBadge(app.status)}</td>
    </tr>
  `;
}
formatRupiah(angka) {
  return Number(angka).toLocaleString("id-ID");
}

formatTanggal(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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
    if ($.fn.DataTable.isDataTable("#datatable")) {
      $("#datatable").DataTable().destroy();
    }

    $(document).ready(() => {
      $("#datatable").DataTable({
        responsive: true,
        language: {
          search: "Cari:",
          lengthMenu: "Tampilkan _MENU_ data per halaman",
          info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
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
    if ($.fn.DataTable.isDataTable("#datatable")) {
      $("#datatable").DataTable().destroy();
    }
  }
}
