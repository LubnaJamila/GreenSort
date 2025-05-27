//src/pages/klasifikasi-sampah/klasifikasiSampahView.js
import "../../assets/styles/sampah.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";

export default class KlasifikasiSampahView {
    constructor() {
        this.app = document.getElementById("content");
        this.sidebarView = new SidebarView();
        this.eventListeners = [];
        this.isMobile = window.matchMedia("(max-width: 768px)").matches;
        this.sidebarCollapsed = false;
        this.uploadedImage = null;
        this.classificationResult = null;
        this.showRecommendation = false; // New state to track recommendation visibility
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
            <div class="main-content ${this.isMobile ? 'full-width' : ''} ${this.sidebarCollapsed ? 'collapsed' : ''}">
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
        const uploadBox = document.getElementById('upload-box');
        const imageUpload = document.getElementById('image-upload');
        const classifyBtn = document.getElementById('classify-btn');

        const uploadBoxClick = () => imageUpload.click();
        uploadBox.addEventListener('click', uploadBoxClick);
        this.eventListeners.push({ element: uploadBox, event: 'click', handler: uploadBoxClick });

        // File input change
        const handleFileChange = (e) => this.handleFileUpload(e);
        imageUpload.addEventListener('change', handleFileChange);
        this.eventListeners.push({ element: imageUpload, event: 'change', handler: handleFileChange });

        // Drag and drop
        const handleDragOver = (e) => {
            e.preventDefault();
            uploadBox.classList.add('dragover');
        };
        const handleDragLeave = () => {
            uploadBox.classList.remove('dragover');
        };
        const handleDrop = (e) => {
            e.preventDefault();
            uploadBox.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileUpload({ target: { files } });
            }
        };

        uploadBox.addEventListener('dragover', handleDragOver);
        uploadBox.addEventListener('dragleave', handleDragLeave);
        uploadBox.addEventListener('drop', handleDrop);
        this.eventListeners.push({ element: uploadBox, event: 'dragover', handler: handleDragOver });
        this.eventListeners.push({ element: uploadBox, event: 'dragleave', handler: handleDragLeave });
        this.eventListeners.push({ element: uploadBox, event: 'drop', handler: handleDrop });

        // Classify button
        const handleClassify = () => this.classifyWaste();
        classifyBtn.addEventListener('click', handleClassify);
        this.eventListeners.push({ element: classifyBtn, event: 'click', handler: handleClassify });

        // Result buttons
        const recycleBtn = document.getElementById('recycle-btn');
        const sellBtn = document.getElementById('sell-btn');

        const handleRecycle = () => this.handleWasteAction('recycle');
        const handleSell = () => this.handleWasteAction('sell');

        if (recycleBtn) {
            recycleBtn.addEventListener('click', handleRecycle);
            this.eventListeners.push({ element: recycleBtn, event: 'click', handler: handleRecycle });
        }
        
