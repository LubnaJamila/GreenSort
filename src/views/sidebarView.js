// src/views/sidebarView.js
export default class SidebarView {
  constructor() {
    this.app = document.getElementById('sidebar');
    this.eventListeners = [];
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;
    this.currentRoute = 'dashboard'; // Default active route
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
    // Set active state after rendering
    this.updateActiveState();
  }

  renderMainMenu() {
    return `
      <div class="nav-section">
        <a href="#" class="nav-link" data-route="dashboard">
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
          <a href="#/master-alamat" class="nav-link" data-route="masterAlamat">
            <i class="bi bi-database"></i>
            <span class="nav-text">Master Alamat</span>
          </a>
        </div>
      `;
    } else if (role === 'pengguna') {
      return `
        <div class="nav-section">
          <div class="nav-section-title">Menu Pengguna</div>
          <a href="#/klasifikasi-sampah" class="nav-link" data-route="klasifikasiSampah">
            <i class="bi bi-recycle"></i>
            <span class="nav-text">Klasifikasi Sampah</span>
          </a>
          <a href="#/master-alamat" class="nav-link" data-route="masterAlamat">
            <i class="bi bi-database"></i>
            <span class="nav-text">Alamat</span>
          </a>
          <a href="#/rekening" class="nav-link" data-route="dataRekening">
            <i class="bi bi-wallet2"></i>
            <span class="nav-text">Rekening</span>
          </a>
          <a href="#/detail-profile" class="nav-link" data-route="detailProfile">
            <i class="bi bi-person-gear"></i>
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

    // Listen for route changes from other parts of the app
    const routeChangeHandler = (e) => this.handleRouteChange(e);
    document.addEventListener('route-changed', routeChangeHandler);
    this.eventListeners.push({ element: document, type: 'route-changed', handler: routeChangeHandler });
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
    
    const route = link.dataset.route;
    if (route) {
      console.log("Nav link clicked:", route);
      
      // Update current route immediately for immediate visual feedback
      this.currentRoute = route;
      this.updateActiveState();
      
      // Dispatch navigation event
      document.dispatchEvent(new CustomEvent('navigate', { detail: { page: route } }));
    }
    
    // Close sidebar on mobile
    if (this.isMobile) {
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.querySelector('.sidebar-overlay');
      
      if (sidebar) sidebar.classList.remove('mobile-open');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Method to handle route changes from external sources
  handleRouteChange(e) {
    if (e.detail && e.detail.route) {
      console.log("Route change received in sidebar view:", e.detail.route);
      this.currentRoute = e.detail.route;
      this.updateActiveState();
    }
  }

  // Method to update active state based on current route
  updateActiveState() {
    console.log("Updating active state for route:", this.currentRoute);
    
    // Remove active class from all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(navLink => {
      navLink.classList.remove('active');
    });
    
    // Add active class to current route
    const activeLink = document.querySelector(`[data-route="${this.currentRoute}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
      console.log("Active state set for:", this.currentRoute);
    } else {
      console.log("No nav link found for route:", this.currentRoute);
    }

    // Handle special cases for dashboard routes
    if (this.currentRoute === 'dashboardUser' || this.currentRoute === 'dashboard') {
      const dashboardLink = document.querySelector('[data-route="dashboard"]');
      if (dashboardLink) {
        dashboardLink.classList.add('active');
        console.log("Dashboard active state set");
      }
    }

    // Handle special cases for rekening routes
    if (this.currentRoute === 'tambahRekening') {
      const rekeningLink = document.querySelector('[data-route="dataRekening"]');
      if (rekeningLink) {
        rekeningLink.classList.add('active');
        console.log("Rekening active state set for tambahRekening");
      }
    }

    // Handle special cases for profile routes
    if (this.currentRoute === 'editProfile' || this.currentRoute === 'ubahPassword') {
      const profileLink = document.querySelector('[data-route="detailProfile"]');
      if (profileLink) {
        profileLink.classList.add('active');
        console.log("Profile active state set for sub-route");
      }
    }

    // Handle special cases for alamat routes
    if (this.currentRoute === 'tambahAlamat') {
      const alamatLink = document.querySelector('[data-route="masterAlamat"]');
      if (alamatLink) {
        alamatLink.classList.add('active');
        console.log("Master Alamat active state set for tambahAlamat");
      }
    }
  }

  // Method to set active route and update UI
  setActiveRoute(route) {
    console.log("Setting active route to:", route);
    this.currentRoute = route;
    this.updateActiveState();
  }

  // Method to initialize with specific route
  initWithRoute(route) {
    console.log("Initializing with route:", route);
    this.currentRoute = route;
  }

  // Method to get current active route
  getActiveRoute() {
    return this.currentRoute;
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