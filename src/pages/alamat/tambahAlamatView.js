// src/pages/alamat/tambahAlamatView.js
import "../../assets/styles/rekening.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconShadow from "leaflet/dist/images/marker-shadow.png";

export default class TambahAlamatView {
  constructor() {
    this.app = document.getElementById("content");
    this.sidebarView = new SidebarView();
    this.isMobile = window.matchMedia("(max-width: 768px)").matches;
    this.sidebarCollapsed = false;
    this.eventListeners = [];

    // Map related properties
    this.map = null;
    this.marker = null;
    this.currentLocation = null;

    // Event handlers (will be set by presenter)
    this.onProvinsiChangeHandler = null;
    this.onKabupatenChangeHandler = null;
    this.onKecamatanChangeHandler = null;
    this.onFormSubmitHandler = null;
    this.onCancelHandler = null;
  }

  render() {
    this.sidebarView.render();
    this.renderMainContent();
    this.setupEventListeners();
    this.checkMobileView();

    // Initialize map after content is rendered
    setTimeout(() => {
      this.initMap();
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
                        <form id="form-alamat" class="form">
                            <!-- Row 1: Provinsi dan Kabupaten -->
                            <div class="form-row-group">
                                <div class="form-group">
                                    <label for="provinsi" class="form-label">Pilih Provinsi</label>
                                    <select class="form-control" id="provinsi" name="provinsi" required>
                                        <option value="">Loading provinsi...</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="kabupaten" class="form-label">Pilih Kabupaten/Kota</label>
                                    <select class="form-control" id="kabupaten" name="kabupaten" required disabled>
                                        <option value="">Pilih provinsi terlebih dahulu</option>
                                    </select>
                                </div>
                            </div>
                            
                            <!-- Row 2: Kecamatan dan Desa/Kelurahan -->
                            <div class="form-row-group">
                                <div class="form-group">
                                    <label for="kecamatan" class="form-label">Pilih Kecamatan</label>
                                    <select class="form-control" id="kecamatan" name="kecamatan" required disabled>
                                        <option value="">Pilih kabupaten terlebih dahulu</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="desa" class="form-label">Pilih Desa/Kelurahan</label>
                                    <select class="form-control" id="desa" name="desa" required disabled>
                                        <option value="">Pilih kecamatan terlebih dahulu</option>
                                    </select>
                                </div>
                            </div>
                            
                            <!-- Alamat Lengkap -->
                            <div class="form-group">
                                <label for="alamatLengkap" class="form-label">Alamat Lengkap</label>
                                <textarea class="form-control" id="alamatLengkap" name="alamatLengkap" rows="4" 
                                         placeholder="Masukkan alamat lengkap Anda..." required></textarea>
                            </div>
                            
                            <!-- Map Section -->
                            <div class="form-group">
                                <label class="form-label">Spesifikkan Alamat Anda</label>
                                <div class="map-container">
                                    <div id="map" style="height: 100%; width: 100%;"></div>
                                    <div class="map-placeholder" id="mapPlaceholder">
                                        <div class="text-center">
                                            <i class="fas fa-map-marker-alt fa-3x mb-3"></i>
                                            <br>
                                            <strong>Peta Interaktif</strong>
                                            <br>
                                            <small>Klik untuk menentukan lokasi tepat Anda</small>
                                        </div>
                                    </div>
                                    <div class="map-controls">
                                        <div class="map-control-btn" id="zoomIn" title="Zoom In">
                                            <i class="fas fa-plus"></i>
                                        </div>
                                        <div class="map-control-btn" id="zoomOut" title="Zoom Out">
                                            <i class="fas fa-minus"></i>
                                        </div>
                                        <div class="map-control-btn" id="locateMe" title="My Location">
                                            <i class="fas fa-crosshairs"></i>
                                        </div>
                                    </div>
                                </div>
                                <input type="hidden" id="latitude" name="latitude">
                                <input type="hidden" id="longitude" name="longitude">
                            </div>
                            
                            <!-- Submit Button -->
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary" id="btn-simpan">
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

    // Form event listeners
    this.setupFormEventListeners();
  }

  setupFormEventListeners() {
    // Provinsi change
    const provinsi = document.getElementById("provinsi");
    if (provinsi && this.onProvinsiChangeHandler) {
      provinsi.addEventListener("change", this.onProvinsiChangeHandler);
      this.eventListeners.push({
        element: provinsi,
        type: "change",
        handler: this.onProvinsiChangeHandler,
      });
    }

    // Kabupaten change
    const kabupaten = document.getElementById("kabupaten");
    if (kabupaten && this.onKabupatenChangeHandler) {
      kabupaten.addEventListener("change", this.onKabupatenChangeHandler);
      this.eventListeners.push({
        element: kabupaten,
        type: "change",
        handler: this.onKabupatenChangeHandler,
      });
    }

    // Kecamatan change
    const kecamatan = document.getElementById("kecamatan");
    if (kecamatan && this.onKecamatanChangeHandler) {
      kecamatan.addEventListener("change", this.onKecamatanChangeHandler);
      this.eventListeners.push({
        element: kecamatan,
        type: "change",
        handler: this.onKecamatanChangeHandler,
      });
    }

    // Form submit - Updated to match presenter expectations
    const form = document.getElementById("form-alamat");
    if (form && this.onFormSubmitHandler) {
      const formHandler = (e) => {
        e.preventDefault();

        // Validate form before submitting
        const validation = this.validateForm();
        if (!validation.isValid) {
          this.showValidationErrors(validation.errors);
          return;
        }

        // Call the presenter's form submit handler
        this.onFormSubmitHandler(e);
      };
      form.addEventListener("submit", formHandler);
      this.eventListeners.push({
        element: form,
        type: "submit",
        handler: formHandler,
      });
    }

    // Cancel button
    const cancelBtn = document.getElementById("btn-kembali");
    if (cancelBtn && this.onCancelHandler) {
      const clickHandler = (e) => {
        e.preventDefault();
        this.onCancelHandler();
      };
      cancelBtn.addEventListener("click", clickHandler);
      this.eventListeners.push({
        element: cancelBtn,
        type: "click",
        handler: clickHandler,
      });
    }
  }

  // Set event handlers (called by presenter)
  setEventHandlers(handlers) {
    this.onProvinsiChangeHandler = handlers.onProvinsiChange;
    this.onKabupatenChangeHandler = handlers.onKabupatenChange;
    this.onKecamatanChangeHandler = handlers.onKecamatanChange;
    this.onFormSubmitHandler = handlers.onFormSubmit;
    this.onCancelHandler = handlers.onCancel;

    // Re-setup form event listeners with new handlers
    this.setupFormEventListeners();
  }

  // UI Update Methods
  populateProvinces(provinces) {
    const provinsiSelect = document.getElementById("provinsi");
    if (!provinsiSelect) return;

    provinsiSelect.innerHTML = '<option value="">Pilih Provinsi</option>';
    provinces.forEach((province) => {
      const option = document.createElement("option");
      option.value = province.id;
      option.textContent = province.name;
      provinsiSelect.appendChild(option);
    });
  }

  populateKabupaten(regencies) {
    const kabupatenSelect = document.getElementById("kabupaten");
    if (!kabupatenSelect) return;

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

  populateKecamatan(districts) {
    const kecamatanSelect = document.getElementById("kecamatan");
    if (!kecamatanSelect) return;

    kecamatanSelect.innerHTML = '<option value="">Pilih Kecamatan</option>';
    kecamatanSelect.disabled = false;

    districts.forEach((district) => {
      const option = document.createElement("option");
      option.value = district.id;
      option.textContent = district.name;
      kecamatanSelect.appendChild(option);
    });
  }

  populateDesa(villages) {
    const desaSelect = document.getElementById("desa");
    if (!desaSelect) return;

    desaSelect.innerHTML = '<option value="">Pilih Desa/Kelurahan</option>';
    desaSelect.disabled = false;

    villages.forEach((village) => {
      const option = document.createElement("option");
      option.value = village.id;
      option.textContent = village.name;
      desaSelect.appendChild(option);
    });
  }

  // Reset dependent dropdowns
  resetKabupatenOptions() {
    const kabupatenSelect = document.getElementById("kabupaten");
    const kecamatanSelect = document.getElementById("kecamatan");
    const desaSelect = document.getElementById("desa");

    if (kabupatenSelect) {
      kabupatenSelect.innerHTML =
        '<option value="">Pilih provinsi terlebih dahulu</option>';
      kabupatenSelect.disabled = true;
    }
    if (kecamatanSelect) {
      kecamatanSelect.innerHTML =
        '<option value="">Pilih kabupaten terlebih dahulu</option>';
      kecamatanSelect.disabled = true;
    }
    if (desaSelect) {
      desaSelect.innerHTML =
        '<option value="">Pilih kecamatan terlebih dahulu</option>';
      desaSelect.disabled = true;
    }
  }

  resetKecamatanOptions() {
    const kecamatanSelect = document.getElementById("kecamatan");
    const desaSelect = document.getElementById("desa");

    if (kecamatanSelect) {
      kecamatanSelect.innerHTML =
        '<option value="">Pilih kabupaten terlebih dahulu</option>';
      kecamatanSelect.disabled = true;
    }
    if (desaSelect) {
      desaSelect.innerHTML =
        '<option value="">Pilih kecamatan terlebih dahulu</option>';
      desaSelect.disabled = true;
    }
  }

  resetDesaOptions() {
    const desaSelect = document.getElementById("desa");
    if (desaSelect) {
      desaSelect.innerHTML =
        '<option value="">Pilih kecamatan terlebih dahulu</option>';
      desaSelect.disabled = true;
    }
  }

  // Loading states
  showLoading(selectId, message) {
    const select = document.getElementById(selectId);
    if (select) {
      select.innerHTML = `<option value="">${message}</option>`;
      select.disabled = false;
    }
  }

  showError(selectId, message) {
    const select = document.getElementById(selectId);
    if (select) {
      select.innerHTML = `<option value="">${message}</option>`;
    }
  }

  // Form validation and data
  getFormData() {
    return {
      provinsi: document.getElementById("provinsi")?.value || "",
      kabupaten: document.getElementById("kabupaten")?.value || "",
      kecamatan: document.getElementById("kecamatan")?.value || "",
      desa: document.getElementById("desa")?.value || "",
      alamatLengkap: document.getElementById("alamatLengkap")?.value || "",
      latitude: document.getElementById("latitude")?.value || "",
      longitude: document.getElementById("longitude")?.value || "",
      // Get selected text for display purposes
      provinsiText: this.getSelectedText("provinsi"),
      kabupatenText: this.getSelectedText("kabupaten"),
      kecamatanText: this.getSelectedText("kecamatan"),
      desaText: this.getSelectedText("desa"),
    };
  }

  getSelectedText(selectId) {
    const select = document.getElementById(selectId);
    return select?.selectedOptions[0]?.text || "";
  }

  validateForm() {
    const requiredFields = [
      { id: "provinsi", label: "Provinsi" },
      { id: "kabupaten", label: "Kabupaten/Kota" },
      { id: "kecamatan", label: "Kecamatan" },
      { id: "desa", label: "Desa/Kelurahan" },
      { id: "alamatLengkap", label: "Alamat Lengkap" },
      { id: "latitude", label: "Koordinat (klik pada peta)" },
      { id: "longitude", label: "Koordinat (klik pada peta)" },
    ];
    const errors = [];

    requiredFields.forEach(({ id, label }) => {
      const field = document.getElementById(id);
      if (!field?.value?.trim()) {
        errors.push(`${label} harus diisi`);
        field?.classList.add("is-invalid");
      } else {
        field?.classList.remove("is-invalid");
      }
    });

    // Validate coordinates if provided
    const lat = document.getElementById("latitude")?.value;
    const lng = document.getElementById("longitude")?.value;

    if (lat && (isNaN(lat) || lat < -90 || lat > 90)) {
      errors.push("Koordinat latitude tidak valid");
    }

    if (lng && (isNaN(lng) || lng < -180 || lng > 180)) {
      errors.push("Koordinat longitude tidak valid");
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }

  showValidationErrors(errors) {
    alert("Mohon lengkapi semua field yang required:\n" + errors.join("\n"));
  }

  // Success/Error messaging
  showSuccess(message) {
    alert(message);
  }

  showErrorMessage(message) {
    alert(`Error: ${message}`);
  }

  // Form state management
  setFormLoading(loading) {
    const submitBtn = document.getElementById("btn-simpan");
    const form = document.getElementById("form-alamat");

    if (loading) {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin me-2"></i>Menyimpan...';
      }
      if (form) {
        form.style.opacity = "0.7";
      }
    } else {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save me-2"></i>Simpan';
      }
      if (form) {
        form.style.opacity = "1";
      }
    }
  }
  showSuccessMessage(message) {
    this.showSuccess(message);
  }

  showSubmitLoading(loading) {
    this.setFormLoading(loading);
  }

  clearForm() {
    const form = document.getElementById("form-alamat");
    if (form) {
      form.reset();

      // Reset dropdowns to initial state
      this.resetKabupatenOptions();

      // Clear coordinates
      document.getElementById("latitude").value = "";
      document.getElementById("longitude").value = "";

      // Remove marker from map
      if (this.marker) {
        this.map.removeLayer(this.marker);
        this.marker = null;
      }

      // Remove validation classes
      form.querySelectorAll(".is-invalid").forEach((el) => {
        el.classList.remove("is-invalid");
      });
    }
  }

  // Map functionality
  initMap() {
    // Fix Leaflet marker icons
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon,
      iconUrl: markerIcon,
      shadowUrl: markerIconShadow,
    });

    // Initialize map with default view to Indonesia
    this.map = L.map("map").setView([-2.5489, 118.0149], 5);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    // Hide placeholder
    const placeholder = document.getElementById("mapPlaceholder");
    if (placeholder) {
      placeholder.style.display = "none";
    }

    // Add click event to place marker
    this.map.on("click", (e) => {
      this.placeMarker(e.latlng);
    });

    // Initialize marker as null
    this.marker = null;

    // Setup control buttons
    this.setupMapControls();
  }

