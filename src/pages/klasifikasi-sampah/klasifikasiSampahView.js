//src/pages/klasifikasi-sampah/klasifikasiSampahView.js
import "../../assets/styles/sampah.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";
import KlasifikasiModel from "../../models/klasifikasi-model";
import RekomendasiModel from "../../models/rekomendasi-model"; // Tambahan

export default class KlasifikasiSampahView {
  constructor() {
    this.app = document.getElementById("content");
    this.sidebarView = new SidebarView();
    this.eventListeners = [];
    this.isMobile = window.matchMedia("(max-width: 768px)").matches;
    this.sidebarCollapsed = false;
    this.uploadedImage = null;
    this.uploadedFile = null; // Store the actual file for model prediction
    this.classificationResult = null;
    this.showRecommendation = false;
    this.model = new KlasifikasiModel();
    this.model.loadModel(); // Load model on initialization
    this.rekomendasiModel = new RekomendasiModel(); // Tambahan

    this.render(); // Render dulu, biar ada #model-status
    this.initModelLoading(); // Async load model + status

    // Color mapping for each waste type
    this.wasteTypeColors = {
      Cardboard: "#fd7e14",
      Food_Organics: "#198754",
      Glass: "#20c997",
      Metal: "#6c757d",
      Miscellaneous_Trash: "#dc3545",
      Paper: "#0dcaf0",
      Plastic: "#0d6efd",
      Textile_Trash: "#6f42c1",
      Vegetation: "#198754",
    };
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
                            <h2>Klasifikasi Sampah</h2>
                            <p class="text-dark mb-4">Ringkasan status pengajuan Anda secara real-time.</p>
                        </div>
                        <div class="user-profile">
                            <img id="user-avatar" src="${userPlaceholder}" alt="User">
                            <span id="user-name">Loading...</span>
                        </div>
                    </div>
                </header>

                <!-- Upload Section -->
                <section class="sampah-section">
                    <div class="bg-white rounded-4 shadow-sm p-5 mx-auto" style="max-width: 64rem;">
                        <div class="upload-box mb-3" id="upload-box">
                            <i class="fas fa-upload"></i>
                            <p>Upload Gambar Sampah</p>
                            <input type="file" id="image-upload" accept="image/*" style="display: none;">
                        </div>
                        <div class="d-flex justify-content-end">
                            <button class="btn btn-classify" type="button" id="classify-btn" disabled>Klasifikasi</button>
                            </div>
                            <div id="model-status" style="margin-top: 1rem; font-size: 0.9rem; color: #6c757d;">Memuat model...</div>
                    </div>
                </section>

                <!-- Result Section -->
                <section class="px-4 pb-5" id="result-section" style="display: none;">
                    <div class="result-card">
                        <h3 class="result-title">Hasil Klasifikasi</h3>
                        <div class="result-content">
                            <img id="result-image" src="" alt="Uploaded waste image" />
                            <div class="result-text">
                                <!-- Classification Results -->
                                <div class="classification-results">
                                    <div class="prediction-section">
                                        <h4>Top Prediction:</h4>
                                        <div class="top-prediction" id="top-prediction">
                                            <div class="prediction-item">
                                                <div class="prediction-label">
                                                    <span class="color-indicator" id="top-color"></span>
                                                    <span id="top-waste-type">-</span>
                                                </div>
                                                <div class="confidence-score">
                                                    Confidence: <span id="top-confidence">-</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="alternative-section">
                                        <h4>Alternative Predictions:</h4>
                                        <div class="alternative-predictions" id="alternative-predictions">
                                            <!-- Alternative predictions will be inserted here -->
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Form Input Quantity -->
                                <div class="form-section">
                                    <form id="form-tambah-quantity" class="form">
                                        <div class="form-group">
                                            <label for="quantity">Input Quantity</label>
                                            <input type="text" id="quantity" class="form-control" required>
                                        </div>
                                    </form>
                                </div>
                                
                                <!-- Action Buttons -->
                                <div class="result-buttons">
                                    <button class="btn btn-classify" type="button" id="recycle-btn">Sampah di daur ulang</button>
                                    <button class="btn btn-classify" type="button" id="sell-btn">Sampah Dijual</button>
                                </div>
                                
                                <!-- Recommendation Section (Initially Hidden) -->
                                <div id="recommendation-section" style="display: none; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #e9ecef;">
                                    <p><span>Rekomendasi Pengolahan sampah</span><span id="waste-recommendation">-</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;

    this.bindEvents();
  }

