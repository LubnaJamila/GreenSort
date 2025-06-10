// src/pages/dashboard-user/formOngkirView.js
import "../../assets/styles/sidebar.css";
import "../../assets/styles/rekening.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class FormOngkirView {
  constructor() {
    this.app = document.getElementById("content");
    this.sidebar = new SidebarView();
    this.eventListeners = [];
    this.isMobile = window.matchMedia("(max-width: 768px)").matches;
    this.sidebarCollapsed = false;
    this.applicationData = null;
    this.masterAlamat = [];
    this.selectedDeliveryMethod = "mengantar"; // default
  }

  render(applicationData = null) {
    this.applicationData = applicationData;
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
                            <div class="d-flex align-items-center mb-3">    
                                <div>
                                    <h2>Form Ongkos Kirim</h2>
                                    <p class="text-dark mb-0">Detail pengajuan dan pengaturan pengiriman</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="user-profile">
                            <img id="user-avatar" src="${userPlaceholder}" alt="User">
                            <span id="user-name">Loading...</span>
                        </div>
                    </div>
                </header>
        
                <div class="rekening-section">
                    <div class="section-header">
                        <h2 class="section-title">Detail Ongkos Kirim</h2>
                    </div>

                    <div class="row">
                        <!-- Detail Sampah Card -->
                        <div class="col-md-6 mb-4">
                            <div class="card border-0 shadow-sm">
                                <div class="card-header bg-primary text-white">
                                    <h5 class="mb-0"><i class="bi bi-recycle me-2"></i>Detail Sampah</h5>
                                </div>
                                <div class="card-body">
                                    <div class="text-center mb-3">
                                        <img id="sampah-image" src="" alt="Gambar Sampah" 
                                             class="img-fluid rounded shadow-sm" 
                                             style="max-height: 200px; object-fit: cover;">
                                    </div>
                                    
                                    <div class="detail-info">
                                        <div class="row mb-2">
                                            <div class="col-5"><strong>Nama Lengkap:</strong></div>
                                            <div class="col-7" id="nama-lengkap">-</div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-5"><strong>No. HP:</strong></div>
                                            <div class="col-7" id="no-hp">-</div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-5"><strong>Kategori Sampah:</strong></div>
                                            <div class="col-7" id="kategori-sampah">-</div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-5"><strong>Berat Sampah:</strong></div>
                                            <div class="col-7" id="berat-sampah">-</div>
                                        </div>
                                        <div class="row mb-0">
                                            <div class="col-5"><strong>Harga Sampah:</strong></div>
                                            <div class="col-7" id="harga-sampah">-</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Form Pengiriman Card -->
                        <div class="col-md-6 mb-4">
                            <div class="card border-0 shadow-sm">
                                <div class="card-header bg-success text-white">
                                    <h5 class="mb-0"><i class="bi bi-truck me-2"></i>Metode Pengiriman</h5>
                                </div>
                                <div class="card-body">
                                    <!-- Radio Button Pilihan Pengiriman -->
                                    <div class="mb-4">
                                        <label class="form-label fw-bold">Pilih Metode Pengiriman:</label>
                                        <div class="form-check mb-2">
                                            <input class="form-check-input" type="radio" 
                                                   name="delivery-method" id="mengantar" value="mengantar" checked>
                                            <label class="form-check-label" for="mengantar">
                                                <i class="bi bi-person-walking me-2"></i>Mengantar Sendiri
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" 
                                                   name="delivery-method" id="dijemput" value="dijemput">
                                            <label class="form-check-label" for="dijemput">
                                                <i class="bi bi-truck me-2"></i>Dijemput
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <!-- Form Section -->
                                    <div id="delivery-form-section">
                                        <!-- Mengantar Sendiri Form -->
                                        <form id="mengantar-form" class="delivery-form">
                                            <div class="alert alert-info">
                                                <i class="bi bi-info-circle me-2"></i>
                                                Silakan datang ke alamat berikut untuk mengantar sampah:
                                            </div>
                                            
                                            <div class="mb-3">
                                                <label class="form-label fw-bold">Alamat Tujuan:</label>
                                                <div class="card bg-light">
                                                    <div class="card-body">
                                                        <div class="d-flex justify-content-between align-items-start">
                                                            <div>
                                                                <p id="alamat-tujuan" class="mb-0">
                                                                    Jl. Contoh Alamat No. 123, Kecamatan ABC, 
                                                                    Kabupaten XYZ, Jawa Timur 12345
                                                                </p>
                                                            </div>
                                                            <a href="#" id="lokasi-link" class="btn btn-outline-primary btn-sm" 
                                                               title="Lihat Lokasi di Peta">
                                                                <i class="bi bi-geo-alt-fill"></i>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="mb-3">
                                                <label for="pilih-rekening" class="form-label fw-bold">Pilih rekening Penjemputan:</label>
                                                <select class="form-select" id="rekening-user-mengantar" name="rekening_id" required>
                                                    <option value="">-- Pilih rekening --</option>
                                                </select>
                                            </div>
                                            
                                            <div class="mb-3">
                                                <label class="form-label fw-bold">Total Harga:</label>
                                                <div class="input-group">
                                                    <span class="input-group-text">Rp</span>
                                                    <input type="text" class="form-control fw-bold text-success" 
                                                           id="total-harga-mengantar" value="0" readonly>
                                                </div>
                                                <small class="text-muted">Total harga yang akan Anda terima</small>
                                            </div>

                                            <div class="mb-3">
                                              <label class="form-label fw-bold">Estimasi Tanggal Mulai Pengantaran:</label>
                                              <input type="date" class="form-control" id="estimasi-mulai-mengantar" readonly>
                                            </div>
                                            <div class="mb-3">
                                              <label class="form-label fw-bold">Estimasi Tanggal Selesai Pengantaran:</label>
                                              <input type="date" class="form-control" id="estimasi-selesai-mengantar" readonly>
                                            </div>
                                            
                                            <div class="mt-4 text-end">
                                                <button type="button" class="btn btn-secondary me-2 cancel-btn">
                                                    Batal
                                                </button>
                                                <button type="submit" class="btn btn-primary submit-btn">
                                                    <i class="bi bi-check-lg me-2"></i>Konfirmasi
                                                </button>
                                            </div>
                                        </form>
                                        
                                        <!-- Dijemput Form -->
                                        <form id="dijemput-form" class="delivery-form" style="display: none;">
                                            <div class="mb-3">
                                                <label class="form-label fw-bold">Alamat Bank Sampah:</label>
                                                <div class="card bg-light">
                                                    <div class="card-body">
                                                        <p id="alamat-user" class="mb-0">Loading alamat...</p>
                                                    </div>
                                                    <input type="hidden" id="latitude" name="latitude">
                                                    <input type="hidden" id="longitude" name="longitude">
                                                </div>
                                            </div>
                                            
                                            <div class="mb-3">
                                                <label for="pilih-alamat" class="form-label fw-bold">Pilih Alamat Penjemputan:</label>
                                                <select class="form-select" id="pilih-alamat" name="alamat_id" required>
                                                    <option value="">-- Pilih Alamat --</option>
                                                </select>
                                            </div>
                                            <div class="mb-3">
                                                <label for="pilih-rekening" class="form-label fw-bold">Pilih rekening Penjemputan:</label>
                                                <select class="form-select" id="rekening-user-dijemput" name="rekening_id" required>
                                                    <option value="">-- Pilih rekening --</option>
                                                </select>
                                            </div>
                                            
                                            <div class="mb-3">
                                                <label class="form-label fw-bold">Estimasi Jarak:</label>
                                                <div class="input-group">
                                                    <span class="input-group-text"><i class="bi bi-rulers"></i></span>
                                                    <input type="text" class="form-control" id="estimasi-jarak" 
                                                           value="Pilih alamat terlebih dahulu" readonly>
                                                    <span class="input-group-text">km</span>
                                                </div>
                                            </div>
                                            
                                            <div class="mb-3">
                                                <label class="form-label fw-bold">Ongkos Kirim:</label>
                                                <div class="input-group">
                                                    <span class="input-group-text">Rp</span>
                                                    <input type="text" class="form-control text-danger" id="ongkir" 
                                                           name="ongkir" value="0" readonly>
                                                </div>
                                                <small class="text-muted">Ongkos kirim akan dihitung otomatis berdasarkan jarak</small>
                                            </div>
                                            
                                            <div class="mb-3">
                                                <label class="form-label fw-bold">Total Harga:</label>
                                                <div class="input-group">
                                                    <span class="input-group-text">Rp</span>
                                                    <input type="text" class="form-control" id="total-harga-dijemput" 
                                                           value="0" readonly>
                                                </div>
                                                <small class="text-muted">Harga sampah + ongkos kirim</small>
                                            </div>
                                            
                                            <div class="mb-3">
                                                <label class="form-label fw-bold">Pendapatan Anda:</label>
                                                <div class="input-group">
                                                    <span class="input-group-text">Rp</span>
                                                    <input type="text" class="form-control fw-bold text-success" 
                                                           id="pendapatan" value="0" readonly>
                                                </div>
                                                <small class="text-muted">Harga sampah - ongkos kirim</small>
                                            </div>
                                            
                                            <div class="mb-3">
                                              <label class="form-label fw-bold">Estimasi Tanggal Mulai Penjemputan:</label>
                                              <input type="date" class="form-control" id="estimasi-mulai-dijemput" readonly>
                                            </div>
                                            <div class="mb-3">
                                              <label class="form-label fw-bold">Estimasi Tanggal Selesai Penjemputan:</label>
                                              <input type="date" class="form-control" id="estimasi-selesai-dijemput" readonly>
                                            </div>

                                            <div class="mt-4 text-end">
                                                <button type="button" class="btn btn-secondary me-2 cancel-btn">
                                                    Batal
                                                </button>
                                                <button type="submit" class="btn btn-primary submit-btn">
                                                    <i class="bi bi-check-lg me-2"></i>Konfirmasi
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  populateApplicationData(data) {
    if (!data) return;

    this.applicationData = data;

    // Format currency
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount);
    };

    const sampahImage = document.getElementById("sampah-image");
    if (sampahImage && data.gambarSampah) {
      sampahImage.src = data.gambarSampah;
    }

    document.getElementById("nama-lengkap").textContent =
      data.namaLengkap || "-";
    document.getElementById("no-hp").textContent = data.noHp || "-";
    document.getElementById("kategori-sampah").textContent =
      data.kategoriSampah || data.jenisSampah || "-";
    document.getElementById("berat-sampah").textContent = `${
      data.beratSampah || data.kuantitas || "-"
    } kg`;
    document.getElementById("harga-sampah").textContent = data.hargaSampah
      ? formatCurrency(data.hargaSampah)
      : "-";

    // Tambahkan atau update Total Harga
    let totalHargaEl = document.getElementById("total-harga-sampah");
    if (!totalHargaEl) {
      const hargaContainer =
        document.getElementById("harga-sampah").parentElement.parentElement;
      const row = document.createElement("div");
      row.className = "row mb-0";
      row.innerHTML = `
        <div class="col-5"><strong>Total Harga:</strong></div>
        <div class="col-7" id="total-harga-sampah">${formatCurrency(
          data.totalHarga
        )}</div>
      `;
      hargaContainer.parentElement.appendChild(row);
    } else {
      totalHargaEl.textContent = formatCurrency(data.totalHarga);
    }

    // Kirim total harga dari presenter langsung
    this.updateTotalHarga(data.totalHarga || 0, 0);
  }

  // Gabungan: tampilkan alamat lengkap admin tanpa konflik dengan displayUserAlamatInfo()
  populateUserAddress(adminAlamat) {
    const alamatUser = document.getElementById("alamat-user");
    const latInput = document.getElementById("latitude");
    const lngInput = document.getElementById("longitude");

    const latDisplay = document.getElementById("lat-display");
    const lngDisplay = document.getElementById("lng-display");

    // Ambil alamat lengkap dari dua kemungkinan field
    const alamatLengkap =
      (adminAlamat?.alamat && adminAlamat.alamat.trim()) ||
      (adminAlamat?.alamat_lengkap && adminAlamat.alamat_lengkap.trim()) ||
      null;

    console.log("Alamat yang akan ditampilkan:", alamatLengkap);

    if (alamatUser) {
      alamatUser.textContent = alamatLengkap || "Alamat belum tersedia";
    }

    if (latInput) latInput.value = adminAlamat?.latitude || "";
    if (lngInput) lngInput.value = adminAlamat?.longitude || "";

    if (latDisplay) latDisplay.textContent = adminAlamat?.latitude || "-";
    if (lngDisplay) lngDisplay.textContent = adminAlamat?.longitude || "-";

    // Juga update bagian displayUserAlamatInfo jika diperlukan
    const alamatInfo = document.getElementById("alamat-user-info");
    if (alamatInfo) {
      alamatInfo.textContent = alamatLengkap || "-";
    }
  }

  populateMasterAlamat(alamatList) {
    this.masterAlamat = alamatList;
    const selectAlamat = document.getElementById("pilih-alamat");

    if (selectAlamat) {
      selectAlamat.innerHTML = '<option value="">-- Pilih Alamat --</option>';

      alamatList.forEach((alamat) => {
        const option = document.createElement("option");
        option.value = alamat.id;
        option.textContent = `${alamat.nama} - ${alamat.alamat}`;
        option.dataset.jarak = alamat.jarak || 0;
        selectAlamat.appendChild(option);
      });
    }
  }

  displayUserRekening(rekeningList) {
    const ids = ["rekening-user-mengantar", "rekening-user-dijemput"];

    ids.forEach((id) => {
      const selectEl = document.getElementById(id);
      if (!selectEl) return;

      selectEl.innerHTML = '<option value="">-- Pilih rekening --</option>';

      if (!rekeningList || rekeningList.length === 0) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Belum ada rekening.";
        selectEl.appendChild(option);
      } else {
        rekeningList.forEach((rekening) => {
          const option = document.createElement("option");
          option.value = rekening.id_rekening;
          option.textContent = `${rekening.nama_bank} - ${rekening.no_rek} a.n ${rekening.nama_pemilik}`;
          selectEl.appendChild(option);
        });
      }
    });
  }

  // Perbarui updateEstimasiJarak agar bagian DIJEMPUT gunakan totalHarga dari presenter
  updateEstimasiJarak(jarak, ongkir) {
    const estimasiJarakInput = document.getElementById("estimasi-jarak");
    const ongkirInput = document.getElementById("ongkir");

    if (estimasiJarakInput) {
      estimasiJarakInput.value = jarak ? `${jarak}` : "Tidak tersedia";
    }

    if (ongkirInput) {
      const formatNumber = (amount) => {
        return new Intl.NumberFormat("id-ID").format(amount);
      };
      ongkirInput.value = ongkir ? formatNumber(ongkir) : "0";
    }

    // Update calculations for dijemput method
    if (this.selectedDeliveryMethod === "dijemput") {
      const totalHarga = this.applicationData?.totalHarga || 0;
      this.updateTotalHarga(totalHarga, ongkir || 0);
    }
  }

  // Perbarui updateTotalHarga agar bagian DIJEMPUT hanya tampil totalHarga dari presenter
  updateTotalHarga(totalHargaSampah, ongkir) {
    const formatNumber = (amount) => {
      return new Intl.NumberFormat("id-ID").format(amount);
    };

    if (this.selectedDeliveryMethod === "mengantar") {
      // Total harga = totalHargaSampah (tanpa ongkir)
      const totalHargaMengantar = document.getElementById(
        "total-harga-mengantar"
      );
      if (totalHargaMengantar) {
        totalHargaMengantar.value = formatNumber(totalHargaSampah);
      }
    } else {
      // Dijemput: total harga TIDAK ditambah ongkir
      // Pendapatan = totalHargaSampah - ongkir
      const totalHarga = totalHargaSampah; // ❗ hanya total harga dari presenter
      const pendapatan = totalHargaSampah - (ongkir || 0);

      const totalHargaDijemput = document.getElementById(
        "total-harga-dijemput"
      );
      const pendapatanInput = document.getElementById("pendapatan");

      if (totalHargaDijemput) {
        totalHargaDijemput.value = formatNumber(totalHarga);
      }

      if (pendapatanInput) {
        const nilaiTampil =
          pendapatan < 0
            ? "-" + formatNumber(Math.abs(pendapatan))
            : formatNumber(pendapatan);

        pendapatanInput.value = nilaiTampil;

        if (pendapatan <= 0) {
          pendapatanInput.classList.remove("text-success");
          pendapatanInput.classList.add("text-danger");
        } else {
          pendapatanInput.classList.remove("text-danger");
          pendapatanInput.classList.add("text-success");
        }
      }
    }
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

    // Cancel buttons
    const cancelBtns = document.querySelectorAll(".cancel-btn");
    cancelBtns.forEach((btn) => {
      const handler = () => this.handleCancel();
      btn.addEventListener("click", handler);
      this.eventListeners.push({ element: btn, type: "click", handler });
    });

    // Radio button changes
    const deliveryRadios = document.querySelectorAll(
      'input[name="delivery-method"]'
    );
    deliveryRadios.forEach((radio) => {
      const handler = (e) => this.handleDeliveryMethodChange(e.target.value);
      radio.addEventListener("change", handler);
      this.eventListeners.push({ element: radio, type: "change", handler });
    });

    // Alamat dropdown change
    const pilihAlamat = document.getElementById("pilih-alamat");
    if (pilihAlamat) {
      const handler = (e) => this.handleAlamatChange(e.target.value);
      pilihAlamat.addEventListener("change", handler);
      this.eventListeners.push({
        element: pilihAlamat,
        type: "change",
        handler,
      });
    }

    // Form submit for both forms
    const mengantarForm = document.getElementById("mengantar-form");
    const dijemputForm = document.getElementById("dijemput-form");

    if (mengantarForm) {
      const handler = (e) => this.handleFormSubmit(e, "mengantar");
      mengantarForm.addEventListener("submit", handler);
      this.eventListeners.push({
        element: mengantarForm,
        type: "submit",
        handler,
      });
    }

    if (dijemputForm) {
      const handler = (e) => this.handleFormSubmit(e, "dijemput");
      dijemputForm.addEventListener("submit", handler);
      this.eventListeners.push({
        element: dijemputForm,
        type: "submit",
        handler,
      });
    }
  }

  handleDeliveryMethodChange(method) {
    this.selectedDeliveryMethod = method;

    const mengantarForm = document.getElementById("mengantar-form");
    const dijemputForm = document.getElementById("dijemput-form");

    if (method === "mengantar") {
      mengantarForm.style.display = "block";
      dijemputForm.style.display = "none";
      // Update total harga for mengantar
      const hargaSampah = this.applicationData?.hargaSampah || 0;
      this.updateTotalHarga(hargaSampah, 0);
    } else {
      mengantarForm.style.display = "none";
      dijemputForm.style.display = "block";
      // Reset alamat selection and calculations
      const pilihAlamat = document.getElementById("pilih-alamat");
      if (pilihAlamat) {
        pilihAlamat.value = "";
      }
      this.updateEstimasiJarak(null, null);
    }

    // Dispatch event to presenter
    const event = new CustomEvent("delivery-method-changed", {
      detail: { method: method },
    });
    document.dispatchEvent(event);
  }

  handleAlamatChange(alamatId) {
    if (!alamatId) {
      this.updateEstimasiJarak(null, null);
      return;
    }

    // Dispatch event to presenter
    const event = new CustomEvent("alamat-changed", {
      detail: { alamatId: alamatId },
    });
    document.dispatchEvent(event);
  }

  handleFormSubmit(e, method) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      applicationId: this.applicationData?.id,
      deliveryMethod: method,
      alamatId: method === "dijemput" ? formData.get("alamat_id") : null,
      ongkir: method === "dijemput" ? formData.get("ongkir") : "0",
    };

    // Dispatch event to presenter
    const event = new CustomEvent("form-submit", {
      detail: data,
    });
    document.dispatchEvent(event);
  }

  handleCancel() {
    if (
      confirm(
        "Apakah Anda yakin ingin membatalkan? Data yang telah diisi akan hilang."
      )
    ) {
      // Navigate back to previous page
      window.location.hash = "#/diterima";
    }
  }

  showLoading(show = true) {
    const submitBtns = document.querySelectorAll(".submit-btn");
    submitBtns.forEach((btn) => {
      if (show) {
        btn.disabled = true;
        btn.innerHTML =
          '<span class="spinner-border spinner-border-sm me-2"></span>Memproses...';
      } else {
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-check-lg me-2"></i>Konfirmasi';
      }
    });
  }

  showError(message) {
    // Create error alert
    const alertHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

    const deliveryFormSection = document.getElementById(
      "delivery-form-section"
    );
    if (deliveryFormSection) {
      deliveryFormSection.insertAdjacentHTML("afterbegin", alertHtml);

      // Auto remove after 5 seconds
      setTimeout(() => {
        const alert = deliveryFormSection.querySelector(".alert-danger");
        if (alert) {
          alert.remove();
        }
      }, 5000);
    }
  }

  showSuccess(message) {
    // Create success alert
    const alertHtml = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="bi bi-check-circle me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

    const deliveryFormSection = document.getElementById(
      "delivery-form-section"
    );
    if (deliveryFormSection) {
      deliveryFormSection.insertAdjacentHTML("afterbegin", alertHtml);

      // Auto remove after 3 seconds then redirect
      setTimeout(() => {
        window.location.hash = "#/diterima";
      }, 3000);
    }
  }

  displayUserInfo(user) {
    const userNameElement = document.getElementById("user-name");
    const userAvatarElement = document.getElementById("user-avatar");

    if (userNameElement && user) {
      userNameElement.textContent = user.name || user.username;
    }

    if (userAvatarElement && user && user.avatar) {
      userAvatarElement.src = user.avatar;
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

  removeEventListeners() {
    this.eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
    this.eventListeners = [];
  }

  destroy() {
    this.removeEventListeners();

    if (this.sidebar) {
      this.sidebar.destroy();
    }
  }
}
