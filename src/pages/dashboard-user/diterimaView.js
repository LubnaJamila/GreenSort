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
                        <h3>Data Pengajuan Diterima</h3>
                        <button id="refresh-btn" class="btn btn-primary btn-sm">
                            <i class="bi bi-arrow-clockwise"></i> Refresh
                        </button>
                    </div>
            
                    <div class="table-responsive">
                        <table id="datatable" class="table table-striped" style="width:100%">
                        <thead>
                            <tr>
                                <th>Gambar Sampah</th>
                                <th>Jenis Sampah</th>
                                <th>Berat (kg)</th>
                                <th>Harga Tawaran</th>
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

  renderApplicationsTable(applicationsData) {
    const tableBody = document.getElementById("applications-table-body");
    if (!tableBody) return;

    // Check if data exists and is array
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
    this.setupActionListeners();
  }

  renderApplicationRow(app) {
    const formatCurrency = (amount) => {
      const num = parseFloat(amount);
      if (isNaN(num)) return "Rp 0";
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(num);
    };

    const imageUrl = app.gambar_sampah
      ? `${this.baseImageUrl}${app.gambar_sampah}`
      : "";

    return `
      <tr data-id="${app.id || ""}">
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
        <td>${app.jenis_sampah || app.jenisSampah}</td>
        <td>${app.berat || "0"} kg</td>
        <td>${formatCurrency(app.harga || app.harga_tawaran)}</td>
        <td>
          <span class="badge bg-success">
            <i class="bi bi-check-circle me-1"></i>
            ${app.status || "Diterima"}
          </span>
        </td>
        <td>
          <div class="action-buttons d-flex">
            <button class="btn btn-success btn-sm me-1" 
                    onclick="window.location.href='#/form-ongkir?id=${app.id}'" 
                    title="Terima">
                <i class="bi bi-check-circle"></i> Terima
            </button>
            <button class="btn btn-danger btn-sm action-reject" 
                    data-id="${app.id}" data-action="reject" title="Tolak">
              <i class="bi bi-x-circle"></i> Tolak
            </button>
          </div>
        </td>
      </tr>
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
  }

  setupActionListeners() {
    const tableBody = document.getElementById("applications-table-body");
    if (!tableBody) return;

    // Gunakan bound handler supaya bisa dihapus dengan tepat
    if (!this.boundActionHandler) {
      this.boundActionHandler = (e) => {
        e.preventDefault();
        const target = e.target.closest(".action-accept, .action-reject");
        if (!target) return;

        const applicationId = target.dataset.id;
        const action = target.dataset.action;

        const actionEvent = new CustomEvent("application-action", {
          detail: { id: applicationId, action: action },
        });
        document.dispatchEvent(actionEvent);
      };
    }

    tableBody.removeEventListener("click", this.boundActionHandler);
    tableBody.addEventListener("click", this.boundActionHandler);
  }

  handleRefresh() {
    // Dispatch refresh event
    const refreshEvent = new CustomEvent("diterima-refresh");
    document.dispatchEvent(refreshEvent);
  }

  showSuccess(message) {
    // Tampilkan notifikasi sukses dengan toast-like behavior
    const alertDiv = document.createElement("div");
    alertDiv.className =
      "alert alert-success alert-dismissible fade show position-fixed";
    alertDiv.style.cssText =
      "top: 20px; right: 20px; z-index: 9999; min-width: 300px;";
    alertDiv.innerHTML = `
            <i class="bi bi-check-circle me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

    document.body.appendChild(alertDiv);

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 3000);
  }

  showError(message) {
    // Tampilkan notifikasi error
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

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 5000);
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

  displayUserInfo(user) {
    const userNameElement = document.getElementById("user-name");
    const userAvatarElement = document.getElementById("user-avatar");

    if (userNameElement && user) {
      userNameElement.textContent = user.name || user.username || "User";
    }

    // Update avatar if user has profile picture
    if (userAvatarElement && user && user.avatar) {
      userAvatarElement.src = user.avatar;
    }
  }

  initDataTable() {
    // Destroy existing DataTable if it exists
    if (this.dataTable) {
      this.dataTable.destroy();
      this.dataTable = null;
    }

    // Wait for DOM to be ready and jQuery DataTables to be available
    if (typeof $ !== "undefined" && $.fn.DataTable) {
      try {
        this.dataTable = $("#datatable").DataTable({
          responsive: true,
          pageLength: 10,
          lengthMenu: [
            [10, 25, 50, -1],
            [10, 25, 50, "Semua"],
          ],
          order: [[1, "asc"]], // Sort by jenis sampah column
          columnDefs: [
            {
              targets: [0], // Gambar column
              orderable: false,
              searchable: false,
              responsivePriority: 1,
            },
            {
              targets: [2, 3], // Berat dan Harga columns
              className: "text-end",
            },
            {
              targets: [4], // Status column
              className: "text-center",
            },
            {
              targets: [5], // Action column
              orderable: false,
              searchable: false,
              responsivePriority: 2,
              className: "text-center",
            },
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
            // Re-setup action listeners after table redraw
            this.setupActionListeners();
          },
        });
      } catch (error) {
        console.error("Error initializing DataTable:", error);
      }
    } else {
      console.warn("jQuery DataTables not available, using basic table");
    }
  }

  getSelectedRows() {
    const selectedCheckboxes = document.querySelectorAll(
      '#applications-table-body input[type="checkbox"]:checked'
    );
    return Array.from(selectedCheckboxes).map((cb) => cb.value);
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
