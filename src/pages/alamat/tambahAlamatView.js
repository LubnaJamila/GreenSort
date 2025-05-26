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

        this.wilayahData = {
            'jawa-timur': {
                name: 'Jawa Timur',
                kabupaten: {
                    'jember': {
                        name: 'Jember',
                        kecamatan: {
                            'sumbersari': {
                                name: 'Sumbersari',
                                desa: ['Tegalgede', 'Krajan', 'Sumbersari', 'Antirogo']
                            },
                            'kaliwates': {
                                name: 'Kaliwates',
                                desa: ['Kaliwates', 'Jember Kidul', 'Kepatihan', 'Mangli']
                            },
                            'patrang': {
                                name: 'Patrang',
                                desa: ['Patrang', 'Banjarsengon', 'Jumerto', 'Slawu']
                            }
                        }
                    },
                    'surabaya': {
                        name: 'Surabaya',
                        kecamatan: {
                            'gubeng': {
                                name: 'Gubeng',
                                desa: ['Gubeng', 'Airlangga', 'Barata Jaya', 'Kertajaya']
                            },
                            'wonokromo': {
                                name: 'Wonokromo',
                                desa: ['Wonokromo', 'Jagir', 'Ngagel', 'Ngagel Rejo']
                            }
                        }
                    },
                    'malang': {
                        name: 'Malang',
                        kecamatan: {
                            'klojen': {
                                name: 'Klojen',
                                desa: ['Klojen', 'Kasin', 'Kiduldalem', 'Penanggungan']
                            },
                            'lowokwaru': {
                                name: 'Lowokwaru',
                                desa: ['Lowokwaru', 'Dinoyo', 'Jatimulyo', 'Ketawanggede']
                            }
                        }
                    }
                }
            },
            'jawa-tengah': {
                name: 'Jawa Tengah',
                kabupaten: {
                    'semarang': {
                        name: 'Semarang',
                        kecamatan: {
                            'semarang-tengah': {
                                name: 'Semarang Tengah',
                                desa: ['Pindrikan Lor', 'Sekayu', 'Pekunden', 'Kembangsari']
                            },
                            'semarang-timur': {
                                name: 'Semarang Timur',
                                desa: ['Bugangan', 'Kemijen', 'Mlatiharjo', 'Sarirejo']
                            }
                        }
                    },
                    'solo': {
                        name: 'Solo (Surakarta)',
                        kecamatan: {
                            'laweyan': {
                                name: 'Laweyan',
                                desa: ['Laweyan', 'Bumi', 'Karangasem', 'Panularan']
                            },
                            'jebres': {
                                name: 'Jebres',
                                desa: ['Jebres', 'Kepatihan Kulon', 'Kepatihan Wetan', 'Sudiroprajan']
                            }
                        }
                    }
                }
            },
            'jawa-barat': {
                name: 'Jawa Barat',
                kabupaten: {
                    'bandung': {
                        name: 'Bandung',
                        kecamatan: {
                            'coblong': {
                                name: 'Coblong',
                                desa: ['Coblong', 'Dago', 'Lebak Gede', 'Lebak Siliwangi']
                            },
                            'sukasari': {
                                name: 'Sukasari',
                                desa: ['Sukasari', 'Geger Kalong', 'Isola', 'Sukarasa']
                            }
                        }
                    }
                }
            },
            'dki-jakarta': {
                name: 'DKI Jakarta',
                kabupaten: {
                    'jakarta-pusat': {
                        name: 'Jakarta Pusat',
                        kecamatan: {
                            'menteng': {
                                name: 'Menteng',
                                desa: ['Menteng', 'Pegangsaan', 'Cikini', 'Gondangdia']
                            },
                            'gambir': {
                                name: 'Gambir',
                                desa: ['Gambir', 'Cideng', 'Petojo Selatan', 'Kebon Kelapa']
                            }
                        }
                    },
                    'jakarta-selatan': {
                        name: 'Jakarta Selatan',
                        kecamatan: {
                            'kebayoran-baru': {
                                name: 'Kebayoran Baru',
                                desa: ['Kebayoran Baru', 'Gandaria Utara', 'Cipete Utara', 'Melawai']
                            }
                        }
                    }
                }
            }
        };
    }

    render() {
        this.sidebarView.render();
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
        
        <div class="main-content ${this.isMobile ? 'full-width' : ''} ${this.sidebarCollapsed ? 'collapsed' : ''}">
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
                                    <option value="">Pilih Provinsi</option>
                                    <option value="jawa-timur">Jawa Timur</option>
                                    <option value="jawa-tengah">Jawa Tengah</option>
                                    <option value="jawa-barat">Jawa Barat</option>
                                    <option value="dki-jakarta">DKI Jakarta</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="kabupaten" class="form-label">Pilih Kabupaten</label>
                                <select class="form-control" id="kabupaten" required>
                                    <option value="">Pilih Kabupaten</option>
                                    <option value="jember">Jember</option>
                                    <option value="surabaya">Surabaya</option>
                                    <option value="malang">Malang</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Row 2: Kecamatan dan Desa/Kelurahan -->
                        <div class="form-row-group">
                            <div class="form-group">
                                <label for="kecamatan" class="form-label">Pilih Kecamatan</label>
                                <select class="form-control" id="kecamatan" required>
                                    <option value="">Pilih Kecamatan</option>
                                    <option value="sumbersari">Sumbersari</option>
                                    <option value="kaliwates">Kaliwates</option>
                                    <option value="patrang">Patrang</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="desa" class="form-label">Pilih Desa/Kelurahan</label>
                                <select class="form-control" id="desa" required>
                                    <option value="">Pilih Desa/Kelurahan</option>
                                    <option value="tegalgede">Tegalgede</option>
                                    <option value="krajan">Krajan</option>
                                    <option value="sumbersari">Sumbersari</option>
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
        const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
        if (mobileMenuBtn) {
            const handler = () => this.toggleSidebar();
            mobileMenuBtn.addEventListener('click', handler);
            this.eventListeners.push({ element: mobileMenuBtn, type: 'click', handler });
        }

        // Sidebar overlay click
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            const handler = () => this.toggleSidebar(false);
            overlay.addEventListener('click', handler);
            this.eventListeners.push({ element: overlay, type: 'click', handler });
        }

        // Window resize
        const resizeHandler = () => this.handleResize();
        window.addEventListener('resize', resizeHandler);
        this.eventListeners.push({ element: window, type: 'resize', handler: resizeHandler });

        // Form validation untuk dropdown dependencies
        this.setupFormValidation();
    }

    toggleSidebar(show = null) {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        const mainContent = document.querySelector('.main-content');
        
        if (show === null) {
            show = !sidebar.classList.contains('mobile-open');
        }

        if (show) {
            sidebar.classList.add('mobile-open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    setupFormValidation() {
        const provinsi = document.getElementById('provinsi');
        const kabupaten = document.getElementById('kabupaten');
        const kecamatan = document.getElementById('kecamatan');
        const desa = document.getElementById('desa');

        if (provinsi) {
            const handler = () => this.updateKabupaten();
            provinsi.addEventListener('change', handler);
            this.eventListeners.push({ element: provinsi, type: 'change', handler });
        }

        if (kabupaten) {
            const handler = () => this.updateKecamatan();
            kabupaten.addEventListener('change', handler);
            this.eventListeners.push({ element: kabupaten, type: 'change', handler });
        }

        if (kecamatan) {
            const handler = () => this.updateDesa();
            kecamatan.addEventListener('change', handler);
            this.eventListeners.push({ element: kecamatan, type: 'change', handler });
        }
    }

    updateKabupaten() {
        const provinsiValue = document.getElementById('provinsi').value;
        const kabupatenSelect = document.getElementById('kabupaten');
        const kecamatanSelect = document.getElementById('kecamatan');
        const desaSelect = document.getElementById('desa');
        
        // Reset dependent dropdowns
        kabupatenSelect.innerHTML = '<option value="">Pilih Kabupaten</option>';
        kecamatanSelect.innerHTML = '<option value="">Pilih Kecamatan</option>';
        desaSelect.innerHTML = '<option value="">Pilih Desa/Kelurahan</option>';
        
        if (provinsiValue && this.wilayahData[provinsiValue]) {
            const kabupatenData = this.wilayahData[provinsiValue].kabupaten;
            
            Object.keys(kabupatenData).forEach(key => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = kabupatenData[key].name;
                kabupatenSelect.appendChild(option);
            });
        }
    }

    updateKecamatan() {
        const provinsiValue = document.getElementById('provinsi').value;
        const kabupatenValue = document.getElementById('kabupaten').value;
        const kecamatanSelect = document.getElementById('kecamatan');
        const desaSelect = document.getElementById('desa');
        
        // Reset dependent dropdowns
        kecamatanSelect.innerHTML = '<option value="">Pilih Kecamatan</option>';
        desaSelect.innerHTML = '<option value="">Pilih Desa/Kelurahan</option>';
        
        if (provinsiValue && kabupatenValue && 
            this.wilayahData[provinsiValue] && 
            this.wilayahData[provinsiValue].kabupaten[kabupatenValue]) {
            
            const kecamatanData = this.wilayahData[provinsiValue].kabupaten[kabupatenValue].kecamatan;
            
            Object.keys(kecamatanData).forEach(key => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = kecamatanData[key].name;
                kecamatanSelect.appendChild(option);
            });
        }
    }

    updateDesa() {
        const provinsiValue = document.getElementById('provinsi').value;
        const kabupatenValue = document.getElementById('kabupaten').value;
        const kecamatanValue = document.getElementById('kecamatan').value;
        const desaSelect = document.getElementById('desa');
        
        // Reset desa dropdown
        desaSelect.innerHTML = '<option value="">Pilih Desa/Kelurahan</option>';
        
        if (provinsiValue && kabupatenValue && kecamatanValue &&
            this.wilayahData[provinsiValue] && 
            this.wilayahData[provinsiValue].kabupaten[kabupatenValue] &&
            this.wilayahData[provinsiValue].kabupaten[kabupatenValue].kecamatan[kecamatanValue]) {
            
            const desaData = this.wilayahData[provinsiValue].kabupaten[kabupatenValue].kecamatan[kecamatanValue].desa;
            
            desaData.forEach(desa => {
                const option = document.createElement('option');
                option.value = desa.toLowerCase().replace(/\s+/g, '-');
                option.textContent = desa;
                desaSelect.appendChild(option);
            });
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
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;

        if (this.isMobile) {
            mainContent.classList.add('full-width');
            mainContent.classList.remove('collapsed');
        } else {
            mainContent.classList.remove('full-width');
            if (this.sidebarCollapsed) {
                mainContent.classList.add('collapsed');
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
        const requiredFields = ['provinsi', 'kabupaten', 'kecamatan', 'desa', 'alamatLengkap'];
        const errors = [];

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                errors.push(`${field.labels[0]?.textContent || fieldId} harus diisi`);
                field.classList.add('is-invalid');
            } else {
                field.classList.remove('is-invalid');
            }
        });

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    bindFormSubmit(handler) {
        const form = document.getElementById("alamatForm");
        if (form) {
            const formHandler = (e) => {
                e.preventDefault();
                
                const validation = this.validateForm();
                if (!validation.isValid) {
                    alert('Mohon lengkapi semua field yang required:\n' + validation.errors.join('\n'));
                    return;
                }

                const data = {
                    provinsi: document.getElementById("provinsi").value,
                    kabupaten: document.getElementById("kabupaten").value,
                    kecamatan: document.getElementById("kecamatan").value,
                    desa: document.getElementById("desa").value,
                    alamatLengkap: document.getElementById("alamatLengkap").value,
                    // Get selected text for display purposes
                    provinsiText: document.getElementById("provinsi").selectedOptions[0]?.text,
                    kabupatenText: document.getElementById("kabupaten").selectedOptions[0]?.text,
                    kecamatanText: document.getElementById("kecamatan").selectedOptions[0]?.text,
                    desaText: document.getElementById("desa").selectedOptions[0]?.text,
                };
                
                handler(data);
            };
            form.addEventListener("submit", formHandler);
            this.eventListeners.push({ element: form, type: 'submit', handler: formHandler });
        }
    }

    bindBackButton(handler) {
        const backBtn = document.getElementById("btn-kembali");
        if (backBtn) {
            const clickHandler = (e) => {
                e.preventDefault();
                handler();
            };
            backBtn.addEventListener('click', clickHandler);
            this.eventListeners.push({
                element: backBtn,
                type: 'click',
                handler: clickHandler,
            });
        }
    }

    bindCancel(handler) {
        console.log("bindCancel called");
        // Buat temporary cancel button
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Kembali';
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.onclick = handler;
    }

    // Method untuk load data dari API (future enhancement)
    async loadWilayahFromAPI() {
        try {
            // Contoh implementasi dengan API wilayah Indonesia
            // const response = await fetch('https://api.wilayah-indonesia.com/provinces');
            // const provinces = await response.json();
            // return provinces;
            console.log('API integration untuk wilayah dapat ditambahkan di sini');
        } catch (error) {
            console.error('Error loading wilayah data:', error);
        }
    }

    destroy() {
        this.removeEventListeners();
    }
}