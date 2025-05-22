export default class DashboardUserView {
  constructor() {
    this.app = document.getElementById('app');
  }

  render() {
    this.app.innerHTML = `
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
            <a href="#" class="nav-link">
              <i class="bi bi-database"></i>
              <span class="nav-text">Klasifikasi Sampah</span>
            </a>
            <a href="#" id="nav-rekening" class="nav-link">
              <i class="bi bi-people"></i>
              <span class="nav-text">Rekening</span>
            </a>
            <a href="#" class="nav-link">
              <i class="bi bi-trash"></i>
              <span class="nav-text">Pengaturan</span>
            </a>
          </div>
        </div>

        <div class="mt-auto mb-4 px-3">
          <button id="logout-btn" class="btn btn-outline-danger w-100">
            <i class="bi bi-box-arrow-left me-2"></i>Logout
          </button>
        </div>
      </div>

      <div class="main-content">
        <header>
          <div class="user-profile">
            <img id="user-avatar" src="https://randomuser.me/api/portraits/women/72.jpg" alt="User" />
            <span id="user-name">Nama Pengguna</span>
          </div>

          <div class="dashboard-header">
            <h2>Dashboard</h2>
            <p class="text-dark mb-4">
              Ringkasan status pengajuan Anda secara real-time.
            </p>
          </div>
        </header>
      </div>
    `;

    // Event logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        document.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'login' } }));
      });
    }

    // Event navigasi ke halaman Rekening
    const rekeningNav = document.getElementById('nav-rekening');
    if (rekeningNav) {
      rekeningNav.addEventListener('click', (e) => {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'rekening' } }));
      });
    }
  }

  displayUserInfo(user) {
    document.getElementById('user-name').textContent = user.name;
    const avatar = document.getElementById('user-avatar');
    if (avatar && user.avatar) avatar.src = user.avatar;
  }

  destroy() {
    this.app.innerHTML = '';
  }
}
