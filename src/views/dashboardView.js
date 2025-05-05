// src/views/dashboardView.js
import '../assets/styles/dashboard.css';
import userPlaceholder from '../assets/images/unsplash_HaNi1rsZ6Nc.png';

export default class DashboardView {
    constructor() {
        this.app = document.getElementById('app');
        this.eventListeners = [];
    }

    render() {
        this.app.innerHTML = `
        <!-- Sidebar -->
        <div class="sidebar">
            <div class="logo my-3 mx-3">
                <span class="logo-text">GREENSORT</span>
            </div>
            
            <div class="nav flex-column mt-4">
                <a href="#" class="nav-link active">
                    <i class="bi bi-grid"></i>
                    <span class="nav-text">Dashboard</span>
                </a>
                
                <div class="mt-3">
                    <p class="ms-3 text-secondary mb-2">Master</p>
                    <a href="#" class="nav-link">
                        <i class="bi bi-database"></i>
                        <span class="nav-text">Data Master</span>
                    </a>
                    <a href="#" class="nav-link">
                        <i class="bi bi-people"></i>
                        <span class="nav-text">Pengguna</span>
                    </a>
                    <a href="#" class="nav-link">
                        <i class="bi bi-trash"></i>
                        <span class="nav-text">Jenis Sampah</span>
                    </a>
                </div>
            </div>
            
            <div class="mt-auto mb-4 px-3">
                <button id="logout-btn" class="btn btn-outline-danger w-100">
                    <i class="bi bi-box-arrow-left me-2"></i>Logout
                </button>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="main-content">
            <header>
              <!-- User Profile -->
              <div class="user-profile">
                <img id="user-avatar" src="${userPlaceholder}" alt="User">
                <span id="user-name">Loading...</span>
              </div>
              
              <div class="dashboard-header">
                  <h2>Dashboard</h2>
                  <p class="text-dark mb-4">Ringkasan status pengajuan Anda secara real-time.</p>
                  
                  <!-- Stats Cards -->
                  <div class="row">
                      <div class="col-md-2 col-lg-2-4">
                          <div class="stat-card">
                              <div class="stat-number">80</div>
                              <div class="stat-label">Menunggu Validasi</div>
                              <div class="icon-circle yellow-bg">
                                  <i class="bi bi-hourglass-split"></i>
                              </div>
                              <a href="#" class="more-btn">
                                  <i class="bi bi-arrow-down"></i>
                              </a>
                          </div>
                      </div>
                      
                      <div class="col-md-2 col-lg-2-4">
                          <div class="stat-card">
                              <div class="stat-number">16</div>
                              <div class="stat-label">Diterima</div>
                              <div class="icon-circle blue-bg">
                                  <i class="bi bi-clipboard-check"></i>
                              </div>
                              <a href="#" class="more-btn">
                                  <i class="bi bi-arrow-down"></i>
                              </a>
                          </div>
                      </div>
                      
                      <div class="col-md-2 col-lg-2-4">
                          <div class="stat-card">
                              <div class="stat-number">8</div>
                              <div class="stat-label">Ditolak</div>
                              <div class="icon-circle red-bg">
                                  <i class="bi bi-x-circle"></i>
                              </div>
                              <a href="#" class="more-btn">
                                  <i class="bi bi-arrow-down"></i>
                              </a>
                          </div>
                      </div>
                      
                      <div class="col-md-2 col-lg-2-4">
                          <div class="stat-card">
                              <div class="stat-number">24</div>
                              <div class="stat-label">Dikirim</div>
                              <div class="icon-circle orange-bg">
                                  <i class="bi bi-truck"></i>
                              </div>
                              <a href="#" class="more-btn">
                                  <i class="bi bi-arrow-down"></i>
                              </a>
                          </div>
                      </div>
                      
                      <div class="col-md-2 col-lg-2-4">
                          <div class="stat-card">
                              <div class="stat-number">42</div>
                              <div class="stat-label">Selesai</div>
                              <div class="icon-circle green-bg">
                                  <i class="bi bi-check-circle"></i>
                              </div>
                              <a href="#" class="more-btn">
                                  <i class="bi bi-arrow-down"></i>
                              </a>
                          </div>
                      </div>
                  </div>
              </div>
            </header>
            
            <!-- Data Pengajuan Section -->
            <div class="data-section">
                <div class="data-header d-flex justify-content-between align-items-center">
                    <h3>Data Pengajuan</h3>
                    <div class="search-box">
                        <i class="bi bi-search"></i>
                    </div>
                </div>
                
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th width="40px"></th>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Jenis Sampah</th>
                                <th>Kuantitas</th>
                                <th>Total</th>
                                <th>Gambar Sampah</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="applications-table-body">
                            <!-- Data rows will be inserted here -->
                        </tbody>
                    </table>
                    <!-- Pagination -->
                    <nav>
                        <ul class="pagination">
                            <li class="page-item">
                                <a class="page-link" href="#" aria-label="Previous">
                                    <i class="bi bi-chevron-left"></i>
                                </a>
                            </li>
                            <li class="page-item active"><a class="page-link" href="#">1</a></li>
                            <li class="page-item"><a class="page-link" href="#">2</a></li>
                            <li class="page-item"><a class="page-link" href="#">3</a></li>
                            <li class="page-item">
                                <a class="page-link" href="#">...</a>
                            </li>
                            <li class="page-item"><a class="page-link" href="#">10</a></li>
                            <li class="page-item">
                                <a class="page-link" href="#" aria-label="Next">
                                    <i class="bi bi-chevron-right"></i>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
        
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css">
        `;
        
        // Setup event listeners after rendering
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Membersihkan event listener lama
        this.removeEventListeners();
        
        // Add logout button event listener
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            const logoutHandler = (e) => {
                e.preventDefault();
                console.log('Logging out');
                // Trigger custom event for logout
                const event = new CustomEvent('user-logout');
                document.dispatchEvent(event);
            };
            
            logoutBtn.addEventListener('click', logoutHandler);
            this.eventListeners.push({ element: logoutBtn, type: 'click', handler: logoutHandler });
        }
    }
    
    // Method untuk menampilkan informasi user
    displayUserInfo(user) {
        const userNameElement = document.getElementById('user-name');
        if (userNameElement && user) {
            userNameElement.textContent = user.name || user.username;
        }
    }
    
    // Method untuk menampilkan data dashboard
    renderDashboardData(user) {
        // Simulasi data untuk dashboard
        const applicationsData = [
            {
                id: 1,
                name: "Sherry Rowe",
                status: "Menunggu Validasi",
                jenisSampah: "Glass",
                kuantitas: 6,
                total: "Rp. 300,000",
                imageUrl: "../assets/images/image 44.png"
            },
            {
                id: 2,
                name: "John Doe",
                status: "Diterima",
                jenisSampah: "Plastic",
                kuantitas: 10,
                total: "Rp. 450,000",
                imageUrl: "/api/placeholder/100/70"
            },
            {
                id: 3,
                name: "Jane Smith",
                status: "Dikirim",
                jenisSampah: "Paper",
                kuantitas: 8,
                total: "Rp. 200,000",
                imageUrl: "/api/placeholder/100/70"
            },
            {
                id: 4,
                name: "Robert Johnson",
                status: "Selesai",
                jenisSampah: "Metal",
                kuantitas: 12,
                total: "Rp. 600,000",
                imageUrl: "/api/placeholder/100/70"
            }
        ];
        
        this.renderApplicationsTable(applicationsData);
    }
    
    // Render table rows
    renderApplicationsTable(applicationsData) {
        const tableBody = document.getElementById('applications-table-body');
        if (!tableBody) return;
        
        let tableHTML = '';
        
        applicationsData.forEach(app => {
            let statusClass = 'bg-light';
            let statusIcon = 'bi-hourglass-split';
            
            // Determine status styling
            switch (app.status) {
                case 'Diterima':
                    statusClass = 'bg-info bg-opacity-10';
                    statusIcon = 'bi-clipboard-check';
                    break;
                case 'Ditolak':
                    statusClass = 'bg-danger bg-opacity-10';
                    statusIcon = 'bi-x-circle';
                    break;
                case 'Dikirim':
                    statusClass = 'bg-warning bg-opacity-10';
                    statusIcon = 'bi-truck';
                    break;
                case 'Selesai':
                    statusClass = 'bg-success bg-opacity-10';
                    statusIcon = 'bi-check-circle';
                    break;
            }
            
            tableHTML += `
            <tr>
                <td>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${app.id}">
                    </div>
                </td>
                <td>${app.name}</td>
                <td>
                    <span class="status-badge ${statusClass}">
                        <i class="bi ${statusIcon} me-1"></i>
                        ${app.status}
                    </span>
                </td>
                <td>${app.jenisSampah}</td>
                <td>${app.kuantitas}</td>
                <td>${app.total}</td>
                <td>
                    <img src="${app.imageUrl}" alt="Waste Image" class="waste-img">
                </td>
                <td>
                    <button class="action-btn btn btn-success"><i class="bi bi-check"></i></button>
                    <button class="action-btn btn btn-danger"><i class="bi bi-x"></i></button>
                    <button class="action-btn btn btn-primary"><i class="bi bi-chat"></i></button>
                </td>
            </tr>
            `;
        });
        
        tableBody.innerHTML = tableHTML;
    }
    
    // Membersihkan event listener saat view dihancurkan
    removeEventListeners() {
        this.eventListeners.forEach(({ element, type, handler }) => {
            if (element) {
                element.removeEventListener(type, handler);
            }
        });
        this.eventListeners = [];
    }
    
    // Method untuk digunakan oleh presenter saat destroy
    destroy() {
        console.log('Destroying DashboardView');
        this.removeEventListeners();
    }
}