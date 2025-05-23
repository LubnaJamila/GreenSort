// src/views/sidebarView.js
export default class SidebarView {
  constructor() {
    this.app = document.getElementById('sidebar');
    this.eventListeners = [];
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;
  }

  render(role = 'pengguna') {
    if (!this.app) return;

    this.app.innerHTML = `
      <div class="sidebar ${this.isMobile ? 'mobile-hidden' : ''}">
        <div class="logo">
          <span class="logo-text">GREENSORT</span>
          <button class="sidebar-toggle d-none d-lg-block">
            <i class="bi bi-chevron-left"></i>
          </button>
        </div>
        
        <nav class="nav-container">
          ${this.renderMainMenu()}
          ${this.renderRoleSpecificMenu(role)}
        </nav>
        
        <div class="sidebar-footer">
          <button id="logout-btn" class="btn btn-outline-danger logout-btn">
            <i class="bi bi-box-arrow-left"></i>
            <span class="logout-text">Logout</span>
          </button>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  renderMainMenu() {
    return `
      <div class="nav-section">
        <a href="#" class="nav-link active" data-route="dashboard">
          <i class="bi bi-grid"></i>
          <span class="nav-text">Dashboard</span>
        </a>
      </div>
    `;
  }

  renderRoleSpecificMenu(role) {
    if (role === 'admin') {
      return `
        <div class="nav-section">
          <div class="nav-section-title">Master</div>
          <a href="#" class="nav-link" data-route="master-data">
            <i class="bi bi-database"></i>
            <span class="nav-text">Data Master</span>
          </a>
        </div>
      `;
    } else if (role === 'pengguna') {
      return `
        <div class="nav-section">
          <div class="nav-section-title">Menu Pengguna</div>
          <a href="#" class="nav-link" data-route="profile">
            <i class="bi bi-person"></i>
            <span class="nav-text">Klasifikasi Sampah</span>
          </a>
          <a href="#/rekening" class="nav-link" data-route="dataRekening">
            <i class="bi bi-cart"></i>
            <span class="nav-text">Rekening</span>
          </a>
          <a href="#" class="nav-link" data-route="pengaturan">
            <i class="bi bi-cart"></i>
            <span class="nav-text">Pengaturan</span>
          </a>
        </div>
      `;
    }
    return '';
  }

  setupEventListeners() {
    this.removeEventListeners();

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      const handler = (e) => {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('user-logout'));
      };
      logoutBtn.addEventListener('click', handler);
      this.eventListeners.push({ element: logoutBtn, type: 'click', handler });
    }

    // Sidebar toggle
    const toggleBtn = document.querySelector('.sidebar-toggle');
    if (toggleBtn) {
      const handler = () => this.toggleSidebar();
      toggleBtn.addEventListener('click', handler);
      this.eventListeners.push({ element: toggleBtn, type: 'click', handler });
    }

    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const handler = (e) => this.handleNavLinkClick(e, link);
      link.addEventListener('click', handler);
      this.eventListeners.push({ element: link, type: 'click', handler });
    });
  }

  toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const toggleIcon = document.querySelector('.sidebar-toggle i');
    
    if (sidebar && mainContent && toggleIcon) {
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('collapsed');
      
      if (sidebar.classList.contains('collapsed')) {
        toggleIcon.classList.remove('bi-chevron-left');
        toggleIcon.classList.add('bi-chevron-right');
      } else {
        toggleIcon.classList.remove('bi-chevron-right');
        toggleIcon.classList.add('bi-chevron-left');
      }
    }
  }

  handleNavLinkClick(e, link) {
    e.preventDefault();
    
    // Update active state
    document.querySelectorAll('.nav-link').forEach(navLink => {
      navLink.classList.remove('active');
    });
    link.classList.add('active');
    
    // Dispatch navigation event
    const route = link.dataset.route;
    if (route) {
      document.dispatchEvent(new CustomEvent('navigate', { detail: { page : route } }));
    }
    
    // Close sidebar on mobile
    if (this.isMobile) {
      document.querySelector('.sidebar').classList.remove('mobile-open');
      document.querySelector('.sidebar-overlay').classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  removeEventListeners() {
    this.eventListeners.forEach(({ element, type, handler }) => {
      if (element) {
        element.removeEventListener(type, handler);
      }
    });
    this.eventListeners = [];
  }

  destroy() {
    this.removeEventListeners();
    if (this.app) this.app.innerHTML = '';
  }
}