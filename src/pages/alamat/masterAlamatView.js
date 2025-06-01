//src/pages/alamat/masterAlamatView.js
import "../../assets/styles/content.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class MasterAlamatView {
  constructor() {
    this.app = document.getElementById("content");
    this.sidebarView = new SidebarView();
    this.eventListeners = [];
    this.isMobile = window.matchMedia("(max-width: 768px)").matches;
    this.sidebarCollapsed = false;
    this.dataTable = null;

    // Disable DataTables warnings/alerts
    this.disableDataTablesWarnings();
  }

  // Method untuk menonaktifkan warning popup DataTables
  disableDataTablesWarnings() {
    if (typeof $ !== "undefined" && $.fn.dataTable) {
      // Disable all DataTables alerts
      $.fn.dataTable.ext.errMode = "none";

      // Override alert function for DataTables
      const originalAlert = window.alert;
      window.alert = function (message) {
        if (
          typeof message === "string" &&
          (message.includes("DataTables warning") ||
            message.includes("Cannot reinitialise DataTable") ||
            message.includes("Requested unknown parameter"))
        ) {
          console.warn("DataTables Warning (suppressed):", message);
          return;
        }
        originalAlert.call(window, message);
      };
    }
  }

  render() {
    this.sidebarView.render();

    this.app.innerHTML = `
            <!-- Mobile Menu Toggle -->
            <button id="mobile-menu-toggle" class="mobile-menu-btn">
                <i class="bi bi-list"></i>
            </button>
            <div class="sidebar-overlay"></div>

            <!-- Main Content -->
            <div class="main-content ${this.isMobile ? "full-width" : ""} ${
      this.sidebarCollapsed ? "collapsed" : ""
    }">
                <header>
                    <div class="header-content">
                        <div class="dashboard-header">
                            <h2>Data Master - Alamat</h2>
                            <p class="text-dark mb-4">Input Alamat Pengiriman</p>
                        </div>
                        <div class="user-profile">
                            <img id="user-avatar" src="${userPlaceholder}" alt="User">
                            <span id="user-name">Loading...</span>
                        </div>
                    </div>
                    <div class="table-actions">
                        <a href="#/master-alamat/tambah" class="classify-btn" data-route="tambahAlamat">
                            <i class="bi bi-plus-circle"></i>
                            <span class="nav-text">Tambah Alamat</span>
                        </a>
                    </div>
                </header>

                <div class="content-section">
                    <div class="content-header">
                        <h3>Daftar Alamat</h3>
                    </div>

                    <!-- Loading Indicator -->
                    <div id="loading-indicator" class="text-center" style="display: none;">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-2">Memuat data alamat...</p>
                    </div>

                    <!-- Error Message -->
                    <div id="error-message" class="alert alert-danger" style="display: none;"></div>

                    <!-- Success Message -->
                    <div id="success-message" class="alert alert-success" style="display: none;"></div>

                    <!-- Empty State -->
                    <div id="empty-state" class="text-center py-5" style="display: none;">
                        <i class="bi bi-geo-alt" style="font-size: 3rem; color: #ccc;"></i>
                        <h4 class="mt-3 text-muted">Belum Ada Alamat</h4>
                        <p class="text-muted">Anda belum memiliki alamat yang tersimpan.</p>
                        <a href="#/master-alamat/tambah" class="btn btn-primary">
                            <i class="bi bi-plus-circle"></i> Tambah Alamat Pertama
                        </a>
                    </div>

                    <!-- Data Table -->
                    <div id="table-container" class="table-responsive">
                        <table id="alamat-datatable" class="table table-striped" style="width:100%">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Provinsi</th>
                                    <th>Kabupaten/Kota</th>
                                    <th>Kecamatan</th>
                                    <th>Desa/Kelurahan</th>
                                    <th>Alamat Lengkap</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody id="alamat-table-body"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Confirmation Modal -->
            <div class="modal fade" id="confirmModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="confirmModalTitle">Konfirmasi</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body" id="confirmModalBody"></div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                            <button type="button" class="btn btn-danger" id="confirmModalConfirm">Ya, Hapus</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

    this.initDataTable();
    this.setupEventListeners();
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
  }

  bindAddAlamat(handler) {
    const tambahBtn = document.querySelector('[data-route="tambahAlamat"]');
    if (tambahBtn) {
      const clickHandler = (e) => {
        e.preventDefault();
        handler();
      };
      tambahBtn.addEventListener("click", clickHandler);
      this.eventListeners.push({
        element: tambahBtn,
        type: "click",
        handler: clickHandler,
      });
    }
  }

  bindEditAlamat(handler) {
    // Event delegation untuk tombol edit
    const tableContainer = document.getElementById("table-container");
    if (tableContainer) {
      const editHandler = (e) => {
        const editBtn = e.target.closest(".edit-btn");
        if (editBtn) {
          e.preventDefault();
          const alamatId = editBtn.getAttribute("data-id");
          handler(alamatId);
        }
      };
      tableContainer.addEventListener("click", editHandler);
      this.eventListeners.push({
        element: tableContainer,
        type: "click",
        handler: editHandler,
      });
    }
  }

  bindDeleteAlamat(handler) {
    // Event delegation untuk tombol delete
    const tableContainer = document.getElementById("table-container");
    if (tableContainer) {
      const deleteHandler = (e) => {
        const deleteBtn = e.target.closest(".delete-btn");
        if (deleteBtn) {
          e.preventDefault();
          const alamatId = deleteBtn.getAttribute("data-id");
          handler(alamatId);
        }
      };
      tableContainer.addEventListener("click", deleteHandler);
      this.eventListeners.push({
        element: tableContainer,
        type: "click",
        handler: deleteHandler,
      });
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

  displayUserInfo(user) {
    const userNameElement = document.getElementById("user-name");
    if (userNameElement && user) {
      userNameElement.textContent = user.name || user.username;
    }
  }

  // Method untuk menampilkan data alamat dari backend
  renderAlamatData(alamatData) {
    const emptyState = document.getElementById("empty-state");
    const tableContainer = document.getElementById("table-container");

    if (!alamatData || alamatData.length === 0) {
      // Tampilkan empty state jika tidak ada data
      emptyState.style.display = "block";
      tableContainer.style.display = "none";

      // Destroy DataTable jika ada
      this.destroyDataTable();
      return;
    }

    // Sembunyikan empty state dan tampilkan tabel
    emptyState.style.display = "none";
    tableContainer.style.display = "block";

    // Render data ke tabel
    this.renderAlamatTable(alamatData);
  }

  // Method untuk destroy DataTable dengan aman
  destroyDataTable() {
    try {
      if (this.dataTable) {
        // Jika ada instance DataTable yang disimpan
        this.dataTable.destroy();
        this.dataTable = null;
      } else if ($.fn.DataTable.isDataTable("#alamat-datatable")) {
        // Jika ada DataTable yang tidak disimpan di instance
        $("#alamat-datatable").DataTable().destroy();
      }
    } catch (error) {
      console.warn("Error destroying DataTable:", error);
      // Force remove DataTable jika error
      try {
        $("#alamat-datatable").removeClass("dataTable");
        $(".dataTables_wrapper").remove();
      } catch (e) {
        console.warn("Error in force cleanup:", e);
      }
    }
  }

  renderAlamatTable(alamatData) {
    // Destroy existing DataTable secara aman
    this.destroyDataTable();

    const tableBody = document.getElementById("alamat-table-body");
    if (!tableBody) return;

    const tableHTML = alamatData
      .map((alamat, index) => this.renderAlamatRow(alamat, index + 1))
      .join("");
    tableBody.innerHTML = tableHTML;

    // Reinitialize DataTable dengan data baru
    this.initDataTable();
  }

  renderAlamatRow(alamat, no) {
    return `
            <tr>
                <td>${no}</td>
                <td>${alamat.provinsi || "-"}</td>
                <td>${alamat.kabupaten || "-"}</td>
                <td>${alamat.kecamatan || "-"}</td>
                <td>${alamat.desa || "-"}</td>
                <td>${alamat.alamat_lengkap || "-"}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${
                          alamat.id_alamat
                        }">
                            <i class="bi bi-trash"></i> Hapus
                        </button>
                    </div>
                </td>
            </tr>
        `;
  }

  initDataTable() {
    try {
      // Destroy existing DataTable secara aman
      this.destroyDataTable();

      // Tunggu DOM ready dan pastikan element masih ada
      $(document).ready(() => {
        const tableElement = $("#alamat-datatable");

        // Pastikan element table masih ada di DOM
        if (tableElement.length === 0) {
          console.warn("Table element not found in DOM");
          return;
        }

        // Tambahkan delay kecil untuk memastikan DOM sudah ter-render
        setTimeout(() => {
          try {
            // Double check sebelum inisialisasi
            if (!$.fn.DataTable.isDataTable("#alamat-datatable")) {
              this.dataTable = tableElement.DataTable({
                responsive: true,
                retrieve: true, // Allow retrieval of existing table
                destroy: true, // Allow destruction of existing table
                language: {
                  search: "Cari:",
                  lengthMenu: "Tampilkan _MENU_ data per halaman",
                  info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
                  infoEmpty: "Menampilkan 0 sampai 0 dari 0 data",
                  infoFiltered: "(disaring dari _MAX_ total data)",
                  emptyTable: "Tidak ada data alamat",
                  paginate: {
                    first: "<<",
                    last: ">>",
                    next: ">",
                    previous: "<",
                  },
                },
                order: [[0, "asc"]], // Sort by nomor
                columnDefs: [
                  { orderable: false, targets: -1 }, // Disable sorting for action column
                ],
                processing: false,
                serverSide: false,
                deferRender: true,
              });
            }
          } catch (error) {
            console.warn("Error initializing DataTable:", error);
          }
        }, 100);
      });
    } catch (error) {
      console.warn("Error in initDataTable:", error);
    }
  }

  // Method untuk menampilkan loading indicator
  showLoading() {
    const loading = document.getElementById("loading-indicator");
    const tableContainer = document.getElementById("table-container");
    const emptyState = document.getElementById("empty-state");

    if (loading) loading.style.display = "block";
    if (tableContainer) tableContainer.style.display = "none";
    if (emptyState) emptyState.style.display = "none";
  }

  // Method untuk menyembunyikan loading indicator
  hideLoading() {
    const loading = document.getElementById("loading-indicator");
    if (loading) loading.style.display = "none";
  }

  // Method untuk menampilkan pesan error
  showError(message) {
    const errorElement = document.getElementById("error-message");
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = "block";

      // Auto hide after 5 seconds
      setTimeout(() => {
        errorElement.style.display = "none";
      }, 5000);
    }
  }

  // Method untuk menampilkan pesan sukses
  showSuccess(message) {
    const successElement = document.getElementById("success-message");
    if (successElement) {
      successElement.textContent = message;
      successElement.style.display = "block";

      // Auto hide after 3 seconds
      setTimeout(() => {
        successElement.style.display = "none";
      }, 3000);
    }
  }

  // Method untuk menampilkan dialog konfirmasi
  showConfirmDialog(title, message) {
    return new Promise((resolve) => {
      const modal = document.getElementById("confirmModal");
      const titleElement = document.getElementById("confirmModalTitle");
      const bodyElement = document.getElementById("confirmModalBody");
      const confirmBtn = document.getElementById("confirmModalConfirm");

      if (titleElement) titleElement.textContent = title;
      if (bodyElement) bodyElement.textContent = message;

      // Show modal
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();

      // Handle confirm button
      const confirmHandler = () => {
        bsModal.hide();
        resolve(true);
      };

      // Handle cancel/close
      const cancelHandler = () => {
        resolve(false);
      };

      confirmBtn.addEventListener("click", confirmHandler, { once: true });
      modal.addEventListener("hidden.bs.modal", cancelHandler, { once: true });
    });
  }

  removeEventListeners() {
    this.eventListeners.forEach(({ element, type, handler }) => {
      if (element) {
        element.removeEventListener(type, handler);
      }
    });
    this.eventListeners = [];
  }

  destroy() {
    console.log("Destroying MasterAlamatView");
    this.removeEventListeners();

    // Destroy DataTable dengan method yang aman
    this.destroyDataTable();

    if (this.sidebarView && this.sidebarView.destroy) {
      this.sidebarView.destroy();
    }
  }
}
