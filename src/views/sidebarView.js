// // src/views/dashboardView.js
// import "../assets/styles/sidebar.css";
// import userPlaceholder from "../assets/images/unsplash_HaNi1rsZ6Nc.png";

export default class SidebarView {
  constructor() {
    this.app = document.getElementById("sidebar");
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
      `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.removeEventListeners();

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      const logoutHandler = (e) => {
        e.preventDefault();
        console.log("Logging out");
        const event = new CustomEvent("user-logout");
        document.dispatchEvent(event);
      };

      logoutBtn.addEventListener("click", logoutHandler);
      this.eventListeners.push({
        element: logoutBtn,
        type: "click",
        handler: logoutHandler,
      });
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
    console.log("Destroying DashboardView");
    this.removeEventListeners();
  }
}