  bindEvents() {
    // Clear existing event listeners
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners = [];

    // Upload box click
    const uploadBox = document.getElementById("upload-box");
    const imageUpload = document.getElementById("image-upload");
    const classifyBtn = document.getElementById("classify-btn");

    const uploadBoxClick = () => imageUpload.click();
    uploadBox.addEventListener("click", uploadBoxClick);
    this.eventListeners.push({
      element: uploadBox,
      event: "click",
      handler: uploadBoxClick,
    });

    // File input change
    const handleFileChange = (e) => this.handleFileUpload(e);
    imageUpload.addEventListener("change", handleFileChange);
    this.eventListeners.push({
      element: imageUpload,
      event: "change",
      handler: handleFileChange,
    });

    // Drag and drop
    const handleDragOver = (e) => {
      e.preventDefault();
      uploadBox.classList.add("dragover");
    };
    const handleDragLeave = () => {
      uploadBox.classList.remove("dragover");
    };
    const handleDrop = (e) => {
      e.preventDefault();
      uploadBox.classList.remove("dragover");
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.handleFileUpload({ target: { files } });
      }
    };

    uploadBox.addEventListener("dragover", handleDragOver);
    uploadBox.addEventListener("dragleave", handleDragLeave);
    uploadBox.addEventListener("drop", handleDrop);
    this.eventListeners.push({
      element: uploadBox,
      event: "dragover",
      handler: handleDragOver,
    });
    this.eventListeners.push({
      element: uploadBox,
      event: "dragleave",
      handler: handleDragLeave,
    });
    this.eventListeners.push({
      element: uploadBox,
      event: "drop",
      handler: handleDrop,
    });

    // Classify button
    const handleClassify = () => this.classifyWaste();
    classifyBtn.addEventListener("click", handleClassify);
    this.eventListeners.push({
      element: classifyBtn,
      event: "click",
      handler: handleClassify,
    });

    // Result buttons
    const recycleBtn = document.getElementById("recycle-btn");
    const sellBtn = document.getElementById("sell-btn");

    const handleRecycle = () => this.handleWasteAction("recycle");
    const handleSell = () => this.handleWasteAction("sell");

    if (recycleBtn) {
      recycleBtn.addEventListener("click", handleRecycle);
      this.eventListeners.push({
        element: recycleBtn,
        event: "click",
        handler: handleRecycle,
      });
    }

