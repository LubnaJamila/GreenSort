// src/pages/dashboard-admin/selesaiUserView.js
import "../../assets/styles/sidebar.css";
import "../../assets/styles/dashboard.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";
const BASE_URL = "https://greenshort-production.up.railway.app";

export default class SelesaiUserView {
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
              "80",
              "Menunggu Validasi",
              "bi-hourglass-split",
              "yellow-bg",
              "#/dashboardUser"
            )}
            ${this.renderStatCard(
              "16",
              "Diterima",
              "bi-clipboard-check",
              "blue-bg",
              "#/diterima"
            )}
            ${this.renderStatCard(
              "8",
              "Ditolak",
              "bi-x-circle",
              "red-bg",
              "#/ditolak"
            )}
            ${this.renderStatCard(
              "24",
              "Penjemputan",
              "bi-truck",
              "orange-bg",
              "#/penjemputan"
            )}
            ${this.renderStatCard(
              "42",
              "Selesai",
              "bi-check-circle",
              "green-bg",
              "#/selesaiUser"
            )}
          </div>
        </header>

        <div class="data-section">
          <div class="data-header">
            <h3>Data Selesai</h3>
          </div>

          <div class="table-responsive">
            <table id="datatable" class="table table-striped" style="width:100%">
              <thead>
                <tr>
                  <th>Gambar</th>
                  <th>Jenis Sampah</th>
                  <th>Berat</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Bukti Transfer</th>
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
    const event = new CustomEvent("selesaiUser-refresh");
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

   
    if (!applicationsData || !Array.isArray(applicationsData)) {
      tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4">
                        <i class="bi bi-info-circle me-2"></i>
                        Tidak ada data pengajuan yang diterima
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
  }

  
  renderApplicationRow(app) {
    const imageUrl = app.gambar_sampah
      ? `${this.baseImageUrl}${app.gambar_sampah}`
      : "";

    return `
      <tr>
        <td>
          ${
            imageUrl
              ? `
            <img src="${imageUrl}" 
                 alt="Gambar Sampah" 
                 class="img-thumbnail application-image" 
                 style="width: 60px; height: 60px; object-fit: cover; cursor: pointer;"
                 onclick="this.parentElement.querySelector('.image-modal').style.display='block'"
                 onerror="this.src='https://via.placeholder.com/60?text=No+Image'; this.style.objectFit='contain';">
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
        <td>${app.jenisSampah}</td>
        <td>${app.berat}</td>
        <td>${app.status}</td>
        <td>${app.total}</td>
        <td>
          ${
            app.status.toLowerCase().trim() === "selesai" && app.buktiTf !== "-"
              ? `<a href="${BASE_URL}/uploads/${app.bukti_tf}" target="_blank">Lihat Bukti</a>`
              : "-"
          }
        </td>
      </tr>
    `;
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
  updateStatCards(stats) {
    
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
  showError(message) {
    
    const alertDiv = document.createElement("div");
    alertDiv.className =
      "alert alert-danger alert-dismissible fade show position-fixed";
    alertDiv.style.cssText =
      "top: 20px; right: 20px; z-index: 9999; min-width: 300px;";
    alertDiv.innerHTML = `
            <i class="bi bi-exclamation-triangle me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

    document.body.appendChild(alertDiv);

    
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 5000);
  }
  showLoadingState() {
    const tableBody = document.getElementById("applications-table-body");
    if (tableBody) {
      tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4">
                        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                        Memuat data pengajuan yang diterima...
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
