// src/pages/alamat/tambahAlamatView.js
import "../../assets/styles/rekening.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class TambahAlamatView {
  constructor() {
    this.app = document.getElementById("content");
    this.sidebarView = new SidebarView();
    this.isMobile = window.matchMedia("(max-width: 768px)").matches;
    this.sidebarCollapsed = false;
    this.eventListeners = [];

    // API endpoints
    this.apiBaseUrl = "https://www.emsifa.com/api-wilayah-indonesia/api";

    // Cache untuk menyimpan data yang sudah dimuat
    this.cache = {
      provinces: null,
      regencies: {},
      districts: {},
      villages: {},
    };
  }

  render() {
    this.sidebarView.render();
    this.renderMainContent();
    this.setupEventListeners();
    this.checkMobileView();
    this.loadProvinces(); // Load provinces saat render
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
                        <h2>Tambah Alamat</h2>
                        <p class="text-dark mb-4">Input Alamat Pengiriman.</p>
                    </div>
                    
                    <div class="user-profile">
                        <img id="user-avatar" src="${userPlaceholder}" alt="User">
                        <span id="user-name">Loading...</span>
                    </div>
                </div>
            </header>

            <div class="alamat-section">
                <div class="form-section">
                    <form id="alamatForm" class="form">
                        <!-- Row 1: Provinsi dan Kabupaten -->
                        <div class="form-row-group">
                            <div class="form-group">
                                <label for="provinsi" class="form-label">Pilih Provinsi</label>
                                <select class="form-control" id="provinsi" required>
                                    <option value="">Loading provinsi...</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="kabupaten" class="form-label">Pilih Kabupaten/Kota</label>
                                <select class="form-control" id="kabupaten" required disabled>
                                    <option value="">Pilih provinsi terlebih dahulu</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Row 2: Kecamatan dan Desa/Kelurahan -->
                        <div class="form-row-group">
                            <div class="form-group">
                                <label for="kecamatan" class="form-label">Pilih Kecamatan</label>
                                <select class="form-control" id="kecamatan" required disabled>
                                    <option value="">Pilih kabupaten terlebih dahulu</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="desa" class="form-label">Pilih Desa/Kelurahan</label>
                                <select class="form-control" id="desa" required disabled>
                                    <option value="">Pilih kecamatan terlebih dahulu</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Alamat Lengkap -->
                        <div class="form-group">
                            <label for="alamatLengkap" class="form-label">Alamat Lengkap</label>
                            <textarea class="form-control" id="alamatLengkap" rows="4" placeholder="Masukkan alamat lengkap Anda..." required></textarea>
                        </div>
                        
                        <!-- Map Section -->
                        <div class="form-group">
                            <label class="form-label">Spesifikkan Alamat Anda</label>
                            <div class="map-container">
                                <div class="map-placeholder">
                                    <div class="text-center">
                                        <i class="fas fa-map-marker-alt fa-3x mb-3"></i>
                                        <br>
                                        <strong>Peta Interaktif</strong>
                                        <br>
                                        <small>Klik untuk menentukan lokasi tepat Anda</small>
                                    </div>
                                </div>
                                <div class="map-controls">
                                    <div class="map-control-btn" title="Zoom In">
                                        <i class="fas fa-plus"></i>
                                    </div>
                                    <div class="map-control-btn" title="Zoom Out">
                                        <i class="fas fa-minus"></i>
                                    </div>
                                    <div class="map-control-btn" title="My Location">
                                        <i class="fas fa-crosshairs"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Submit Button -->
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save me-2"></i>Simpan
                            </button>
                            <button type="button" id="btn-kembali" class="btn btn-secondary">Kembali</button>
                        </div>
                    </form>
                </div>
            </div>
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

    // Form validation untuk dropdown dependencies
    this.setupFormValidation();
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

  setupFormValidation() {
    const provinsi = document.getElementById("provinsi");
    const kabupaten = document.getElementById("kabupaten");
    const kecamatan = document.getElementById("kecamatan");
    const desa = document.getElementById("desa");

    if (provinsi) {
      const handler = () => this.onProvinsiChange();
      provinsi.addEventListener("change", handler);
      this.eventListeners.push({ element: provinsi, type: "change", handler });
    }

    if (kabupaten) {
      const handler = () => this.onKabupatenChange();
      kabupaten.addEventListener("change", handler);
      this.eventListeners.push({ element: kabupaten, type: "change", handler });
    }

    if (kecamatan) {
      const handler = () => this.onKecamatanChange();
      kecamatan.addEventListener("change", handler);
      this.eventListeners.push({ element: kecamatan, type: "change", handler });
    }
  }

  // API Methods
  async fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  async loadProvinces() {
    const provinsiSelect = document.getElementById("provinsi");

    try {
      // Cek cache terlebih dahulu
      if (this.cache.provinces) {
        this.populateProvinces(this.cache.provinces);
        return;
      }

      provinsiSelect.innerHTML =
        '<option value="">Loading provinsi...</option>';

      const provinces = await this.fetchData(
        `${this.apiBaseUrl}/provinces.json`
      );
      this.cache.provinces = provinces;
      this.populateProvinces(provinces);
    } catch (error) {
      console.error("Error loading provinces:", error);
      provinsiSelect.innerHTML =
        '<option value="">Error loading provinsi</option>';
    }
  }

  populateProvinces(provinces) {
    const provinsiSelect = document.getElementById("provinsi");
    provinsiSelect.innerHTML = '<option value="">Pilih Provinsi</option>';

    provinces.forEach((province) => {
      const option = document.createElement("option");
      option.value = province.id;
      option.textContent = province.name;
      provinsiSelect.appendChild(option);
    });
  }

  async onProvinsiChange() {
    const provinsiSelect = document.getElementById("provinsi");
    const kabupatenSelect = document.getElementById("kabupaten");
    const kecamatanSelect = document.getElementById("kecamatan");
    const desaSelect = document.getElementById("desa");

    const provinsiId = provinsiSelect.value;

    // Reset dependent dropdowns
    kecamatanSelect.innerHTML =
      '<option value="">Pilih kabupaten terlebih dahulu</option>';
    kecamatanSelect.disabled = true;
    desaSelect.innerHTML =
      '<option value="">Pilih kecamatan terlebih dahulu</option>';
    desaSelect.disabled = true;

    if (!provinsiId) {
      kabupatenSelect.innerHTML =
        '<option value="">Pilih provinsi terlebih dahulu</option>';
      kabupatenSelect.disabled = true;
      return;
    }

    try {
      // Cek cache
      if (this.cache.regencies[provinsiId]) {
        this.populateKabupaten(this.cache.regencies[provinsiId]);
        return;
      }

      kabupatenSelect.innerHTML =
        '<option value="">Loading kabupaten...</option>';
      kabupatenSelect.disabled = false;

      const regencies = await this.fetchData(
        `${this.apiBaseUrl}/regencies/${provinsiId}.json`
      );
      this.cache.regencies[provinsiId] = regencies;
      this.populateKabupaten(regencies);
    } catch (error) {
      console.error("Error loading regencies:", error);
      kabupatenSelect.innerHTML =
        '<option value="">Error loading kabupaten</option>';
    }
  }

  populateKabupaten(regencies) {
    const kabupatenSelect = document.getElementById("kabupaten");
    kabupatenSelect.innerHTML =
      '<option value="">Pilih Kabupaten/Kota</option>';
    kabupatenSelect.disabled = false;

    regencies.forEach((regency) => {
      const option = document.createElement("option");
      option.value = regency.id;
      option.textContent = regency.name;
      kabupatenSelect.appendChild(option);
    });
  }

  async onKabupatenChange() {
    const kabupatenSelect = document.getElementById("kabupaten");
    const kecamatanSelect = document.getElementById("kecamatan");
    const desaSelect = document.getElementById("desa");

    const kabupatenId = kabupatenSelect.value;

    // Reset dependent dropdown
    desaSelect.innerHTML =
      '<option value="">Pilih kecamatan terlebih dahulu</option>';
    desaSelect.disabled = true;

    if (!kabupatenId) {
      kecamatanSelect.innerHTML =
        '<option value="">Pilih kabupaten terlebih dahulu</option>';
      kecamatanSelect.disabled = true;
      return;
    }

    try {
      // Cek cache
      if (this.cache.districts[kabupatenId]) {
        this.populateKecamatan(this.cache.districts[kabupatenId]);
        return;
      }

      kecamatanSelect.innerHTML =
        '<option value="">Loading kecamatan...</option>';
      kecamatanSelect.disabled = false;

      const districts = await this.fetchData(
        `${this.apiBaseUrl}/districts/${kabupatenId}.json`
      );
      this.cache.districts[kabupatenId] = districts;
      this.populateKecamatan(districts);
    } catch (error) {
      console.error("Error loading districts:", error);
      kecamatanSelect.innerHTML =
        '<option value="">Error loading kecamatan</option>';
    }
  }

  populateKecamatan(districts) {
    const kecamatanSelect = document.getElementById("kecamatan");
    kecamatanSelect.innerHTML = '<option value="">Pilih Kecamatan</option>';
    kecamatanSelect.disabled = false;

    districts.forEach((district) => {
      const option = document.createElement("option");
      option.value = district.id;
      option.textContent = district.name;
      kecamatanSelect.appendChild(option);
    });
  }

  async onKecamatanChange() {
    const kecamatanSelect = document.getElementById("kecamatan");
    const desaSelect = document.getElementById("desa");

    const kecamatanId = kecamatanSelect.value;

    if (!kecamatanId) {
      desaSelect.innerHTML =
        '<option value="">Pilih kecamatan terlebih dahulu</option>';
      desaSelect.disabled = true;
      return;
    }

    try {
      // Cek cache
      if (this.cache.villages[kecamatanId]) {
        this.populateDesa(this.cache.villages[kecamatanId]);
        return;
      }

      desaSelect.innerHTML = '<option value="">Loading desa...</option>';
      desaSelect.disabled = false;

      const villages = await this.fetchData(
        `${this.apiBaseUrl}/villages/${kecamatanId}.json`
      );
      this.cache.villages[kecamatanId] = villages;
      this.populateDesa(villages);
    } catch (error) {
      console.error("Error loading villages:", error);
      desaSelect.innerHTML = '<option value="">Error loading desa</option>';
    }
  }

  populateDesa(villages) {
    const desaSelect = document.getElementById("desa");
    desaSelect.innerHTML = '<option value="">Pilih Desa/Kelurahan</option>';
    desaSelect.disabled = false;

    villages.forEach((village) => {
      const option = document.createElement("option");
      option.value = village.id;
      option.textContent = village.name;
      desaSelect.appendChild(option);
    });
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

  removeEventListeners() {
    this.eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
    this.eventListeners = [];
  }

  validateForm() {
    const requiredFields = [
      "provinsi",
      "kabupaten",
      "kecamatan",
      "desa",
      "alamatLengkap",
    ];
    const errors = [];

    requiredFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (!field.value.trim()) {
        errors.push(`${field.labels[0]?.textContent || fieldId} harus diisi`);
        field.classList.add("is-invalid");
      } else {
        field.classList.remove("is-invalid");
      }
    });

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }

  getSelectedText(selectId) {
    const select = document.getElementById(selectId);
    return select.selectedOptions[0]?.text || "";
  }

  bindFormSubmit(handler) {
    const form = document.getElementById("alamatForm");
    if (form) {
      const formHandler = (e) => {
        e.preventDefault();

        const validation = this.validateForm();
        if (!validation.isValid) {
          alert(
            "Mohon lengkapi semua field yang required:\n" +
              validation.errors.join("\n")
          );
          return;
        }

        const data = {
          provinsi: document.getElementById("provinsi").value,
          kabupaten: document.getElementById("kabupaten").value,
          kecamatan: document.getElementById("kecamatan").value,
          desa: document.getElementById("desa").value,
          alamatLengkap: document.getElementById("alamatLengkap").value,
          // Get selected text for display purposes
          provinsiText: this.getSelectedText("provinsi"),
          kabupatenText: this.getSelectedText("kabupaten"),
          kecamatanText: this.getSelectedText("kecamatan"),
          desaText: this.getSelectedText("desa"),
        };

        handler(data);
      };
      form.addEventListener("submit", formHandler);
      this.eventListeners.push({
        element: form,
        type: "submit",
        handler: formHandler,
      });
    }
  }

  bindBackButton(handler) {
    const backBtn = document.getElementById("btn-kembali");
    if (backBtn) {
      const clickHandler = (e) => {
        e.preventDefault();
        handler();
      };
      backBtn.addEventListener("click", clickHandler);
      this.eventListeners.push({
        element: backBtn,
        type: "click",
        handler: clickHandler,
      });
    }
  }

  bindCancel(handler) {
    console.log("bindCancel called");
    // Buat temporary cancel button
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Kembali";
    cancelBtn.className = "btn btn-secondary";
    cancelBtn.onclick = handler;
  }

  destroy() {
    this.removeEventListeners();
  }
}