    if (sellBtn) {
      sellBtn.addEventListener("click", handleSell);
      this.eventListeners.push({
        element: sellBtn,
        event: "click",
        handler: handleSell,
      });
    }
  }
  setModelStatus(status, color = "#6c757d") {
    const el = document.getElementById("model-status");
    if (el) {
      el.textContent = status;
      el.style.color = color;
    }
  }
  async initModelLoading() {
    this.setModelStatus("Memuat model...", "#6c757d");

    try {
      await this.model.loadModel();
      this.setModelStatus("Model berhasil dimuat", "#28a745");
    } catch (err) {
      console.error("Gagal memuat model:", err);
      this.setModelStatus("Gagal memuat model", "#dc3545");
    }
  }

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB.");
      return;
    }

    this.uploadedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.uploadedImage = e.target.result;
      this.displayUploadedImage(e.target.result);
      document.getElementById("classify-btn").disabled = false;
    };
    reader.readAsDataURL(file);
  }

  displayUploadedImage(imageSrc) {
    const uploadBox = document.getElementById("upload-box");
    uploadBox.classList.add("has-image");
    uploadBox.innerHTML = `
      <img src="${imageSrc}" alt="Uploaded waste image">
      <p style="margin-top: 1rem; color: #28a745; font-weight: 600;">
        <i class="fas fa-check-circle"></i> Gambar berhasil diupload
      </p>
      <p style="font-size: 0.75rem; color: #6c757d;">Klik untuk mengganti gambar</p>
    `;
  }

  async classifyWaste() {
    const classifyBtn = document.getElementById("classify-btn");
    const originalText = classifyBtn.innerHTML;
    classifyBtn.innerHTML = '<span class="loading"></span>Mengklasifikasi...';
    classifyBtn.disabled = true;

    try {
      if (!this.model.model) {
        throw new Error("Model belum selesai dimuat.");
      }

      const result = await this.model.predict(this.uploadedFile);
      const predictions = result.topPredictions.map((prediction) => ({
        type: prediction.className,
        confidence: parseFloat(prediction.confidence.toFixed(2)),
        color: this.wasteTypeColors[prediction.className] || "#6c757d",
      }));

      this.classificationResult = {
        topPrediction: predictions[0],
        alternativePredictions: predictions.slice(1),
      };

      this.showRecommendation = false;
      this.displayClassificationResult();
    } catch (error) {
      alert(`Terjadi kesalahan saat mengklasifikasi sampah: ${error.message}`);
    } finally {
      classifyBtn.innerHTML = originalText;
      classifyBtn.disabled = false;
    }
  }

  displayClassificationResult() {
    const resultSection = document.getElementById("result-section");
    const resultImage = document.getElementById("result-image");
    resultImage.src = this.uploadedImage;

    document.getElementById("top-waste-type").textContent =
      this.classificationResult.topPrediction.type;
    document.getElementById("top-confidence").textContent =
      this.classificationResult.topPrediction.confidence + "%";
    document.getElementById("top-color").style.backgroundColor =
      this.classificationResult.topPrediction.color;

    const altContainer = document.getElementById("alternative-predictions");
    altContainer.innerHTML = "";
    this.classificationResult.alternativePredictions.forEach((p) => {
      const div = document.createElement("div");
      div.className = "prediction-item alternative-item";
      div.innerHTML = `
        <div class="prediction-label">
          <span class="color-indicator" style="background-color: ${p.color}"></span>
          <span>${p.type}</span>
        </div>
        <div class="confidence-score">${p.confidence}%</div>
      `;
      altContainer.appendChild(div);
    });

    document.getElementById("recommendation-section").style.display = "none";
    resultSection.style.display = "block";
    resultSection.scrollIntoView({ behavior: "smooth" });
  }

  async handleWasteAction(action) {
    const quantity = document.getElementById("quantity").value.trim();
    if (!quantity || isNaN(quantity)) {
      alert("Silakan masukkan quantity dalam angka.");
      return;
    }
    const wasteType = this.classificationResult.topPrediction.type;

    if (action === "recycle") {
      if (confirm("Apakah Anda yakin ingin mendaur ulang sampah ini?")) {
        alert(`Sampah akan didaur ulang sebanyak ${quantity} kg.`);
        await this.showWasteRecommendation(wasteType, quantity);
      }
    } else if (action === "sell") {
      if (confirm("Apakah Anda yakin ingin menjual sampah ini?")) {
        // Save classification data to localStorage before navigating
        this.saveClassificationDataForSell(quantity);
        window.location.href = "#/penjualan-sampah";
      }
    }
  }

  // NEW METHOD: Save classification data for sell action
  saveClassificationDataForSell(quantity) {
    const classificationData = {
      image: this.uploadedImage,
      category: this.classificationResult.topPrediction.type,
      confidence: this.classificationResult.topPrediction.confidence,
      quantity: parseFloat(quantity),
      timestamp: new Date().toISOString(),
    };

    try {
      localStorage.setItem(
        "penjualanSampahData",
        JSON.stringify(classificationData)
      );
      console.log("Data penjualan sampah disimpan:", classificationData);
    } catch (error) {
      console.error("Gagal menyimpan data penjualan:", error);
      alert("Terjadi kesalahan saat menyimpan data untuk penjualan");
    }
  }

  async showWasteRecommendation(wasteType, quantity) {
    const section = document.getElementById("recommendation-section");
    const content = document.getElementById("waste-recommendation");

    // Show loading state
    content.innerHTML = '<span class="loading"></span> Memuat rekomendasi...';
    section.style.display = "block";

    try {
      // Ensure the model is ready
      if (!this.rekomendasiModel.dataset) {
        await this.rekomendasiModel.loadDataset();
      }

      // Get recommendation with proper error handling
      const recommendation = await this.rekomendasiModel.getRecommendation(
        wasteType,
        quantity
      );

      // Display comprehensive recommendation
      if (recommendation && recommendation.rekomendasi) {
        let items = [];

        if (Array.isArray(recommendation.rekomendasi)) {
          items = recommendation.rekomendasi;
        } else if (typeof recommendation.rekomendasi === "string") {
          items = recommendation.rekomendasi.split(",");
        } else {
          items = [String(recommendation.rekomendasi)];
        }

        const rekomList = items
          .map((item) => `<li>${item.trim()}</li>`)
          .join("");
        content.innerHTML = `
          <div class="recommendation-content">
            <h5>Rekomendasi untuk ${recommendation.kategori}</h5>
            <div class="recommendation-details">
              <p><strong>Berat input:</strong> ${
                recommendation.berat_input_kg
              } kg</p>
              <p><strong>Rentang optimal:</strong> ${
                recommendation.berat_min_kg
              } - ${recommendation.berat_max_kg} kg</p>
              ${
                recommendation.message
                  ? `<p class="text-info">${recommendation.message}</p>`
                  : ""
              }
              <div class="recommendation-text">
                <h6>Cara Pengolahan:</h6>
                <ol>
                  ${rekomList}
                </ol>
              </div>
            </div>
          </div>
        `;
      } else {
        content.innerHTML = `
          <div class="recommendation-content">
            <p class="text-warning">Rekomendasi tidak tersedia untuk jenis sampah ini.</p>
            <p class="text-muted">Silakan konsultasikan dengan petugas pengelola sampah setempat.</p>
          </div>
        `;
      }

      // Scroll to recommendation section
      section.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error getting recommendation:", error);

      // Show user-friendly error message
      content.innerHTML = `
        <div class="recommendation-content">
          <p class="text-danger">Gagal memuat rekomendasi.</p>
          <p class="text-muted">Error: ${error.message}</p>
          <p class="text-info">Silakan coba lagi atau konsultasikan dengan petugas pengelola sampah setempat.</p>
        </div>
      `;

      section.style.display = "block";
    }
  }

  destroy() {
    this.eventListeners.forEach(({ element, event, handler }) => {
      if (element) element.removeEventListener(event, handler);
    });
    this.eventListeners = [];
  }

  displayUserInfo(user) {
    const el = document.getElementById("user-name");
    if (el && user) {
      el.textContent = user.name || user.username;
    }
  }
}
