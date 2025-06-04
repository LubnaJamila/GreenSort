//src/pages/klasifikasi-sampah/penjualanSampahView.js
import "../../assets/styles/rekening.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class PenjualanSampahView {
  constructor() {
    this.app = document.getElementById("content");
    this.sidebarView = new SidebarView();
    this.eventListeners = [];
    this.isMobile = window.matchMedia("(max-width: 768px)").matches;
    this.sidebarCollapsed = false;

    this.presenter = null;
    this.formElement = null;
    this.submitButton = null;
    this.classifiedImage = null;
    this.classificationResult = null;
    this.kategoriSampahInput = null;
    this.beratSampahInput = null;
    this.init();
  }

  init() {
    this.bindElements();
    this.bindEvents();
    this.loadPenjualanData();
    this.autoFillUserData();
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
              <h2>Form Pengajuan Penjualan Sampah</h2>
              <p class="text-dark mb-4">Ringkasan status pengajuan Anda secara real-time.</p>
            </div>
            <div class="user-profile">
              <img id="user-avatar" src="${userPlaceholder}" alt="User">
              <span id="user-name">Loading...</span>
            </div>
          </div>
        </header>

        <!-- Upload Section -->
        <div class="rekening-section">
          <div class="content-header">
            <h3>Data Penjualan Sampah</h3>
          </div>

          <div class="content-body">
            <form id="penjualan-form">
              <!-- Row untuk gambar sampah yang telah diklasifikasi -->
              <div class="form-group">
                <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
                  <div id="classified-image-container">
                    <img id="classified-image" src="" alt="Sampah Terklasifikasi" 
                         style="width: 100px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid #ddd;">
                  </div>
                  <div>
                    <h4 style="margin: 0 0 5px 0; color: var(--text-dark);">Hasil Klasifikasi:</h4>
                    <p id="classification-result" style="margin: 0; font-weight: 600; color: var(--primary-color);">-</p>
                  </div>
                </div>
              </div>

              <!-- Form Row 1 -->
              <div class="form-row">
                <div class="form-group">
                  <label for="nama-lengkap" class="form-label">Nama Lengkap</label>
                  <input type="text" id="nama-lengkap" name="nama-lengkap" class="form-control" disabled readonly>
                </div>
                <div class="form-group">
                  <label for="no-hp" class="form-label">No HP</label>
                  <input type="tel" id="no-hp" name="no-hp" class="form-control" disabled readonly>
                </div>
              </div>

              <!-- Form Row 2 -->
              <div class="form-row">
                <div class="form-group">
                  <label for="kategori-sampah" class="form-label">Kategori Sampah</label>
                  <input type="text" id="kategori-sampah" name="kategori-sampah" class="form-control" disabled readonly>
                </div>
                <div class="form-group">
                  <label for="berat-sampah" class="form-label">Berat Sampah (kg)</label>
                  <input type="number" id="berat-sampah" name="berat-sampah" class="form-control" disabled readonly>
                </div>
              </div>

              <!-- Submit Button -->
              <div style="display: flex; justify-content: flex-end; margin-top: 30px; gap: 15px;">
                <a href="#/klasifikasi-sampah" class="btn btn-outline">Kembali</a>
                <button type="button" class="btn btn-primary classify-btn" id="submit-btn" disabled>
                  Kirim Pengajuan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    this.bindElements();
    this.bindEvents();
    this.loadPenjualanData();
    this.autoFillUserData();
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    this.displayUserInfo(userData);
  }

  bindElements() {
    this.formElement = document.getElementById("penjualan-form");
    this.submitButton = document.getElementById("submit-btn");
    this.classifiedImage = document.getElementById("classified-image");
    this.classificationResult = document.getElementById(
      "classification-result"
    );
    this.namaLengkapInput = document.getElementById("nama-lengkap");
    this.iduserInput = document.getElementById("id-user");
    this.noHpInput = document.getElementById("no-hp");
    this.kategoriSampahInput = document.getElementById("kategori-sampah");
    this.beratSampahInput = document.getElementById("berat-sampah");
  }

  bindEvents() {
    if (this.formElement) {
      this.formElement.addEventListener("submit", (e) => e.preventDefault());
    }
  }

  enableSubmit() {
    if (this.submitButton) {
      this.submitButton.disabled = false;
      this.submitButton.style.backgroundColor = "#007bff";
      this.submitButton.style.borderColor = "#007bff";
      this.submitButton.style.cursor = "pointer";
      this.submitButton.style.opacity = "1";
      this.submitButton.textContent = "Kirim Pengajuan";

      this.submitButton.addEventListener("click", async (e) => {
        e.preventDefault();
        if (
          this.presenter &&
          typeof this.presenter.submitPengajuan === "function"
        ) {
          try {
            await this.presenter.submitPengajuan();
            // Jika submit berhasil, alihkan ke dashboard
            window.location.href = "#/dashboardUser";  // Ganti sesuai URL dashboardmu
          } catch (error) {
            this.showError("Gagal mengirim pengajuan: " + error.message);
          }
        }
      });
    }
  }

  getFormData() {
    return {
      namaLengkap: this.namaLengkapInput?.value || "",
      idUser: this.iduserInput?.value || "",
      noHp: this.noHpInput?.value || "",
      kategoriSampah: this.kategoriSampahInput?.value || "",
      beratSampah: parseFloat(this.beratSampahInput?.value || 0),
      gambarSampah: this.classifiedImage?.src || "",
      tanggalPengajuan: new Date().toISOString(),
      status: "Tersimpan",
      id: Date.now().toString(),
    };
  }

  showSuccess(message) {
    alert(message || "Data telah tersimpan!");
  }

  showError(message) {
    alert("Error: " + (message || "Terjadi kesalahan saat memuat data"));
  }

  setPresenter(presenter) {
    this.presenter = presenter;
  }

  loadPenjualanData() {
    try {
      const penjualanData = JSON.parse(
        localStorage.getItem("penjualanSampahData") || "{}"
      );

      if (this.classifiedImage && penjualanData.image) {
        this.classifiedImage.src = penjualanData.image;
      }

      if (this.classificationResult && penjualanData.category) {
        this.classificationResult.innerHTML = penjualanData.category;
        if (penjualanData.confidence) {
          const confidence = Math.round(penjualanData.confidence);
          this.classificationResult.innerHTML += `<span style="font-size:0.8rem;color:#6c757d;"> (${confidence}% akurasi)</span>`;
        }
      }

      if (this.kategoriSampahInput && penjualanData.category) {
        this.kategoriSampahInput.value = penjualanData.category;
      }

      if (this.beratSampahInput && penjualanData.quantity) {
        this.beratSampahInput.value = penjualanData.quantity;
      }
    } catch (error) {
      console.error("Error loadPenjualanData:", error);
      this.showError("Gagal memuat data penjualan");
    }
  }

  autoFillUserData() {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      if (userData.nama_lengkap && this.namaLengkapInput) {
        this.namaLengkapInput.value = userData.nama_lengkap;
      }
      if (userData.no_hp && this.noHpInput) {
        this.noHpInput.value = userData.no_hp;
      }
      if (userData.id_user && this.iduserInput) {
        this.iduserInput.value = userData.id_user;
      }
      const userNameElement = document.getElementById("user-name");
      if (userData.displayName && userNameElement) {
        userNameElement.textContent = userData.displayName;
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }

  displayUserInfo(user) {
    const el = document.getElementById("user-name");
    if (el && user) {
      el.textContent = user.nama_lengkap || user.username;
    }
  }

  destroy() {
    this.eventListeners.forEach(({ element, event, handler }) => {
      if (element) element.removeEventListener(event, handler);
    });
    this.eventListeners = [];
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = PenjualanSampahView;
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");
  console.log(
    "classifiedImage element:",
    document.getElementById("classified-image")
  );
});