        if (sellBtn) {
            sellBtn.addEventListener('click', handleSell);
            this.eventListeners.push({ element: sellBtn, event: 'click', handler: handleSell });
        }
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size should be less than 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.uploadedImage = e.target.result;
            this.displayUploadedImage(e.target.result);
            document.getElementById('classify-btn').disabled = false;
        };
        reader.readAsDataURL(file);
    }

    displayUploadedImage(imageSrc) {
        const uploadBox = document.getElementById('upload-box');
        uploadBox.classList.add('has-image');
        uploadBox.innerHTML = `
            <img src="${imageSrc}" alt="Uploaded waste image">
            <p style="margin-top: 1rem; color: #28a745; font-weight: 600;">
                <i class="fas fa-check-circle"></i> Gambar berhasil diupload
            </p>
            <p style="font-size: 0.75rem; color: #6c757d;">Klik untuk mengganti gambar</p>
        `;
    }

    async classifyWaste() {
        const classifyBtn = document.getElementById('classify-btn');
        const originalText = classifyBtn.innerHTML;
        
        // Show loading state
        classifyBtn.innerHTML = '<span class="loading"></span>Mengklasifikasi...';
        classifyBtn.disabled = true;

        try {
            // Simulate API call for classification
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mock classification result with multiple predictions
            const predictions = [
                { type: 'Metal', confidence: 99.81, color: '#6c757d' },
                { type: 'Textile_Trash', confidence: 0.12, color: '#dc3545' },
                { type: 'Cardboard', confidence: 0.05, color: '#fd7e14' },
                { type: 'Plastic', confidence: 0.02, color: '#0d6efd' }
            ];
            
            this.classificationResult = {
                topPrediction: predictions[0],
                alternativePredictions: predictions.slice(1, 3), // Take top 2 alternatives
                recommendation: `Berdasarkan analisis, sampah ini teridentifikasi sebagai ${predictions[0].type}. Sampah ini dapat didaur ulang menjadi bahan baku baru atau dapat dijual ke pengepul sampah untuk diproses lebih lanjut. Pastikan sampah dalam kondisi bersih sebelum diproses.`
            };

            // Reset recommendation visibility
            this.showRecommendation = false;
            this.displayClassificationResult();
            
        } catch (error) {
            console.error('Classification error:', error);
            alert('Terjadi kesalahan saat mengklasifikasi sampah. Silakan coba lagi.');
        } finally {
            classifyBtn.innerHTML = originalText;
            classifyBtn.disabled = false;
        }
    }

    displayClassificationResult() {
        const resultSection = document.getElementById('result-section');
        const resultImage = document.getElementById('result-image');
        const recommendationSection = document.getElementById('recommendation-section');

        resultImage.src = this.uploadedImage;
        
        // Display top prediction
        const topWasteType = document.getElementById('top-waste-type');
        const topConfidence = document.getElementById('top-confidence');
        const topColor = document.getElementById('top-color');
        
        topWasteType.textContent = this.classificationResult.topPrediction.type;
        topConfidence.textContent = this.classificationResult.topPrediction.confidence + '%';
        topColor.style.backgroundColor = this.classificationResult.topPrediction.color;
        
        // Display alternative predictions
        const alternativePredictions = document.getElementById('alternative-predictions');
        alternativePredictions.innerHTML = '';
        
        this.classificationResult.alternativePredictions.forEach(prediction => {
            const predictionItem = document.createElement('div');
            predictionItem.className = 'prediction-item alternative-item';
            predictionItem.innerHTML = `
                <div class="prediction-label">
                    <span class="color-indicator" style="background-color: ${prediction.color}"></span>
                    <span>${prediction.type}</span>
                </div>
                <div class="confidence-score">${prediction.confidence}%</div>
            `;
            alternativePredictions.appendChild(predictionItem);
        });

        // Hide recommendation section initially
        recommendationSection.style.display = 'none';

        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    handleWasteAction(action) {
        const quantity = document.getElementById('quantity').value;
        
        // Validate quantity input
        if (!quantity || quantity.trim() === '') {
            alert('Silakan masukkan quantity terlebih dahulu.');
            document.getElementById('quantity').focus();
            return;
        }

        if (action === 'recycle') {
            // Show recommendation when recycle button is clicked
            this.showWasteRecommendation();
            
            const message = `Sampah akan didaur ulang dengan quantity ${quantity}. Terima kasih telah berkontribusi untuk lingkungan!`;
            if (confirm(`Apakah Anda yakin ingin menandai sampah ini untuk didaur ulang?`)) {
                alert(message);
                console.log(`Waste action: ${action}, quantity: ${quantity}`, this.classificationResult);
            }
        } else if (action === 'sell') {
            const message = `Sampah akan dijual dengan quantity ${quantity}. Terima kasih telah berkontribusi untuk lingkungan!`;
            if (confirm(`Apakah Anda yakin ingin menandai sampah ini untuk dijual?`)) {
                alert(message);
                console.log(`Waste action: ${action}, quantity: ${quantity}`, this.classificationResult);
            }
        }
    }

    showWasteRecommendation() {
        const recommendationSection = document.getElementById('recommendation-section');
        const wasteRecommendation = document.getElementById('waste-recommendation');
        
        if (!this.showRecommendation) {
            wasteRecommendation.textContent = this.classificationResult.recommendation;
            recommendationSection.style.display = 'block';
            this.showRecommendation = true;
            
            // Smooth scroll to recommendation
            recommendationSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    destroy() {
        // Clean up event listeners
        this.eventListeners.forEach(({ element, event, handler }) => {
            if (element) {
                element.removeEventListener(event, handler);
            }
        });
        this.eventListeners = [];
    }

    displayUserInfo(user) {
        const userNameElement = document.getElementById("user-name");
        if (userNameElement && user) {
          userNameElement.textContent = user.name || user.username;
        }
    }
}