  setupMapControls() {
    const zoomInBtn = document.getElementById("zoomIn");
    const zoomOutBtn = document.getElementById("zoomOut");
    const locateMeBtn = document.getElementById("locateMe");

    if (zoomInBtn) {
      const handler = () => this.map.zoomIn();
      zoomInBtn.addEventListener("click", handler);
      this.eventListeners.push({ element: zoomInBtn, type: "click", handler });
    }

    if (zoomOutBtn) {
      const handler = () => this.map.zoomOut();
      zoomOutBtn.addEventListener("click", handler);
      this.eventListeners.push({ element: zoomOutBtn, type: "click", handler });
    }

    if (locateMeBtn) {
      const handler = () => this.locateUser();
      locateMeBtn.addEventListener("click", handler);
      this.eventListeners.push({
        element: locateMeBtn,
        type: "click",
        handler,
      });
    }
  }

  placeMarker(latlng) {
    // Remove previous marker if exists
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Add new marker
    this.marker = L.marker(latlng, {
      draggable: true,
      autoPan: true,
    }).addTo(this.map);

    // Save coordinates to form
    const latField = document.getElementById("latitude");
    const lngField = document.getElementById("longitude");

    if (latField) latField.value = latlng.lat;
    if (lngField) lngField.value = latlng.lng;

    // Event for dragged marker
    this.marker.on("dragend", (e) => {
      const newLatLng = e.target.getLatLng();
      if (latField) latField.value = newLatLng.lat;
      if (lngField) lngField.value = newLatLng.lng;
    });

    // Center map to marker
    this.map.setView(latlng, this.map.getZoom());
  }

  locateUser() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          this.placeMarker(latlng);
          this.map.setView(latlng, 15);
          this.currentLocation = latlng;
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Tidak dapat mendapatkan lokasi Anda. Pastikan izin lokasi telah diberikan."
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      alert("Browser Anda tidak mendukung geolocation.");
    }
  }

  // UI Helper methods
  toggleSidebar(show = null) {
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.querySelector(".sidebar-overlay");

    if (show === null) {
      show = !sidebar?.classList.contains("mobile-open");
    }

    if (show) {
      sidebar?.classList.add("mobile-open");
      overlay?.classList.add("active");
      document.body.style.overflow = "hidden";
    } else {
      sidebar?.classList.remove("mobile-open");
      overlay?.classList.remove("active");
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

  removeEventListeners() {
    this.eventListeners.forEach(({ element, type, handler }) => {
      element?.removeEventListener(type, handler);
    });
    this.eventListeners = [];
  }

  destroy() {
    this.removeEventListeners();
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}
