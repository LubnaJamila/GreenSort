import '../assets/styles/main.css';
import frame10 from '../assets/images/Frame 10.png';
import frame11 from '../assets/images/Frame 11.png';
import background from '../assets/images/Ellipse 28.png';
import service from '../assets/images/4909450 1.png';

export default class IndexView {
    constructor() {
      this.app = document.getElementById('app');
    }
  
    render() {
      this.app.innerHTML = `
        <header class="position-relative overflow-hidden" style="min-height: 100vh;">
            <!-- Background Image -->
            <div id="bg-image" class="position-absolute top-0 start-0 w-100 h-100" 
            style="z-index: -1; background: no-repeat right center; background-size: cover; background-position: right;"></div>

            <!-- Navigation -->
            <nav class="container d-flex justify-content-between align-items-center py-4 position-relative">
                <div class="fw-bold text-black fs-5">GREENSORT</div>
                <ul class="nav d-none d-md-flex gap-4">
                    <li><a href="#" class="text-black text-decoration-none">Home</a></li>
                    <li><a href="#about-us" class="text-black text-decoration-none">About Us</a></li>
                    <li><a href="#services" class="text-black text-decoration-none">Services</a></li>
                    <li><a href="#contact-us" class="text-black text-decoration-none">Contact Us</a></li>
                </ul>
                <div class="d-none d-md-flex gap-2">
                    <button class="btn btn-outline-success btn-sm fw-semibold px-4 rounded-pill" id="login-btn">Login</button>
                    <button class="btn btn-success btn-sm text-white fw-semibold px-4 rounded-pill" id="register-btn">Register</button>
                </div>
            </nav>

            <!-- Hero Content -->
            <div class="container d-flex flex-column flex-md-row align-items-center justify-content-between py-5 gap-3 position-relative">
                <div class="text-section" style="max-width: 450px;">
                    <h1 class="fw-bold mb-4" style="font-size: 2rem;">
                        Transformasi Pengelolaan Limbah B2B Menuju Masa Depan yang Berkelanjutan
                    </h1>
                    <p class="mb-4 text-secondary" style="font-size: 1rem;">
                        GreenSort membantu bisnis Anda mengambil keputusan berbasis data untuk pengelolaan limbah yang lebih efisien, hemat biaya, dan ramah lingkungan.
                    </p>
                    <button class="btn btn-green px-4 py-2 rounded-pill fw-semibold" type="button">Ini Button</button>
                </div>

                <div class="image-section d-flex justify-content-center">
                    <img src="${frame10}" alt="Hero Image" class="img-fluid" style="max-width: 500px;" loading="lazy" />
                </div>
            </div>
        </header>

        <!-- About Us Section -->
        <section class="container my-5 py-4" id="about-us">
            <div class="row g-4">
                <div class="col-12">
                    <h2 class="fw-bold fs-4 mb-1">About Us</h2>
                    <p class="text-secondary fst-italic mb-1">"Menilai Limbah Mengelola Masa Depan"</p>
                    <p class="text-secondary fst-italic mb-4">"Klasifikasikan dengan Cerdas, Jual dengan Mudah"</p>
                </div>
                
                <div class="col-md-5">
                    <div class="position-relative">
                        <div class="green-bg p-4 rounded-4 position-relative">
                            <img src="${frame11}" alt="Illustration" class="img-fluid" />
                            <!-- Tanda tanya di sekitar gambar -->
                            <div class="question-mark bg-white rounded-circle position-absolute">?</div>
                            <div class="question-mark bg-white rounded-circle position-absolute" style="top: 15%; right: 15%;">?</div>
                            <div class="question-mark bg-white rounded-circle position-absolute" style="bottom: 25%; left: 10%;">?</div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-7">
                    <div class="border-start border-dark ps-4">
                        <p class="text-justify">
                            GreenSort adalah platform penilaian limbah B2B berbasis teknologi 
                            cerdas yang dirancang untuk membantu industri dalam mengelola 
                            limbah secara efisien, bertanggung jawab, dan berkelanjutan. Kami 
                            percaya bahwa masa depan industri yang lebih hijau dimulai dari 
                            transparansi dan efisiensi dalam proses pengelolaan limbah. 
                            Dengan menggabungkan kecerdasan buatan, analitik data, dan 
                            standar keberlanjutan.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Services Section -->
        <section class="services-wrapper my-5 py-5" id="services">
            <div class="container">
                <h2 class="text-end fw-bold mb-5">Services</h2>
                
                <div class="row g-4">
                    <!-- Kolom Kiri (Service Boxes) -->
                    <div class="col-lg-5 d-flex flex-column gap-4">
                        <!-- Service Box 1 -->
                        <div class="service-card lime-card">
                            <h3 class="service-title d-flex justify-content-between align-items-center">
                                Klasifikasi Image Limbah Otomatis
                                <i class="fas fa-camera-retro"></i>
                            </h3>
                            <p class="service-description">
                                Deteksi dan klasifikasikan limbah secara instan melalui analisis gambar berbasis AI—praktis, cepat, dan akurat.
                            </p>
                            <hr class="my-3">
                            <a href="#" class="d-flex justify-content-between align-items-center text-decoration-none text-dark">
                                <span class="fw-semibold">Coba Sekarang</span>
                                <i class="fas fa-circle-arrow-right"></i>
                            </a>
                        </div>
                        
                        <!-- Service Box 2 -->
                        <div class="service-card white-card">
                            <h3 class="service-title d-flex justify-content-between align-items-center">
                                Penjualan Limbah
                                <i class="fas fa-store"></i>
                            </h3>
                            <p class="service-description">
                                Pasarkan limbah yang telah diklasifikasikan langsung ke mitra B2B melalui marketplace yang aman dan efisien.
                            </p>
                            <hr class="my-3">
                            <a href="#" class="d-flex justify-content-between align-items-center text-decoration-none text-dark">
                                <span class="fw-semibold">Coba Sekarang</span>
                                <i class="fas fa-circle-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                    
                    <!-- Kolom Kanan (Ilustrasi) -->
                    <div class="col-lg-7">
                        <div class="h-100">
                            <img src="${service}" alt="Ilustrasi pemandangan hijau dengan bunga putih" class="img-fluid rounded-4 w-100 h-100" style="object-fit: cover;">
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Education Section -->
        <section class="container my-5 py-4">
            <h2 class="text-center fw-semibold mb-5">Edukasi Lingkungan & Kesadaran Limbah</h2>
            
            <div class="row g-4">
                <div class="col-md-5">
                    <h3 class="fw-bold fs-3 mb-4">
                        Edukasi adalah langkah awal menuju industri yang lebih bertanggung jawab terhadap lingkungan
                    </h3>
                    <div class="education-image-container">
                        <img src="${frame10}" alt="Edukasi Lingkungan" class="img-fluid rounded-4">
                    </div>
                </div>
                
                <div class="col-md-7">
                    <div class="border-start border-dark ps-4">
                        <div class="mb-4">
                            <h4 class="fw-semibold mb-2">Jenis-Jenis Limbah & Cara Penanganannya</h4>
                            <p class="text-secondary">
                                Pelajari perbedaan limbah organik, anorganik, B3, dan cara penanganan yang tepat untuk masing-masing.
                            </p>
                        </div>
                        
                        <div class="mb-4">
                            <h4 class="fw-semibold mb-2">Manfaat Daur Ulang & Ekonomi Sirkular</h4>
                            <p class="text-secondary">
                                Temukan bagaimana limbah bisa bernilai kembali dan mendukung keberlanjutan industri.
                            </p>
                        </div>
                        
                        <div class="mb-4">
                            <h4 class="fw-semibold mb-2">Tips & Praktik Ramah Lingkungan</h4>
                            <p class="text-secondary">
                                Dari kebiasaan kecil hingga langkah besar—kami bagikan cara-cara sederhana untuk ikut menjaga lingkungan.
                            </p>
                        </div>
                        
                        <div class="mb-4">
                            <h4 class="fw-semibold mb-2">Dampak Lingkungan dari Limbah Tak Terkelola</h4>
                            <p class="text-secondary">
                                Pahami risiko sebenarnya terhadap kesehatan dan ekosistem, serta pentingnya pengelolaan yang bertanggung jawab.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section class="contact-section py-5" id="contact-us">
            <div class="container">
                <h2 class="text-center fw-bold mb-5">Contact Us</h2>
                
                <div class="row justify-content-center mb-5">
                    <!-- Email Card -->
                    <div class="col-md-4 mb-4 mb-md-0">
                        <div class="contact-card text-center">
                            <i class="fas fa-envelope mb-3"></i>
                            <h4>Email</h4>
                            <p>Politeknik@polije.ac.id</p>
                        </div>
                    </div>
                    
                    <!-- WhatsApp Card -->
                    <div class="col-md-4 mb-4 mb-md-0">
                        <div class="contact-card text-center">
                            <i class="fab fa-whatsapp mb-3"></i>
                            <h4>Whatsapp</h4>
                            <p>+62 8913 9238 32</p>
                        </div>
                    </div>
                    
                    <!-- Email Card (duplicated as in the design) -->
                    <div class="col-md-4">
                        <div class="contact-card text-center">
                            <i class="fas fa-envelope mb-3"></i>
                            <h4>Email</h4>
                            <p>Marketing@polije.ac.id</p>
                        </div>
                    </div>
                </div>
                
                <!-- Contact Form -->
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="contact-form">
                            <h3 class="text-center mb-4">Formulir Kontak</h3>
                            <form>
                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <input type="text" class="form-control" placeholder="Nama Lengkap" required>
                                    </div>
                                    <div class="col-md-6">
                                        <input type="email" class="form-control" placeholder="Email" required>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <input type="text" class="form-control" placeholder="Subjek" required>
                                </div>
                                <div class="mb-4">
                                    <textarea class="form-control" rows="5" placeholder="Pesan"></textarea>
                                </div>
                                <button type="submit" class="btn btn-green w-100 py-2 fw-semibold">Kirim</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="footer py-3">
            <div class="container text-center">
                <p class="mb-0">© Copyright <strong>2025</strong></p>
            </div>
        </footer>
      `;

      // Setelah HTML sudah masuk, set background image
      const bgImage = document.getElementById('bg-image');
      bgImage.style.backgroundImage = `url(${background})`;
      
      // Tambahkan event listeners untuk tombol login dan register
      this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Register button event listener - DIUBAH
        const registerBtn = document.getElementById('register-btn');
        if (registerBtn) {
          registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Gunakan custom event untuk trigger page change via presenter dan router
            const event = new CustomEvent('navigate', { detail: { page: 'register' } });
            document.dispatchEvent(event);
          });
        }
        
        // Login button event listener - DIUBAH
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
          loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Gunakan custom event untuk trigger page change via presenter dan router
            const event = new CustomEvent('navigate', { detail: { page: 'login' } });
            document.dispatchEvent(event);
          });
        }
      }
  }