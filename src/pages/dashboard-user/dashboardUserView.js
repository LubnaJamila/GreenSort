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
    this.baseImageUrl = "https://greenshort-production.up.railway.app/uploads/";
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
            ${this.renderStatCard(
              "0",
              "Menunggu Validasi",
              "bi-hourglass-split",
              "yellow-bg",
              "#/dashboardUser"
            )}
            ${this.renderStatCard(
              "0",
              "Diterima",
              "bi-clipboard-check",
              "blue-bg",
              "#/diterima"
            )}
            ${this.renderStatCard(
              "0",
              "Ditolak",
              "bi-x-circle",
              "red-bg",
              "#/ditolak"
            )}
            ${this.renderStatCard(
              "0",
              "Penjemputan",
              "bi-truck",
              "orange-bg",
              "#/penjemputan"
            )}
            ${this.renderStatCard(
              "0",
              "Selesai",
              "bi-check-circle",
              "green-bg",
              "#/selesaiUser"
            )}
          </div>
        </header>

        <div class="data-section">
          <div class="data-header">
            <h3>Data Pengajuan Sampah</h3>
            <button id="refresh-btn" class="btn btn-outline-primary btn-sm">
              <i class="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>

          <div class="table-responsive">
            <table id="datatable" class="table table-striped" style="width:100%">
              <thead>
                <tr>
                  <th><input type="checkbox" id="select-all"></th>
                  <th>Gambar Sampah</th>
                  <th>Jenis Sampah</th>
                  <th>Berat (kg)</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody id="applications-table-body">
                <tr>
                  <td colspan="6" class="text-center py-4">
                    <div class="text-muted">
                      <i class="bi bi-clock-history" style="font-size: 2rem;"></i>
                      <p class="mt-2">Memuat data...</p>
                    </div>
                  </td>
                </tr>
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
      userNameElement.textContent = user.name || user.username || "User";
    }

    if (userAvatar && user && user.avatar) {
      userAvatar.src = user.avatar;
    }
  }

  renderApplicationsTable(applicationsData) {
    const tableBody = document.getElementById("applications-table-body");
    if (!tableBody) return;

    if (!applicationsData || applicationsData.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4">
            <div class="text-muted">
              <i class="bi bi-inbox" style="font-size: 2rem;"></i>
              <p class="mt-2">Belum ada data pengajuan sampah</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    const tableHTML = applicationsData
      .map((app) => this.renderApplicationRow(app))
      .join("");
    tableBody.innerHTML = tableHTML;

    this.initDataTable();
    this.setupTableEventListeners();
  }

  renderApplicationRow(app) {
    const statusStyles = this.getStatusStyles(app.status);
    const imageUrl = app.gambar_sampah
      ? `${this.baseImageUrl}${app.gambar_sampah}`
      : "";

    return `
      <tr>
        <td><input type="checkbox" class="row-checkbox" value="${app.id}"></td>
        <td>
          ${
            imageUrl
              ? `
            <img src="${imageUrl}" 
                 alt="Gambar Sampah" 
                 class="img-thumbnail application-image" 
                 style="width: 60px; height: 60px; object-fit: cover; cursor: pointer;"
                 onclick="this.parentElement.querySelector('.image-modal').style.display='block'"
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEw0MCA0ME0yMCA0MEw0MCAyMCIgc3Ryb2tlPSIjQ0NDIiBzdHJva2Utd2lkdGg9IjIiLz4KPHN2Zz4K'; this.style.objectFit='contain';">
            <div class="image-modal" style="display:none; position:fixed; z-index:1000; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.8); cursor:pointer;" onclick="this.style.display='none'">
              <img src="${imageUrl}" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); max-width:90%; max-height:90%; object-fit:contain;">
            </div>
          `
              : `
            <div style="width: 60px; height: 60px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
              <i class="bi bi-image text-muted"></i>
            </div>
          `
          }
        </td>
        <td>${app.jenisSampah || "-"}</td>
        <td>${app.berat ? app.berat.toFixed(2) + " kg" : "-"}</td>
        <td>
          <span class="badge ${statusStyles.class}">
            <i class="bi ${statusStyles.icon}"></i>
            ${app.status}
          </span>
        </td>
        <td>
          <button type="button" class="btn btn-outline-primary btn-sm view-btn" data-id="${
            app.id
          }" title="Lihat Detail">
            <i class="bi bi-eye"></i>
          </button>
        </td>
      </tr>
    `;
  }

  setupTableEventListeners() {
    const tableBody = document.getElementById("applications-table-body");
    if (!tableBody) return;

    // View buttons
    const viewButtons = tableBody.querySelectorAll(".view-btn");
    viewButtons.forEach((btn) => {
      const handler = (e) => {
        e.preventDefault();
        this.handleViewApplication(e.target.closest("button").dataset.id);
      };
      btn.addEventListener("click", handler);
      this.eventListeners.push({ element: btn, type: "click", handler });
    });
  }

  handleViewApplication(applicationId) {
    const event = new CustomEvent("view-application", {
      detail: { applicationId },
    });
    document.dispatchEvent(event);
  }

  getStatusStyles(status) {
    const normalizedStatus = status ? status.toLowerCase() : "";

    const statusMap = {
      pengajuan: {
        class: "bg-warning bg-opacity-10 text-warning border border-warning",
        icon: "bi-hourglass-split",
      },
      "menunggu validasi": {
        class: "bg-warning bg-opacity-10 text-warning border border-warning",
        icon: "bi-hourglass-split",
      },
      diterima: {
        class: "bg-info bg-opacity-10 text-info border border-info",
        icon: "bi-clipboard-check",
      },
      ditolak: {
        class: "bg-danger bg-opacity-10 text-danger border border-danger",
        icon: "bi-x-circle",
      },
      penjemputan: {
        class: "bg-primary bg-opacity-10 text-primary border border-primary",
        icon: "bi-truck",
      },
      selesai: {
        class: "bg-success bg-opacity-10 text-success border border-success",
        icon: "bi-check-circle",
      },
    };

    return (
      statusMap[normalizedStatus] || {
        class: "bg-light text-muted border",
        icon: "bi-question-circle",
      }
    );
  }

  formatStatus(status) {
    if (!status) return "Tidak Diketahui";

    const statusMap = {
      pengajuan: "Pengajuan",
      diterima: "Diterima",
      ditolak: "Ditolak",
      penjemputan: "Penjemputan",
      selesai: "Selesai",
    };

    return statusMap[status.toLowerCase()] || status;
  }

  initDataTable() {
    // Destroy existing DataTable if it exists
    if ($.fn.DataTable && $.fn.DataTable.isDataTable("#datatable")) {
      $("#datatable").DataTable().destroy();
    }

    // Check if jQuery and DataTables are available
    if (typeof $ !== "undefined" && $.fn.DataTable) {
      $(document).ready(() => {
        $("#datatable").DataTable({
          responsive: true,
          order: [[2, "asc"]], // Sort by jenis sampah column
          columnDefs: [
            { orderable: false, targets: [0, 1, 5] }, // Disable sorting for checkbox, image, and actions columns
            { searchable: false, targets: [0, 1, 5] }, // Disable search for checkbox, image, and actions columns
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
          lengthMenu: [
            [10, 25, 50, 100],
            [10, 25, 50, 100],
          ],
        });
      });
    }
  }

  updateStatCards(stats) {
    // Update stat numbers if stats object is provided
    if (!stats) return;

    const statCards = document.querySelectorAll(".stat-number");
    if (statCards.length >= 5) {
      statCards[0].textContent = stats.menungguValidasi || "0";
      statCards[1].textContent = stats.diterima || "0";
      statCards[2].textContent = stats.ditolak || "0";
      statCards[3].textContent = stats.penjemputan || "0";
      statCards[4].textContent = stats.selesai || "0";
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
