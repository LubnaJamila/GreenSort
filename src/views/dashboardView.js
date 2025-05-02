// src/views/dashboardView.js
class DashboardView {
    constructor() {
      this.userNameElement = document.getElementById('userName');
      this.dashboardDataContainer = document.getElementById('dashboardData');
    }
  
    displayUserInfo(user) {
      if (this.userNameElement) {
        this.userNameElement.textContent = user.name || 'Pengguna';
      }
    }
  
    renderDashboardData(data) {
      if (this.dashboardDataContainer) {
        // Render data dashboard di sini
        this.dashboardDataContainer.innerHTML = `
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Selamat datang di Dashboard</h5>
              <p class="card-text">Ini adalah dashboard Anda.</p>
            </div>
          </div>
        `;
      }
    }
  }
  
  export default DashboardView;