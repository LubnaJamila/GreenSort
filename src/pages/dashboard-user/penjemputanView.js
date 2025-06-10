//src/pages/dashboard-user/penjemputanView.js
import "../../assets/styles/sidebar.css";
import "../../assets/styles/dashboard.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class PenjemputanView {
  constructor() {
    this.app = document.getElementById("content");
    this.sidebar = new SidebarView();
    this.eventListeners = [];
    this.isMobile = window.matchMedia("(max-width: 768px)").matches;
    this.sidebarCollapsed = false;
    this.applicationsData = [];
    this.dataTable = null;
    this.statsData = {
      dijemput: 0,
      diantar: 0,
      total: 0,
    };
  }

  render() {
    this.sidebar.render();
    this.renderMainContent();
    this.setupEventListeners();
    this.checkMobileView();
  }

  // Ganti method renderMainContent() dengan yang ini
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
                          <h1>Dashboard Penjemputan</h1>
                          <p>Kelola status penjemputan sampah Anda secara real-time.</p>
                      </div>
                      <div class="user-profile">
                          <img id="user-avatar" src="${userPlaceholder}" alt="User">
                          <span id="user-name">Loading...</span>
                      </div>
                  </div>
  
                  <!-- Stats Grid -->
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
              </div>
          </header>
  
          <!-- Data Section -->
          <div class="data-section">
              <div class="section-header">
                  <h2 class="section-title">Data Penjemputan</h2>
              </div>
  
              <!-- Tabs -->
              <ul class="nav nav-tabs" id="penjemputanTabs" role="tablist">
                  <li class="nav-item" role="presentation">
                      <button class="nav-link active" id="all-tab" data-bs-toggle="tab" data-bs-target="#all" type="button"
                          role="tab" aria-controls="all" aria-selected="true">
                          Semua <span class="badge bg-light text-dark ms-1" id="badge-all">0</span>
                      </button>
                  </li>
                  <li class="nav-item" role="presentation">
                      <button class="nav-link" id="dijemput-tab" data-bs-toggle="tab" data-bs-target="#dijemput" type="button"
                          role="tab" aria-controls="dijemput" aria-selected="false">
                          Dijemput <span class="badge bg-light text-dark ms-1" id="badge-dijemput">0</span>
                      </button>
                  </li>
                  <li class="nav-item" role="presentation">
                      <button class="nav-link" id="diantar-tab" data-bs-toggle="tab" data-bs-target="#diantar" type="button"
                          role="tab" aria-controls="diantar" aria-selected="false">
                          Diantar <span class="badge bg-light text-dark ms-1" id="badge-diantar">0</span>
                      </button>
                  </li>
              </ul>
  
              <!-- Tab Content -->
              <div class="tab-content" id="penjemputanTabsContent">
                  <div class="tab-pane fade show active" id="all" role="tabpanel" aria-labelledby="all-tab">
                      <div class="table-responsive pt-3">
                          <table class="table table-striped datatable" id="table-all" style="width:100%">
                              <thead>
                                <tr>
                                    <th>Jenis Sampah</th>
                                    <th>Berat</th>
                                    <th>Harga (Rp/kg)</th>
                                    <th>Total</th>
                                    <th>Ongkir</th>
                                    <th>Alamat Admin</th>
                                    <th>Estimasi Tanggal</th>
                                    <th>Opsi</th>
                                </tr>
                              </thead>
                              <tbody id="body-all"></tbody>
                          </table>
                      </div>
                  </div>
  
                  <div class="tab-pane fade" id="dijemput" role="tabpanel" aria-labelledby="dijemput-tab">
                      <div class="table-responsive pt-3">
                          <table class="table table-striped datatable" id="table-dijemput" style="width:100%">
                              <thead>
                                <tr>
                                    <th>Jenis Sampah</th>
                                    <th>Berat</th>
                                    <th>Harga (Rp/kg)</th>
                                    <th>Total</th>
                                    <th>Ongkir</th>
                                    <th>Alamat Admin</th>
                                    <th>Estimasi Tanggal</th>
                                    <th>Opsi</th>
                                </tr>
                              </thead>

                              <tbody id="body-dijemput"></tbody>
                          </table>
                      </div>
                  </div>
  
                  <div class="tab-pane fade" id="diantar" role="tabpanel" aria-labelledby="diantar-tab">
                      <div class="table-responsive pt-3">
                          <table class="table table-striped datatable" id="table-diantar" style="width:100%">
                              <thead>
                                <tr>
                                    <th>Jenis Sampah</th>
                                    <th>Berat</th>
                                    <th>Harga (Rp/kg)</th>
                                    <th>Total</th>
                                    <th>Ongkir</th>
                                    <th>Alamat Admin</th>
                                    <th>Estimasi Tanggal</th>
                                    <th>Opsi</th>
                                </tr>
                               </thead>

                              <tbody id="body-diantar"></tbody>
                          </table>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    `;

    // Aktivasi tab dengan metode yang lebih reliable
    this.activateDefaultTab();
  }

  // Method untuk aktivasi tab default yang lebih kuat
  activateDefaultTab() {
    // Implementasi dengan multiple attempts untuk memastikan aktivasi
    const attemptActivation = (attempt = 1) => {
      const allTab = document.getElementById("all-tab");
      const allPane = document.getElementById("all");

      if (!allTab || !allPane) {
        if (attempt < 5) {
          console.log(
            `Attempt ${attempt}: Tab elements not found, retrying...`
          );
          setTimeout(() => attemptActivation(attempt + 1), 100);
          return;
        }
        console.error("Failed to find tab elements after 5 attempts");
        return;
      }

      console.log(`Attempt ${attempt}: Activating default tab...`);

      // Force remove active from all tabs first
      const allTabs = document.querySelectorAll(".nav-link");
      const allPanes = document.querySelectorAll(".tab-pane");

      allTabs.forEach((tab) => {
        tab.classList.remove("active");
        tab.setAttribute("aria-selected", "false");
      });

      allPanes.forEach((pane) => {
        pane.classList.remove("active", "show");
      });

      // Force activate the "Semua" tab
      allTab.classList.add("active");
      allTab.setAttribute("aria-selected", "true");

      // Force activate the "Semua" pane
      allPane.classList.add("active", "show");

      // Verify activation
      setTimeout(() => {
        const isTabActive = allTab.classList.contains("active");
        const isPaneActive =
          allPane.classList.contains("active") &&
          allPane.classList.contains("show");

        if (isTabActive && isPaneActive) {
          console.log('✅ Tab "Semua" berhasil diaktifkan!');

          // Trigger any Bootstrap tab events if needed
          if (window.bootstrap && bootstrap.Tab) {
            try {
              const tabInstance = bootstrap.Tab.getOrCreateInstance(allTab);
            } catch (e) {
              console.log("Bootstrap Tab instance creation skipped");
            }
          }
        } else {
          console.warn("⚠️ Tab activation verification failed, retrying...");
          if (attempt < 3) {
            setTimeout(() => attemptActivation(attempt + 1), 200);
          }
        }
      }, 50);
    };

    // Start activation attempts
    setTimeout(() => attemptActivation(), 100);
  }

  // Tambahkan method showTableLoading yang dibutuhkan oleh presenter
  showTableLoading(show = true) {
    if (show) {
      this.showLoading(true);
    } else {
      this.showLoading(false);
    }
  }

  // Tambahkan juga CSS untuk memastikan warna hijau
  addTabStyles() {
    const style = document.createElement("style");
    style.id = "penjemputan-tab-styles";
    style.textContent = `
      /* Tab Navigation Styles */
      .nav-tabs .nav-link.active {
        color: #28a745 !important;
        border-color: #28a745 #28a745 #fff !important;
        background-color: #fff !important;
        font-weight: 600;
      }
      
      .nav-tabs .nav-link.active:hover,
      .nav-tabs .nav-link.active:focus {
        color: #28a745 !important;
        border-color: #28a745 #28a745 #fff !important;
      }
      
      .nav-tabs .nav-link:hover {
        color: #28a745;
        border-color: #28a745;
      }
      
      /* Tab Content Styles */
      .tab-content > .tab-pane {
        display: none;
      }
      
      .tab-content > .active {
        display: block;
      }
      
      /* Loading Overlay */
      .table-loading-overlay {
        border-radius: 8px;
      }
      
      /* Ensure tab visibility */
      #penjemputanTabsContent .tab-pane.active.show {
        display: block !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
    `;

    // Remove existing style if exists
    const existingStyle = document.getElementById("penjemputan-tab-styles");
    if (existingStyle) {
      existingStyle.remove();
    }

    document.head.appendChild(style);
  }

  // Modifikasi method render() untuk memanggil addTabStyles
  render() {
    this.sidebar.render();
    this.renderMainContent();
    this.addTabStyles(); // Tambahkan ini
    this.setupEventListeners();
    this.checkMobileView();
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
  }

  showLoading(show = true) {
    let loadingState = document.getElementById("loading-state");

    // Jika belum ada di DOM, buat elemen loading secara dinamis
    if (!loadingState) {
      loadingState = document.createElement("div");
      loadingState.id = "loading-state";
      loadingState.className = "loading-state text-center py-4";
      loadingState.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Memuat data...</p>
        `;
      const tabContent = document.querySelector(".tab-content");
      if (tabContent) tabContent.prepend(loadingState);
    }

    loadingState.style.display = show ? "block" : "none";

    // Sembunyikan semua tab sementara loading
    const tabContent = document.getElementById("penjemputanTabsContent");
    if (tabContent) {
      tabContent.style.display = show ? "none" : "block";
    }
  }

  renderApplicationsTable(applicationsData) {
    this.applicationsData = applicationsData || [];
    this.showLoading(false);

    const tables = {
      all: document.getElementById("body-all"),
      dijemput: document.getElementById("body-dijemput"),
      diantar: document.getElementById("body-diantar"),
    };

    // Kosongkan semua tabel
    Object.values(tables).forEach((tbody) => (tbody.innerHTML = ""));

    this.applicationsData.forEach((app) => {
      const opsi = this.normalizeStatus(app.status || "");
      const rowHTML = this.renderApplicationRow(app);

      // Semua
      tables.all.innerHTML += rowHTML;

      // Filter ke tab yang sesuai
      if (opsi === "dijemput") {
        tables.dijemput.innerHTML += rowHTML;
      } else if (opsi === "antar sendiri") {
        tables.diantar.innerHTML += rowHTML;
      }
    });

    this.updateStats();
    this.updateTabBadges();
    this.initDataTables();
  }

  renderApplicationRow(app) {
    const formattedDateStart = this.formatDate(app.tanggal_awal);
    const formattedDateEnd = this.formatDate(app.tanggal_akhir);
    const formattedPrice = this.formatCurrency(app.price || 0);
    const formattedTotalPrice = this.formatCurrency(app.totalPrice || 0);
    const formattedOngkir = this.formatCurrency(app.ongkir || 0);

    return `
      <tr>
        <td>${app.category || "-"}</td>
        <td>${app.weight || 0} kg</td>
        <td>${formattedPrice}</td>
        <td>${formattedTotalPrice}</td>
        <td>${formattedOngkir}</td>
        <td>${app.address || "-"}</td>
        <td>${formattedDateStart} - ${formattedDateEnd}</td>
        <td>${this.normalizeStatus(app.status)}</td>
      </tr>
    `;
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("Rp", "Rp ");
  }

  normalizeStatus(status) {
    const s = (status || "").toLowerCase();
    if (s.includes("dijemput")) return "dijemput";
    if (s.includes("antar")) return "antar sendiri";
    return s;
  }

  getStatusStyles(status) {
    const statusMap = {
      dijemput: {
        class: "status-shipped",
        icon: "bi-truck",
        label: "Dijemput",
      },
      diantar: {
        class: "status-completed",
        icon: "bi-check-circle",
        label: "Diantar",
      },
    };

    return (
      statusMap[status] || {
        class: "status-pending",
        icon: "bi-hourglass-split",
        label: status || "Unknown",
      }
    );
  }

  formatDate(date) {
    if (!date) return "N/A";

    const d = new Date(date);
    if (isNaN(d.getTime())) return "N/A";

    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  initDataTables() {
    const tableIds = ["table-all", "table-dijemput", "table-diantar"];
    tableIds.forEach((id) => {
      if ($.fn.DataTable.isDataTable(`#${id}`)) {
        $(`#${id}`).DataTable().destroy();
      }
      $(`#${id}`).DataTable({
        responsive: true,
        pageLength: 10,
        language: {
          search: "Cari:",
          lengthMenu: "Tampilkan _MENU_ data per halaman",
          info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
          paginate: {
            next: ">",
            previous: "<",
          },
          zeroRecords: "Tidak ada data yang cocok",
        },
      });
    });
  }

  updateStats() {
    if (!this.applicationsData) return;

    this.statsData = {
      total: this.applicationsData.length,
      dijemput: this.applicationsData.filter(
        (item) => this.normalizeStatus(item.status) === "dijemput"
      ).length,
      diantar: this.applicationsData.filter(
        (item) => this.normalizeStatus(item.status) === "diantar"
      ).length,
    };

    // Update stat cards
    const totalStat = document.getElementById("stat-total-penjemputan");
    const dijemputStat = document.getElementById("stat-dijemput");
    const diantarStat = document.getElementById("stat-diantar");

    if (totalStat) totalStat.textContent = this.statsData.total;
    if (dijemputStat) dijemputStat.textContent = this.statsData.dijemput;
    if (diantarStat) diantarStat.textContent = this.statsData.diantar;
  }

  updateTabBadges() {
    if (!this.applicationsData) return;

    const counts = {
      all: this.applicationsData.length,
      dijemput: this.applicationsData.filter(
        (item) => this.normalizeStatus(item.status) === "dijemput"
      ).length,
      diantar: this.applicationsData.filter(
        (item) => this.normalizeStatus(item.status) === "antar sendiri"
      ).length,
    };

    // Update tab badges
    Object.keys(counts).forEach((status) => {
      const badge = document.getElementById(`badge-${status}`);
      if (badge) badge.textContent = counts[status];
    });
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

  renderDashboardData(applicationsData) {
    this.renderApplicationsTable(applicationsData);
  }

  clearSelection() {
    // Method ini bisa dikosongkan karena tidak ada selection yang perlu di-clear
  }

  removeEventListeners() {
    this.eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
    this.eventListeners = [];
  }

  destroy() {
    this.removeEventListeners();
    if (this.dataTable) {
      this.dataTable.destroy();
      this.dataTable = null;
    }
  }
}
